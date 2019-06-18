<template>
    <button type="button" class='YZMBtn' @click="send" :disabled="!clickAble">{{text | alltext}}</button>
</template>
<script>
import { User } from "@/services";
    export default {
        name:'YZMBtn',
        props:{
            // 二选一  参数组1
            refForm:Object,
            prop1:String,
            phone:String,
            email:String,
            // // 二选一  参数组2
            // id:String,
            // start:Boolean,

            // 其他
            // initCount:Number//监听变化去进行重置
        },
        data(){
            return {
                text: this.$t('SEND_CODE'),
                timer:null,
                clickAble:true
            }
        },
        mounted(){
            clearInterval(this.timer);
        },
        destroyed(){
            clearInterval(this.timer);
        },
        methods:{
            send(){
                this.text = 60;
                this.timer = setInterval(()=>{
                    this.text--;
                    if(this.text<=0){
                        this.text = this.$t('RESEND');
                        this.clickAble = true;
                        clearInterval(this.timer);
                    }
                },1000)
                this.clickAble = false;
                this.getYZM();
            },
            // 获取验证码
            getYZM(){
                let account,sendType;
                // if(this.phone || this.email){
                    // 单独校验
                    // 1
                    // let canGoOn = false;
                    // console.log(this.refForm);
                    // this.refForm.validateField( this.prop1 ,(errMsg) => {
                    //     if(errMsg == '') canGoOn = true
                    // })
                    // if(!canGoOn) return
                    // 2
                    // this.$emit('beforeSend')
                    console.log(this.phone,this.email);
                    if(this.phone) {
                        console.log(this.phone);
                        if(!(/^1[3|5|7|8]\d{9}$/.test(this.phone))){
                            this.WARN(this.$t('ERROR_PHONE'))
                            this.init();
                            return 
                        } 
                        account = this.phone;
                        sendType = 1;//发送手机
                    }
                    if(this.email) {
                        console.log(this.email);
                        if(!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email))){
                            this.WARN(this.$t('ENTER_RIGHT_EMAIL'))
                            this.init();
                            return 
                        } 
                        account = this.email;
                        sendType = 2;//发送邮箱
                    }
                // }else {
                //     return 
                // }
                let businessType;
                if(this.$route.name=='user_safe_pass') businessType = 1;//修改登陆密码，
                if(this.$route.name=='user_safe_trade') businessType = 2;//绑定/修改交易密码
                if(this.$route.name=='user_safe_mobile') businessType = 3;//绑定/修改手机账号
                if(this.$route.name=='user_safe_email') businessType = 4;//绑定修改邮箱账号
                if(this.$route.name=='user_safe_wechat' || this.$route.name=='user_safe_alipay' ) businessType = 5;//修改微信/支付宝账号）
                
                User.sendCode({
                    account: account,//接收账号(手机账号/邮箱账号/用户ID)
                    sendType: sendType,//消息类型（1：手机短信，2：邮箱短信，3：根据用户ID发送手机短信，4：根据用户ID发送邮箱短信）
                    businessType: businessType,//业务类型（1：修改登陆密码，2：绑定/修改交易密码，3：绑定/修改手机账号，4：绑定修改邮箱账号，5：修改微信/支付宝账号）
                }).then(res=>{
                    this.SUCCESS(this.$t('SEND_SUCC'));
                    this.$emit('getKey',res.oneData);
                }).catch(err=>{
                    this.init();
                     
                })
            },
            init(){
                this.clickAble = true;
                clearInterval(this.timer);
                this.text = this.$t(this.$t('SEND_CODE'));
            }
        },
        filters:{
            alltext(text){
                if(typeof(text) == 'number'){
                    return text+' S'
                }else{
                    return text
                }
            }
        }
    }
</script>
<style lang='scss' scoped>
@import "./../assets/sass/_default";
    button {
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: 0;
        outline: 0;
        cursor: pointer;
        color: $defaultColor;
        text-align: center;
    }
</style>