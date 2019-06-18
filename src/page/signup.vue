<template>
    <div class="signin">
        <canvasComponent></canvasComponent>
        <div class="sign-cont">
            <div class="sign-logo">
                <router-link to="/">
                    <img src="~@/assets/img/header-logo.png" alt="">
                </router-link>
            </div>
            <div class="form-wrap">
                <div class="form-tab">
                    <a href="javascript:;" class="tab-item" v-for="(item,key) of tabList" :key='key' :class="item.id==defaultIndex?'active':''"
                        @click="switchForm(item)">{{item.name|t}}</a>
                </div>

                <el-form :model="Form" :rules="rules" ref="Form" class="demo-ruleForm">
                    <!-- 手机注册 -->
                    <el-form-item prop="phone" v-if="defaultIndex==1">
                        <el-input v-model="Form.phone" @blur="checkUser('Form')" :placeholder="$t('MOBILE_LABEL')">
                            <i slot="prefix" class="el-input__icon icon-user"></i>
                        </el-input>
                    </el-form-item>
                    <!-- 邮箱注册 -->
                    <el-form-item prop="email" v-if="defaultIndex==2">
                        <el-input v-model="Form.email" @blur="checkUser('Form')" :placeholder="$t('EMAIL_LBAEL')">
                            <i slot="prefix" class="el-input__icon icon-mail"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="imgYZM">
                        <el-input v-model="Form.imgYZM" :placeholder="'PIC_CODE'|t" style="width: 70%" class="float-l">
                            <i slot="prefix" class="el-input__icon icon-verif"></i>
                        </el-input>
                        <div class="YZMpic" @click="getYZM">
                            <img :src="YZMsrc" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item prop="YZM">
                        <el-input v-model="Form.YZM" :placeholder="$t('CODE_LABEL')" class="send_code">
                            <i slot="prefix" class="el-input__icon icon-verif"></i>
                            <button type="button" slot="append" @click="send" :disabled="!clickAble" class="sendBtn">{{text | alltext}}</button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="invCode">
                        <el-input v-model="Form.invCode" :placeholder="$t('INVITAT')">
                            <i slot="prefix" class="el-input__icon el-icon-more" style="color:#DE211D;"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pwd">
                        <el-input v-model="Form.pwd" type="password" :placeholder="$t('PASSWORD')">
                            <i slot="prefix" class="el-input__icon icon-pass"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pwd2">
                        <el-input v-model="Form.pwd2" type="password" @keyup.enter.native="submitForm('Form')" :placeholder="$t('CHECK_PASS')">
                            <i slot="prefix" class="el-input__icon icon-pass"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="hasRead" class="sign-checkbox">
                        <el-checkbox-group v-model="Form.hasRead">
                            <el-checkbox :label="$t('AGREEMENT')" name="hasRead"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('Form')" :loading="isAble" :disabled="isAble" class="flex-btn">{{'SIGNUP'|t}}</el-button>
                    </el-form-item>
                    <p class="box-flex form-text center">
                        <span @click="$router.push('/signin')">{{'ALREADY_HAVE_ACCOUNT'|t}}>></span>
                    </p>
                </el-form>

            </div>
        </div>
    </div>
