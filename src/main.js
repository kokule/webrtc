import './polyfills';
import './plugins';
import './styles.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './app/router';
import store from './app/store';

import CommonPart from './common';
import * as Api from './app/api';

Vue.use(CommonPart);
Vue.prototype.$api = Api;

// 设置主题
var eleLinks = document.querySelectorAll('link[title]');
const links = [...eleLinks];
const THEME = 'default';
// const THEME = 'darken';
eleLinks.forEach(link => {
    link.disabled = true;
    link.disabled = link.title !== THEME;
});

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
