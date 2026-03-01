using FluentValidation;
using BarberSaaS.Api.DTOs;
using System.Data;

namespace BarberSaaS.Api.Validators;


public class CreateAppointmentRequestValidator : AbstractValidator<CreateAppointmentDto>
{
    public CreateAppointmentRequestValidator()
    {
        RuleFor(x => x.BarberShopId).NotEmpty();
        RuleFor(x => x.EmployeeId).NotEmpty();
        RuleFor(x => x.CustomerId).NotEmpty();

        RuleFor(x => x.StartTime)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow).WithMessage("Appointment start time must be in the future");

        RuleFor(x => x.EndTime)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow).WithMessage("Appointment end time must be in the future")
            .GreaterThan(x => x.StartTime).WithMessage("End time must be after start time");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).When(x => x.Price.HasValue);
    }
}