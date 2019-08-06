import * as Directives from './directives';
import * as Components from './components';

export default {
    install: (Vue) => {
        for (let name of Object.keys(Components)) {
            Vue.component(Components[name]['name'], Components[name]);
        }
        for (let name in Directives) {
            Vue.directive(name, Directives[name]);
        }
    }
};
