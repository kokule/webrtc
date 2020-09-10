import * as Directives from './directives';
import * as Components from './components';
import * as Utils from './utils';

export default {
    install: (Vue) => {
        for (let name of Object.keys(Components)) {
            Vue.component(Components[name], Components[name]);
        }
        for (let name in Directives) {
            Vue.directive(name, Directives[name]);
        }
        Object.assign(Vue.prototype.$utils ? Vue.prototype.$utils : {}, Utils);
    }
};
