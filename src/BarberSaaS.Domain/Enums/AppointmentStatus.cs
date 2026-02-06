namespace BarberSaaS.Domain.Enums;

public enum AppointmentStatus
{
    Pending = 1, // appointment waiting for approval (default)
    Confirmed = 2, // confirmed appointment
    Completed = 3, // finishhed appointment
    Cancelled = 4, // cancelled appointment
    NoShow = 5 // Customer didn't come to appointment
}