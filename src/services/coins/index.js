/*
 * @Author: zxhuan 
 * @Date: 2018-04-11 10:03:57 
 * @Blog:www.zxhuan.com 
 * @Email:1123046380@qq.com 
 * @Last Modified time: 2018-04-11 10:03:57 
 */
import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * 获取货币列表
 * methodType Get
 * @param {*} parmas 
 * @param {*} bool 
 */
const UseList = (parmas, bool) => Ajax.Get(dataURL.coins.useList, parmas, bool);

export const Coins = {
  UseList
};