<template>
    <div class="email-template">
        <user-mask @close="close($event)" :value='setEmailBool' height="500px" width="100%">

            <!-- 绑定邮箱 -->
            <div class="user-form-wrap" v-if="userStatus.emailState==0">
                <div class="user-form-title">{{'BIND_ACC_EMAIL'|t}}</div>
                <el-form :model="mailForm" :rules="rules" ref="mailForm" class="demo-ruleForm">
                    <el-form-item prop="mail">
                        <el-input v-model="mailForm.mail" :placeholder="$t('EMAIL_LBAEL')">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="YZM">
                        <el-input v-model="mailForm.YZM" :placeholder="$t('EMAIL_CODE')" class="send_code">
                            <span slot="append"><YZMBTN :refForm="$refs.mailForm" prop1="mail" :email="mailForm.mail" @getKey="getKey"/></span>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="bind('mailForm')" :loading="isAble" :disabled="isAble" class="flex-btn">{{'BIND'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 邮箱更改 -->
            <user-auth-text v-if="userStatus.emailState==1" :title="'CHANGE_EMAIL'|t" @nextStept="nextSteptFn" ref="userAuthText" :setp-text="'CHANGE_EMAIL'|t">
            <!-- <user-auth-text title="更换邮箱" @nextStept="nextSteptFn" ref="userAuthText" setp-text="修改邮箱"> -->
                <div class="user-form-wrap" slot="setptwo"    >
                    <el-form :model="mailForm" :rules="rules" ref="mailForm" class="demo-ruleForm">
                        <el-form-item prop="mail">
                            <el-input v-model="mailForm.mail">
                                <template slot="prepend">{{'EMAIL_ADDR'|t}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="YZM">
                            <el-input v-model="mailForm.YZM" class="send_code">
                                <template slot="prepend">{{'CODE_LABEL'|t}}</template>
                                <span slot="append"><YZMBTN :refForm="$refs.mailForm" prop1="mail" :email="mailForm.mail" @getKey="getKey"/></span>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <!-- <el-button type="primary" class="flex-btn">{{'CHANGE_EMAIL'|t}}</el-button> -->
                            <el-button type="primary" @click="edit('mailForm')" :loading="isAble" :disabled="isAble" class="flex-btn next-setp">{{'DETERMINE'|t}}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </user-auth-text>
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { mapState } from 'vuex';
    import userAuthText from '@/components/user-auth-text';
    import { Rules } from '@/providers/rules';
    import { User } from '@/services';
    import YZMBTN from '@/components/YZMBtn.vue';
    export default {
        name: 'email-component',
        components:{ YZMBTN, userMask, userAuthText },
        data() {
            return {
                currentValue: false,
                setEmailBool: true,
                setptwoBool: false,
                isAble: false,
                mailForm: {
                    mail: '',
                    YZM: '',
                },
                rules: {
                    mail: Rules.mail,
                    YZM: Rules.loginYZM,
                },
                key: ''
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ])
        },
        mounted() {
            if(this.userStatus.emailState==undefined) 
                return this.$router.push('/user/safe');
        },
        methods: {
            getKey(key){
                this.key = key;
            },
            // 下一步
            nextSteptFn(val) {
                // this.setptwoBool = true;
                console.log(val);
            },
            // 返回上一层
            close($event) {
                this.$router.replace('/user/safe');
            },

            // 绑定
            bind(formName) {
                // this.setptwoBool = false;
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.isAble = true;
                    User.setPhoneEamil({
                        account: this.mailForm.mail,//手机/邮箱账号
                        code: this.mailForm.YZM,//验证码
                        key: this.key,
                        type: 2,//类型（1：设置手机，2：设置邮箱
                    }).then(res=>{
                        this.isAble = false;
                        // this.$refs.userAuthText.handleReset('绑定邮箱成功');
                        this.SUCCESS(this.$t('BIND_EMAIL_SUCC'));
                        // 下次路由切换时，获取/更新认证状态
                        this.$store.state.userStatusChangeSignal = 1;
                        this.$router.replace('/user/safe');
                    }).catch(err=>{
                        this.isAble = false;
                    })
                });
            },

            // 修改
            edit(formName) {
                // this.setptwoBool = false;
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.isAble = true;
                    User.editPhoneEamil({
                        account: this.mailForm.mail,//手机/邮箱账号
                        code: this.mailForm.YZM,//验证码
                        key: this.key,
                        type: 2,//类型（1：设置手机，2：设置邮箱
                    }).then(res=>{
                        this.isAble = false;
                        // 下次路由切换时，获取/更新认证状态
                        this.$store.state.userStatusChangeSignal = 1;
                        this.$refs.userAuthText.handleReset(this.$t('CHANGE_EMAIL_SUCC'));
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