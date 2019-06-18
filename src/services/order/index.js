/*
 * @Author: zxhuan 
 * @Date: 2018-06-20 15:42:07 
 * @Blog:www.zxhuan.com 
 * @Email:1123046380@qq.com 
 * @Last Modified time: 2018-06-20 15:42:07 
 */

import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * C2C订单列表
 * methodType Get
 * @param {*} parmas 
 * page 当前页数
 * limit 记录条数
 * coinId 货币ID
 * state 状态
 * type  买/卖类型
 * @param {*} bool 
 */
const List = (parmas, bool) => Ajax.Get(dataURL.order.list, parmas, bool);
/**
 * C2C订单列表
 * methodType Get
 * @param {*} parmas 
 * orderId   订单ID
 * @param {*} bool 
 */
const Info = (parmas, bool) => Ajax.Get(dataURL.order.info, parmas, bool);
/**
 * 确认收款
 * methodType Post
 * @param {*} parmas 
 * orderId 订单ID
 * @param {*} bool 
 */
const Update = (parmas, bool) => Ajax.Post(dataURL.order.update, parmas, bool);
/**
 * 撤销或买家确认付款
 * methodType Post
 * @param {*} parmas 
 * orderId 订单ID
 * state  状态
 * @param {*} bool 
 */
const InfoUpdata = (parmas, bool) => Ajax.Post(dataURL.order.infoUpdata, parmas, bool);
/**
 * 订单状态
 * methodType Get
 * @param {*} parmas 
 * @param {*} bool 
 */
const StateList = (parmas, bool) => Ajax.Get(dataURL.order.stateList, parmas, bool);
/**
 * 删除订单
 * methodType Post
 * @param {*} parmas 
 * orderId orderId
 * @param {*} bool 
 */
const OrderDelete = (params, bool) => Ajax.Post(dataURL.order.orderDelete, params, bool);
/**
* 纠纷列表
* methodType Get
* @param {*} parmas 
* page  page 
* limit limit
* type 广告类型 买家申请,卖家卖家未转账：BUY_TYPE 卖家申请：卖家未打款：SELL_YPE  
* state 状态 进行中：PROCESS 通过：AGREE 驳回：DISAGREE  
* @param {*} bool 
*/
const DisputeList = (params, bool) => Ajax.Get(dataURL.order.disputeList, params, bool);
/**
* 纠纷状态
* methodType Get
* @param {*} parmas 
* @param {*} bool 
*/
const DisputeStateList = (params, bool) => Ajax.Get(dataURL.order.disputeStateList, params, bool);
/**
 * 添加纠纷记录
 * methodType Post
 * @param {*} params 
 * orderId  订单ID
 * remark  用户备注
 * type   类型 买家申请,卖家卖家未转账：BUY_TYPE 卖家申请：卖家未打款：SELL_YPE
 * @param {*} bool 
 */
const DisputeAdd = (params, bool) => Ajax.upLoadFile(dataURL.order.disputeAdd, params, bool);
/**
 * 删除纠纷记录
 * methodType Post
 * @param {*} params 
 * disputeId 纠纷ID
 * @param {*} bool 
 */
const DisputeDelete = (params, bool) => Ajax.Post(dataURL.order.disputeDelete, params, bool);
/**
 * 用户委托列表
 * methodType Get
 * @param {*} params 
 * state
 * type
 * times
 * priceCoinId
 * productCoinId
 * defaultIndex
 * @param {*} bool 
 */
const BbCenterUserEntrusts = (params, bool) => Ajax.Get(dataURL.order.bbCenterUserEntrusts, params, bool);
/**
 * 用户委托详情
 * methodType Get
 * @param {*} params 
 * entrustId 
 * @param {*} bool 
 */
const BbCenterUserEntrustDetail = (params, bool) => Ajax.Get(dataURL.order.bbCenterUserEntrustDetail, params, bool);
/**
 * 用户委托关联的成交记录
 * methodType Get
 * @param {*} params 
 * entrustId 
 * @param {*} bool 
 */
const BbCenterUserOrders = (params, bool) => Ajax.Get(dataURL.order.bbCenterUserOrders, params, bool);
/**
 * 撤销委托
 * @param {*} params 
 * entrustId 委托记录id
 * @param {*} bool 
 */
const BbCenterCancelEntrust = (params, bool) => Ajax.Post(dataURL.order.bbCenterCancelEntrust, params, bool);
/**
 * c2b订单详情
 * @param {*} params 
 * id
 * @param {*} bool 
 */
const TransactionInfo = (params, bool) => Ajax.Get(dataURL.order.transactionInfo, params, bool);
export const Order = {
    List,
    Update,
    StateList,
    InfoUpdata,
    OrderDelete,
    DisputeList,
    DisputeAdd,
    DisputeDelete,
    DisputeStateList,
    Info,
    BbCenterCancelEntrust,
    BbCenterUserEntrusts,
    BbCenterUserOrders,
    TransactionInfo,
    BbCenterUserEntrustDetail
};