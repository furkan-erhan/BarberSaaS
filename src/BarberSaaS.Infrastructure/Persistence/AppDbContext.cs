using Microsoft.EntityFrameworkCore;
using BarberSaaS.Domain.Entities;

namespace BarberSaaS.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<BarberShop> BarberShops { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
}

