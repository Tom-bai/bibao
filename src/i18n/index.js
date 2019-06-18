import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui'
import enlocale from 'element-ui/lib/locale/lang/en'
import zhlocale from 'element-ui/lib/locale'
import { Func } from '../providers/Func';
if (!Func.getCookie('lang')) {
    Func.setCookie('lang', 'zh');
}

Vue.config.lang = Func.getCookie('lang');
// 改变ElementUI的语言
if (Vue.config.lang == 'en') {
    Vue.use(ElementUI, { locale: enlocale });
} else {
    Vue.use(ElementUI);
}
Vue.use(VueI18n);
var en = require('./en.json');
var zh = require('./zh.json');
let messages = {
    en: {
        ...Object.assign(en),
        ...enlocale
    },
    zh: {
        ...Object.assign(zh),
        ...zhlocale
    }
};
let i18n = new VueI18n({
    locale: Vue.config.lang,
    fallbackLocale: 'en',
    messages
});
Vue.use({
    i18n: function (path, options) {
        let value = i18n.t(path, options);
        if (value !== null && value !== undefined) return value;
        return '';
    }
});
// if (module.hot) {
//   module.hot.accept(['./en.json', './zh.json'], () => {
//     i18n.setLocaleMessage('en', require('./en.json'))
//     i18n.setLocaleMessage('zh', require('./zh.json'))
//   })
// }

// if (module.hot) {
//   module.hot.accept(['./en.json', './zh.json'], () => {
//     Vue.locale('en', require('./en.json').default);
//     Vue.locale('ja', require('./zh.json').default);
//   });
// }

export default i18n;