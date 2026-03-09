using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using BarberSaaS.Domain.Entities;

namespace BarberSaaS.Infrastructure.Persistence; 

public static class DbInitializer {
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        string[] roles = { "Admin", "Barber", "Customer" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        var adminEmail = "admin@barbersaas.com"; // for testing
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            var newAdmin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Sistem",
                LastName = "Admini",
                EmailConfirmed = true
            };

            // Şifreyi buraya şimdilik sabit veriyoruz, ilk girişte değiştirebilirsin kanka
            var result = await userManager.CreateAsync(newAdmin, "123456Aa");
            
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(newAdmin, "Admin");
            }
        }


    }
}