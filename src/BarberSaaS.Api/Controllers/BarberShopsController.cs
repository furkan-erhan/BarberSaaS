using BarberSaaS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper; // 1. Add this
using BarberSaaS.Api.DTOs; // 2. Add this to find BarberShopDto

namespace BarberSaaS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BarberShopsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper; // 3. Add the mapper field

    // 4. Update constructor to inject the mapper
    public BarberShopsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Fetch entities from DB
        var shops = await _context.BarberShops.ToListAsync();

        // 5. Transform entities into DTOs
        var shopDtos = _mapper.Map<IEnumerable<BarberShopDto>>(shops);

        // 6. Return the DTOs instead of the raw database objects
        return Ok(shopDtos);
    }
}