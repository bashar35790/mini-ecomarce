import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "./store";
import { setCart } from "./cartSlice";
import {
  setWishlist,
  addToWatchlist,
  removeFromWatchlist,
  type WishlistItem,
} from "./wishlistSlice";
import {
  fetchWishlist,
  toggleWishlist,
  type BackendWishlistProduct,
} from "./api/wishlistApi";
import { syncCart } from "./api/cartApi";
import type { CartItem } from "@/types/cart";

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const FALLBACK_IMAGE = "/images/logo.png";

const toBackendId = (item: Pick<CartItem, "id" | "productId">): string | null => {
  if (item.productId && OBJECT_ID_RE.test(item.productId)) return item.productId;
  const id = String(item.id);
  return OBJECT_ID_RE.test(id) ? id : null;
};

const mapCloudToWishlistItem = (p: BackendWishlistProduct): WishlistItem => ({
  id: p.id,
  productId: p.id,
  title: p.title,
  text: p.title,
  price: p.discountPrice ?? p.basePrice,
  image:
    p.images?.find((img) => img.isPrimary)?.url ??
    p.images?.[0]?.url ??
    FALLBACK_IMAGE,
  quantity: 1,
  category: p.category?.name ?? "General",
  inStock: p.stockCount > 0,
  stockCount: p.stockCount,
});

interface CartReconcileOutcome {
  items: CartItem[];
  priceChanged: number;
  removed: number;
  quantityClamped: number;
}

// Reconcile local cart items against authoritative backend data.
// Returns the merged items plus change counters for notifications.
const reconcileCartItems = async (
  localItems: CartItem[]
): Promise<CartReconcileOutcome> => {
  const outcome: CartReconcileOutcome = {
    items: [...localItems],
    priceChanged: 0,
    removed: 0,
    quantityClamped: 0,
  };
  if (localItems.length === 0) return outcome;

  const payload = localItems.flatMap((item) => {
    const productId = toBackendId(item);
    if (!productId) return [];
    return [
      {
        productId,
        variantId: item.variantId,
        quantity: Math.max(1, item.quantity || 1),
      },
    ];
  });
  if (payload.length === 0) return outcome;

  const result = await syncCart(payload);
  const byKey = new Map(
    result.items.map((s) => [`${s.productId}::${s.variantId ?? ""}`, s])
  );

  const merged: CartItem[] = [];
  for (const item of localItems) {
    const productId = toBackendId(item);
    const synced = productId
      ? byKey.get(`${productId}::${item.variantId ?? ""}`)
      : undefined;

    // Items the backend doesn't know (legacy static ids) pass through untouched.
    if (!synced) {
      merged.push(item);
      continue;
    }
    if (!synced.valid) {
      outcome.removed += 1;
      continue;
    }
    if (synced.unitPrice !== item.price) outcome.priceChanged += 1;
    const next: CartItem = {
      ...item,
      price: synced.unitPrice,
      image: synced.image ?? item.image,
      inStock: synced.inStock,
    };
    if (synced.availableQuantity > 0 && item.quantity > synced.availableQuantity) {
      next.quantity = synced.availableQuantity;
      outcome.quantityClamped += 1;
    }
    merged.push(next);
  }

  outcome.items = merged;
  return outcome;
};

const notifyCartChanges = (outcome: CartReconcileOutcome) => {
  if (outcome.priceChanged > 0) {
    toast.success("Cart prices updated to the latest store prices.", {
      position: "bottom-center",
    });
  }
  if (outcome.quantityClamped > 0) {
    toast.success("Some quantities were adjusted to available stock.", {
      position: "bottom-center",
    });
  }
  if (outcome.removed > 0) {
    toast.success(
      `${outcome.removed} unavailable item${outcome.removed === 1 ? " was" : "s were"} removed from your cart.`,
      { position: "bottom-center" }
    );
  }
};

export interface LoginSyncSummary {
  cart: CartReconcileOutcome | null;
  wishlistCount: number;
}

// Merge guest state into the freshly authenticated account.
// Never throws — sync failures keep local state untouched.
export const syncOnLogin = async (
  dispatch: AppDispatch,
  getState: () => RootState
): Promise<LoginSyncSummary> => {
  const summary: LoginSyncSummary = { cart: null, wishlistCount: 0 };

  // 1. Cart: reconcile guest cart with authoritative prices/stock.
  try {
    const outcome = await reconcileCartItems(getState().cart.items);
    dispatch(setCart(outcome.items));
    summary.cart = outcome;
    notifyCartChanges(outcome);
  } catch {
    // keep local cart on failure
  }

  // 2. Wishlist: push local-only items to the cloud, then adopt cloud truth.
  try {
    const local = getState().watchlist.items;
    const cloud = await fetchWishlist();
    const cloudIds = new Set(cloud.map((p) => p.id));

    const localOnly = local.filter((item) => {
      const backendId = item.productId ?? toBackendId(item);
      return backendId && !cloudIds.has(backendId);
    });
    for (const item of localOnly) {
      try {
        await toggleWishlist((item.productId ?? String(item.id)) as string);
      } catch {
        // best effort per item
      }
    }

    const fresh =
      localOnly.length > 0 ? await fetchWishlist().catch(() => cloud) : cloud;
    const legacy = local.filter((item) => !toBackendId(item) && !item.productId);
    dispatch(
      setWishlist([...fresh.map(mapCloudToWishlistItem), ...legacy])
    );
    summary.wishlistCount = fresh.length;
  } catch {
    // keep local wishlist on failure
  }

  return summary;
};

// Optimistic wishlist toggle that mirrors to the backend when logged in.
export const toggleWishlistItem = async (
  dispatch: AppDispatch,
  getState: () => RootState,
  item: WishlistItem
): Promise<boolean> => {
  const state = getState();
  const isIn = state.watchlist.items.some(
    (i) => String(i.id) === String(item.id)
  );

  if (isIn) {
    dispatch(removeFromWatchlist(item.id));
  } else {
    dispatch(addToWatchlist(item));
  }

  const backendId = item.productId ?? toBackendId(item);
  if (!state.auth.accessToken || !backendId) return !isIn;

  try {
    await toggleWishlist(backendId);
    return !isIn;
  } catch {
    // Revert optimistic update on backend failure.
    if (isIn) {
      dispatch(addToWatchlist(item));
    } else {
      dispatch(removeFromWatchlist(item.id));
    }
    toast.error("Couldn't sync wishlist. Please try again.", {
      position: "bottom-center",
    });
    return isIn;
  }
};

// One-shot cart refresh (e.g. on cart page mount while logged in).
export const refreshCartPrices = async (
  dispatch: AppDispatch,
  getState: () => RootState
): Promise<void> => {
  if (!getState().auth.accessToken) return;
  if (getState().cart.items.length === 0) return;
  try {
    const outcome = await reconcileCartItems(getState().cart.items);
    dispatch(setCart(outcome.items));
    notifyCartChanges(outcome);
  } catch {
    // silent — cart stays as-is
  }
};
