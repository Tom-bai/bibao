import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * 显示用户所有资产数据
 * @param {*} params 
 * type:,//类型 0轮播图，1小广告 ，2友情链接
 */
const getHomeInfo = (params, bool) => Ajax.Get(dataURL.home.getHomeInfo, params, bool);

export default {
    getHomeInfo
};


