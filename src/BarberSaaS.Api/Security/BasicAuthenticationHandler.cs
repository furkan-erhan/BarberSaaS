using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace BarberSaaS.Api.Security;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    // ISystemClock was deprecated in .NET 7 and removed in .NET 8+.
    // The new base constructor takes UrlEncoder directly — no clock parameter needed.
    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
            return Task.FromResult(AuthenticateResult.Fail("Missing Authorization Header"));

        try
        {
           var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]!);

            if (authHeader.Scheme != "Basic")
                return Task.FromResult(AuthenticateResult.Fail("Invalid Scheme"));

            var credentialBytes = Convert.FromBase64String(authHeader.Parameter!);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);
            var username = credentials[0];
            var password = credentials[1];
         
            // Temporary in-memory credentials (DO NOT use this in production)
            if (username != "admin" || password != "Admin123!")
                return Task.FromResult(AuthenticateResult.Fail("Invalid Credentials"));

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
        catch
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization Header"));
        }
    }
}