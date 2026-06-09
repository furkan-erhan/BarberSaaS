namespace BarberSaaS.Application.DTOs;

public class UpdateAppointmentDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal? Price { get; set; }

}