/*
 * @Author: zxhuan 
 * @Date: 2017-12-08 15:23:02 
 * @blog: http://www.zxhuan.com 
 * @Last Modified time: 2017-12-08 15:23:02 
 */
/**
 * js的公共函数库
 */
const Func = {
    quicksort(arr, left, right) {
        if (left < right) {
            var key = arr[left];  // 基准数
            var first = left;   // 开始位置
            var last = right;  // 结束位置

            while (first < last) {
                while (first < last && arr[last] >= key) {
                    last--;
                }

                arr[first] = arr[last];

                while (first < last && arr[first] <= key) {
                    first++;
                }

                arr[last] = arr[first];
            }
            arr[first] = key;
            this.quicksort(arr, left, first - 1);
            this.quicksort(arr, first + 1, right);
        }
    },
    // 深拷贝对象或者数组
    deepCopy(o) {
        if (o instanceof Array) {
            var n = [];
            for (var i = 0; i < o.length; ++i) {
                n[i] = this.deepCopy(o[i]);
            }
            return n;
        } else if (o instanceof Object) {
            var k = {};
            for (var j in o) {
                k[j] = this.deepCopy(o[j]);
            }
            return n;
        } else {
            return o;
        }
    },
    /**
     * 发送验证码后的倒计时，防治重复点击
     * @param {*} tartget 目标HTML
     * @param {*} _this  this
     * @param {*} clickBool 布尔值的名字
     * @param {*} innerText 切换回原来的文字
     * @param {*} timeNum 默认的时间
     */
    countdown(tartget, _this, clickBool, innerText, timeNum = 60) {
        let timers = setInterval(() => {
            timeNum--;
            tartget.innerHTML = timeNum + 's';
            if (timeNum <= 0) {
                tartget.innerHTML = innerText;
                clearInterval(timers);
                _this[clickBool] = false;
            }
        }, 1000);
    },
    /**
   * 设置Cookie函数
   * name:Cookie的名称
   * value:Cookie的值
   * expires:设置失效时间
   */
    setCookie(name, value) {
        var Days = 1;
        var expires = new Date();
        expires.setTime(expires.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString();
    },
    /**
     * 获取Cookie函数
     * name:Cookie的名称
     */
    getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    /**
     * 删除Cookie
     * @param name
     * 当前时间为失效时间
     */
    delCookie(name) {
        var exp = new Date();  // 当前时间  
        exp.setTime(exp.getTime() - 1);
        var cval = Func.getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();

    }
}
export {
    Func
};