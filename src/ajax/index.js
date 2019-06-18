// import Vue from 'vue';
import Axios from 'axios';
import AxiosConfig from './axios.config';
import { Func } from '@/providers';
import App from '../main.js';
var fileUploadConfig = {
    baseURL: '/',
    timeout: 50000,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};
let pending = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = Axios.CancelToken;
let removePending = (config) => {
    for (let p in pending) {
        if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
            pending[p].f(); // 执行取消操作
            pending.splice(p, 1); // 把这条记录从数组中移除
        }
    }
};
Axios.interceptors.request.use((config) => {
    removePending(config); // 在一个ajax发送前执行一下取消操作
    config.cancelToken = new CancelToken((c) => {
        // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        pending.push({ u: config.url + '&' + config.method, f: c });
    });
    return config;
}, (error) => {
    return Promise.reject(error);
});
Axios.interceptors.response.use((response) => {
    removePending(response.config);
    return response;
}, (error) => {
    // let str = error + '';
    // if (str.search('timeout') !== -1) {
    //     App.$dialog.toast({
    //         msg: '请求超时，请重试',
    //         position: 'top'
    //     });
    // }
    // console.log(str.search('timeout') !== -1);
    // console.log(str.search('timeout'));
    return Promise.reject(error);
});
/**
 * Get 方法获取参数时，需拼接，
 * @param {*} parmas 
 * GET方法传入对象，然后拼接
 */
let _getParmas = (parmas) => {
    let _parmas = '';
    for (let item in parmas) {
        _parmas += item + '=' + parmas[item] + '&';
    };
    if (_parmas) {
        return '?' + _parmas.substr(0, _parmas.length - 1);
    }
    return '';
};
class Ajax {
    /**
     * post 方法封装
     * @param {*} url API
     * @param {*} parmas 参数
     * @param {*} showMaskBool 结果301时候 是否弹层 
     * @param {*} cancelToken  取消请求
     */
    static Post(url, parmas, showMaskBool, cancelToken) {
        return new Promise((resolve, reject) => {
            Axios.post(url, parmas, {
                cancelToken,
                ...AxiosConfig
            }).then((res) => {
                resolve(Ajax.AjaxHandlerFunction(res.data, resolve, reject, showMaskBool));
            }).catch((error) => {
                reject(error);
            });
        });
    }
    /**
     * get 方法封装
     * @param {*} url 
     * @param {*} parmas 
     */
    static Get(url, parmas, showMaskBool) {
        return new Promise((resolve, reject) => {
            Axios.get(url + _getParmas(parmas), AxiosConfig).then((res) => {
                resolve(Ajax.AjaxHandlerFunction(res.data, resolve, reject, showMaskBool));
            }).catch((error) => {
                reject(error);
            });
        });
    }
    /**
     * all 方法封装
     * @param {*} functionArr 
     * @param {*} callbackFn 
     */
    static All(functionArr, callbackFn) {
        Axios.all(functionArr).then(Axios.spread(() => {
            callbackFn(...arguments);
        }));
    }
    /**
     * 文件上传封装
     * @param {*} url 
     * @param {*} parmas 
     */
    static upLoadFile(url, parmas, showMaskBool) {
        return new Promise((resolve, reject) => {
            Axios.post(url, parmas, fileUploadConfig).then((res) => {
                resolve(Ajax.AjaxHandlerFunction(res.data, resolve, reject, showMaskBool));
            }).catch((error) => {
                reject(error);
            });
        });
    }
    /**
     * 结果处理封装
     * @param {*} data 
     * @param {*} resolve 
     * @param {*} reject 
     * @param {*} showMaskBool 
     */
    static AjaxHandlerFunction(data, resolve, reject, showMaskBool = true) {
        let _data = typeof data == 'string' ? JSON.parse(data) : data;
        switch (_data.code.toString()) {
            // 成功的处理（不使用后端提示）
            case 'SUCCESS':
                resolve(_data);
                break;
            case 'SUCCESS_ENTRUST_NO_MATCHED'://发布委托成功，暂未匹配到合适的订单
                resolve(_data);
                break;
            case 'SUCCESS_ENTRUST_YES_MATCHED'://发布委托成功，恭喜您匹配到了合适的订单
                resolve(_data);
                break;
            case 'SUCCESS_ENTRUST_DEAL'://恭喜,您有委托被成功匹配
                // 成功返回
                resolve(_data);
                break;
            // 失败的处理
            case 'UNAUTH': //用户未登录
                Func.delCookie('registerTime');
                Func.delCookie('username');
                App.$store.state.userStatus = {};
                App.$alert(_data[App.$l + 'Message'], App.$t('PROMPT'), {
                    confirmButtonText: App.$t('DETERMINE'),
                    type: 'warning',
                    callback: ()=>{
                        App.$router.push('/signin');
                    }
                });
                reject(_data);
                break;
            // 其余异常的提示（根据前端情况是否使用后端提示,不需要提示则在参数后面添加 false）
            default:
                if (showMaskBool) {
                    App.$notify.warning({
                        title: App.$t('WARMTIPS'),
                        message: _data[App.$l + 'Message'],
                        duration: 1200,
                        offset: 100,
                        onClose() {
                            if (_data.code.toString() == 'PLEASE_SET_PAYMENT_METHOD') {
                                App.$router.push('/user/safe');
                            }
                        }
                    });
                }
                // if(){}
                reject(_data);
                break;
        }
    }
};
//************  通用异常CODE  ************
// FAIL, //处理失败
// UNAUTH, //用户未登录
// TIMEOUT, //请求服务超时
// EXCEPTION, //处理异常
// PARAMETER_MISSING, //缺少必要参数
// SERVICE_ERROR, //服务异常

