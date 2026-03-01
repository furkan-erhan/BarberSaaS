using System;
using BarberSaaS.Domain.Enums;

namespace BarberSaaS.Domain.Entities;

public class Appointment : BaseEntity
{
    public Guid BarberShopId { get; set; }

    // Navigation Property. Used 'virtual' for lazy loading
    public virtual BarberShop BarberShop { get; set; } = null!;

    public Guid CustomerId { get; set; }

    public Guid EmployeeId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

    public decimal? Price { get; set; }


}