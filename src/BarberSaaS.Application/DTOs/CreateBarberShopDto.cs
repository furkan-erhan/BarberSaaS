namespace BarberSaaS.Application.DTOs;

public class CreateBarberShopDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public Guid OwnerId { get; set; }

}

