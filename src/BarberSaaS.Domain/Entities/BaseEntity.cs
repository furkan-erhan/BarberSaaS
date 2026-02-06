using System;

namespace BarberSaaS.Domain.Entities;


public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid(); // globally unique identifier (primary key)

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // use current datetime when object is instantiated

    public DateTime? UpdatedAt { get; set; } // Auto implemented property. Also nullable

    public bool IsDeleted { get; set; } = false;
}