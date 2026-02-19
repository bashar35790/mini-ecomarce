import { addToCart, removeFromCart } from "@/lib/cartSlice";
import { addToWatchlist, removeFromWatchlist } from "@/lib/wishlistSlice";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaCheck, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

//recevie the id prop
const ProductCard = ({ id, image, text, price, category, inStock }) => {
  console.log(id);
  //setup redux dispatch and select cart items to cheek if product is in cart
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => item.id === id);

  //get watchlist item and get cheek if the item is alredy added
  const watchlistItem = useSelector((state) => state.watchlist.items);
  const isInWatchlist = watchlistItem.some((item) => item.id == id);

  //convert price to a number
  const numericPrice =
    typeof price === "string"
      ? parseFloat(price.replace("$", "")) || 0
      : Number(price) || 0;

  // handle heart icon to toggle add/remove item from watchlist
  const handleToggleHeart = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(id));
      toast.success("Remove from wishlist", {
        duration: 1000,
        position: "bottom-center",
        icon: <FaCheck className="text-white" />,
        style: {
          background: "#ef4444",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          padding: "12px 20px",
          borderRadius: "6px",
          transition: "opacity .3s easy",
        },
      });
    } else {
      console.log("Adding to wishlist");
      dispatch(
        addToWatchlist({
          id,
          image,
          text,
          price: numericPrice,
          quantity: 1,
          category,
          inStock,
        }),
      );
      toast.success("Successfully Added To Card", {
        duration: 1000,
        position: "bottom-center",
        icon: <FaCheck className="text-white" />,

        style: {
          background: "#22c55e",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          padding: "12px 20px",
          borderRadius: "6px",
          transition: "opacity .3s easy",
        },
      });
    }
  };

  //handle card icon click to toggle add/remove product from cart
  const handleToggleCart = () => {
    console.log("Toggling cart for product:", id);
    if (isInCart) {
      dispatch(removeFromCart(id));
      toast.success("Remove from cart", {
        duration: 1000,
        position: "bottom-center",
        icon: <FaCheck className="text-white" />,
        style: {
          background: "#ef4444",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          padding: "12px 20px",
          borderRadius: "6px",
          transition: "opacity .3s easy",
        },
      });
    } else {
      console.log("Adding to cart");
      dispatch(
        addToCart({
          id,
          image,
          text,
          price: numericPrice,
          quantity: 1,
          category,
          inStock,
        }),
      );
      toast.success("Successfully Added To Card", {
        duration: 1000,
        position: "bottom-center",
        icon: <FaCheck className="text-white" />,

        style: {
          background: "#22c55e",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          padding: "12px 20px",
          borderRadius: "6px",
          transition: "opacity .3s easy",
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-visible flex flex-col h-[280px]">
      <div className=" relative w-full h-[200px]">
        <Image
          src={image}
          alt="dk"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className=" p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 px-4 py-3 pt-0 pb-4 m-0">
          {text}
        </h3>
        <div className="flex items-center justify-between px-4 pt-0 pb-4 mt-0">
          <span className="text-xl font-bold text-gray-700">
            ${numericPrice.toFixed(2)}
          </span>
          <div className="flex space-x-3">
            <FaHeart
              className={`cursor-pointer ${
                isInWatchlist
                  ? "text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
              onClick={handleToggleHeart}
            />
            <FaShoppingCart
              className={`cursor-pointer ${
                isInCart
                  ? "text-green-500"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={handleToggleCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
