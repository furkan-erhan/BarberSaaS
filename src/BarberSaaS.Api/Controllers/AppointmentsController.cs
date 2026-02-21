using AutoMapper;
using BarberSaaS.Api.DTOs;
using BarberSaaS.Domain.Entities;
using BarberSaaS.Domain.Enums;
using BarberSaaS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarberSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper; // 1. Add Mapper

    public AppointmentsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper; // 2. Inject Mapper
    }

    [HttpPost]
    public async Task<IActionResult> Create(AppointmentDto appointmentDto) // 3. Use DTO as input
    {
        // 4. Map DTO back to Entity for saving to Database
        var appointment = _mapper.Map<Appointment>(appointmentDto);

        appointment.Status = AppointmentStatus.Pending;
        appointment.CreatedAt = DateTime.UtcNow;
        appointment.UpdatedAt = DateTime.UtcNow;
        appointment.IsDeleted = false;

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        // 5. Return the DTO version to the user
        return Ok(_mapper.Map<AppointmentDto>(appointment));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? barberShopId)
    {
        var query = _context.Appointments.Where(a => !a.IsDeleted);

        if (barberShopId.HasValue)
        {
            query = query.Where(a => a.BarberShopId == barberShopId.Value);
        }

        var appointments = await query.ToListAsync();

        // 6. Transform the list to DTOs
        return Ok(_mapper.Map<IEnumerable<AppointmentDto>>(appointments));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();

        appointment.IsDeleted = true;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}