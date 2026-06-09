namespace BarberSaaS.Application.DTOs;

public class UpdateBarberShopDto
{
    public string Name { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Adress { get; set; }
}