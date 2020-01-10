import Vue from 'vue';
import Router from 'vue-router';
import { ExampleRoute } from '../views/example/example.route';

Vue.use(Router);

export default new Router({
    routes: [
        ExampleRoute('/'),
        {
            path: '*', redirect: '/Page1'
        }
    ]
});
