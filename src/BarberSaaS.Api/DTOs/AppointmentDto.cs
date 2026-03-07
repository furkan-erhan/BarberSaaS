namespace BarberSaaS.Api.DTOs;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid BarberShopId { get; set; }

    public string BarberShopName { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;
    public Guid EmployeeId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal? Price { get; set; }
}