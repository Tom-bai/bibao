<template>
    <div class="email-template">
        <user-mask @close="close($event)" :value='setEmailBool' height="500px" width="100%">
            <!-- 修改密码 -->
            <user-auth-text :title="'CHANGE_PWD'|t" @nextStept="nextSteptFn" ref="userAuthText" :setp-text="'CHANGE_PWD'|t">
                <div class="user-form-wrap" slot="setptwo">
                    <el-form :model="passForm" :rules="rules" ref="passForm" class="demo-ruleForm">
                        <el-form-item prop="pwd">
                            <el-input v-model="passForm.pwd" type="password">
                                <template slot="prepend">{{'NEW_PASS_LABEL'|t}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="check">
                            <el-input v-model="passForm.check" type="password">
                                <template slot="prepend">{{'CHECK_PASS'|t}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('passForm')" :loading="isAble" :disabled="isAble" class="flex-btn next-setp">{{'DETERMINE'|t}}</el-button>
                            <!-- <el-button type="primary" class="flex-btn">{{'CHANGE_EMAIL'|t}}</el-button> -->
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
    export default {
        name: 'email-component',
        data() {
            let _check =(rule, value, callback)=>{
                if (value !== this.passForm.pwd) callback(new Error(this.$t('NOT_SAME')));
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
                setptwoBool: false,
                passForm: {
                    pwd: '',
                    check: ''
                },
                rules: {
                    pwd: [...Rules.pwd,{ validator: _noSpaceBar, trigger: "blur" }],
                    check: [...Rules.pwd, 
                        { validator: _check, trigger: "blur" },
                        { validator: _noSpaceBar, trigger: "blur" }
                    ],
                }
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ])
        },
        methods: {
            // 下一步
            nextSteptFn(val) {
                // this.setptwoBool = true;
                console.log(val);
            },
            // 返回上一层
            close($event) {
                this.$router.replace('/user/safe');
            },
            submitForm(formName) {
                // this.setptwoBool = false;
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.isAble = true;
                    User.editPwd({
                        pwd:this.AES(this.passForm.pwd),//登陆密码
                    }).then(res=>{
                        this.isAble = false;
                        this.$refs.userAuthText.handleReset(this.$t('CHANGE_PWD_SUCC'));
                    }).catch(err=>{
                         this.isAble = false;
                    })
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        components: {
            userMask,
            userAuthText
        },
        mounted() {
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/safe';
</style>