</template>
<script>
    import { Login } from "@/services";
    import { Rules } from "@/providers/rules";
    import canvasComponent from '@/components/canvas';
    export default {
        data() {
            let _check = (rule, value, callback) => {
                if (value !== this.Form.pwd) callback(new Error(this.$t('NOT_SAME')));
                else callback();
            };
            let _checkExist = (rule, value, callback) => {
                let params;
                if (this.type == "PHONE") {
                    params = {
                        type: this.type,
                        phone: this.Form.phone
                    };
                }
                if (this.type == "EMAIL") {
                    params = {
                        type: this.type,
                        email: this.Form.email
                    };
                }
                Login.checkMember(params).then(res => {
                    if (res.oneData) callback(new Error(this.$t('BEEN_REG')));
                    else callback();
                });
            };
            let _invCode = (rule, value, callback) => {
                if (value != '')
                    Login.checkVerCode({ invitationCode: value }).then(res => {
                        callback();
                    }).catch(err => {
                        callback(new Error(this.$t('CODE_NOT_EXIST')));
                    })
                else callback();
            };
            let _read = (rule, value, callback) => {
                if (value) callback();
                else callback(new Error(this.$t('NO_PICKUP')));
            };
            let _noSpaceBar = (rule, value, callback) => {
                if (value.match(' ')) callback(new Error(this.$t('NO_SPACE')));
                else callback();
            };
            return {
                isAble: false,
                defaultIndex: 1,
                tabList: [
                    {
                        id: 1,
                        name: "PHONE_SING_UP",
                        formName: "Form"
                    },
                    {
                        id: 2,
                        name: "EMIAL_SING_UP",
                        formName: "Form"
                    }
                ],

                YZMsrc: "",
                rules: {
                    phone: [...Rules.phone, { validator: _checkExist, trigger: "blur" }],
                    email: [...Rules.mail, { validator: _checkExist, trigger: "blur" }],
                    imgYZM: Rules.loginYZM,
                    YZM: Rules.YZM,
                    invCode: [{ validator: _invCode, trigger: "blur" }],
                    pwd: [...Rules.pwd, { validator: _noSpaceBar, trigger: "blur" }],
                    pwd2: [...Rules.pwd,
                    { validator: _check, trigger: "blur" },
                    { validator: _noSpaceBar, trigger: "blur" }
                    ],
                    hasRead: [
                        { required: true, validator: _read, trigger: "blur" }
                        // { type: 'boolean', required: true, message: '未勾选', trigger: 'change' }
                    ],
                },
                Form: {
                    phone: "",
                    email: "",
                    imgYZM: "",
                    YZM: "",
                    invCode: "",
                    pwd: "",
                    pwd2: "",
                    hasRead: false
                },
                key: "",
                text: this.$t(this.$t('SEND_CODE')),
                captchaBgColor: process.env.CAPRH_BG_COLOR,
                timer: null,
                clickAble: true
            };
        },
        computed: {
            type() {
                if (this.defaultIndex == 1) return "PHONE";
                if (this.defaultIndex == 2) return "EMAIL";
                return "";
            }
        },
        components: {
            canvasComponent
        },
        mounted() {
            if (this.$route.query.code) {
                this.Form.invCode = this.$route.query.code;
            }
            this.getYZM();
        },
        methods: {
            // 登陆验证码图片
            getYZM() {
                this.YZMsrc = Login.regCaptcha + "?" + Math.random() + '&bgColor=' + this.captchaBgColor;
            },
            async validateFn(item) {
                let bool;
                return new Promise(resolve => {
                    this.$refs["Form"].validateField(item, errMsg => {
                        if (errMsg) bool = true;
                        else bool = false
                        resolve(bool);
                    });
                })
            },

            // 发送验证码
            async send() {
                // 校验
                let type, prop;
                if (this.defaultIndex == 1) prop = "phone";
                if (this.defaultIndex == 2) prop = "email";
                let canGo1 = await this.validateFn("imgYZM");
                let canGo2 = await this.validateFn(prop);
                // console.log(canGo1, canGo2);
                if (canGo1 || canGo2) return this.init();

                // 倒数
                this.text = 60;
                this.clickAble = false;
                this.timer = setInterval(() => {
                    this.text--;
                    if (this.text <= 0) {
                        this.text = this.$t("RESEND");
                        this.clickAble = true;
                        clearInterval(this.timer);
                    }
                }, 1000);

                // 发送验证码
                Login.regSendCode({
                    captcha: this.Form.imgYZM, //图像验证码
                    type: this.type,
                    phone: this.type == "PHONE" ? this.Form.phone : '',
                    email: this.type == "EMAIL" ? this.Form.email : ''
                })
                    .then(res => {
                        this.SUCCESS(this.$t('SEND_SUCC'));
                        this.key = res.oneData;
                    })
                    .catch(err => {
                        this.init();
                        this.getYZM();
                    });
            },
            // 重置倒数
            init() {
                this.clickAble = true;
                clearInterval(this.timer);
                this.text = this.$t(this.$t('SEND_CODE'));
            },

            // 切换表单
            switchForm(item) {
                if (this.defaultIndex == item.id) return false;
                this.defaultIndex = item.id;
                this.resetForm(item.formName);
            },

            // 检测用户是否已被注册
            checkUser(formName) {
                // 单独校验
                let canGoOn = false;
                let prop;
                if (this.defaultIndex == 1) prop = "phone";
                if (this.defaultIndex == 2) prop = "email";
                this.$refs[formName].validateField(prop, errMsg => {
                    if (errMsg == "") canGoOn = true;
                });
                if (!canGoOn) return;
            },

            // 注册
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    this.isAble = true;
                    Login.member({
                        type: this.type, //注册方式
                        phone: this.type == "PHONE" ? this.Form.phone : "", //手机号码
                        email: this.type == "EMAIL" ? this.Form.email : "", //邮箱
                        password: this.AES(this.Form.pwd), //登录密码（AES加密）
                        captcha: this.Form.imgYZM, //图形验证码
                        verificationCode: this.Form.YZM, //验证码
                        verificationCodeKey: this.key, //验证码KEY
                        invitationCode: this.Form.invCode //邀请码
                    }).then(res => {
                        this.isAble = false;
                        this.SUCCESS(this.$t('REG_SUCC'));
                        this.$router.push({ path: "/signin", query: { user: this.type == "PHONE" ? this.Form.phone : this.Form.email } });
                    })
                        .catch(err => {
                            this.isAble = false;
                            // this.resetForm('Form');
                            this.Form.pwd = '';
                            this.Form.pwd2 = '';
                            this.Form.YZM = '';
                            this.init();
                            this.getYZM();
                        });
                });
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        filters: {
            alltext(text) {
                if (typeof text == "number") {
                    return text + " S";
                } else {
                    return text;
                }
            }
        }
    };
</script>
<style scoped lang="scss">
    @import "../assets/sass/signin.scss";
</style>