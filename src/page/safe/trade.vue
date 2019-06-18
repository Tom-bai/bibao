<template>
    <div class="email-template">
        <user-mask @close="close($event)" :value='setEmailBool' height="500px" width="100%">


            <!-- 设置交易密码 -->
            <div class="user-form-wrap" v-show="defalutIndex !=3">
                <div class="user-form-title" v-text="userStatus.tradePasswordState==1 ? $t('CHANGE_TRADE_PWD'):$t('SET_TRADE_PWD')"></div>
                <el-form :model="tradePwdForm" :rules="rules" ref="tradePwdForm" class="demo-ruleForm">
                    <el-form-item prop="pwd">
                        <el-input v-model="tradePwdForm.pwd" type="password" :placeholder="$t('USER_TRADE_PASS')"></el-input>
                    </el-form-item>
                    <el-form-item prop="check">
                        <el-input v-model="tradePwdForm.check" type="password" :placeholder="'CHECK_TRADE_PWD'|t"></el-input>
                    </el-form-item>
                    <el-form-item prop="proveWay">
                        <el-select v-model="tradePwdForm.proveWay" :placeholder="'VER_WAY'|t" class="form-select">
                            <el-option :label="'VER_BYPHONE'|t" value="1" :disabled="userStatus.phoneState==='0'"></el-option>
                            <el-option :label="'VER_BYEMAIL'|t" value="2" :disabled="userStatus.emailState==='0'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="YZM">
                        <el-input v-model="tradePwdForm.YZM" :placeholder="$t('CODE_LABEL')" class="send_code">
                            <span slot="append">
                                <YZMBTN :phone="acc" @getKey="getKey" v-if="tradePwdForm.proveWay==1"/>
                                <YZMBTN :email="acc" @getKey="getKey" v-if="tradePwdForm.proveWay==2"/>
                            </span>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('tradePwdForm')" :loading="isAble" :disabled="isAble" class="flex-btn" v-text="userStatus.tradePasswordState==1 ? $t('CHANGE_TRADE_PWD'):$t('DETERMINE')"></el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 绑定成功 -->
            <div v-show="defalutIndex==3" class="success-step">
                <div class="success-text">
                    <i class="success-icon"></i> {{successTip}}</div>
                <div class="success-btns">
                    <el-button @click="$router.replace('/user/safe')">{{'DETERMINE'|t}}</el-button>
                </div>
            </div>
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { mapState } from 'vuex';
    import { Rules } from '@/providers/rules';
    import { User } from '@/services';
    import YZMBTN from '@/components/YZMBtn.vue';

    export default {
        name: 'email-component',
        components: { userMask, YZMBTN },
        data() {
            let _check =(rule, value, callback)=>{
                if (value !== this.tradePwdForm.pwd) callback(new Error(this.$t('NOT_SAME')));
                else callback();
            }
            let _noSpaceBar = (rule, value, callback) => {
                if(value.match(' ')) callback(new Error(this.$t('NO_SPACE')));
                else callback();
            };
            return {
                isAble: false,
                currentValue: false,
                setEmailBool: true,
                defalutIndex: 1,
                tradePwdForm: {
                    pwd: '',
                    check: '',
                    proveWay: '',
                    YZM: ''
                },
                rules: {
                    pwd: [...Rules.pwd,{ validator: _noSpaceBar, trigger: "blur" }],
                    check: [...Rules.pwd, 
                        { validator: _check, trigger: "blur" },
                        { validator: _noSpaceBar, trigger: "blur" }
                    ],
                    proveWay: Rules.noEmpty,
                    YZM: Rules.noEmpty
                },
                key: ''
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ]),
            acc(){
                if(this.tradePwdForm.proveWay == 1) return this.userStatus.phone
                if(this.tradePwdForm.proveWay == 2) return this.userStatus.email
                return ''
            },
            successTip(){
                if(this.userStatus.tradePasswordState == 0) return this.$t('SET_SUCC')
                if(this.userStatus.tradePasswordState == 1) return this.$t('FIX_SUCC')
                return ''
            }
        },
        mounted() {
            if(this.userStatus.tradePasswordState==undefined) 
                return this.$router.push('/user/safe');
        },
        methods: {
            getKey(key){
                this.key = key;
            },
            close($event) {
                this.$router.replace('/user/safe');
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.isAble = true;
                    User.setTradePwd({
                        tradePwd:this.AES(this.tradePwdForm.pwd),//交易密码
                        code: this.tradePwdForm.YZM,//验证码
                        key: this.key,
                        proveType: this.tradePwdForm.proveWay,//验证类型（1：手机验证，2：邮箱验证）
                    }).then(res=>{
                        this.isAble = false;
                        // 下次路由切换时，获取/更新认证状态
                        this.$store.state.userStatusChangeSignal = 1;
                        this.defalutIndex = 3;
                    }).catch(err=>{
                        this.isAble = false;
                    })
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/safe';
</style>