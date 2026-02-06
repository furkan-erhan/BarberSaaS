using System.Collections.Generic;

namespace BarberSaaS.Domain.Entities;

public class BarberShop : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty; // name will be visible on URL

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public Guid OwnerId { get; set; }  // shop owners id, not the shops id 

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>(); // for Entity Framework (EF) we used ICollection, now List


}