using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Domain.Event;

namespace InveonMiniCourseAPI.Application.Interfaces;

public interface IPaymentService
{
    Task<Payment> CreatePaymentAsync(PaymentCompletedEvent paymentCompletedEvent);

}