import Vue from 'vue';
import Axios from 'axios';
import i18n from '@/i18n';
import Router from 'vue-router';
import { routes } from './routes';
import { Auth, Func } from '@/providers';
import { store } from '@/store';
import { User, Coins, Login } from "@/services";

Vue.use(Router);

const vueRouter = new Router({
    mode: 'hash',
    routes
});
let _bool = false;

// 2018-8-8谢树宏新增 >>>>>>>>>>>>>>>>>>>>>>>>begin>>>>>>>>>;
let idx = 0;
let websoket = null;
let heartCheck = {
    reconnectCount: 5,
    timeout: 50000,
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: () => {
        heartCheck.reconnectCount = 5;
        if (heartCheck.timeoutObj)
            clearTimeout(heartCheck.timeoutObj);
        if (heartCheck.serverTimeoutObj)
            clearTimeout(heartCheck.serverTimeoutObj);
        heartCheck.timeoutObj = setTimeout(() => {
            websoket.send('alive');
            // 发送过去过了timeout还没接受到消息的话就断开重连
            heartCheck.serverTimeoutObj = setTimeout(() => {
                websoket.close();
                websoketFn(next); // 重连
            }, heartCheck.timeout)
        }, heartCheck.timeout)
    },
};

let websoketFn = (next) => {
    // websoket = new WebSocket(`ws://` + Login.loginConflict);
    websoket = new WebSocket(`wss://` + Login.loginConflict);
    
    // 开启的回调
    websoket.onopen = () => {
        heartCheck.reset();
        // console.log('开始websoket')
    };
    // 通信时
    websoket.onmessage = (evt) => {
        // console.log('接受到');
        // console.log('页面接受');
        let lang = Vue.prototype.$l;
        // console.log('进行通讯');
        // 重置之前的心跳
        heartCheck.reset();
        let data = evt.data;
        // console.log(evt.data);
        if (data != 'fine') {
            let info;
            if(JSON.parse(data).datas.LoginOtherWhereInfo){
                info = JSON.parse(data).datas.LoginOtherWhereInfo;
            } else {
                info = JSON.parse(data).datas.logoutInfo;
            }
            Vue.prototype.ALERT(info[lang + 'Message'] , () => {
                Func.delCookie('registerTime');
                Func.delCookie('username');
                store.state.userStatus = {};
                next('/signin');
            }, 'warning'); 
        }
    };
    websoket.onerror = (event) => {
        heartCheck.reconnectCount--;
        if (heartCheck.reconnectCount > 0) {
            setTimeout(() => {
                websoketFn(next); // 重连
            }, 2000)
        } else {
            Vue.prototype.WARN(i18n.t('NODATA_REFLUSE'));
        }
    };
    websoket.onclose = () => {
        // console.log('断开');
        if (heartCheck.timeoutObj)
            clearTimeout(heartCheck.timeoutObj);
        if (heartCheck.serverTimeoutObj)
            clearTimeout(heartCheck.serverTimeoutObj);
    };
}
// 2018-8-8谢树宏新增 >>>>>>>>>>>>>>>>>>>>>>>>end>>>>>>>>>
// 路由导航守卫
vueRouter.beforeEach((to, from, next) => {
    if (to.path === '/signin' && from.path === '/user/safe' && !Vue.prototype.loginStatus()) {
        // console.log('服务断开');
        websoket.send('{ "request": "logout"}');
        websoket.close();
        idx = 0 ;
    }
    // 2018-8-8谢树宏新增 >>>>>>>>>>>>>>>>>>>>>>>>begin>>>>>>>>>
    if (Vue.prototype.loginStatus()) { // 如果已经登录 就开启websoket监控 全局只有1次
        idx++;
        if (idx === 1) {
            websoketFn(next);
        }
    }
    // 2018-8-8谢树宏新增 >>>>>>>>>>>>>>>>>>>>>>>>end>>>>>>>>>
    // websoket.close();
    if (window.console && !_bool) {
        var cons = console;
        _bool = true;
        if (cons) {
            console.log('%cCOCONUT', ` font: 700 50px "Comic Sans MS";color: white;text-shadow: 5px 5px 5px black, 0px 0px 2px black;`);
            // console.log('%cMCE', ` font: 700 100px "Comic Sans MS";color: white;text-shadow: 0 0 20px #fdec84,10px -10px 30px #ffae35,20px -20px 40px #ec760c,-20px -60px 50px #cd4607,0px -80px 60px #973717,10px -40px 70px #451b0e`);
        }
    }
    // 需要登陆才能进入的页面
    let needNameList = ['/user', '/order'];
    let gohome = false;
    needNameList.forEach(element => {
        if (to.path.indexOf(element) != -1) {
            gohome = true;
        }
    });
    
    if ((!Vue.prototype.loginStatus()) && gohome) {
        Vue.prototype.WARN(i18n.t('SIGNIN_FIRST'));
        next('/');
    } else {
        next();
    }
});
vueRouter.afterEach((to, from) => {
    // 2018-8-8谢树宏新增 >>>>>>>>>>>>>>>>>>>>>>>>begin>>>>>>>>>
    if (Vue.prototype.loginStatus()) { // 离开时websoket监控
        // websoket.close();
    }
    // 2018-8-8谢树宏新增 >>>>>>>>>>>>>>>>>>>>>>>>end>>>>>>>>>
    // 获取全局数据
    if (store.state.coinList[0].id == '') { // 因为有初始数据，所以不能用length去判断
        let getCoinList = () => {
            return Coins.UseList()
        };
        Axios.all([
            getCoinList()
        ]).then((res) => {
            store.state.coinList = res[0].listData;
        });
    }
    // 获取用户认证状态
    let noGetPathArr = ['/user/safe','/signup','/signup','/forget']
    // console.log(Vue.prototype.loginStatus())
    if (Vue.prototype.loginStatus() && store.state.userStatusChangeSignal === 1 && !noGetPathArr.includes(to.path)) {
        User.getMemberState().then(res => {
            store.state.userStatus = res.oneData;
            store.state.userStatusChangeSignal = 0;
        })
    }
});
export {
    vueRouter
};