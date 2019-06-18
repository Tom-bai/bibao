import { dataURL } from '@/mock/dataURL';
import { Ajax } from '@/ajax';
/**
 * 我的分润
 * @param {*} params 
 * userId: ,
 * pageNum 
 * pageSize 
 */
const fenrunRecord = (params, bool) => Ajax.Get(dataURL.user.fenrunRecord, params, bool);
/**
 * 获取邀请码
 * @param {*} params 
 * userId: ,
 */
const invitation = (params, bool) => Ajax.Get(dataURL.user.invitation, params, bool);
/**
 * 我的好友
 * @param {*} params 
 * userId: ,
 * pageNum 
 * pageSize 
 */
const invitationFriends = (params, bool) => Ajax.Get(dataURL.user.invitationFriends, params, bool);

/**
 * 显示用户所有资产数据
 * @param {*} params 
 * userId: ,
 */
const getBalance = (params, bool) => Ajax.Get(dataURL.user.getBalance, params, bool);

/**
 * 显示用户指定资产数据
 * @param {*} params 
 * userId: ,
 * coinId:,
 */
const getBalanceByCoinno = (params, bool) => Ajax.Get(dataURL.user.getBalanceByCoinno, params, bool);

/**
 * 显示用户转账数据
 * @param {*} params 
 * userId: ,
 * coinId:,
 * type:,
 * pageSize:,
 * limitSize:,
 */
const getTransferrecord = (params, bool) => Ajax.Get(dataURL.user.getTransferrecord, params, bool);

/**
 * 设置用户微信/支付宝
 * @param {*} params 
 * userId:,//用户ID
 * account:,//微信/支付宝账号
 * photo:,//微信/支付宝收款码
 * tradePwd:,//交易密码
 * type:,//类型(1：微信，2：支付宝)
 */

const setWechatAlipay = (params, bool) => Ajax.upLoadFile(dataURL.user.setWechatAlipay, params, bool);

/**
 * 修改用户微信/支付宝
 * @param {*} params 
 * @param {*} bool 
 * userId:,//用户ID
 * account:,//新微信/支付宝账号
 * photo:,//新微信/支付宝收款码
 * type:,//类型(1：微信，2：支付宝)
 */
const editWechatAlipay = (params, bool) => Ajax.upLoadFile(dataURL.user.editWechatAlipay, params, bool);

/**
 * 新增用户银行卡数据
 * @param {*} params 
 * @param {*} bool 
 * userId:,//用户ID
    username:,//用户姓名
    bank:,//银行名称
    branchBank:,//银行支行
    address:,//银行地址
    card:,//银行账号
 */
const addBankcard = (params, bool) => Ajax.Post(dataURL.user.addBankcard, params, bool);

/* 设置用户默认银行卡数据
 * @param {*} params 
    userId:,//用户ID
    cardId:,//银行卡ID
 */
const defaultBankcard = (params, bool) => Ajax.Post(dataURL.user.defaultBankcard, params, bool);

/* 显示用户所有银行卡数据
 * @param {*} params 
 * userId,//用户ID
 */
const getBankcard = (params, bool) => Ajax.Get(dataURL.user.getBankcard, params, bool);

/* 删除用户银行卡数据
 * @param {*} params 
 * cardId: ,//银行卡ID
 */
const removeBankcard = (params, bool) => Ajax.Post(dataURL.user.removeBankcard, params, bool);

/**
 * 新增用户实名认证信息
 * @param {*} params 
 * @param {*} bool
 *  photo1:,//
    photo2:,//
    photo3:,//
    userId:,//用户ID
    type:,//证件类型(1:身份证，2：护照，3：驾驶证)
    address:,//证件地址
    dealName:,//证件人名称
    idNumber:,//证件号码
    beginDate:,//开始时间
    endDate:,//结束时间 
 */
const addMemberAuth = (params, bool) => Ajax.upLoadFile(dataURL.user.addMemberAuth, params, bool);

/**
 * 获取用户实名认证状态及数据
 * @param {*userId} params 
 * @param {*} bool 
 * userId:,//用户ID
 */
const getMemberAuth = (params, bool) => Ajax.Get(dataURL.user.getMemberAuth, params, bool);


/**
 * 修改用户登陆密码
 * @param {*userId} params 
 * @param {*} bool 
 * userId:,//用户ID
 * pwd:,//登陆密码
 */
const editPwd = (params, bool) => Ajax.Post(dataURL.user.editPwd, params, bool);


