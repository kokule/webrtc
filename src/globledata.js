import store from './app/store/index'
import {chatApi} from './app/api/chat/chat'

getUserList();

function getUserList() {
    chatApi.getUserList().then(res => {
        store.commit('user/SET_USERLIST', res.data)
    })
}
