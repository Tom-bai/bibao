// import return Promise
// 参考文档 https://router.vuejs.org/zh-cn/advanced/lazy-loading.html
// 路由懒加载模式，路由异步加载
module.exports = file => () => import('@/page/' + file + '.vue');