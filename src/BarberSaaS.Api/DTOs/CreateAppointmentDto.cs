namespace BarberSaaS.Api.DTOs;

public class CreateAppointmentDto
{
    public Guid BarberShopId { get; set; }
    public Guid CustomerId { get; set; }
    public Guid EmployeeId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal? Price { get; set; }
}