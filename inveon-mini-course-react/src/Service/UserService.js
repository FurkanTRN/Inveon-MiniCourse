import apiClient from "./ApiClient.js";


const UserService = {

    getUserInfo: async () => {
        try {
            const response = await apiClient.get('/user');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user info', error);
            throw new Error("Failed to fetch user information.");
        }
    },
    updateProfile: async (firstName, lastName, avatarPath, email) => {
        try {
            const response = await apiClient.put("/user", {
                firstName,
                lastName,
                avatarPath,
                email
            });
            return response;
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    }

}
export default UserService;