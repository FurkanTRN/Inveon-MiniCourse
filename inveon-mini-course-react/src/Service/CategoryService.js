import apiClient from "./ApiClient.js";

const CategoryService = {
    getCategories: async () => {
        try {
            const response = await apiClient.get(`/category`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch Categories', error);
        }
    },
    getCategoryById: async (id, pageSize, pageNumber, sortOrder) => {
        try {
            const response = await apiClient.get(`/category/${id}`,
                {
                    params: {
                        pageNumber,
                        pageSize,
                        sortOrder
                    }

                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch Categories', error);
        }
    }

}
export default CategoryService;