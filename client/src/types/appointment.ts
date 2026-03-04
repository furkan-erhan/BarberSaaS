export interface IAppointment {
    id: string;
    barberShopId: string;
    barberShopName: string;
    customerId: string;
    employeeId: string;
    startTime: string;
    endTime: string;
    status: string;
    price: number | null;
}