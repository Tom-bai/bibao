<template>
    <div class="email-template">
        <user-mask @close="close($event)" :value='setEmailBool' height="500px" width="100%">

            <!-- 未开启 -->
            <div class="putOn clearfix" style="width:100%" v-if="userStatus.googleState==0">
                <!-- 设置交易密码 -->
                <div class="user-form-wrap fl">
                    <div class="user-form-title">{{'SET_G_VER'|t}}</div>
                    <div class="google-cont">
                        <div class="qrcode">
                            <!-- <canvas ref="cvs" height="300px" width="300px" id="canvas"></canvas> -->
                            <img :src="qrcodeSrc" alt="">
                        </div>
                        <p>{{'SCANNING_G_CODE'|t}}</p>
                        <!-- <div class="box-flex google-item">
                            <el-input v-model="inputText" readonly disabled style="width:80%;vertical-align: middle;"></el-input>
                            <el-button type='primary' class="google-btn" v-clipboard:copy="inputText" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
                        </div> -->
                        <el-form :model="codeForm" :rules="rules" ref="codeForm" class="google-item">
                            <el-form-item prop="" style="width:100%;">
                                <el-input v-model="inputText" disabled>
                                    <template slot="prepend">{{'CODE_KEY'|t}}</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="" style="width:100%;">
                                <el-input v-model="acc" disabled>
                                    <template slot="prepend">{{'ACCOUNT'|t}}</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="code" style="width:100%;">
                                <el-input v-model="codeForm.code">
                                    <template slot="prepend">{{'CODE_LABEL'|t}}</template>
                                </el-input>
                            </el-form-item>
                            <el-button type='primary' plain class="google-btn" @click="setGoogleAuth" :loading="isAble" :disabled="isAble" style="width:100%;">{{'BIND'|t}}</el-button>
                        </el-form>
                    </div>
                </div>
                <div class="tips fl">
                    <dl class="tip1">
                        <dt>{{'G_TIPS_1'|t}}</dt>
                        <dt>{{'G_TIPS_2'|t}}</dt>
                    </dl>
                    <dl class="tip2">
                        <dt>1、{{'GTIPS_2_1'|t}}</dt>
                            <dd>{{'GTIPS_2_1_1'|t}}</dd>
                            <dd>{{'GTIPS_2_1_2'|t}}</dd>
                        <dt>2、{{'GTIPS_2_2'|t}}</dt>
                            <dd>{{'GTIPS_2_2_1'|t}}</dd>
                            <dd>{{'GTIPS_2_2_2'|t}}</dd>
                        <dt>3、{{'GTIPS_2_3'|t}}</dt>
                    </dl>
                </div>
            </div>

            <!-- 已开启 -->
            <div class="shootDown" v-if="userStatus.googleState==1">
                <div class="user-form-title">{{'CLOSE_G_VER'|t}}</div>
                <el-form :model="codeForm" :rules="rules" ref="codeForm">
                    <el-form-item prop="" style="width:100%;">
                        <el-input v-model="acc" disabled>
                            <template slot="prepend">{{'ACCOUNT'|t}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code" style="width:100%;">
                        <el-input v-model="codeForm.code" @keyup.enter.native="setGoogleAuth">
                            <template slot="prepend">{{'CODE_LABEL'|t}}</template>
                        </el-input>
                    </el-form-item>
                    <el-button plain type="primary" @click="setGoogleAuth" :loading="isAble" :disabled="isAble" style="width:100%;">{{'CLOSE_G_VER'|t}}</el-button>
                </el-form>
            </div>
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { mapState } from 'vuex';
    import QRCode from 'qrcode';
    import { User } from "@/services"
    import { Rules } from '@/providers/rules';
    export default {
        name: 'email-component',
        components: {
            userMask
        },
        data() {
            return {
                setEmailBool: true,
                isAble: false,
                codeForm:{
                    code: ''
                },
                rules:{
                    code: Rules.YZM
                },
                acc:'',
                inputText: '',
                qrcodeSrc:'',
                isBinded:null,//未认证: NOT/null/'',   已开启: ENABLE,   已关闭: DISABLE
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ])
        },
        mounted(){
            if(this.userStatus.googleState==undefined) 
                return this.$router.push('/user/safe');
            this.getData();
        },
        methods: {
            // 获取数据
            getData(){
                User.getGoogleAuth().then(res=>{
                    this.acc = res.oneData.googleAccount;
                    this.inputText = res.oneData.googleAuthKey;
                    this.isBinded = res.oneData.googleAuthState;
                    this.qrcodeSrc = res.oneData.googleAuthUrl;
                    // console.log(res.oneData.googleAuthUrl)
                    // this.QRCodeCanvas(res.oneData.googleAuthUrl);
                }).catch(err=>{
                     
                })
            },

            // 绑定，关闭
            setGoogleAuth(){
                this.isAble = true;
                User.setGoogleAuth({
                    secretCode: this.codeForm.code,//谷歌验证码
                    type: this.isBinded=='ENABLE'?2:1,//类型（1：绑定，2：重置）
                }).then(res=>{
                    if(this.isBinded=='ENABLE') this.SUCCESS(this.$t('RESET_SUCC'));
                    else this.SUCCESS(this.$t('BIND_SUCC'));
                    // 下次路由切换时，获取/更新认证状态
                    this.$store.state.userStatusChangeSignal = 1;
                    this.$router.replace('/user/safe');
                    this.isAble = false;
                }).catch(err=>{
                     this.isAble = false;
                })
            },

            // // 二维码显示
            QRCodeCanvas(value) {
                QRCode.toCanvas(this.$refs.cvs, value, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('success!');
                    }
                });
            },

            // onCopy(e) {
            //     this.SUCCESS(this.$t('COPY_SUCCESS'))
            // },
            // onError(e) {
            //     this.WARN('Failed to copy texts')
            // },

            close($event) {
                this.$router.replace('/user/safe');
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return 
                    }
                    this.setGoogleAuth();
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
    .user-form-wrap {
        width: 40%;
        margin-right: 55px;
    }
    .tips {
        width: calc(60% - 55px);
        padding: 25px;
        border: 1px dashed #0093F9;
        box-sizing: border-box;
        background-color: #F4F8FE;
        border-radius: 5px;
        color: #333333;
        font-size: 14px;
        line-height: 26px;
        text-align: justify;
        dt {
            i {
                color: #005EFF;
            }
        }
        dd {
            margin-left: 20px;
        }
        a {
            color: #005EFF;
            &:hover {
                color: #0093F9;
            }
        }
    }

    .google-cont {
        text-align: center;
        .google-item {
            margin-top: 20px;
        }
        .qrcode {
            height: 120px;
            margin-bottom: 20px;
            img {
                height: 100%;
            }
            #canvas {
                height: 120px !important;
                width: 120px !important;
            }
            &+p {
                color: #333;
            }
        }
    }

    
    .shootDown {
        width: 445px;
    }
</style>