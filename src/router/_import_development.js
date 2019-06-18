// 非路由懒加载模式，路由同步加载
module.exports = file => require('@/page/' + file + '.vue').default;