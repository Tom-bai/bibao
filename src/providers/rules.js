/*
 * @Author: zxhuan 
 * @Date: 2018-05-03 14:29:38 
 * @Blog:www.zxhuan.com 
 * @Email:1123046380@qq.com 
 * @Last Modified time: 2018-05-03 14:29:38 
 */
/**
 * 表单验证
 */
import i18n from '@/i18n';

let Num = /^([+]?\d+(\.\d+)?)$/;
let Int0 = /^\+?[0-9]*$/;
let GE0 = /^[0-9]\d*(\.\d+)?$/;//    >=0
let G0 = /^(?!0(\d|\.0+$|$))\d+(\.\d+)?$/    // >0
let GE0F2 = /^[0-9]\d*(\.\d{1,2})?$/;//    >=0的2位小数
let GE0F4 = /^[0-9]\d*(\.\d{1,4})?$/;//    >=0的4位小数
let G0F2 = /^(?!0(\d|\.0+$|$))\d+(\.\d{1,2})?$/;//    >0的2位小数
let G0F4 = /^(?!0(\d|\.0+$|$))\d+(\.\d{1,4})?$/;//    >0的4位小数
let email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;    // 邮箱

export const Rules = {
    date1: [
        { required: true }
    ],
    imgHand: [
        { required: true, message: i18n.t('IMGHANDSRC') }
    ],
    imgFace: [
        { required: true, message: i18n.t('IMGFACESRC') }
    ],
    imgBack: [
        { required: true, message: i18n.t('IMGBACKSRC') }
    ],
    YZM: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') },
        { len: 6, message: i18n.t('ERRORCODELENG_6') },
        { type: 'number', message: i18n.t('ERRORLENG'), transform: value => +value }
    ],
    loginYZM: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') },
        { len: 4, message: i18n.t('ERRORCODELENG_4') },
        { type: 'number', message: i18n.t('ERRORLENG'), transform: value => +value },
    ],
    noEmpty: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') }
    ],
    pwd: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') },
        { min: 6, max: 18, message: i18n.t('ERRORPASSLENG'), trigger: 'blur' }
    ],
    price: [
        { required: true, message: i18n.t('ENTER_TRADE_PRICE'), trigger: 'blur' },
        { pattern: Num, message: i18n.t('REQUIRE_NUMBER') }
    ],
    dealNumber: [
        { required: true, message: i18n.t('ENTER_TRADE_NUM'), trigger: 'blur' },
        { pattern: Num, message: i18n.t('REQUIRE_NUMBER') }
    ],
    dealNum: [
        { required: true, message: i18n.t('ENTER_TRADE_NUM'), trigger: 'blur' },
        { pattern: Num, message: i18n.t('REQUIRE_NUMBER') }
    ],
    tradePassword: [
        { required: true, message: i18n.t('USER_TRADE_PASS_PLACE'), trigger: 'blur' },
        { min: 6, max: 18, message: i18n.t('ERRORPASSLENG'), trigger: 'blur' }
    ],
    bankNum: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') },
        { pattern: /^([1-9]{1})(\d{14}|\d{18})$/, message: i18n.t('ERRORBANKNUM') },
    ],
    coinId: [{ required: true, message: i18n.t('COINTY'), trigger: 'blur' }],
    type: [{ required: true }],
    discussPrice: [{ required: true }],
    tradePassowrd: [
        { required: true, message: i18n.t('USER_TRADE_PASS_PLACE'), trigger: 'blur' },
        { min: 6, max: 18, message: i18n.t('ERRORPASSLENG'), trigger: 'blur' }
    ],
    remark: [
        { required: true, message: i18n.t('ENTER_AD_MARK'), trigger: 'blur' },
        { max: 120, message: i18n.t('MAX_REMAKS'), trigger: 'blur' }
    ],
    remarks: [
        { required: true, message: i18n.t('ENTER_MARK'), trigger: 'blur' },
        { max: 120, message: i18n.t('MAX_REMAKS'), trigger: 'blur' }
    ],
    payType: [{ required: true, message: i18n.t('CHOOSE_PAY_WAY') }],
    amount: [{ required: true, message: i18n.t('ENTER_TRADE_NUM') }, { pattern: Num, message: i18n.t('REQUIRE_NUMBER') }],
    identity: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') },
        { type: "string", pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: i18n.t("ERRORID") }
    ],
    phone: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') },
        { type: "string", pattern: /^1[3|5|7|8]\d{9}$/, message: i18n.t('ERRORPHONE') }
    ],
    mail: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') },
        { pattern: email, message: i18n.t('ERROR_EMAIL') },
    ],
    name: [
        { trigger: 'blur', required: true, message: i18n.t('NOEMPTY') },
        { type: "string", pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: i18n.t('ZHEN_ONLY') }
    ],
    num: [{ pattern: Num, message: i18n.t('REQUIRE_NUMBER') }]
};