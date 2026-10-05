export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  buttonText?: string;
  featured?: boolean;
  parentId?: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
