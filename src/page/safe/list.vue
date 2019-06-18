<template>
    <div class="safe-list-wrap">
        <ul class="safe-list" :loading="!showRouter">
            <li class="safe-item" v-for='(item,key) of dataList' :key="key" :class="item.border?'no-border-b':''">
                <div class="safe-info box-flex">
                    <div class="safe-icon">
                        <img :src="item.pic">
                    </div>
                    <div class="flex ml-10">
                        <h3>{{item.title}}</h3>
                        <p>{{desc(item)}}</p>
                    </div>
                </div>
                <div class="safe-text">
                    <a href="javascript:;" class="c-blue" v-if="userStatus[item.name+'State']==='1' && item.canRevise" @click="bindOrChange(item)">{{item.passText}}</a>
                    <span class="c-blue" v-else-if="userStatus[item.name+'State']==='1' && !item.canRevise">{{item.passText}}</span>
                    <a href="javascript:;" class="c-red" v-else @click="bindOrChange(item)">{{stateText(item)||item.failText}}</a>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { SafeList } from '@/providers';
    import userMask from '@/components/mask';
    import emailComponents from '@/page/safe/email';
    import mobileComponents from '@/page/safe/mobile';
    import { User } from "@/services";
    export default {
        components: {
            userMask,
            emailComponents,
            mobileComponents
        },
        data() {
            return {
                showRouter: false,
                dataList: [
                    { pic: '/static/safe-ali.png',      name: 'email',            router: 'email',      title: this.$t('USER_EMAIL'),       failText:this.$t('NO_BIND')+'>>',       passText:this.$t('GO_CHANGE')+'>>',     canRevise:true,    desc: this.$t('DESC_EMAIL')},
                    { pic: '/static/safe-mobile.png',   name: 'phone',            router: 'mobile',     title: this.$t('PHONE_BIND'),       failText:this.$t('NO_BIND')+'>>',       passText:this.$t('GO_FIX')+'>>',        canRevise:true,    desc: this.$t('DESC_PHONE')},
                    { pic: '/static/safe-realname.png', name: 'credentialInfo',   router: 'identity',   title: this.$t('REAL_NAME'),        failText:this.$t('NOTPASSVER')+'>>',    passText:this.$t('PASSVER'),            canRevise:false,   desc: this.$t('DESC_ID')},
                    { pic: '/static/safe-verif.png',    name: 'google',           router: 'google',     title: this.$t('G_VER'),            failText:this.$t('NOTPASSVER')+'>>',    passText:this.$t('GO_CLOSE')+'>>',      canRevise:true,    desc: this.$t('DESC_G')},
                    //{pic: '/static/safe-verif.png',   name: 'safe',             router: 'question',   title: '安全问题'this.$t('USER_EMAIL'),       failText:this.$t('NO_BIND')+'>>',       passText:this.$t('GO_FIX')+'>>',    canRevise:true,    desc: '安全问题等账户重要操作'},
                    { pic: '/static/safe-pass.png',     name: 'password',         router: 'pass',       title: this.$t('USER_PASS'),        failText:this.$t('GO_FIX')+'>>',        passText:this.$t('GO_FIX')+'>>',        canRevise:true,    desc: this.$t('DESC_PWD')},
                    { pic: '/static/safe-pass.png',     name: 'tradePassword',    router: 'trade',      title: this.$t('USER_TRADE_PASS'),       failText:this.$t('GO_SET')+'>>',        passText:this.$t('GO_FIX')+'>>',        canRevise:true,    desc: this.$t('DESC_TRADE')},
                    { pic: '/static/safe-wechat.png',   name: 'wechat',           router: 'wechat',     title: this.$t('WECHAT'),           failText:this.$t('NO_BIND')+'>>',       passText:this.$t('GO_CHANGE')+'>>',     canRevise:true,    desc: this.$t('DESC_ACC')},
                    { pic: '/static/safe-ali.png',      name: 'alipay',           router: 'alipay',     title: this.$t('USER_ALIPAY'),      failText:this.$t('NO_BIND')+'>>',       passText:this.$t('GO_CHANGE')+'>>',     canRevise:true,    desc: this.$t('DESC_ACC')},
                    { pic: '/static/safe-bank.png',     name: 'bank',             router: 'bank',       title: this.$t('BANK_ACC'),         failText:this.$t('NO_BIND')+'>>',       passText:this.$t('GO_ADD')+'>>',        canRevise:true,    desc: this.$t('DESC_ACC')}
                ],
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ])
        },
        mounted() {
            this.getState(); 
        },
        methods: {
            // 获取状态
            getState() {
                User.getMemberState().then(res => {
                    this.$store.state.userStatus = res.oneData;
                    this.showRouter = true;
                }).catch(err => {

                })
            },

            // 进入路由前的处理
            bindOrChange(item) {
                if(!this.showRouter) return //未返回认证状态时不让进入
                this.$router.push('/user/safe/'+item.router);
            },

            // 描述
            desc(item){
                if((item.name == 'wechat' ||item.name == 'alipay' ||item.name == 'bank') && this.userStatus[item.name+'State']==1 ){
                    return this.$t('DEF_ACC') + '：' + this.userStatus[item.name]
                }else{
                    return item.desc
                }
            },

            // 除了认证成功和认证失败之外的其他状态描述
            stateText(item){
                // 实名认证 的其他状态
                if(item.router == 'identity' && this.userStatus[item.name+'State']==='2') return this.$t('认证中');
                if(item.router == 'identity' && this.userStatus[item.name+'State']==='3') return this.$t('认证失败');
                return false
            }
        },

    };
</script>
<style lang="scss" scoped>
    @import '~@/assets/sass/safe';
</style>