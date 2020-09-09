const user = {
    namespaced: true,
    state: {
        userInfo: {}
    },
    mutations: {
        SET_TOKEN (state, token) {
            state.token = token;
        },
        SET_USERINFO (state, data) {
            state.userInfo = data
        }
    }
}

export default user;
