import axios from 'axios';
import ElementUI from 'element-ui';

import router from '@/router';

const ip = 'http://192.168.50.126:8080';


// axios.defaults.withCredentials  = false;
const Axios = axios.create({
  baseURL: ip,
  timeout: 5000,
  responseType: 'json',
  withCredentials: true,
  header: {
    'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
  }
})
// console.log(Axios)
// const Axios = axios.

// 设置axios请求参数序列化
Axios.interceptors.request.use(
  config => {
    if(sessionStorage.getItem('csrfToken')) {
      config.headers = {'csrfToken':sessionStorage.getItem('csrfToken')};
    }
    // config.withCredentials = true;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)

Axios.interceptors.response.use(
  response => {
    if (response.data.respcode == 100) {
      return response;
    } else if (response.data.respcode == 500) {
      ElementUI.Message({
        message: response.data.respmsg,
        type: 'warning'
      })
      router.push('login');
      return false;
    } else {
      ElementUI.Message({
        message: response.data.respmsg,
        type: 'warning'
      });
      return false;
    }
  }
)

// get请求
function get(url) {
  return body => Axios.get(url,{ params: body });
}

// post请求
function post(url) {
  return body => Axios.post(url, body);
}