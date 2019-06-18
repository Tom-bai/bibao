import CryptoJS from 'crypto-js';//加密
import { Func } from '@/providers';
// import { Decimal } from 'decimal.js';// 控制数字精度的包
import { BigNumber } from 'bignumber.js';

const vuePrototype = {
    install: (Vue, options) => {
        // 接口中英切换取值取值
        Vue.prototype.$l = Func.getCookie('lang')
        Vue.prototype.loginStatus = () => {
            return Func.getCookie('username') ? true : false
        };
        Vue.prototype.$C = ( num ) => {//用于虚拟币小数位保留
            if (num-0 == num) { //是否是数字
                let places = 20;//保留2位小数
                let temp = BigNumber(num).toFixed(places);
                let int, decimal, extra0, dL;
                // 小数部分处理
                if (/\.\d{0,20}0*$/.test(temp)) {//如果小数尾部出现0的话（toFixed可能会出现多余0的情况）
                    //整数部分
                    if (temp > 0) {
                        int = Math.floor(Number(temp));
                    } else if (temp < 0) {
                        int = Math.ceil(Number(temp));
                    } else {
                        return '0'
                    }
                    decimal = temp.match(/\.\d{0,20}/)[0];//小数点及后面部分
                    extra0 = decimal.match(/0*$/)[0];//后面多余的0
                    if (extra0.length == 0) {
                        dL = decimal.slice(1);//小数点后面部分
                    } else {
                        dL = decimal.slice(1, -extra0.length);//小数点后面部分
                    }
                    if (dL.length > 0) {
                        return int + '.' + dL
                    } else {
                        return int
                    }
                } else {
                    return temp
                }
            }else {
                return num
            }
        };
        Vue.prototype.$M = (num) => {//用于人民币小数位保留
            if (num-0 == num) { //是否是数字
                let places = 2;//保留2位小数
                let temp = BigNumber(num).toFixed(places);
                let int, decimal, extra0, dL;
                // 小数部分处理
                if (/\.\d{0,2}0*$/.test(temp)) {//如果小数尾部出现0的话（toFixed可能会出现多余0的情况）
                    //整数部分
                    if (temp > 0) {
                        int = Math.floor(Number(temp));
                    } else if (temp < 0) {
                        int = Math.ceil(Number(temp));
                    } else {
                        return '0'
                    }
                    decimal = temp.match(/\.\d{0,2}/)[0];//小数点及后面部分
                    extra0 = decimal.match(/0*$/)[0];//后面多余的0
                    if (extra0.length == 0) {
                        dL = decimal.slice(1);//小数点后面部分
                    } else {
                        dL = decimal.slice(1, -extra0.length);//小数点后面部分
                    }
                    if (dL.length > 0) {
                        return int + '.' + dL
                    } else {
                        return int
                    }
                } else {
                    return temp
                }
            }else {
                return num
            }
        };
        // AES加密
        Vue.prototype.AES = (str) => {
            let defKey = "2018@#$%bijiaoyi";
            var key = CryptoJS.enc.Utf8.parse(defKey);
            var srcs = CryptoJS.enc.Utf8.parse(str);
            var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
            return encrypted.toString();
        }
        // AES解密
        Vue.prototype.AES_d = (str) => {
            let defKey = "2018@#$%bijiaoyi";
            var key = CryptoJS.enc.Utf8.parse(defKey);
            var decrypt = CryptoJS.AES.decrypt(str, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        }
        // 成功提示
        Vue.prototype.SUCCESS = (msg, closeFn, clickFn) => {
            options.ElementUI.Notification({
                title: options.i18n.t('SUCCESS'),
                message: msg,
                type: 'success',
                duration: 1200,
                offset: 100,
                onClick: clickFn,
                onClose: closeFn
            });
        }
        // 警示提示
        Vue.prototype.WARN = (msg, closeFn, clickFn) => {
            options.ElementUI.Notification({
                title: options.i18n.t('PROMPT'),
                message: msg,
                type: 'warning',
                duration: 1200,
                offset: 100,
                onClick: clickFn,
                onClose: closeFn
            });
        }
        // 错误提示
        Vue.prototype.ERROR = (msg, closeFn, clickFn) => {

        }
        // ALERT 提示
        Vue.prototype.ALERT = (msg, closeFn, type = 'error') => {
            options.ElementUI.MessageBox.alert(msg, options.i18n.t('PROMPT'), {
                confirmButtonText: options.i18n.t('DETERMINE'),
                type: type,
                callback: closeFn
            });
        }
    }
}

export default vuePrototype