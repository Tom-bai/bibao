<template>
    <div class="email-template">
        <user-mask @close="close($event)" :value='setEmailBool' height="500px" width="100%">

            <!-- 绑定 -->
            <div class="user-form-wrap" v-if="userStatus.wechatState==0">
                <!-- <div class="user-form-wrap" v-if="false"> -->
                <div class="user-form-title">{{'BIND_ACC_WECHART'|t}}</div>
                <el-form :model="bindForm" :rules="rules" ref="bindForm" class="demo-ruleForm">
                    <div class="upload-flex wechat_code_upload">
                        <div class="wechat_code-text">
                            <span>+</span>
                            <span>{{'UPLOAD_PAGEMENT_PIC'|t}}</span>
                        </div>
                        <el-form-item prop="img">
                            <div class="form-file">
                                <div class="form-input-file wechat_code_img_bg">
                                    <img src="" alt="" id="imgSrc">
                                    <input type="file" accept="image/png, image/jpeg" @change="changeFile($event,'imgSrc','bindForm')" id="img">
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                    <el-form-item prop="wechat">
                        <el-input v-model="bindForm.wechat">
                            <template slot="prepend">{{'WECHAT'|t}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="tradePwd">
                        <el-input v-model="bindForm.tradePwd" type="password">
                            <template slot="prepend">{{'USER_TRADE_PASS'|t}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitBindForm('bindForm')" :loading="isAble" :disabled="isAble" class="flex-btn">{{'DETERMINE'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>


            <!-- 修改-步骤1 -->
            <div class="user-form-wrap" v-if="userStatus.wechatState==1">
                <!-- <div class="user-form-wrap"> -->
                <div class="user-form-title">{{'CHANGE_ACC_WECHART'|t}}</div>
                <el-form :model="changeForm1" :rules="rules" ref="changeForm1" class="demo-ruleForm" v-show="defalutIndex==1">
                    <el-form-item>
                        <el-input v-model="changeForm1.oldAcc" disabled>
                            <template slot="prepend">{{'OLD_WECHART'|t}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="type">
                        <el-select v-model="changeForm1.type" :placeholder="'VER_WAY'|t" class="form-select">
                            <el-option :label="'VER_BYPHONE'|t" value="1" :disabled="userStatus.phoneState==0"></el-option>
                            <el-option :label="'VER_BYEMAIL'|t" value="2" :disabled="userStatus.emailState==0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-input v-model="changeForm1.code" class="send_code">
                            <template slot="prepend">{{'CODE_LABEL'|t}}</template>
                            <span slot="append">
                                <YZMBTN :phone="acc" @getKey="getKey" v-if="changeForm1.type==1" />
                                <YZMBTN :email="acc" @getKey="getKey" v-if="changeForm1.type==2" />
                            </span>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitChangeForm('changeForm1')" :loading="isAble" :disabled="isAble" class="next-setp">{{'NEXT_STEP'|t}}</el-button>
                    </el-form-item>
                </el-form>

                <!-- 修改-步骤2 -->
                <el-form :model="changeForm2" :rules="rules" ref="changeForm2" class="demo-ruleForm" v-show="defalutIndex==2">
                    <div class="upload-flex wechat_code_upload">
                        <div class="wechat_code-text">
                            <span>+</span>
                            <span>{{"UPLOAD_PAGEMENT_PIC"|t}}</span>
                        </div>
                        <el-form-item prop="img">
                            <div class="form-file">
                                <div class="form-input-file wechat_code_img_bg">
                                    <img src="" alt="" id="imgSrc">
                                    <input type="file" accept="image/png, image/jpeg" @change="changeFile($event,'imgSrc','changeForm2')" id="img">
                                </div>
                            </div>
                            <!-- <el-input type="file" v-model="Form.img" placeholder="" style="display: none"></el-input> -->
                        </el-form-item>
                    </div>
                    <el-form-item prop="newAcc">
                        <el-input v-model="changeForm2.newAcc">
                            <template slot="prepend">{{'NEW_WECHART'|t}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitChangeForm('changeForm2')" :loading="isAble" :disabled="isAble" class="next-setp">{{'SURE_FIX'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { mapState } from 'vuex';
    import { Rules } from '@/providers/rules';
    import { User } from '@/services'
    import YZMBTN from '@/components/YZMBtn.vue';

    export default {
        name: 'email-component',
        components: { YZMBTN, userMask },
        data() {
            let _imgs = (rule, value, callback) => {
                if (value == '' || value == null) callback(new Error(this.$t('UPLOAD_PIC')));
                else if (value.size > 2 * 1024 * 1024) callback(new Error(this.$t('PIC_MAX_2M')));
                else callback();
            }
            return {
                isAble: false,
                defalutIndex: 1,
                setEmailBool: true,
                rules: {
                    wechat: [...Rules.noEmpty, { max: 20, message: this.$t('NAX_LENGTH20'), trigger: 'blur' }],
                    tradePwd: Rules.pwd,
                    img: [{ validator: _imgs, trigger: 'change' }],
                    newAcc: [...Rules.noEmpty, { max: 20, message: this.$t('NAX_LENGTH20'), trigger: 'blur' }],
                    oldAcc: Rules.noEmpty,
                    type: Rules.noEmpty,
                    code: Rules.loginYZM,
                },
                bindForm: {
                    img: null,
                    wechat: '',
                    tradePwd: ''
                },
                changeForm1: {
                    oldAcc: '',
                    type: '',
                    code: '',
                },
                changeForm2: {
                    img: null,
                    newAcc: '',
                },
                key: ''
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ]),
            acc() {
                if (this.changeForm1.type == 1) return this.userStatus.phone
                if (this.changeForm1.type == 2) return this.userStatus.email
                return ''
            }
        },
        mounted() {
            if (this.userStatus.tradePasswordState == undefined)
                return this.$router.push('/user/safe');
            this.changeForm1.oldAcc = this.userStatus.wechat;
        },
        methods: {
            getKey(key) {
                this.key = key;
            },
            // 图片本地回显
            changeFile($event, type, form) {
                var input = $event.target;
                var files = $event.target.files[0];
                if(files){
                    this[form].img = files;
                    var reader = new FileReader();
                    reader.onload = () => {
                        var dataURL = reader.result;
                        var output = document.getElementById(type);
                        output['src'] = dataURL;
                    };
                    reader.readAsDataURL(files);
                }
                this.$refs[form].validateField('img');
            },

            close($event) {
                this.$router.replace('/user/safe');
            },

            submitBindForm(formName) {
                // console.log(this.bindForm);
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    this.isAble = true;
                    let fd = new FormData();
                    fd.append('account', this.bindForm.wechat);
                    fd.append('photo', this.bindForm.img);
                    fd.append('tradePwd', this.AES(this.bindForm.tradePwd));
                    fd.append('type', 1);//1微信 2支付宝
                    User.setWechatAlipay(fd).then((res) => {
                        this.isAble = false;
                        this.SUCCESS(this.$t('BIND_SUCC'));
                        // 下次路由切换时，获取/更新认证状态
                        this.$store.state.userStatusChangeSignal = 1;
                        this.$router.replace('/user/safe');
                    }).catch(err => {
                        this.isAble = false;
                    })
                });
            },

            submitChangeForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    this.isAble = true;
                    // 第一步
                    if (formName === 'changeForm1') {
                        User.editWechatAlipayJudge({
                            oldAccount: this.changeForm1.oldAcc,//旧微信/支付宝账号
                            code: this.changeForm1.code,//验证码
                            key: this.key,//验证码Key
                            type: 1,//类型(1：微信，2：支付宝)
                            proveType: this.changeForm1.type,//验证类型（1：手机验证，2：邮箱验证）
                        }).then(res => {
                            this.isAble = false;
                            if (res.code === 'SUCCESS') {
                                this.defalutIndex = 2;
                            }
                        }).catch(err => {
                            this.isAble = false;
                        })
                    }
                    // 第二步
                    if (formName === 'changeForm2') {
                        let fd = new FormData();
                        fd.append('account', this.changeForm2.newAcc);
                        fd.append('photo', this.changeForm2.img);
                        fd.append('type', 1);//(1：微信，2：支付宝)
                        User.editWechatAlipay(fd).then((res) => {
                            this.isAble = false;
                            this.SUCCESS(this.$t('FIX_SUCC'));
                            // 下次路由切换时，获取/更新认证状态
                            this.$store.state.userStatusChangeSignal = 1;
                            this.$router.replace('/user/safe');
                        }).catch(err => {
                            this.isAble = false;
                        })
                    }
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