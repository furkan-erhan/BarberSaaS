using FluentValidation;
using BarberSaaS.Application.DTOs;

namespace BarberSaaS.Api.Validators;

public class UpdateAppointmentRequestValidator : AbstractValidator<UpdateAppointmentDto>
{
    public UpdateAppointmentRequestValidator()
    {
        RuleFor(x => x.StartTime)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow).WithMessage("Updated appointment start time must be in the future")
            .LessThan(x => x.EndTime).WithMessage("Start time must be earlier than end time");

        RuleFor(x => x.EndTime)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow).WithMessage("Updated appointment end time must be in the future")
            .GreaterThan(x => x.StartTime).WithMessage("End time must be after start time");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).When(x => x.Price.HasValue).WithMessage("Price cannot be negative");
    }
}