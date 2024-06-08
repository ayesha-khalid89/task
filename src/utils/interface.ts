export interface IFilterKeys {
  title: string;
  key: string;
  type: string;
  dropdownValues?: string[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  image: string;
  username: string;
  password: string;
  height: string;
  bloodGroup: string;
  eyeColor: string;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  weight: number;
  warrantyInformation: string;
  availabilityStatus: string;
  shippingInformation: string;
}
