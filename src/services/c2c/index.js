/*
 * @Author: zxhuan 
 * @Date: 2018-06-15 15:27:00 
 * @Blog:www.zxhuan.com 
 * @Email:1123046380@qq.com 
 * @Last Modified time: 2018-06-15 15:27:00 
 */

import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * 购买/出售操作
 * method Type Post
 * @param {*} params 
 * entrustId 广告ID
 * dealNum  交易数量
 * price 交易总额
 * type  操作类型
 * tradePassword 交易密码
 * @param {*} bool 
 */
const OrderAdd = (params, bool) => Ajax.Post(dataURL.c2c.orderAdd, params, bool);
/**
 * 获取广告页面初始化数据
 * method Type Get
 * @param {*} params 
 * coinId 货币编号
 * type  广告类型
 * @param {*} bool 
 */
const EntrustInit = (params, bool) => Ajax.Get(dataURL.c2c.entrustInit, params, bool);
/**
 * 添加广告信息
 * method Type Post
 * @param {*} params 
 * coinId 货币编号
 * type 广告类型
 * dealNumber 交易数量
 * price 当前币种价格
 * discussPrice 溢价
 * minLimitPrice 最小限额
 * maxLimitPrice 最大限额
 * remark  备注
 * @param {*} bool 
 */
const EntrustAdd = (params, bool) => Ajax.Post(dataURL.c2c.entrustAdd, params, bool);
/**
 * 获取广告详细信息
 * method Type Get
 * @param {*} params 
 * entrustId 广告ID
 * memberId  广告买家/卖家ID
 * @param {*} bool 
 */
const EntrustInfo = (params, bool) => Ajax.Get(dataURL.c2c.entrustInfo, params, bool);
/**
 * 获取广告分页数据
 * method Type Get
 * @param {*} params 
 * page  当前页数
 * limit 记录条数
 * coinId 币种编号
 * type  广告类型
 * @param {*} bool 
 */
const EntrustList = (params, bool) => Ajax.Get(dataURL.c2c.entrustList, params, bool);
/**
 * 广告用户付款信息
 * method Type Get
 * @param {*} params 
 * entrustId 广告ID
 * @param {*} bool 
 */
const EntrustPayInfo = (params, bool) => Ajax.Get(dataURL.c2c.entrustPayInfo, params, bool);
/**
 * 支付列表
 * method Type Get
 * @param {*} params 
 * @param {*} bool 
 */
const OrderPayList = (params, bool) => Ajax.Get(dataURL.c2c.orderPayList, params, bool);
/**
 * C2C订单详情
 * method Type Get
 * @param {*} params 
 * orderId 订单ID
 * @param {*} bool 
 */
const OrderInfo = (params, bool) => Ajax.Get(dataURL.c2c.orderInfo, params, bool);
/**
 * 获取用户广告列表
 * method Type Get
 * @param {*} params 
 * page  page
 * limit  limit
 * coinId 货币编号 
 * type  广告类型 
 * payType  支付类型 
 * @param {*} bool 
 */
const EntrustUserList = (params, bool) => Ajax.Get(dataURL.c2c.entrustUserList, params, bool);
/**
 * 撤销广告、删除广告
 * method Type Post
 * @param {*} params 
 * type 操作类型
 * entrustId  广告ID
 * @param {*} bool 
 */
const EntrustUserEdit = (params, bool) => Ajax.Post(dataURL.c2c.entrustUserEdit, params, bool);
/**
 * method Type Get
 * @param {*} params 
 * @param {*} bool 
 */
const EntrustStateList = (params, bool) => Ajax.Get(dataURL.c2c.entrustStateList, params, bool);
/**
 * C2C委托详情
 * method Type Get
 * @param {*} params 
 * page 当前页数
 * limit 记录条数
 * entrustId 委托ID
 * @param {*} bool 
 */
const EntrustDetailInfo = (params, bool) => Ajax.Get(dataURL.c2c.entrustDetailInfo, params, bool);
export const C2c = {
  OrderAdd,
  EntrustInit,
  EntrustAdd,
  EntrustInfo,
  EntrustList,
  OrderPayList,
  OrderInfo,
  EntrustDetailInfo,
  EntrustStateList,
  EntrustUserEdit,
  EntrustUserList,
  EntrustPayInfo
};