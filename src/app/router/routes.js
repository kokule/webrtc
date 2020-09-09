import Header from '../../common/components/main/main';

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
    },
    {
        path: '/resource-allocation',
        name: 'resourceAllocation',
        component: Header,
        children: [
            // {
            //     path: 'message_page',
            //     name: 'message_page',
            //     meta: {
            //         icon: 'md-notifications',
            //         title: '消息中心'
            //     },
            //     component: () => import('@/view/single-page/message/index.vue')
            // }
        ]
    },
];
