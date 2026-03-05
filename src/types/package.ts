export interface Package {
  id: string;
  name: string;
  speed: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackagePayload {
  name: string;
  speed: number;
  price: number;
}

export interface UpdatePackagePayload extends CreatePackagePayload {
  id: string;
}
