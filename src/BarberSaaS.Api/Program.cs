<<<<<<< HEAD
// This allows the API project to access extension methods
// defined inside the Infrastructure project (like AddInfrastructure)
=======
>>>>>>> 0c6189115291c94968e4bba90e389854686b1058
using BarberSaaS.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

<<<<<<< HEAD
// Enables controller-based APIs (required for using Controllers folder)
builder.Services.AddControllers();


// Registers Swagger / OpenAPI services
// This prepares Swagger internally (it does NOT expose endpoints yet)
=======
builder.Services.AddInfrastructure(builder.Configuration);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
>>>>>>> 0c6189115291c94968e4bba90e389854686b1058
builder.Services.AddOpenApi();


// Registers all Infrastructure services (DbContext, repositories, etc.)
// This connects the API layer with the Infrastructure layer
// Without this, controllers that depend on Infrastructure will crash
builder.Services.AddInfrastructure(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Add this to provide the UI (The Swagger Website)
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "BarberSaaS API v1");
        options.RoutePrefix = "swagger"; // This makes the URL: /swagger
    });
    
}

// Forces HTTPS usage
app.UseHttpsRedirection();

// Maps controller routes (e.g. /api/barbershops)
// Without this, controllers will never be reachable
app.MapControllers();



<<<<<<< HEAD
=======
app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");
>>>>>>> 0c6189115291c94968e4bba90e389854686b1058

app.Run();


