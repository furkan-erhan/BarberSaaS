using BarberSaaS.Domain.Entities;
using BarberSaaS.Domain.Enums;
using BarberSaaS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarberSaaS.Api.Controllers;


[ApiController]
[Route("api/[controller]")] // api/appointments
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppointmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost] // for adding new appointment 
    public async Task<IActionResult> Create(Appointment appointment)
    {
        appointment.Status = AppointmentStatus.Pending;
        appointment.CreatedAt = DateTime.UtcNow;
        appointment.UpdatedAt = DateTime.UtcNow;
        appointment.IsDeleted = false;

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return Ok(appointment);
    }

    [HttpGet] // get all appointments of specific barbershop by id. Or all appointments when no parameter given
    public async Task<IActionResult> GetAll([FromQuery] Guid? barberShopId)
    {
        var query = _context.Appointments.Where(a => !a.IsDeleted); // get active appointments

        if (barberShopId.HasValue)
        {
            query = query.Where(a => a.BarberShopId == barberShopId.Value);
        }

        var appointments = await query.ToListAsync();

        return Ok(appointments);

    }

    [HttpDelete("{id}")] // delete specific appointment by appointment id
    public async Task<IActionResult> Delete(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null) return NotFound();

        //Soft delete part 
        appointment.IsDeleted = true;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

}