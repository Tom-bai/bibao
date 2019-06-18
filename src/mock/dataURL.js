
/*
 * @Author: zxhuan 
 * @Date: 2018-05-20 15:22:17 
 * @blog: http://www.zxhuan.com 
 * @Last Modified time: 2018-05-20 15:22:17 
 */

let APIURL = process.env.APIURL5;
let SOCKETHOST = process.env.SOCKETHOST
export const dataURL = {
    home: {
        getHomeInfo: `${APIURL}advertising/list.json`, // 查询
    },
    login: {
        captcha: `${APIURL}sign/captcha.png`,//登录验证码
        checkLogin: `${APIURL}sign/check-login.json`,//检测当前会话是否登录
        login: `${APIURL}sign/member/login.json`,//登录
        logout: `${APIURL}sign/member/logout.json`,//退出登陆
        regCaptcha: `${APIURL}register/captcha.png`,//注册验证码
        member: `${APIURL}register/member.json`,//注册
        checkMember: `${APIURL}member/check-exist.json`,//验证账号是否存在
        regSendCode: `${APIURL}register/verification-code.json`,//发送验证码
        checkVerCode: `${APIURL}register/invitation-code/check-exist.json`,//验证邀请码是否存在
        findPwd: `${APIURL}member/retrieve-password.json`,//找回密码
        fgCaptcha: `${APIURL}retrieve-password/captcha.png`,//图形验证码（找回密码）
        fgSendCode: `${APIURL}retrieve-password/verification-code.json`,//发送验证码（找回密码）
        loginConflict: `${SOCKETHOST}webSocket/overall`, // 用 WS更新币区里面的币种信息
    },
    coins: {
        useList: `${APIURL}coin/use/list.json` // 获取货币列表
    },
    bb: {
        getBlocks: `${APIURL}bb/data/tradeBlock.json`,//BB交易区列表
        getCoinsByBlock: `${APIURL}bb/data/tradeBlockInfo.json`,//BB交易区列表-明细
        tradeStatistics: `${APIURL}bb/data/tradeStatistics.json`,//BB交易区成交量统计
        addCoinTransactionPairUser: `${APIURL}bb/data/addCoinTransactionPairUser.json`,//用户手动添加收藏-如果已收藏则取消收藏
        getCoinsByWS: `${SOCKETHOST}webSocket/BBTradeHome`,//用 WS更新币区里面的币种信息
        approximateValue: `${APIURL}bb/data/approximate-value.json`, //货币与CNY的兑换
        getCoinUserCount: `${APIURL}currency/coinUserCount/getCoinUserCount.json`,//获取货币有效用户数以及用户排行
        deductData: `${APIURL}deduct/data/deductData.json` //获取抵扣参数
    },
    c2c: {
        orderAdd: `${APIURL}c2c/order/add.json`, //  购买/出售操作
        entrustAdd: `${APIURL}c2c/entrust/add.json`, // 添加广告信息
        entrustInit: `${APIURL}c2c/entrust/init.json`, // 广告页面初始化
        entrustInfo: `${APIURL}c2c/entrust/info.json`, // 获取广告详细信息
        entrustList: `${APIURL}c2c/entrust/list.json`, // 广告列表获取广告分页数据
        entrustPayInfo: `${APIURL}c2c/entrust/pay/info.json`, // 广告用户付款信息
        orderPayList: `${APIURL}c2c/order/pay/list.json`,// 支付列表
        entrustUserList: `${APIURL}c2c/entrust/user/list.json`,// 获取用户广告列表
        orderInfo: `${APIURL}c2c/order/info.json`, // C2C订单详情
        entrustUserEdit: `${APIURL}c2c/entrust/user/edit.json`, //撤销广告、删除广告
        entrustStateList: `${APIURL}c2c/entrust/state/list.json`, // 用户广告列表交易方式以及交易状态
        entrustDetailInfo: `${APIURL}c2c/entrust/detail/info.json`,// C2C委托详情
    },
    c2b: {
        transactionAdd: `${APIURL}ctb/transaction/add.json`, // 出售，购买，交易须知接口
        transactionGetList: `${APIURL}ctb/transaction/getList.json`, // 订单详情接口
        transactionList: `${APIURL}ctb/transaction/list.json`, // 平台交易记录接口 
        transactionUndo: `${APIURL}ctb/transaction/undo.json`, // 撤销
        transactionStateList: `${APIURL}ctb/transaction/state/list.json` // CTB状态列表
    },
    order: {
        list: `${APIURL}c2c/order/list.json`, // C2C订单列表 --------------------
        info: `${APIURL}c2c/order/info.json`, // C2C订单详情
        update: `${APIURL}c2c/order/update.json`, // 确认收款
        stateList: `${APIURL}c2c/order/state/list.json`,// 订单状态
        infoUpdata: `${APIURL}c2c/order/info/update.json`, // 撤销或买家确认付款
        orderDelete: `${APIURL}c2c/order/delete.json`, // 删除订单
        disputeList: `${APIURL}c2c/dispute/list.json`, // 纠纷列表
        disputeStateList: `${APIURL}c2c/dispute/state/list.json`, // 纠纷状态
        disputeAdd: `${APIURL}c2c/dispute/add.json`, // 添加纠纷记录
        disputeDelete: `${APIURL}c2c/dispute/delete.json`,// 删除纠纷记录
        bbCenterUserEntrusts: `${APIURL}bb/data/bbCenterUserEntrusts.json`,// 委托记录
        bbCenterUserEntrustDetail: `${APIURL}bb/data/bbCenterUserEntrustDetail.json`, // 用户委托详情
        bbCenterUserOrders: `${APIURL}bb/data/bbCenterUserOrders.json`,// 用户委托关联的成交记录
        bbCenterCancelEntrust: `${APIURL}bb/data/bbCenterCancelEntrust.json`, // 撤销委托
        transactionInfo: `${APIURL}ctb/transaction/info.json`,// c2b订单详情 
    },
    msg: {
        footerList: `${APIURL}information/type/list.json`,// 脚部链接
        getDefMsg: `${APIURL}information/list.json`,// 首页头部公告
        getInfoList: `${APIURL}information/list-type.json`,// 公告/新闻/系统文章  列表
        getArtical: `${APIURL}information/detail.json`,//文章内容
        footInfoMation: `${APIURL}information/foot-information.json`,//系统电话、系统邮箱、版权信息、系统名称
    },
    user: {
        fenrunRecord: `${APIURL}account/member/i-fenrun-record.json`,//我的分润
        invitation: `${APIURL}account/member/i-invitation.json`,//获取邀请码
        invitationFriends: `${APIURL}account/member/i-invitationFriends.json`,//我的好友
        sendCode: `${APIURL}identifyingCode/sendCode.json`,//短信验证码发送
        getBalance: `${APIURL}account/memberbalance/getBalance.json`,//显示用户所有资产数据
        getBalanceByCoinno: `${APIURL}account/memberbalance/getBalanceByCoinno.json`,//显示用户指定资产数据
        getTransferrecord: `${APIURL}currency/transferrecord/getTransferrecord.json`,//显示用户转账数据
        setWechatAlipay: `${APIURL}account/member/setWechatAlipay.json`,//设置用户微信/支付宝
        editWechatAlipay: `${APIURL}account/member/editWechatAlipay.json`,//设置用户微信/支付宝
        addBankcard: `${APIURL}account/memberbankcard/addBankcard.json`,//新增用户银行卡数据
        defaultBankcard: `${APIURL}account/memberbankcard/defaultBankcard.json`,//设置用户默认银行卡数据
        getBankcard: `${APIURL}account/memberbankcard/getBankcard.json`,//显示用户所有银行卡数据
        removeBankcard: `${APIURL}account/memberbankcard/removeBankcard.json`,//删除用户银行卡数据
        addMemberAuth: `${APIURL}account/memberAuth/addMemberAuth.json`,//新增用户实名认证信息
        getMemberAuth: `${APIURL}account/memberAuth/getMemberAuth.json`,//获取用户实名认证状态及数据
        editPwd: `${APIURL}account/member/editPwd.json`, // 修改用户登陆密码
        setTradePwd: `${APIURL}account/member/setTradePwd.json`, // 设置(修改)用户交易密码
        setPhoneEamil: `${APIURL}account/member/setPhoneEamil.json`, // 设置用户手机/邮箱号码
        editPhoneEamil: `${APIURL}account/member/editPhoneEamil.json`,//修改用户手机/邮箱号码
        AccountVerification: `${APIURL}account/member/AccountVerification.json`,//选择手机/邮箱验证（查询手机/邮箱）
        getMemberAuthAddress: `${APIURL}account/memberAuth/getMemberAuthAddress.json`,//获取用户实名认证筛选地址
        // getTransferrecord: `${APIURL}currency/transferrecord/getTransferrecord.json`,//显示用户转账数据
        recharge: `${APIURL}currency/transferrecord/recharge.json`,//用户充值(获取钱包地址)
        withdraw: `${APIURL}currency/transferrecord/withdraw.json`,//用户提现
        getMemberState: `${APIURL}account/member/getMemberState.json`,//个人中心模块状态
        getGoogleAuth: `${APIURL}account/member/getGoogleAuth.json`,//获取Google认证秘钥和二维码
        setGoogleAuth: `${APIURL}account/member/setGoogleAuth.json`,//验证Google认证秘钥(绑定/重置谷歌认证)
        editPhoneEamilJudge: `${APIURL}account/member/editPhoneEamilJudge.json`,//修改用户手机/邮箱号码（验证码验证）
        editPwdJudge: `${APIURL}account/member/editPwdJudge.json`,//修改用户登陆密码（验证码验证）
        editWechatAlipayJudge: `${APIURL}account/member/editWechatAlipayJudge.json`,//修改用户微信/支付宝（验证码/原账号验证）
        setNickname: `${APIURL}account/member/setNickname.json`,// 设置昵称
        setPhoto: `${APIURL}account/member/setPhoto.json`,// 设置用户头像
    },
    activity: {
        partActivity: `${APIURL}record/user-part-activity.json`,//参加活动
        coinHalfwayOut: `${APIURL}record/coin-halfway-out.json`,//用户中途强行去除参加活动币种
        activityList: `${APIURL}record/activity-record-list.json`,//持币生息活动列表
        userEarnings: `${APIURL}record/user-earnings.json`// 用户当前币种当天的收益
    },
    mine: {
        mineList: `${APIURL}bb/mine/list.json`// 获取挖矿记录
    },
    authenticate: {
        authenticateAdd: `${APIURL}authenticate/add-key.json`,//申请成为开发平台账户
        authenticateCheckOpen: `${APIURL}authenticate/check-open.json`,//是否是开发平台用户
        authenticateGetOpen: `${APIURL}authenticate/get-open.json`,//查看开放平台用户ID和KEY
        authenticateTheKey: `${APIURL}authenticate/the-key.json`,//开放key显示
    }
};