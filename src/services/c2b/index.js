/*
 * @Author: zxhuan 
 * @Date: 2018-06-21 09:47:20 
 * @Blog:www.zxhuan.com 
 * @Email:1123046380@qq.com 
 * @Last Modified time: 2018-06-21 09:47:20 
 */
import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * 获取出售,购买,交易须知
 * methodType GET
 * @param {*} params 
 * price 价钱
 * amount  数量
 * coinId  币种编号
 * type  交易类型
 * @param {*} bool 
 */
const TransactionAdd = (params, bool) => Ajax.Post(dataURL.c2b.transactionAdd, params, bool);
/**
 * c2b订单列表
 * methodType GET
 * @param {*} params 
 * page 当前页数
 * limit 当前页数
 * createDate createDate
 * coinId   币种编号
 * price  价钱
 * status   交易类型
 * @param {*} bool 
 */
const TransactionGetList = (params, bool) => Ajax.Get(dataURL.c2b.transactionGetList, params, bool);
/**
 * 平台交易记录接口
 * methodType GET
 * @param {*} params 
 * coinId 货币编号
 * @param {*} bool 
 */
const TransactionList = (params, bool) => Ajax.Get(dataURL.c2b.transactionList, params, bool);
/**
 * 撤销
 * methodType GET
 * @param {*} params 
 * id id
 * userId 商户名
 * @param {*} bool 
 */ 
const TransactionUndo = (params, bool) => Ajax.Post(dataURL.c2b.transactionUndo, params, bool);
 /**
 * CTB状态列表
 * methodType GET
 * @param {*} params 
 * @param {*} bool 
 */ 
const TransactionStateList = (params, bool) => Ajax.Get(dataURL.c2b.transactionStateList, params, bool);
export const C2b = {
    TransactionGetList,
    TransactionList,
    TransactionUndo,
    TransactionStateList,
    TransactionAdd
}
