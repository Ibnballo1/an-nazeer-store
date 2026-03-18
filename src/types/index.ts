export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  slug: string;
  stock: number;
  unit: string | null;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ShippingAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
};
