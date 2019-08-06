export const example = {
    test: function () {
        return Axios.get('/').then((response) => {
            return response.data;
        });
    }
};
