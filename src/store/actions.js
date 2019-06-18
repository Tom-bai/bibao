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
    [SENDWEBSCOKETMSG]({ commit, state }, data) {
        commit(SENDWEBSCOKETMSG, data);
    },
    // 存储websoket推送过来的交易数据
    [SETTARDEDATA]({ commit, state }, data) {
        commit(SETTARDEDATA, data);
    },
    // 设置币币交易单个交易对的数据
    [SETCOINITEM]({ commit, state }, data) {
        commit(SETCOINITEM, data);
    },
    // 币区数据
    [BLOCKLIST]({ commit, state }, data) {
        commit(BLOCKLIST, data);
    },
    // 设置币币交易币种数据
    [COINDATALIST]({ commit, state }, data) {
        commit(COINDATALIST, data);
    },
    // 切换币区
    [SWITCHBLOCK]({ commit, state }, data) {
        commit(SWITCHBLOCK, data);
    },
    // 切换币区
    [SETBOOLEAN]({ commit, state }, data) {
        commit(SETBOOLEAN, data);
    }

};