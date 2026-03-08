using AutoMapper;
using BarberSaaS.Api.DTOs;
using BarberSaaS.Domain.Entities;
using BarberSaaS.Domain.Enums;
using BarberSaaS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BarberSaaS.Api.Validators;

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

    
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateAppointmentDto appointmentDto) 
    {
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if(string.IsNullOrEmpty(userId)) return Unauthorized("Kimlik dogrulanamadi, oncelikle giris yap !");
        
        var appointment = _mapper.Map<Appointment>(appointmentDto);

        appointment.UserId = userId;
        appointment.Status = AppointmentStatus.Pending;
        appointment.CreatedAt = DateTime.UtcNow;
        appointment.UpdatedAt = DateTime.UtcNow;
        appointment.IsDeleted = false;

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        // 5. Return the DTO version to the user
        return Ok(_mapper.Map<AppointmentDto>(appointment));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateAppointmentDto appointmentDto)
    {
        var existingAppointment = await _context.Appointments.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

        if (existingAppointment == null) throw new KeyNotFoundException("Appointment has not found");

        _mapper.Map(appointmentDto, existingAppointment);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(string.IsNullOrEmpty(currentUserId)) return Unauthorized("Belirsiz kimlik, bos liste donduruluyor...");

        var appointments = await _context.Appointments
            .Where(a => a.UserId == currentUserId && !a.IsDeleted)
            .Include(a => a.BarberShopId)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<AppointmentDto>>(appointments));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var existingAppointment = await _context.Appointments.Include(a => a.BarberShop).FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

        if (existingAppointment == null) throw new KeyNotFoundException("Appointment not found");

        var appointmentDto = _mapper.Map<AppointmentDto>(existingAppointment);
        return Ok(appointmentDto);
    }


    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var appointment = await _context.Appointments.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        if (appointment == null) throw new KeyNotFoundException("Appointment not found");

        appointment.IsDeleted = true;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}