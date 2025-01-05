import apiClient from "./ApiClient.js";

const CourseService = {
    getCourses: async (pageNumber, pageSize, sortBy) => {
        try {
            const response = await apiClient.get('/course', {
                params: {
                    pageNumber,
                    pageSize,
                    sortBy
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch courses', error);
            throw new Error("Failed to fetch course information.");
        }
    },
    getCourseById: async (id) => {
        try {
            const response = await apiClient.get(`/course/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch course', error);
            throw new Error("Failed to fetch course information.");
        }
    },
    searchCourse: async (pageNumber, pageSize, searchTerm, sortOrder) => {
        try {
            const response = await apiClient.get('/course/search', {
                params: {
                    pageNumber,
                    pageSize,
                    searchTerm,
                    sortOrder
                }
            });

            return response.data;
        } catch (error) {
            console.error('Failed to fetch course', error);
        }
    },
    createCourse: async (course) => {
        try {
            const response = await apiClient.post(`/course`, course);
            return response;
        } catch (error) {
            console.error('Failed to create course', error);
        }
    },
    getInstructorCourses: async (pageNumber, pageSize) => {
        try {
            const response = await apiClient.get('/course/instructor', {
                params: {
                    pageNumber,
                    pageSize
                }
            })
            return response.data;
        } catch (error) {
            console.error('Failed to fetch course', error);
        }
    },
    updateCourse: async (id,course) => {
        try {
            const response = await apiClient.put(`/course/${id}`, course);
            return response;
        } catch (error) {
            console.error('Failed to update course', error);
        }
    },
    deleteCourse: async (id) => {
        try{
            const response = await apiClient.delete(`/course/${id}`);
            return response;
        }
        catch(error) {
            console.error('Failed to delete course', error);
        }
    }


}
export default CourseService;