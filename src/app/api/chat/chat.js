export const chatApi = {
    getUserList(params) {
        return Axios.get('/auth-service/v1/user', {params: params});
    },
    getChatSession(data) {
        return Axios.get('/message-service/v1/chat-session/mine');
    },
    addSessionGroup(data) {
        return Axios.post('/message-service/v2/chat-session-and-user', data)
    },
    deleteSessionGroup(id) {
        return Axios.delete('/message-service/v1/chat-session/' + id)
    }

};