/**
 * 设置(修改)用户交易密码
 * @param {*userId} params 
 * @param {*} bool 
    userId:,//用户ID
    tradePwd:,//交易密码
    code:,//验证码
    proveType:,//验证类型（1：手机验证，2：邮箱验证）
 */
const setTradePwd = (params, bool) => Ajax.Post(dataURL.user.setTradePwd, params, bool);

/**
 * 设置用户手机/邮箱号码
 * @param {*userId} params 
 * @param {*} bool 
    userId:,//用户ID
    account:,//手机/邮箱账号
    code:,//验证码
    type:,//类型（1：设置手机，2：设置邮箱
 */
const setPhoneEamil = (params, bool) => Ajax.Post(dataURL.user.setPhoneEamil, params, bool);

/**
 * 修改用户手机/邮箱号码
 * @param {*userId} params 
 * @param {*} bool 
    userId:,//用户ID
    account:,//新手机/邮箱账号
    code:,//新账号验证码
    type:,//类型（1：修改手机号，2：修改邮箱号）
 */
const editPhoneEamil = (params, bool) => Ajax.Post(dataURL.user.editPhoneEamil, params, bool);

/**
 * 选择手机/邮箱验证（判断手机/邮箱是否绑定）
 * @param {*userId} params 
 * @param {*} bool 
    userId:,//用户ID
    proveType:,//验证类型（0:全部 1：手机验证，2：邮箱验证）
 */
const AccountVerification = (params, bool) => Ajax.Get(dataURL.user.AccountVerification, params, bool);

/**
 * 获取用户实名认证筛选地址
 * @param {*userId} params 
 * @param {*} bool 
 */
const getMemberAuthAddress = (params, bool) => Ajax.Get(dataURL.user.getMemberAuthAddress, params, bool);

/**
 * 获取用户实名认证筛选地址
 * @param {*userId} params 
 * @param {*} bool 
 * userId:,//用户ID
    coinId:,//货币ID
 */
const recharge = (params, bool) => Ajax.Get(dataURL.user.recharge, params, bool);

/**
 * 获取用户实名认证筛选地址
 * @param {*userId} params 
 * @param {*} bool 
 * userId:,//用户ID
    coinId:,//货币ID
    inAddress:,//转入地址
    tradeNum:,//转账数量
    remark:,//备注
    tradePwd:,//交易密码
 */
const withdraw = (params, bool) => Ajax.Post(dataURL.user.withdraw, params, bool);

/**
 * 个人中心模块状态
 * @param {*userId} params 
 * @param {*} bool 
 * userId:,//用户ID
 */
const getMemberState = (params, bool) => Ajax.Get(dataURL.user.getMemberState, params, bool);

/**
 * 获取Google认证秘钥和二维码
 * @param {*userId} params 
 * @param {*} bool 
 * userId:,//用户ID
 */
const getGoogleAuth = (params, bool) => Ajax.Get(dataURL.user.getGoogleAuth, params, bool);

/**
 * 验证Google认证秘钥(绑定/重置谷歌认证)
 * @param {*userId} params 
 * @param {*} bool 
 * userId:,//用户ID
    secretCode:,//谷歌验证码
    type:,//类型（1：绑定，2：重置）
 */
const setGoogleAuth = (params, bool) => Ajax.Post(dataURL.user.setGoogleAuth, params, bool);


/**
 * 验证Google认证秘钥(绑定/重置谷歌认证)
 * @param {*userId} params 
 * @param {*} bool 
 *  account,://接收账号(手机账号/邮箱账号/用户ID)
    sendType,://消息类型（1：手机短信，2：邮箱短信，3：根据用户ID发送手机短信，4：根据用户ID发送邮箱短信）
    businessType,://业务类型（1：修改登陆密码，2：绑定/修改交易密码，3：绑定/修改手机账号，4：绑定修改邮箱账号，5：修改微信/支付宝账号）
 */
const sendCode = (params, bool) => Ajax.Post(dataURL.user.sendCode, params, bool);

/**
 * 修改用户手机/邮箱号码（验证码验证）
 * @param {*userId} params 
 * @param {*} bool 
*   userId:,//用户ID
    key:,//验证码Key
    code:,//验证码Value
    proveType:,//验证类型（1：手机验证，2：邮箱验证）
 */
const editPhoneEamilJudge = (params, bool) => Ajax.Post(dataURL.user.editPhoneEamilJudge, params, bool);

