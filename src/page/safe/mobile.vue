<template>
    <div class="email-template">
        <user-mask @close="close($event)" :value='setEmailBool' height="500px" width="100%">
            <!-- 绑定手机号码 -->
            <div class="user-form-wrap" v-if="userStatus.phoneState==0">
                <div class="user-form-title">{{'BIND_ACC_PHONE'|t}}</div>
                <el-form :model="mobileForm" :rules="rules" ref="mobileForm" class="demo-ruleForm">
                    <el-form-item prop="phone">
                        <el-input v-model="mobileForm.phone" :placeholder="$t('MOBILE_PLACE')">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="YZM">
                        <el-input v-model="mobileForm.YZM" :placeholder="$t('CODE_REQUIRE')" class="send_code">
                            <span slot="append"><YZMBTN :refForm="$refs.mobileForm" prop1="phone" :phone="mobileForm.phone" @getKey="getKey"/></span>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="bind('mobileForm')" :loading="isAble" :disabled="isAble" class="flex-btn">{{'BIND'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            
            <!-- 更改 -->
            <user-auth-text v-if="userStatus.phoneState==1" :title="'BIND_ACC_PHONE'|t" @nextStept="nextSteptFn" ref="userAuthText" :setp-text="'BIND_ACC_PHONE'|t">
                <div class="user-form-wrap" slot="setptwo">
                    <el-form :model="mobileForm" :rules="rules" ref="mobileForm" class="demo-ruleForm">
                        <el-form-item prop="phone">
                            <el-input v-model="mobileForm.phone">
                                <template slot="prepend">{{'MOBLE'|t}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="YZM">
                            <el-input v-model="mobileForm.YZM" class="send_code">
                                <template slot="prepend">{{'CODE_LABEL'|t}}</template>
                                <span slot="append"><YZMBTN :refForm="$refs.mobileForm" prop1="phone" :phone="mobileForm.phone" @getKey="getKey"/></span>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="edit('mobileForm')" :loading="isAble" :disabled="isAble" class="flex-btn next-setp">{{'DETERMINE'|t}}</el-button>
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
                isAble: false,
                currentValue: false,
                setEmailBool: true,
                setptwoBool: false,
                mobileForm: {
                    phone: '',
                    YZM: '',
                },
                rules: {
                    phone: Rules.phone,
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
            if(this.userStatus.phoneState==undefined) 
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
                        account: this.mobileForm.phone,//手机/邮箱账号
                        code: this.mobileForm.YZM,//验证码
                        key: this.key,
                        type: 1,//类型（1：设置手机，2：设置邮箱
                    }).then(res=>{
                        this.isAble = false;
                        // this.$refs.userAuthText.handleReset('绑定手机成功');
                        this.SUCCESS(this.$t('BIND_PHONE_SUCC'));
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
                        account: this.mobileForm.phone,//手机/邮箱账号
                        code: this.mobileForm.YZM,//验证码
                        key: this.key,
                        type: 1,//类型（1：设置手机，2：设置邮箱
                    }).then(res=>{
                        this.isAble = false;
                        this.$refs.userAuthText.handleReset(this.$t('BIND_PHONE_SUCC'));
                        // 下次路由切换时，获取/更新认证状态
                        this.$store.state.userStatusChangeSignal = 1;
                    }).catch(err=>{
                         this.isAble = false;
                    })
                });
            },


            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/safe';
</style>