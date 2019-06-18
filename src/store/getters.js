import { Func } from '@/providers';
const getters = {
    // loginStatus: () => Func.getCookie('username') ? true : false,
    routePath: state => state.routePath,
    tradeData: state => state.tradeData,
    tradeCoinItem: state => state.tradeCoinItem,
    socketMsg: state => state.socketMsg,
    blockList: state => state.blockList,
    blockData: state => state.blockData,
    coinDataList: state => state.coinDataList,
    sellFormBool: state => state.sellFormBool,
    buyFormBool: state => state.buyFormBool,
    imgPath: () => {
        let pathList;
        if (process.env.NODE_ENV === 'development')
            pathList = ['http://bijiaoyi.oss-cn-shenzhen.aliyuncs.com/'];
        else
            // pathList = ['https://file.bjy.inesv.com/'];
            pathList = [process.env.IMGPATH];
        let num = Math.floor(Math.random() * pathList.length)
        return pathList[num]
    }
};
export default getters;