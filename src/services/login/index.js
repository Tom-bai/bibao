import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * 登录验证码
 * @param {*} params 
 */
const captcha = dataURL.login.captcha;

/**
 * 检测当前会话是否登录
 * @param {*} params 
 */
const checkLogin = (params, bool) => Ajax.Get(dataURL.login.checkLogin, params, bool);

/**
 * 登录
 * @param {*} params 
 * username:,//用户名
 * password:,//登录密码（AES加密）
 * captcha:,//验证码
 */
const login = (params, bool) => Ajax.Post(dataURL.login.login, params, bool);

/**
 * 退出登录
 * @param {*} params 
 * username:,//用户名
 */
const logout = (params, bool) => Ajax.Get(dataURL.login.logout, params, bool);

/**
 * 验证账号是否存在
 * @param {*} params 
 * @return {true已存在，false不存在}
 *  type:,//注册方式/'PHONE'/'EMAIL'
 */
const checkMember = (params, bool) => Ajax.Post(dataURL.login.checkMember, params, bool);

/**
 * 注册验证码图片
 */
const regCaptcha = dataURL.login.regCaptcha;

/**
 * 发送验证码
 * @param {*} params 
 *  captcha:,//图像验证码
    type:,//注册方式
    phone:,//注册方式为手机时必填
    email:,//注册方式为邮箱时必填
 */
const regSendCode = (params, bool) => Ajax.Post(dataURL.login.regSendCode, params, bool);

/**
 * 注册
 * @param {*} params 
 *  type:,//注册方式
    phone:,//手机号码
    email:,//邮箱
    password:,//登录密码（AES加密）
    captcha:,//图形验证码
    verificationCode:,//验证码
    verificationCodeKey:,//验证码KEY
    invitationCode:,//邀请码
 */
const member = (params, bool) => Ajax.Post(dataURL.login.member, params, bool);

/**
 * 验证邀请码是否存在
 * @param {*} params 
 * @return {true已存在，false不存在}
 *  invitationCode:,//邀请码
 */
const checkVerCode = (params, bool) => Ajax.Post(dataURL.login.checkVerCode, params, bool);

/**
 * 找回密码
 * @param {*} params 
 *  type:,//注册方式
    phone:,//手机号码
    email:,//邮箱
    password:,//登录密码（AES加密）
    captcha:,//图形验证码
    verificationCode:,//验证码
    verificationCodeKey:,//验证码KEY
    invitationCode:,//邀请码
 */
const findPwd = (params, bool) => Ajax.Post(dataURL.login.findPwd, params, bool);

/**
 * 图形验证码（找回密码）
 * @param {*} params 
 */
const fgCaptcha = dataURL.login.fgCaptcha;

/**
 * 发送验证码（找回密码）
 * @param {*} params 
 *  captcha:,//图形验证码
    type:,//找回密码方式
    phone:,//找回密码方式为手机时必填
    mail:,//找回密码方式为邮箱时必填
 */
const fgSendCode = (params, bool) => Ajax.Post(dataURL.login.fgSendCode, params, bool);

// 登录冲突
const loginConflict = dataURL.login.loginConflict;

export default {
    captcha,
    checkLogin,
    login,
    logout,
    regCaptcha,
    member,
    regSendCode,
    checkVerCode,
    checkMember,
    findPwd,
    fgCaptcha,
    fgSendCode,
    loginConflict
};

