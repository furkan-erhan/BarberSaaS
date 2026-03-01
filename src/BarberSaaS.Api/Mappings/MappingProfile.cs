using AutoMapper;
using BarberSaaS.Api.DTOs;
using BarberSaaS.Domain.Entities;

public class MappingProfile : Profile
{
    public MappingProfile() // Removed reverse mapping because we have task specific DTOs and in database we hold only entities, not DTOs.
    {


        // Response Mappings (Entity -> DTO)
        CreateMap<BarberShop, BarberShopDto>();
        CreateMap<Appointment, AppointmentDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.BarberShopName, opt => opt.MapFrom(src => src.BarberShop.Name)); ;

        // Request Mappings (DTO -> Entity)
        CreateMap<CreateBarberShopDto, BarberShop>();
        CreateMap<UpdateBarberShopDto, BarberShop>();

        CreateMap<CreateAppointmentDto, Appointment>();
        CreateMap<UpdateAppointmentDto, Appointment>();


    }
}