// //************  指定业务异常CODE  ************
// MY_ERROR,
// PARAMS_NULL, // 必填参数不能为空
// ACCOUNT_NULL, // 用户不存在
// RECORD_EXIST, // 记录已存在
// CODE_FAIL, // 验证码错误
// PWD_FAIL, // 登陆密码错误
// DEALPWD_NULL, // 交易密码为空
// DEALPWD_FAIL, // 交易密码错误
// OLD_WECHAT_FAIL, // 原微信账号错误
// WECHAT_NULL, // 用户微信账号为空
// OLD_ALIPAY_FAIL, // 原支付宝账号错误
// ALIPAY_NULL, // 用户支付宝账号为空
// NOT_SET_PHONE, // 未设置手机号码
// NOT_SET_EMAIL, // 未设置邮箱号码
// IDENTITY_CERTIFICATION_FAIL, // 用户已设置实名认证
// GOOGLE_CERTIFICATION_FAIL, // 用户已设置Google认证
// BALANCE_FAIL, // 用户资产异常
// EN_BALANCE_INSUFFICIENT, // 用户可用资产不足
// UN_BALANCE_INSUFFICIENT, // 用户冻结资产不足
// HOLD_FILE_FAIL, // 保存文件异常
// COIN_FAIL, // 货币信息异常
// TRADE_NUM_FAIL, // 交易数量异常
// PHONE_FORMAT_FAIL, // 手机格式错误
// EMAIL_FORMAT_FAIL, // 邮箱格式错误
// VERIFICATION_CODE_ERROR, //验证码错误
// NO_MEMBER_WALLET,//未创建钱包
// INVITATION_CODE_NOT_EXIST,//邀请码不存在

// /**BB交易相关提示**/
// COIN_UNABLED, //货币未开启
// LIMIT_PRICE,  //限制最小价格
// LIMIT_PRICE_LENGTH,//限制价格小数位
// LIMIT_NUM,//限制最小数量
// LIMIT_NUM_LENGTH,//限制数量小数位
// NO_THIS_PAIR;//抱歉，没有此交易对

export {
    Ajax
};