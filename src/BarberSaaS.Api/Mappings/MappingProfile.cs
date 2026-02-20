using AutoMapper;
using BarberSaaS.Api.DTOs;
using BarberSaaS.Domain.Entities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<BarberShop, BarberShopDto>().ReverseMap();

        CreateMap<Appointment, AppointmentDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ReverseMap();
    }
}