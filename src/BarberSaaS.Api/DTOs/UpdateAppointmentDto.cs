namespace BarberSaaS.Api.DTOs;

public class UpdateAppointmentDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal? Price { get; set; }

}