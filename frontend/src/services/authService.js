import API from "./api";

const login = async(email, password) => {
    const response = await API.post('/users/login', {email, password});
    return response.data;
};

const authService = {
    login,
};

export default authService;