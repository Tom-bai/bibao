/*
 * @Author: zxhuan 
 * @Date: 2018-05-24 09:15:17 
 * @Blog: www.zxhuan.com 
 * @Email:1123046380@qq.com 
 * @Last Modified time: 2018-05-24 09:15:17 
 */
/**
 * @param {*}  meta参数说明
 * token 是否需要登录才显示
 * fixedNav 当前页面是否需要绝对定位
 * hidenavtop 是否隐藏顶部
 * hidefooter 是否隐藏footer
 */
let _import = file => () => import('@/page/' + file + '.vue');
export const routes = [
    {
        path: '/',
        name: 'main',
        meta: { token: false, fixedNav: true },
        component: _import('main')
    },
    {
        path: '/signin',
        name: 'signin',
        meta: { token: true, hidefooter: true },
        component: _import('signin')
    },
    {
        path: '/signup',
        name: 'signup',
        meta: { token: true, hidefooter: true },
        component: _import('signup')
    },
    {
        path: '/forget',
        name: 'forget',
        meta: { token: true, hidefooter: true },
        component: _import('forget')
    },
    {
        path: '/trade',
        name: 'trade',
        meta: { token: true },
        component: _import('trade'),
        children: [
            {
                path: '/trade',
                name: 'trade_info',
                meta: { token: true },
                component: _import('trade/info')
            },
            {
                path: '/trade/full',
                name: 'trade_full',
                meta: { token: true, hidenavtop: true, fullPage: true, hidefooter: true },
                component: _import('trade/fullPage')
            },
        ]

    },
    // {
    //     path: '/trade/full',
    //     name: 'trade_full',
    //     meta: { token: true, hidenavtop: true, fullPage: true, hidefooter: true },
    //     component: _import('trade/fullPage')
    // },
    // {
    //     path: '/intelligent',
    //     name: 'intelligent',
    //     meta: { token: true },
    //     component: _import('intelligent')
    // },
    // {
    //     path: '/intelligent/full',
    //     name: 'intelligent_full',
    //     meta: { token: true, hidenavtop: true, fullPage: true, hidefooter: true },
    //     component: _import('intelligent/fullPage')
    // },
    // {
    //     path: '/leveraged',
    //     name: 'leveraged',
    //     meta: { token: true },
    //     component: _import('leveraged')
    // },
    {
        path: '/statistics',
        name: 'statistics',
        meta: { token: true },
        component: _import('statistics')
    },
    {
        path: '/mining',
        name: 'mining',
        meta: { token: true },
        component: _import('mining')
    },
    {
        path: '/user/safe',
        name: 'user',
        meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
        component: _import('user'),
        children: [
            {
                path: '/user/safe',
                name: 'user_safe',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/list')
            },
            {
                path: '/user/safe/mobile',
                name: 'user_safe_mobile',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/mobile')
            },
            {
                path: '/user/safe/email',
                name: 'user_safe_email',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/email')
            },
            {
                path: '/user/safe/pass',
                name: 'user_safe_pass',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/pass')
            },
            {
                path: '/user/safe/trade',
                name: 'user_safe_trade',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/trade')
            },
            {
                path: '/user/safe/google',
                name: 'user_safe_google',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/google')
            },
            {
                path: '/user/safe/wechat',
                name: 'user_safe_wechat',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/wechat')
            },
            {
                path: '/user/safe/bank',
                name: 'user_safe_bank',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/bank')
            },
            {
                path: '/user/safe/alipay',
                name: 'user_safe_alipay',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/alipay')
            },
            {
                path: '/user/safe/identity',
                name: 'user_safe_identity',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/identity')
            },
            {
                path: '/user/safe/question',
                name: 'user_safe_question',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('safe/question')
            },
            {
                path: '/user/asset',
                name: 'user_asset',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('asset/index')
            },
            {
                path: '/user/invite',
                name: 'user_invite',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('invite/index')
            },
            {
                path: '/user/holding',
                name: 'user_holding',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('holding/index')
            },
            {
                path: '/user/authenticate',
                name: 'user_authenticate',
                meta: { token: true, hidenavtop: true, hidefooter: true, fixedNav: true },
                component: _import('authenticate/index')
            },
        ]
    },
    {
        path: '/order',
        name: 'order',
        meta: { token: true },
        component: _import('order'),
        children: [
            {
                path: '/order',
                name: 'order_list',
                meta: { token: true },
                component: _import('order/list')
            },
            {
                path: '/order/detail',
                name: 'order_list_detail',
                meta: { token: true },
                component: _import('order/list-detail')
            },
            {
                path: '/order/advert',
                name: 'order_advert',
                meta: { token: true },
                component: _import('order/advert')
            },
            {
                path: '/order/entrust',
                name: 'order_entrust',
                meta: { token: true },
                component: _import('order/entrust')
            },
            {
                path: '/order/entrust/detail',
                name: 'order_entrust_detail',
                meta: { token: true },
                component: _import('order/entrust-detail')
            },
            {
                path: '/order/c2b',
                name: 'order_c2b',
                meta: { token: true },
                component: _import('order/c2b-order')
            },
            {
                path: '/order/c2b/detail',
                name: 'order_c2b_detail',
                meta: { token: true },
                component: _import('order/c2b-order-detail')
            }
        ]
    },
    {
        path: '/news',
        name: 'news',
        meta: { token: true, hidefooter: true },
        component: _import('news'),
        children: [
            {
                path: '/news',
                name: 'news_list',
                meta: { token: true, hidefooter: true },
                component: _import('news/newslist')
            },
            {
                path: '/news/notice',
                name: 'news_notice',
                meta: { token: true, hidefooter: true },
                component: _import('news/noticelist')
            },
            {
                path: '/news/detail/:id',
                name: 'news_detail',
                meta: { token: true, hidefooter: true },
                component: _import('news/detail')
            }
        ]
    },
    {
        path: '/guide',
        name: 'guide',
        meta: { token: true, fixedNav: false, hidefooter: true },
        component: _import('guide'),
    },
    {
        path: '/guide/:type',
        name: 'guideType',
        meta: { token: true, fixedNav: false, hidefooter: true },
        component: _import('guide')
    },
    {
        path: '/guide/:type/:id',
        name: 'guideId',
        meta: { token: true, fixedNav: false, hidefooter: true },
        component: _import('guide')
    },
    {
        path: '/c2b',
        name: 'c2b',
        meta: { token: true },
        component: _import('c2b'),
        children: [
            {
                path: '/c2b',
                name: 'c2b_list',
                meta: { token: true },
                component: _import('c2b/list')
            }
        ]
    },
    {
        path: '/c2c',
        name: 'c2c',
        meta: {
            token: true
        },
        component: _import('c2c'),
        children: [
            {
                path: '/c2c',
                name: 'c2c_list',
                meta: { token: true },
                component: _import('c2c/list')
            },
            {
                path: '/c2c/advert',
                name: 'c2c_advert',
                meta: { token: true },
                component: _import('c2c/advert')
            },
            {
                path: '/c2c/sale',
                name: 'c2c_sale',
                meta: { token: true },
                component: _import('c2c/sale')
            },
            {
                path: '/c2c/record',
                name: 'c2c_record',
                meta: { token: true },
                component: _import('c2c/record')
            },
            {
                path: '/c2c/order',
                name: 'c2c_order',
                meta: { token: true },
                component: _import('c2c/order')
            },
            {
                path: '/c2c/order/detail',
                name: 'c2c_order_detail',
                meta: { token: true },
                component: _import('c2c/order-detail')
            }
        ]
    },
    { path: '*', redirect: '/' }
];