import {
    SETTARDEDATA,
    SETCOINITEM,
    SENDWEBSCOKETMSG,
    BLOCKLIST,
    COINDATALIST,
    SWITCHBLOCK,
    SETBOOLEAN
} from './mutation-types';
export default {
    // 存储websoket推送过来的交易数据
    [SETTARDEDATA](state, data) {
        state.tradeData = data;
    },
    // 币币交易单个交易对的数据
    [SETCOINITEM](state, data) {
        state.tradeCoinItem = data;
    },
    [SENDWEBSCOKETMSG](state, data) {
        state.socketMsg = data;
    },
    [BLOCKLIST](state, data) {
        state.blockList = data;
    },
    [COINDATALIST](state, data) {
        state.coinDataList = data;
    },
    [SWITCHBLOCK](state, data) {
        state.blockData = data;
    },
    [SETBOOLEAN](state, data) {
        state[data.type] = data.bool;
    }
};