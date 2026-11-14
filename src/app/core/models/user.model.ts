
export interface UserAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  phone: string;
  address?: UserAddress;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  address: UserAddress;
}
