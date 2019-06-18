/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-09 18:00:37 
 * @Last Modified by: zxhuan
 * @Last Modified time: 2018-05-10 11:25:07
 */

/**
 * 用户信息校验的一些函数库
 */
class Auth {
  // 新增sessionStorage ITEM项
  static setItem(itemName, value) {
    window.sessionStorage.setItem(itemName, value);
  }
  // 获取sessionStorage ITEM项
  static getItem(itemName) {
    return window.sessionStorage.getItem(itemName);
  }
  static removeItem(itemName) {
    window.sessionStorage.removeItem(itemName);
  }
  static checkItem(itemName) {
    return window.sessionStorage.getItem(itemName) ? true : false;
  }
  // 设置cookie
  static setCookie(cname, cvalue, exdays) {
    // 设置cookie
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
  }
  // 获取cookie
  static getCookie(cname) {
    // 获取cookie
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return '';
  }
  // 判断是否是手机号
  static isMobile() {
    let account = Auth.getItem('username');
    let pattern = /^(86)?1[3,4,5,7,8]\d{9}$/;
    return pattern.test(account);
  }
  // 判断是否是手机号
  static isEmail() {
    let account = Auth.getItem('username');
    let pattern = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
    return new RegExp(pattern).test(account);
  }
};
export {
  Auth
};