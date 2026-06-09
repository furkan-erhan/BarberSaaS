using FluentValidation;
using BarberSaaS.Application.DTOs;
using System.Data;

namespace BarberSaaS.Api.Validators;


public class CreateAppointmentRequestValidator : AbstractValidator<CreateAppointmentDto>
{
    public CreateAppointmentRequestValidator()
    {
        RuleFor(x => x.BarberShopId).NotEmpty();
        RuleFor(x => x.EmployeeId).NotEmpty();

        RuleFor(x => x.StartTime)
            .NotEmpty().WithMessage("Randevu saati secmelisin")
            .Must(BeWithinWorkingHours).WithMessage("Mesai saatlerinde randevu secmelisin")
            .GreaterThan(DateTime.UtcNow).WithMessage("Appointment start time must be in the future");


        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).When(x => x.Price.HasValue);
    }

    private bool BeWithinWorkingHours(DateTime startTime)
    {
        var endTime = startTime.AddMinutes(40);
        
        var openTime = new TimeSpan(9,0,0); // 09 00
        var closeTime = new TimeSpan(21,0,0); // 21 00

        return startTime.TimeOfDay >= openTime && endTime.TimeOfDay <= closeTime;
    }

}