/**
 * 修改用户登陆密码（验证码验证）
 * @param {*userId} params 
 * @param {*} bool 
 *  userId:,//用户ID
    key:,//验证码Key
    code:,//验证码Value
    proveType:,//验证类型（1：手机验证，2：邮箱验证）
 */
const editPwdJudge = (params, bool) => Ajax.Post(dataURL.user.editPwdJudge, params, bool);

/**
 * 修改用户微信/支付宝（验证码/原账号验证）
 * @param {*userId} params 
 * @param {*} bool 
 *  userId:,//用户ID
    oldAccount:,//旧微信/支付宝账号
    key:,//验证码Key
    code:,//验证码Value
    type:,//类型(1：微信，2：支付宝)
    proveType:,//验证类型（1：手机验证，2：邮箱验证）
 */
const editWechatAlipayJudge = (params, bool) => Ajax.Post(dataURL.user.editWechatAlipayJudge, params, bool);
/**
 * 持币生息活动列表
 * method Type Get
 * @param {*} params 
 * page 当前页数
 * limit 记录条数
 * coinId  币种ID
 * holdState  活动状态 
 * @param {*} bool 
 */
const ActivityList = (params, bool) => Ajax.Get(dataURL.activity.activityList, params, bool);
/**
 *  参加活动
 * method Type POST
 * @param {*} params 
 * activityId 活动ID
 * coinNumber  参加活动的币种数量
 * @param {*} bool 
 */
const PartActivity = (params, bool) => Ajax.Post(dataURL.activity.partActivity, params, bool);
/**
 * 用户中途强行去除参加活动币种
 * method Type Get
 * @param {*} params 
 * recordId   活动记录ID
 * holdState    活动状态
 * @param {*} bool 
 */
const CoinHalfwayOut = (params, bool) => Ajax.Get(dataURL.activity.coinHalfwayOut, params, bool);
/**
 * 用户当前币种当天的收益
 * @param {*} params 
 * @param {*} params 
 * coinId  
 * @param {*} bool 
 */
const UserEarnings = (params, bool) => Ajax.Get(dataURL.activity.userEarnings, params, bool);
/**
 * 申请成为开发平台账户
 * method Type Post
 * @param {*} params 
 * @param {*} bool 
 */
const AuthenticateAdd = (params, bool) => Ajax.Post(dataURL.authenticate.authenticateAdd, params, bool);
/**
 * 是否是开发平台用户
 * method Type Get
 * @param {*} params
 * @param {*} bool 
 */
const AuthenticateCheckOpen = (params, bool) => Ajax.Get(dataURL.authenticate.authenticateCheckOpen, params, bool);
/**
 * 查看开放平台用户ID和KEY
 * method Type Get
 * @param {*} params
 * @param {*} bool 
 */
const AuthenticateGetOpen = (params, bool) => Ajax.Get(dataURL.authenticate.authenticateGetOpen, params, bool);
/**
 * 开放key显示
 * method Type Get
 * @param {*} params
 * @param {*} bool 
 */
const AuthenticateTheKey = (params, bool) => Ajax.Get(dataURL.authenticate.authenticateTheKey, params, bool);
/**
 * 设置昵称
 * method Type Post
 * @param {*} params 
 * nickname
 * @param {*} bool 
 */ 
const SetNickname = (params, bool) => Ajax.Post(dataURL.user.setNickname, params, bool);
/**
 * 设置用户头像
 * method Type Post
 * @param {*} params 
 * photo
 * @param {*} bool 
 */ 
const SetPhoto = (params, bool) => Ajax.upLoadFile(dataURL.user.setPhoto, params, bool);
export default {
    ActivityList,
    PartActivity,
    CoinHalfwayOut,
    UserEarnings,

    fenrunRecord,
    invitation,
    invitationFriends,

    getBalance,
    getBalanceByCoinno,
    getTransferrecord,
    setWechatAlipay,
    editWechatAlipay,

    addBankcard,
    defaultBankcard,
    getBankcard,
    removeBankcard,

    addMemberAuth,
    getMemberAuth,
    editPwd,
    setTradePwd,

    setPhoneEamil,
    editPhoneEamil,
    AccountVerification,
    getMemberAuthAddress,

    recharge,
    withdraw,

    getMemberState,
    getGoogleAuth,
    setGoogleAuth,

    sendCode,
    editPhoneEamilJudge,
    editPwdJudge,
    editWechatAlipayJudge,

    AuthenticateAdd,
    AuthenticateCheckOpen,
    AuthenticateGetOpen,
    AuthenticateTheKey,

    SetNickname,
    SetPhoto
};