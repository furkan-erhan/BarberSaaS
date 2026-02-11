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
    public async Task<IActionResult> Create(Appointment appointment) // fonksiyon needn asenkron ? Database'i bos yere sirf kendi islemi icin bekletmesin diye mi ?
    {
        appointment.Status = AppointmentStatus.Pending;
        appointment.CreatedAt = DateTime.UtcNow;
        appointment.UpdatedAt = DateTime.UtcNow;
        appointment.IsDeleted = false;

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return Ok(appointment);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? barberShopId) // Buarada argument kisminda ne beklenildigini anlamadim
    {
        var query = _context.Appointments.Where(a => !a.IsDeleted); // get undeleted appointments

        if (barberShopId.HasValue)
        {
            query = query.Where(a => a.BarberShopId == barberShopId.Value); // Burada neden barberShopId yazmak yerine sonuna .Value'da ekledik ?
        }

        var appointments = await query.ToListAsync();

        return Ok(appointments);

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) // buradaki guid kisminda neden Guid? yazmadik ? Get kisminda opsiyonel olarak bir berber idsini arayip onun tum appointmentlarini listeleriz ama istersek guid vermeyip BUTUN appointmentlarin hepsini de getirebiliriz mantigiyla hareket ederken, burada 'zorunlu' olarak spesifik bir appointment silecegimiz icin mi ?
    {
        var appointment = await _context.Appointments.FindAsync(id); // Bu satirda su hatayi verdi "Argument 1: cannot convert from 'System.Guid' to 'System.Type'"

        if (appointment == null) return NotFound();

        //Soft delete part 
        appointment.IsDeleted = true;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

}