using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Domain.Event;

namespace InveonMiniCourseAPI.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;

    public PaymentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Payment> CreatePaymentAsync(PaymentCompletedEvent paymentCompletedEvent)
    {
        var payment = new Payment
        {
            Amount = paymentCompletedEvent.Amount,
            PaymentDate = paymentCompletedEvent.PaymentDate,
            PaymentStatus = paymentCompletedEvent.Status,
            TransactionId = paymentCompletedEvent.TransactionId,
            OrderId = paymentCompletedEvent.OrderId,
        };
        await _unitOfWork.Payments.AddAsync(payment);
        await _unitOfWork.SaveAsync();

        return payment;
    }
}