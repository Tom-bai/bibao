<template>
    <div class="signin">
        <canvas-component></canvas-component>
        <div class="sign-cont">
            <div class="sign-logo">
                <router-link to="/">
                    <img src="~@/assets/img/header-logo.png" alt="">
                </router-link>
            </div>
            <div class="form-wrap">
                <el-form :model="Form" :rules="rules" ref="Form" class="demo-ruleForm">
                    <el-form-item prop="user">
                        <el-input v-model="Form.user" type="text" :placeholder="$t('PHONEEMAIL')" autocomplete="on">
                            <i slot="prefix" class="el-input__icon icon-user"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pwd">
                        <el-input v-model="Form.pwd" type="password" :placeholder="$t('LOGIN_PASS')" autocomplete="on">
                            <i slot="prefix" class="el-input__icon icon-pass"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="YZM">
                        <el-input v-model="Form.YZM" @keyup.enter.native="submitForm('Form','enter')" :placeholder="'CODE_LABEL'|t" style="width: 70%" class="float-l">
                            <i slot="prefix" class="el-input__icon icon-verif"></i>
                        </el-input>
                        <div class="YZMpic" @click="getYZM">
                            <img :src="YZMsrc" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="isAble" :disabled="isAble" @click="submitForm('Form','noEnter')" class="flex-btn">{{'LOGIN'|t}}</el-button>
                    </el-form-item>
                    <p class="box-flex space-between form-text">
                        <span @click="$router.push('/signup')">{{'SIGNUP_ACCOUNT'|t}}</span>
                        <span @click="$router.push('/forget')">{{'FORGET_PASS'|t}}</span>
                    </p>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import { Login } from "@/services"
    import { Rules } from '@/providers/rules';
    import { dataURL } from '@/mock/dataURL';
    import { Func } from '@/providers';
    import canvasComponent from '@/components/canvas';
    export default {
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                vm.from = from;
            })
        },
        data() {
            return {
                websoket: null,
                from: '',
                isAble: false,
                keyup:true,
                Form: {
                    user: '',
                    pwd: '',
                    YZM: ''
                },
                captchaBgColor: process.env.CAPRH_BG_COLOR,
                rules: {
                    user: Rules.noEmpty,
                    pwd: Rules.pwd,
                    YZM: Rules.loginYZM
                },
                YZMsrc: '',
                heartCheck: {
                    reconnectCount: 5,
                    timeout: 50000,
                    timeoutObj: null,
                    serverTimeoutObj: null,
                    reset: () => {
                        this.heartCheck.reconnectCount = 5;
                        if (this.heartCheck.timeoutObj)
                            clearTimeout(this.heartCheck.timeoutObj);
                        if (this.heartCheck.serverTimeoutObj)
                            clearTimeout(this.heartCheck.serverTimeoutObj);
                        this.heartCheck.timeoutObj = setTimeout(() => {
                            this.websoket.send("alive");
                            // 发送过去过了timeout还没接受到消息的话就断开重连
                            this.heartCheck.serverTimeoutObj = setTimeout(() => {
                                this.websoket.close();
                                this.websoketFn();//重连
                            }, this.heartCheck.timeout)
                        }, this.heartCheck.timeout)
                    },
                },
            };
        },
        components: {
            canvasComponent
        },
        mounted() {
            // 自动填入用户名
            if (this.$route.query.user) this.Form.user = this.$route.query.user;
            else if (Func.getCookie('username')) this.Form.user = Func.getCookie('username');
            this.getYZM();
           
        },
        created() {
            
        },
        updated() {
            this.username = Func.getCookie('username');
        },
        methods: {
            submitForm(formName,key) {
                if(key && this.keyup){
                    this.$refs[formName].validate((valid) => {
                        if (!valid) {
                            return false;
                        }
                        this.login();
                    });
                } else {
                    this.keyup = !this.keyup;
                }
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.login();
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            // 登陆验证码图片
            getYZM() {
                this.YZMsrc = dataURL.login.captcha + '?' + Math.random() + '&bgColor=' + this.captchaBgColor;
            },
            // 登录
            login() {
                this.isAble = true;
                Login.login({
                    username: this.Form.user,//用户名
                    password: this.AES(this.Form.pwd),//登录密码（AES加密）
                    captcha: this.Form.YZM,//验证码
                }).then(res => {
                    this.isAble = false;
                    this.SUCCESS(this.$t("SIGNIN_SUCC"));
                    Func.setCookie('registerTime', res.oneData.registerTime);
                    Func.setCookie('username', res.oneData.username);
                    Func.setCookie('nickname',res.oneData.nickname)
                    Func.setCookie('photo',res.oneData.photo)
                    // 下次路由切换时，获取/更新认证状态
                    this.$store.state.userStatusChangeSignal = 1;
                    // 从其他网站进来的 || 注册 || 忘记密码
                    // console.log(this.from,location)
                    let PathArr = ['/', '/signup', '/forget']
                    if (PathArr.includes(this.from.path)) {
                        setTimeout(() => {
                            this.$router.push("/");
                        }, 500)
                    } else {
                        setTimeout(() => {
                            this.$router.go(-1);
                        }, 1000)
                    }

                }).catch(err => {
                    this.isAble = false;
                    this.getYZM();
                    this.Form.pwd = '';
                    this.Form.YZM = '';
                })
            },
        }
    };
</script>
<style scoped lang="scss">
    @import '../assets/sass/signin.scss';
</style>