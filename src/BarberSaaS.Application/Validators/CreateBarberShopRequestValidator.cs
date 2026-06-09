using FluentValidation;
using BarberSaaS.Application.DTOs;

namespace BarberSaaS.Api.Validators;


public class CreateBarberShopRequestValidator : AbstractValidator<CreateBarberShopDto>
{
    public CreateBarberShopRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Barber shop name is required")
            .MaximumLength(100).WithMessage("Name can't exceed 100 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug is required")
            .Matches(@"^[a-z0-9-]+$").WithMessage("Slug can only contain lowercase letters, numbers and hypens")
            .MaximumLength(25).WithMessage("Slug name can't exceed 25 characters");

        RuleFor(x => x.OwnerId)
            .NotEmpty().WithMessage("Owner id is required");
    }
}