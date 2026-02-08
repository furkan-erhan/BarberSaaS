using BarberSaaS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BarberSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // This maps to: api/BarberShops
public class BarberShopsController : ControllerBase
{
    private readonly AppDbContext _context;

    // Pro-Level: Constructor Injection
    // The framework looks at Program.cs, sees AppDbContext is registered, and injects it here.
    public BarberShopsController(AppDbContext context)
    {
        _context = context;
    }

    // Task 3: Implement GET endpoint
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Fetching all shops from the database asynchronously
        var shops = await _context.BarberShops.ToListAsync();
        
        // Returns 200 OK with the list (even if empty [])
        return Ok(shops);
    }
}