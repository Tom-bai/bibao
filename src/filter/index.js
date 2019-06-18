import Vue from 'vue';
import '@/providers/date.js';
import i18n from '@/i18n';
// 数据保存几位小数
const Fixed = Vue.filter('Fixed', (value, fixedNum) => {
  if (!value && value != 0) {
    return value;
  }
  // let pattern = /^(-?\d+)(\.\d+)?$/;
  // if (!pattern.test(value)) {
  //   throw Error(`${value} is not a number`);
  // }
  value = new Number(value);
  let _fixedNum = fixedNum ? fixedNum : 4;
  return Number(value).toFixed(_fixedNum);
});
// 订单状态
const orderType = Vue.filter('orderType', (value, item) => {
  let map = new Map();
  // "type": 0,  //用户身份：0买方，1卖方
  // 状态1：已完成，2：撤销，3：等待买方付款，4：等待卖方确认，5：自动取消，6：纠纷强制打款，7：纠纷强制回滚,8、纠纷中,9、全部
  let itemPay = item['type'] == '1' ? 'WAITDEAL_1' : 'WAITDEAL_2';
  let itemcheck = item['type'] == '1' ? 'WAITDEAL_3' : 'WAITDEAL_4';
  map.set(1, 'COMPLETE').set(2, 'CANCELED').set(3, itemPay).set(4, itemcheck).set(5, 'UNPAID_ROLLBACK_ORDER').set(6, 'COMPULSORY_DISSENSION').set(7, 'FORCED_ROLLBACK_DISPUTES').set(8, 'DISPUTES');
  return i18n.t(map.get(item.state));
});
// 支付方式
const bankType = Vue.filter('bankType', (value, item) => {
  let map = new Map();
  map.set(1, 'BANKS').set(2, 'ALIPAYS').set(3, 'WECHATS');
  return map.get(item.receivablesType);
});
// 时间格式化
const Format = Vue.filter('Format', (value, type) => {
  if (!value) return value;
  return new Date(value).format(type ? type : 'yyyy-MM-dd hh:mm:ss');
});
// 中英文转换
const transform = Vue.filter('t', (value) => {
  if (!value) return value;
  return i18n.t(value);
});
const phoneStr = Vue.filter('phoneStr', (value, type) => {
  if (!value) { return value }
  return value.substr(0, 3) + "****" + value.substr(7);
});
const bankStr = Vue.filter('bankStr', (value, type) => {
  return value.substr(0, 4) + " **** **** **** " + value.substr(16);
});
const wasNull = Vue.filter('wasNull', (value) => {
  if (value === 'null') {
    value = 0;
    console.log('进入2')
  } else {
    console.log('进入3')
    value = parseFloat(value);
  }
  return value ? value : 0;
});
export const Filter = {
  Fixed,
  orderType,
  Format,
  transform,
  bankType,
  phoneStr,
  bankStr,
  wasNull,
};