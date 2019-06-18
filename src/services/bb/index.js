import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * BB交易区列表
 * @param {*} params 
 */
const getBlocks = (params, bool) => Ajax.Get(dataURL.bb.getBlocks, params, bool);

/**
 * BB交易区列表-明细
 * @param {*} params 
 * blockId:,//币区
 */
const getCoinsByBlock = (params, bool) => Ajax.Get(dataURL.bb.getCoinsByBlock, params, bool);

/**
 * BB交易区成交量统计
 * @param {*} params 
 *  productCoinId:,//币种
    priceCoinId:,//币区
 */
const tradeStatistics = (params, bool) => Ajax.Get(dataURL.bb.tradeStatistics, params, bool);

/**
 * 用户手动添加收藏-如果已收藏则取消收藏
 * @param {*} params 
 *  userId:,//
    productCoinId:,//币种
    priceCoinId:,//币区
 */
const addCoinTransactionPairUser = (params, bool) => Ajax.Post(dataURL.bb.addCoinTransactionPairUser, params, bool);
/**
 * 货币与CNY的兑换
 * method Type Get
 * @param {*} params 
 * coinId
 * @param {*} bool 
 */
const ApproximateValue = (params, bool) => Ajax.Get(dataURL.bb.approximateValue, params, bool);
/**
 * 获取货币有效用户数以及用户排行
 * @param {*} params 
 * @param {*} bool 
 */
const GetCoinUserCount = (params, bool) => Ajax.Get(dataURL.bb.getCoinUserCount, params, bool);
/**
 * 获取挖矿记录
 * @param {*} params
 * page 当前页数 
 * limit 记录条数 
 * coinId  货币ID
 * @param {*} bool 
 */
const MineList = (params, bool) => Ajax.Get(dataURL.mine.mineList, params, bool);
/**
 * 获取抵扣参数
 * @param {*} params 
 * @param {*} bool 
 */ 
const DeductData = (params, bool) => Ajax.Get(dataURL.bb.deductData, params, bool);
//用 WS更新币区里面的币种信息
const getCoinsByWS = dataURL.bb.getCoinsByWS;

export default {
    getBlocks, getCoinsByBlock, tradeStatistics, addCoinTransactionPairUser, getCoinsByWS, ApproximateValue, GetCoinUserCount, MineList, DeductData
};