const user = {
    namespaced: true,
    state: {
        userInfo: {},
        userList: []
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
        },
        SET_USERINFO(state, data) {
            state.userInfo = data
        },
        SET_USERLIST(state, data) {
            state.userList = data
        },
    }
}

export default user;
