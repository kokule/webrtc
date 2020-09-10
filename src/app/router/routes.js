export default [
    {
        path: '/',
        redirect: '/webrtc'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@views/login/login.vue')
    },
    {
        path: '/webrtc',
        name: 'webRTC',
        component: () => import('@views/webrtc/webrtc.vue')
    }
];
