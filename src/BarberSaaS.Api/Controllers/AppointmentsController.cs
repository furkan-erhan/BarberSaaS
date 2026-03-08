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
using Microsoft.AspNetCore.Identity;

namespace BarberSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper; 
    private readonly UserManager<ApplicationUser> _userManager;

    public AppointmentsController(AppDbContext context, IMapper mapper, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _mapper = mapper; 
        _userManager = userManager;
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
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var existingAppointment = await _context.Appointments.FirstOrDefaultAsync(x => x.Id == id && x.UserId == currentUserId &&!x.IsDeleted);

        if (existingAppointment == null) throw new KeyNotFoundException("Appointment has not found");

        _mapper.Map(appointmentDto, existingAppointment);
        existingAppointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var isAdmin = User.IsInRole("Admin");
        var isBarber = User.IsInRole("Barber");
        
        if(string.IsNullOrEmpty(currentUserId)) return Unauthorized("Belirsiz kimlik, bos liste donduruluyor...");

        var query = _context.Appointments
            .Include(a => a.BarberShop)
            .Where(a => !a.IsDeleted);

        if(isAdmin) {}
        else if (isBarber)
        {
            var user = await _userManager.FindByIdAsync(currentUserId!);

            if (user?.BarberShopId == null) return Forbid(" berbersin ama dukkanin belirsiz!");

            query = query.Where(a => a.BarberShopId == user.BarberShopId);
        } else
        {
            query = query.Where(a => a.UserId == currentUserId);
        }
        var appointments = await query.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<AppointmentDto>>(appointments));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var existingAppointment = await _context.Appointments.Include(a => a.BarberShop).FirstOrDefaultAsync(x => x.Id == id && x.UserId == currentUserId && !x.IsDeleted);

        if (existingAppointment == null) throw new KeyNotFoundException("Appointment not found");

        var appointmentDto = _mapper.Map<AppointmentDto>(existingAppointment);
        return Ok(appointmentDto);
    }


    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var appointment = await _context.Appointments.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

        if (appointment == null) throw new KeyNotFoundException("Appointment not found");

        if(appointment.UserId != currentUserId)
        {
            return Forbid("Baskasinin randevusunu goruntuleyemezsin !");
        }

        appointment.IsDeleted = true;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}