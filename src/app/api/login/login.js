export const loginApi = {
    login (data) {
        return Axios.post('/auth-service/login', data);
    }
};
