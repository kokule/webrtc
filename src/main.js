import './polyfills';
import './plugins';
import './styles.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './app/router';
import store from './app/store';

import CommonPart from './common';
import * as Api from './app/api';
import { autoSetRem } from './common/utils/rem';
// 设置全局fontSize
autoSetRem(document, window);
// 调试主题
import '@/theme/default/index.scss';
// import '@/theme/darken/index.scss';

Vue.use(CommonPart);
Vue.prototype.$api = Api;

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
