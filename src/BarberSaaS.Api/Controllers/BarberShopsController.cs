using BarberSaaS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper; // 1. Add this
using BarberSaaS.Api.DTOs;
using BarberSaaS.Domain.Entities; // 2. Add this to find BarberShopDto

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


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var shop = await _context.BarberShops.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

        if (shop == null) throw new KeyNotFoundException($"Barber shop with ${id} not found");

        return Ok(_mapper.Map<BarberShopDto>(shop));
    }


    [HttpPost("{id}")]
    public async Task<IActionResult> Create(BarberShopDto barberShopDto)
    {
        var shop = _mapper.Map<BarberShop>(barberShopDto);

        _context.BarberShops.Add(shop);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = shop.Id }, _mapper.Map<BarberShopDto>(shop));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, BarberShopDto barberShopDto)
    {
        var existingShop = await _context.BarberShops.FindAsync(id);
        if (existingShop == null) throw new KeyNotFoundException("Shop Not Found For Update");

        _mapper.Map(barberShopDto, existingShop); // Write new informations from barberShopDtop onto existingShop
        existingShop.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var shop = await _context.BarberShops.FindAsync(id);
        if (shop == null) throw new KeyNotFoundException("Barber Shop Not Found For Delete");

        shop.IsDeleted = true;
        shop.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}