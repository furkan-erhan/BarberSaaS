export interface IBarberShop {
    id: string;
    name: string;
    slug: string;
    phoneNumber: string | null;
    address: string | null;
    price?: number;
    latitude?: number;
    longitude?: number;
    rating?: number;
    reviewCount?: number;
}