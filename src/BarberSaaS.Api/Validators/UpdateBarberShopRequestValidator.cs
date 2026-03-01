using FluentValidation;
using BarberSaaS.Api.DTOs;

namespace BarberSaaS.Api.Validators;

public class UpdateBarberShopRequestValidator : AbstractValidator<UpdateBarberShopDto>
{
    public UpdateBarberShopRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Barber shop name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20).WithMessage("Phone number is too long");
    }
}