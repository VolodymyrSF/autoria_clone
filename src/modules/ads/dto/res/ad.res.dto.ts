export class AdResDto {
  id: string;

  make: string;

  model: string;

  region: string;

  year: number;

  price: number;

  currency: string;

  description: string;

  image?: string[];

  createdAt: Date;

  updatedAt: Date;

  exchangeRate?: number;
}
