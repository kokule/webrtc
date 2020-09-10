import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import { getToken } from '../../common/utils/login';
Vue.use(Router);

const router = new Router({
    routes
});



router.beforeEach((to, from, next) => {
    if (getToken() && to.name === 'login') { // 已登录,要跳转的页面是登录页,返回首页
        next({ path: '/' });
    } else if (!getToken() && to.name !== 'login') { // 未登录,要跳转的页面不是登录页,返回登录页
        next({ path: '/login' });
    } else {
        next();
    }
});

export default router;
