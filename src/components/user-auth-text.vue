<template>
    <div class="user-auth-text">
        <h2 class="auth-title" v-show='title'>{{title}}</h2>
        <div v-show="verifBool">
            <div class="user-auth-item box-flex">
                <div class="item-left flex">
                    <h3>{{'VERIF_MOBILE'|t}}</h3>
                    <p class="desc">{{'VERIF_MOBILE_DESC'|t}}</p>
                </div>
                <div class="item-right">
                    <a href="javascript:;" @click="verfiFn('1')">{{'VER_NOW'|t}}</a>
                </div>
            </div>
            <div class="user-auth-item box-flex">
                <div class="item-left flex">
                    <h3>{{'VERIF_EMAIL'|t}}</h3>
                    <p class="desc">{{'VERIF_EMAIL_DESC'|t}}</p>
                </div>
                <div class="item-right">
                    <a href="javascript:;" @click="verfiFn('2')">{{'VER_NOW'|t}}</a>
                </div>
            </div>
        </div>
        <div class="step-wrap" v-show="!verifBool">
            <!-- 步骤条 -->
            <el-steps :active="defalutActive">
                <el-step :title="'VER_YOU'|t"></el-step>
                <el-step :title="setpText"></el-step>
                <el-step :title="'FIX_SUCC'|t"></el-step>
            </el-steps>
            <!-- 通过手机验证身份 -->
            <div class="user-form-wrap" v-if="defalutType=='1'">
                <el-form :model="Form" :rules="rules" ref="Form" class="demo-ruleForm">
                    <el-form-item prop="oldphone">
                        <el-input v-model="Form.oldphone" :placeholder="$t('MOBILE_PLACE')" disabled>
                            <template slot="prepend">{{'OLD_PHONE'|t}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="YZM">
                        <el-input v-model="Form.YZM" class="send_code">
                            <template slot="prepend">{{'CODE_LABEL'|t}}</template>
                            <span slot="append">
                                <YZMBTN :refForm="$refs.Form" prop1="oldphone" :phone="Form.oldphone" @getKey="getKey" />
                            </span>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('Form')" :loading="isAble" :disabled="isAble" class="flex-btn next-setp">{{'NEXT_STEP'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 通过邮箱验证身份 -->
            <div class="user-form-wrap" v-if="defalutType=='2'">
                <el-form :model="Form" :rules="rules" ref="Form" class="demo-ruleForm">
                    <el-form-item prop="oldmail">
                        <el-input v-model="Form.oldmail" :placeholder="$t('OLD_EMAIL_REQUIRE')" disabled>
                            <template slot="prepend">{{'OLD_EMAIL'|t}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="YZM">
                        <el-input v-model="Form.YZM" :placeholder="$t('EMAIL_CODE_REQUIRE')" class="send_code">
                            <template slot="prepend">{{'CODE_LABEL'|t}}</template>
                            <span slot="append">
                                <YZMBTN :email="Form.oldmail" @getKey="getKey" @beforeSend="beforeSend()" />
                            </span>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('Form')" :loading="isAble" :disabled="isAble" class="flex-btn next-setp">{{'NEXT_STEP'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 第二步 绑定账号 -->
            <div v-show="defalutType=='steptwo'">
                <slot name="setptwo"></slot>
            </div>
            <!-- 第三步 绑定成功 -->
            <div v-show="defalutType=='setpthree'" class="success-step">
                <div class="success-text">
                    <i class="success-icon"></i> {{successTip}}</div>
                <div class="success-btns">
                    <el-button @click="$router.replace('/user/safe')">{{'DETERMINE'|t}}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { Rules } from '@/providers/rules';
    import { User } from '@/services';
    import YZMBTN from '@/components/YZMBtn.vue';
    export default {
        name: 'user-auth-text',
        components: { YZMBTN },
        props: {
            title: {
                type: String,
                default: 'this is title here !'
            },
            setpText: {
                type: String,
                // default: this.$t('STEP2')
            },
        },
        data() {
            return {
                isAble: false,
                canGoOn: false,
                defalutType: '1',
                verifBool: true,
                successTip: this.$t('BIND_SUCC'), // 绑定成功时显示的信息
                defalutActive: 1,
                bindedInfo: {
                    email: null,
                    phone: null
                },
                Form: {
                    oldphone: '',
                    oldmail: '',
                    YZM: ''
                },
                rules: {
                    oldphone: Rules.phone,
                    oldmail: Rules.mail,
                    YZM: Rules.loginYZM
                },
                key: ''
            };
        },
        mounted() {
            this.checkBinded();
        },
        methods: {
            getKey(key) {
                this.key = key;
            },
            handleReset(str) {
                this.successTip = str;
                this.defalutActive = 3;
                this.defalutType = 'setpthree';
            },
            verfiFn(type) {
                if (type === '1' && this.bindedInfo.phone == null) return this.WARN(this.$t('NO_BIND_PHONE'))
                if (type === '2' && this.bindedInfo.email == null) return this.WARN(this.$t('NO_BIND_EMAIL'))
                this.verifBool = false;
                this.defalutType = type;
                if (type === '1') this.Form.oldphone = this.bindedInfo.phone;
                if (type === '2') this.Form.oldmail = this.bindedInfo.email;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.isAble = true;
                    // 验证验证码
                    let judgeName, params, proveType;
                    proveType = this.defalutType;
                    //修改登陆密码，
                    if (this.$route.name == 'user_safe_pass')
                        judgeName = 'editPwdJudge';
                    params = {
                        key: this.key,//验证码Key
                        code: this.Form.YZM,//验证码Value
                        proveType: proveType,//验证类型（1：手机验证，2：邮箱验证）
                    }
                    // if(this.$route.name=='user_safe_trade') judgeName = 2;//绑定/修改交易密码
                    //绑定/修改手机账号   绑定修改邮箱账号
                    if (this.$route.name == 'user_safe_mobile' || this.$route.name == 'user_safe_email')
                        judgeName = 'editPhoneEamilJudge';
                    params = {
                        key: this.key,//验证码Key
                        code: this.Form.YZM,//验证码Value
                        proveType: proveType,//验证类型（1：手机验证，2：邮箱验证）
                        type: this.$route.name == 'user_safe_mobile' ? 1 : 2,//验证类型（1：手机验证，2：邮箱验证）
                    }
                    // //修改微信/支付宝账号）//在另外一个vue文件上（不应用这个模块）
                    // if(this.$route.name=='user_safe_wechat' || this.$route.name=='user_safe_alipay' ) 
                    //     judgeName = 'editWechatAlipayJudge';
                    //     params = {
                    //         oldAccount:,//旧微信/支付宝账号
                    //         key:,//验证码Key
                    //         code:,//验证码Value
                    //         type:,//类型(1：微信，2：支付宝)
                    //         proveType:,//验证类型（1：手机验证，2：邮箱验证）
                    //     }
                    User[judgeName](params).then(res => {
                        this.isAble = false;
                        this.defalutActive = 2;
                        this.defalutType = 'steptwo';
                        this.$emit('nextStept', false);
                    }).catch(err => {
                        this.isAble = false;
                    })
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //查询手机/邮箱 是否有绑定
            checkBinded() {
                User.AccountVerification({
                    proveType: 0,//验证类型（0:全部 1：手机验证，2：邮箱验证）
                }).then(res => {
                    this.bindedInfo = res.oneData;
                }).catch(err => {

                })
            },


        }
    };
</script>
<style lang="scss" scoped>
    .step-wrap {
        margin-top: 50px;
    }

    .user-form-wrap {
        width: 400px;
        margin: 50px auto;
    }

    .next-setp {
        width: 100%;
        /* background: rgba(235, 242, 255, 1); */
        color: rgb(224, 45, 42);
        /* border-color: rgba(235, 242, 255, 1); */
        background: #ffdada;
        border-color: #ffdada;
    }

    .next-setp:hover {
        color: white;
        background: #DE211D;
        border-color: #DE211D;
    }

    .user-auth-text {
        width: 600px;
        .auth-title {
            text-align: center;
            font-size: 22px;
            color: rgba(0, 32, 89, 1);
            line-height: 58px;
        }
        .user-auth-item {
            margin-bottom: 20px;
            width: 100%;
            border-radius: 4px;
            border: 1px solid #E4E4E4;
            padding: 15px 10px;
            .item-left {
                h3 {
                    font-size: 14px;
                    color: rgba(51, 51, 51, 1);
                    line-height: 30px;
                }
                p {
                    font-size: 14px;
                    color: rgba(153, 153, 153, 1);
                    line-height: 25px;
                }
            }
            .item-right {
                display: flex;
                flex-direction: column;
                justify-content: center;
                a {
                    padding: 10px 20px;
                    color: rgba(0, 110, 255, 1);
                    font-size: 14px;
                    border: 1px solid rgba(0, 110, 255, 1);
                    background: #EBF2FF;
                    border-radius: 4px;
                }
            }
        }
    }

    .success-step {
        margin-top: 100px;
        text-align: center;
        .success-text {
            padding: 10px 0;
            color: #002059;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            .success-icon {
                height: 25px;
                width: 25px;
                background: url('~@/assets/img/success-icon.png') no-repeat center center;
                background-size: 100% 100%;
                margin-right: 10px;
            }
        }
        .success-btns {
            padding: 0;
            .el-button {
                height: 44px;
                line-height: 44px;
                padding: 0 150px;
                background: rgba(0, 94, 255, 1);
                color: white;
            }
        }
    }
</style>