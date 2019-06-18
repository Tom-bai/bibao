<template>
    <div class="public-header clearfix" :class='bindClass'>
        <div class="header-top" v-if='!$route.meta.hidenavtop&&listData[0]'>
            <el-button type="success" size="mini">{{'ANNOUNCEMENTS'|t}}</el-button>
            <span class="msg-text ml-10">{{listData[0][$l+'Title']}}</span>
            <router-link to="/news" tag="a" class="more-btn">{{'MORE'|t}}</router-link>
        </div>
        <div class="header-nav clearfix" ref="headerNav" :class="$route.meta.fullPage?'fullPages':''">
            <div :class="$route.meta.fullPage?'fullPage':'nav-warp'" class="clearfix">
                <div class="nav-logo">
                    <img src="~@/assets/img/header-logo.png" alt="" v-if="fixedNavBool">
                    <img src="~@/assets/img/sub-logo.png" alt="" v-else>
                </div>
                <nav class="nav">
                    <ul class="nav-list">
                        <li class="nav-item" v-for="(item,key) of navList" :key="key" ref='navItem' @mouseover="hoverFn(item)" @mouseout="init($route.path)"
                            :class="bindActiveClass(item)" v-if="loginedShowOnly(item)">
                            <a href="javascript:;" @click="goRouterPath(item)">{{item.name|t}}</a>
                            <div class="sub-nav" v-if="item.subNav">
                                <ul class="sub-nav-ul">
                                    <li class="sub-nav-item" v-for="(items,keys) of item.subNav" :key="keys" v-if="loginedShowOnly(items)">
                                        <span @click="goRouterPath(items)">{{items.name|t}}</span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <span class="nav-active" ref='navActive' v-if="fixedNavBool"></span>
                </nav>
                <a @mouseenter="isLangShow = true" @mouseleave="isLangShow = false" href="javascript:;" class="lang fr">
                    <div class="lang_def" @click="showLang">
                        <img :src="'./../../../static/'+ langDef +'_icon.png'">
                    </div>
                    <transition name="slide-fade">
                        <div class="lang_list" v-show="isLangShow" style="position: absolute;z-index: 9999;">
                            <div class="lang_item" v-for="lang in langIcons" :key="lang.id" @click="changeLang(lang)">
                                <img :src="'./../../../static/'+ lang +'_icon.png'">
                            </div>
                        </div>
                    </transition>
                </a>
                <div class="sign" :class='fixedNavBool?"sign-fix":"sign-unfix"'>
                    <router-link to="/user/safe" v-if="loginStatus()" class="sign-up">{{username}}</router-link>
                    <router-link to="/signin" v-if="!loginStatus()" class="sign-up">{{'LOGIN_TITLE'|t}}</router-link>
                    <router-link to="/signup" v-if="!loginStatus()" class="sign-in">{{'SIGNUP'|t}}</router-link>
                    <a v-if="loginStatus()" href="javascript:;" class="sign-in" @click="signOut">{{'SIGNOUT'|t}}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { Msg, Login } from '@/services';
    import { Func } from '@/providers';
    import { mapGetters, mapState } from 'vuex';
    export default {
        name: 'public-header',
        data() {
            return {
                navList: [
                    {
                        name: 'HOME',
                        router: 'main'
                    },
                    {
                        name: 'TRADING_BUTTON',
                        router: 'trade_info'
                    },
                    {
                        name: 'STATISTICS',
                        router: 'statistics'
                    },
                    {
                        name: 'MINING',
                        router: 'mining'
                    },
                    // {
                    //     name: 'EXPERT_ADVISOR',
                    //     router: 'intelligent'
                    // },
                    // {
                    //     name: 'LEVERAGED_DEALS',
                    //     router: 'leveraged'
                    // },
                    {
                        name: 'C2C_TRADING',
                        router: 'c2c_list',
                        subNav: [
                            {
                                name: 'MARKET_TRANSACTION',
                                router: 'c2c_list'
                            },
                            {
                                name: 'MY_ADVERT',
                                router: 'c2c_order'
                            },
                            {
                                name: 'ADVERTISING',
                                router: 'c2c_advert'
                            },
                            {
                                name: 'RECORD_OF_STATEMENTS',
                                router: 'c2c_record'
                            }
                            // {
                            //     name: 'ORDER_DISPUTE',
                            //     router: 'c2c_dispute'
                            // }
                        ]
                    },
                    {
                        name: 'C2B_TRADE',
                        router: 'c2b_list'
                    },
                    {
                        name: 'NEWS_INFORMATION',
                        router: 'news_list'
                    },
                    {
                        name: 'ORDER_MANAGEMENT',
                        router: 'order_list',
                        subNav: [
                            {
                                name: 'C2C_ORDER',
                                router: 'order_list'
                            },
                            {
                                name: 'ENTRUSTMENT_MANAGEMENT',
                                router: 'order_entrust'
                            },
                            {
                                name: 'C2B_ORDER',
                                router: 'order_c2b'
                            }
                        ]
                    },
                ],
                listData: [{ zhTitle: '', enTitle: '' }],
                langIcons: ['zh', 'en'],
                isLangShow: false,
                username: Func.getCookie('username')
            };
        },
        mounted() {
            this.init();
            if (!this.$route.meta.hidenavtop) {
                this.getMsg();
            }
        },
        updated() {
            this.username = Func.getCookie('username');
            // console.log(this.username,Func.getCookie('username'))
        },
        computed: {
            ...mapGetters([
                'routePath'
            ]),

            // username() {
            //     // return Func.getCookie('username');
            //     return Func.getCookie('username');
            // },
            langDef() {
                if (Func.getCookie('lang') == null) {
                    return this.langIcons[0]
                } else {
                    return Func.getCookie('lang')
                }
            },
            // '$route.meta'(value) {
            //     console.log(value);
            // },
            fixedNavBool() {
                return this.$route.meta.fixedNav ? true : false;
            },
            bindClass() {
                if (this.$route.meta.fixedNav == true) {
                    return 'fix-nav';
                } else if (this.$route.meta.fixedNav == false) {
                    return 'un-fix';
                } else {
                    return 'un-fix';
                }
            }
        },
        watch: {
            routePath(newval, oldval) {
                this.init();
            }
        },
        methods: {
            signOut() {
                Login.logout().then(res => {
                    this.SUCCESS(this.$t('SIGNOUT_SUCC'));
                    Func.delCookie('registerTime');
                    Func.delCookie('username');
                    this.$router.push('/signin');
                }).catch(err => {
                    console.log(err);
                })
            },
            // 路由跳转
            goRouterPath(item) {
                if (this.$route.name == item.router) { return false }
                this.$router.push({ name: item.router });
            },
            showLang() {
                this.isLangShow = !this.isLangShow;
            },
            changeLang(lang) {
                if (Func.getCookie('lang') == lang) { return }
                Func.setCookie('lang', lang);
                window.location.reload();
            },
            // 未登录要隐藏的链接
            loginedShowOnly(item) {
                let arr = ['order_list', 'c2c_order', 'c2c_advert', 'c2c_record'];
                if (arr.includes(item.router)) return this.loginStatus()
                else return true
            },
            // 获取公告
            getMsg() {
                Msg.getDefMsg({
                    type: 'INFORMATION_NOTICE',//INFORMATION_NOTICE公告    INFORMATION_NEWS新闻    INFORMATION_HLEP系统文章;
                    sort: 1
                }).then((res) => {
                    this.listData = res.listData;
                })
            },

            bindActiveClass(item) {
                if (!this.$route.name) { return false; };
                let bingClass = '';
                if (item.subNav) {
                    bingClass += 'subnav-toggle';
                }
                if (this.$route.name.split('_')[0] == item.router) {
                    bingClass += 'active';
                }
                // return this.$route.name.split('_')[0] == item.router ? 'active' : '';
                return bingClass;
            },

            hoverFn(item) {
                let navActive = this.$refs.navActive;
                if (!navActive) { return false; }
                navActive.style = `width:${item.width - 20}px;transform:translateX(${item.left + 10}px)`;
            },
            init() {
                let navItem = this.$refs.navItem;
                let navActive = this.$refs.navActive;
                if (this.$refs.navActive) {
                    navItem.map((items, keys) => {
                        this.navList.map((item, key) => {
                            if (key == keys) {
                                item.left = items.offsetLeft;
                                item.width = items.clientWidth;
                                if (this.routePath == item.router) {
                                    navActive.style = `width:${item.width - 20}px;transform:translateX(${item.left + 10}px)`;
                                }
                            }
                        });
                    });
                } else {
                    this.$refs.headerNav.className = `${this.$route.meta.fullPage ? 'header-nav fullPages' : 'header-nav'}`;
                }
                window.onscroll = (event) => {
                    if (this.$refs.navActive) {
                        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                        // if (scrollTop > 100) {
                        //     this.$refs.headerNav.className = 'header-nav fixed';
                        // } else {
                        //     this.$refs.headerNav.className = 'header-nav';
                        // }
                    }
                };
            }
        }
    };
</script>
<style scoped lang="scss">
    @import '../assets/sass/header.scss';
    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateY(10px);
        opacity: 0;
    }
</style>