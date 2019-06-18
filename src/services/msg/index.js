
import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * 首页头部公告信息
 * @param {*} params 
 * type: 'INFORMATION_NOTICE',//公告
 */
const getDefMsg = (params, bool) => Ajax.Get(dataURL.msg.getDefMsg, params, bool);

/**
 * 文章
 * @param {*} params 
 * id: ,//id;
 */
const getArtical = (params, bool) => Ajax.Get(dataURL.msg.getArtical, params, bool);

/**
 * 指南列表
 * @param {*} params 
 */
const footerList = (params, bool) => Ajax.Get(dataURL.msg.footerList, params, bool);

/**
 * 公告/新闻
 * @param {*} params 
 * type:，//INFORMATION_NOTICE公告    INFORMATION_NEWS新闻
 * pageSize:,
 * pageNum:,
 */
const getInfoList = (params, bool) => Ajax.Get(dataURL.msg.getInfoList, params, bool);
/**
 * 系统电话、系统邮箱、版权信息、系统名称
 * method Type Get
 * @param {*} params 
 * @param {*} bool 
 */ 
const FootInfoMation = (params, bool) => Ajax.Get(dataURL.msg.footInfoMation, params, bool);




export default {
    getDefMsg,
    getArtical,
    footerList,
    FootInfoMation,
    getInfoList
};