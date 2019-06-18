// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from '@/App';
import VueClipboard from 'vue-clipboard2';
import ElementUI from 'element-ui';
import VueTippy from 'vue-tippy'
import 'element-ui/lib/theme-chalk/index.css';
import i18n from '@/i18n';
import { vueRouter as router } from './router';
import { store } from '@/store';
import directive from '@/directive';
import { Filter } from '@/filter';
import '@/assets/sass/reset.css';
// import '@/assets/sass/user.scss';
import vuePrototype from '@/providers/vuePrototype';
// import '@/providers/date';
import "@/providers/jwmeyy.js";
// Vue.use(Zxhuan);
// vscode  正则匹配
// \{\{\$t\((.+?)\)\}\}

Vue.use(VueClipboard);
Vue.use(VueTippy);
Vue.use(vuePrototype, { ElementUI, i18n, store, router })

Vue.config.productionTip = false;
/* eslint-disable no-new */
export default new Vue({
    el: '#app',
    router,
    i18n,
    store,
    Filter,
    directive,
    components: {
        App
    },
    template: '<App/>'
});