'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 开发环境
  SOCKETHOST: "'www.bjy.inesv.com/'", // websocketHost
  SOCKETHOST: "'192.168.50.127:8201/'", // websocketHost
  APIURL2: '"http://47.92.33.228:8099/"', // API 接口
  APIURL3: '"http://192.168.50.197:8201/"', // 仁政
  APIURL4: '"http://192.168.50.141:8201/"', // 振聪
  APIURL_F1: '"http://192.168.50.181:8201/"',//远征
  APIURL5: '"http://192.168.50.164:8201/"', // 国凯
  APIURL6_ZX: '"http://192.168.50.104:8201/"', // 华凯
  APIURL7_ZX: '"http://192.168.50.141:8089/"', // 美凯
  APIURL_F2: '"http://192.168.50.153:8201/"',//张谦
  APIURL8_ZX: '"http://192.168.50.192:8201/"', //周鼎
  ONLINE: '"http://www.bjy.inesv.com/"',
  IMGPATH: '"https://file.bjy.inesv.com/"',  // 图片地址
  OPEN_APTH: '"https://www.showdoc.cc/web/#/107002559903111"', //开放平台
  CAPRH_BG_COLOR: '"DE211D"'
})
