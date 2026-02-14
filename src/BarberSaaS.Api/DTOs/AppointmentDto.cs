namespace BarberSaaS.Api.DTOs;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public DateTime ScheduledTime { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // e.g., "Pending", "Confirmed"
    
    // Instead of the full BarberShop entity, just show the name/ID
    public Guid BarberShopId { get; set; }
    public string BarberShopName { get; set; } = string.Empty;
}