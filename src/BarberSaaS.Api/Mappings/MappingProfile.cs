using AutoMapper;
using BarberSaaS.Api.DTOs;            // Ensure this is here
using BarberSaaS.Domain.Entities;     // Ensure this is here

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // No parentheses after the DTO names!
        CreateMap<BarberShop, BarberShopDto>().ReverseMap();
        CreateMap<Appointment, AppointmentDto>().ReverseMap();
    }
}