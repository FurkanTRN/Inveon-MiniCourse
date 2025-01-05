import apiClient from "./ApiClient.js";

const PaymentService = {
    processPayment: async (orderData) => {
        try {
            const response = await apiClient.post("/payment/complete", orderData);
            console.log(response);
            return response;
        } catch (err) {
            console.error(err)
        }
    }
}
export default PaymentService;