using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace BarberSaaS.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName {get;set;} = string.Empty;
    public string LastName {get;set;} = string.Empty;

    public virtual ICollection<Appointment> Appointments {get;set;} = new List<Appointment>();
}