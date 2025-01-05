import apiClient from "./ApiClient.js";

const OrderService = {

    createOrder: async (orderData) => {
        try {
            const response = await apiClient.post("/order", orderData)
            return response.data;
        } catch (err) {
            console.error(err)
        }
    },
    getUserOrders: async () => {
        try{
            const response = await apiClient.get("/order/user");
            return response.data;
        }
        catch(err){
            console.error(err)
        }
    }


}
export default OrderService;