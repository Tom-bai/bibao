import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        activeCoin: {}, // 首页当前查看的 币种/币区
        daysNum: {// 首页当前 币种/币区 的 1，7，30天交易量
            oneDays: "0",
            sevenDays: "0",
            thirtyDays: "0"
        },
        blockList: [], // 币区数据
        coinDataList: [],// 币种数据
        socketMsg: '',
        blockData: {}, // 切换币区的带过来的数据
        tradeCoinItem: {
            highestPrice: 0,
            isTag: 0,
            latestPrice: 0,
            lowestPrice: 0.,
            priceCoinCore: '',
            priceCoinId: '',
            productCoinCore: '',
            productCoinId: '',
            riseAndFall: '',
            tradingVolume: 0
        }, // 币币交易单个交易对的数据
        tradeData: {}, // 币币交易数据websoket数据
        userStatusChangeSignal: 1,//用户认证状态需要改变的信号,1时会改变,0不改变（会调用main里面的查询用户认证状态接口）
        userStatus: {//0:未验证，1：已验证
            // userId: "0",
            // alipay: "",//------------- 支付宝
            // alipayState: "0",
            // credentialInfo: "",//----- 实名认证
            // credentialInfoState: "0",//0未认证，1已认证，2认证中，3：认证失败
            // email: "",//-------------- 邮箱
            // emailState: "0",
            // googleSecretKey: "",//---- 谷歌key
            // googleState: "0",
            // password: "",//----------- 登陆密码
            // passwordState: "0",
            // phone: "",//-------------- 电话
            // phoneState: "0",
            // tradePassword: "",//----- 交易密码
            // tradePasswordState: "0",
            // wechat: "",//------------- 微信
            // wechatState: "0",
            // bank: "",//---------- 银行卡
            // bankState: "0"
        },
        sellFormBool: false,
        buyFormBool: false,
        // 公共数据
        coinList: [{//币种列表
            apiType: '',
            bbScale: '',
            coinImg: '',
            coinName: '',
            createDate: '',
            deleted: '',
            enabled: '',
            fee: '',
            id: '',
            minTradeDonePrice: '',
            minWithdrawNumber: '',
            releaseFormat: '',
            withdrawFee: ''
        }]
    },
    mutations,
    actions,
    getters
});