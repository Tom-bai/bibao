import App from '@/main';
import { Func, Auth } from '@/providers';
// import { User, UserInfo } from '@/services';
class Form {
  static getApp() {
    console.log(App);
  }
  /**
   * 表单重置
   * @param {*} _self   this vue组件实例
   * @param {*} formName 要重置的表单名称
   */
  static resetFrom(_self, formName) {
    Object.assign(_self.$data[formName], _self.$options.data()[formName]);
  }
  /**
   * 表单验证
   * @param {*} _self this vue组件实例
   * @param {*} formName 要校验的表单名称
   */
  static validataForm(_self, formName) {
    for (let item in _self[formName]) {
      if (_self.$refs[item] && !_self.$refs[item].valid) {
        _self.$notify({
          message: _self.$refs[item].msg
        });
        return false;
      }
    }
    return true;
  }
  /**
   * 表单验证单个
   * @param {*} _self this vue组件实例
   * @param {*} item 要校验的输入框名称
   */
  static validItem(_self, item) {
    if (_self.$refs[item] && !_self.$refs[item].valid) {
      _self.$notify({
        message: _self.$refs[item].msg
      });
      return false;
    }
    return true;
  }
  /**
   * 判断后端返回过来的结构是否是301
   * @param {*} res 后端返回的结果
   * @param {*} clearBool 是否清除sessionStorage，进入登陆界面
   */
  static checkResToken(res, clearBool) {
    if (res.code == '301') {
      App.$notify({
        message: res.desc,
        onOk: () => {
          if (clearBool) {
            window.sessionStorage.clear();
            App.$router.push('/login');
          }
        }
      });
      return false;
    }
    return true;
  }
  /**
   * 发送手机验证码
   * @param {*} val 手机号
   * @param {*} target 当前dom
   * @param {*} clickBool 布尔值
   * @param {*} innerText 计时器完成后显示的文字
   */
//   static async SendMobile(val, target, clickBool, innerText, _this) {
//     try {
//       let res = await UserInfo.SendMobile({
//         mobile: val
//       });
//       App.$notify({
//         type: 'success',
//         message: res.desc
//       });
//       Func.countdown(target, _this, clickBool, innerText);
//     } catch (error) {
//       _this[clickBool] = false;
//       console.log(error);
//     }
//   }
//   /**
//    *  注册发送手机验证
//    * @param {*} val 手机号
//    * @param {*} target 当前dom
//    * @param {*} clickBool 布尔值
//    * @param {*} innerText 计时器完成后显示的文字
//    */
//   static async SendMobileValidata(val, target, clickBool, innerText, _this) {
//     try {
//       let res = await UserInfo.SendMobileValidata({
//         mobile: val
//       });
//       App.$notify({
//         message: res.desc,
//         type: 'success',
//         onOk: () => {
//           if (res.code == '300') {
//             return false;
//           }
//           Func.countdown(target, _this, clickBool, innerText);
//         }
//       });
//     } catch (error) {
//       _this[clickBool] = false;
//       console.log(error);
//     }
//   }
//   // 
//   /**
//    * 发送邮箱邮箱验证码
//    * @param {*} val 手机号
//    * @param {*} target 当前dom
//    * @param {*} clickBool 布尔值
//    * @param {*} innerText 计时器完成后显示的文字
//    */
//   static async SentMail(val, target, clickBool, innerText, _this) {
//     try {
//       let res = await UserInfo.SentMail({
//         mail: val
//       });
//       App.$notify({
//         message: res.desc,
//         type: 'success',
//         onOk: () => {
//           Func.countdown(target, _this, clickBool, innerText);
//         }
//       });
//     } catch (error) {
//       _this[clickBool] = false;
//       console.log(error);
//     }
//   }
//   /**
//    *  注册发送邮件验证
//    * @param {*} val 手机号
//    * @param {*} target 当前dom
//    * @param {*} clickBool 布尔值
//    * @param {*} innerText 计时器完成后显示的文字
//    */
//   static async SentMailValidata(val, target, clickBool, innerText, _this) {
//     try {
//       let res = await UserInfo.SentMailValidata({
//         mail: val
//       });
//       App.$notify({
//         message: res.desc,
//         type: 'success',
//         onOk: () => {
//           if (res.code == '300') {
//             return false;
//           }
//           Func.countdown(target, _this, clickBool, innerText);
//         }
//       });
//     } catch (error) {
//       _this[clickBool] = false;
//       console.log(error);
//     }
//   }
  /**
   * @static
   * @param {*} msg 提示的消息
   * @param {*} callFn 回调函数
   * @param {*} title 标题
   * @param {string} [type='success'] 提示的类型
   * @memberof Form
   */
  static Totas(msg, callFn, title, type = 'success') {
    App.$notify({
      title: title ? title : '温馨提示',
      message: msg,
      type: type,
      onOk: () => {
        if (callFn) {
          callFn();
        }
      }
    });
  }
  /**
   * 校验用户资金密码状态
   * @param {*} userStatus  用户信息爱
   * @param {*} bool 
   */
  static checkDealPwdState(userStatus, bool) {
    if (userStatus.tradePasswordState == '0') {
      Form.Totas(App.$t('SET_TRADE_PASS'));
      if (bool) return false;
    };
    return true;
  }
}
export {
  Form
};