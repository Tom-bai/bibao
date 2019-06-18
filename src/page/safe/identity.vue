<template>
    <div class="email-template" v-show="canShow">
        <user-mask @close="close($event)" :value='setEmailBool' height="500px" width="100%">
            <!-- 设置交易密码 -->
            <div class="user-form-wrap identity-wrap" v-show="idState==null">
                <div class="user-form-title">{{'SUBMIT_IDINFO'|t}}</div>
                <div class="user-form-sub-title">—— {{'CHOOSE_ONE'|t}} ——</div>
                <div class="box-flex identity">
                    <div :class="proveWay==1 ? 'flex identity-item active' : 'flex identity-item'" @click="proveWay = 1">{{'VER_ID'|t}}</div>
                    <div :class="proveWay==2 ? 'flex identity-item active' : 'flex identity-item'" @click="proveWay = 2">{{'VER_PASSPORT'|t}}</div>
                    <div :class="proveWay==3 ? 'flex identity-item active' : 'flex identity-item'" @click="proveWay = 3">{{'VER_DRIVER'|t}}</div>
                </div>
                <el-form :model="idForm" :rules="rules" ref="idForm" class="demo-ruleForm">
                    <div class="box-flex">
                        <div class="flex mr-10">
                            <el-form-item prop="local">
                                <el-select v-model="idForm.local" :placeholder="'CARD_ADDR'|t" class="form-select">
                                    <el-option :label="item.province" :value="item.id" v-for="item in locals" :key="item.a"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="flex">
                            <el-form-item prop="name">
                                <el-input v-model="idForm.name" :placeholder="'CARD_NAME'|t">
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item prop="id">
                        <!-- 输入本人护照号码 -->
                        <!-- 输入本人驾驶证号码 -->
                        <el-input v-model="idForm.id" :placeholder="'CARD_NUM'|t"></el-input>
                    </el-form-item>
                    <div class="box-flex" v-if="proveWay==1">
                        <div class="flex mr-10">
                            <el-form-item prop="date1">
                                <el-date-picker type="date" :placeholder="'START_DATE'|t" v-model="idForm.date1" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="flex">
                            <el-form-item prop="date2">
                                <el-date-picker type="date" :placeholder="'END_DATE'|t" v-model="idForm.date2" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </div>
                    </div>
                    <!-- 文件上传 -->
                    <div class="upload-box">
                        <div class="upload-item" v-if="proveWay==1">
                            <el-form-item prop="imgHand">
                                <div class="form-file">
                                    <div class="form-input-file imgHandSrc">
                                        <img alt="" id="imgHandSrc">
                                        <input type="file" accept="image/png, image/jpeg" @change="changeFile($event,'imgHandSrc','imgHand')" id="imgHand">
                                    </div>
                                    <div class="form-input-text" @click="uploadFIle('imgHand')">{{'IMGHANDSRC'|t}}</div>
                                </div>
                            </el-form-item>
                        </div>
                        <div class="upload-item">
                            <el-form-item prop="imgFace">
                                <div class="form-file">
                                    <div class="form-input-file imgFaceSrc">
                                        <img alt="" id="imgFaceSrc">
                                        <input type="file" accept="image/png, image/jpeg" @change="changeFile($event,'imgFaceSrc','imgFace')" id="imgFace">
                                    </div>
                                    <div class="form-input-text" @click="uploadFIle('imgFace')">{{'IMGFACESRC'|t}}</div>
                                </div>
                            </el-form-item>
                        </div>
                        <div class="upload-item">
                            <el-form-item prop="imgBack">
                                <div class="form-file">
                                    <div class="form-input-file imgBackSrc">
                                        <img alt="" id="imgBackSrc">
                                        <input type="file" accept="image/png, image/jpeg" @change="changeFile($event,'imgBackSrc','imgBack')" id="imgBack">
                                    </div>
                                    <div class="form-input-text" @click="uploadFIle('imgBack')">{{'IMGBACKSRC'|t}}</div>
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('idForm')" :loading="isAble" :disabled="isAble" class="flex-btn">{{'DETERMINE'|t}}</el-button>
                        <!-- <el-button type="primary" @click="userStatus.identityState=1" class="flex-btn">更换支付宝账号</el-button> -->
                    </el-form-item>
                </el-form>
                <div class="identity-text">
                    <p>1.{{'PIC_SIZE_IN'|t}}
                        <span>1.2M</span> {{'PIC_SIZE_IN2'|t}}</p>
                    <p>2.{{'UPLOAD_ID_TIPS'|t}}</p>
                </div>
            </div>
            <div class="identity-wrap success-identity" v-show="idState=='AUDITING'">
                <div class="success-identity-pic">
                    <img src="~@/assets/img/success-identity.png" alt="">
                </div>
                <p>认证信息已提交成功!</p>
                <p>平台正在审核，请耐心等待哦</p>
            </div>
            <div class="identity-wrap success-identity" v-show="idState=='FAIL'">
                <div class="success-identity-pic">
                    <img src="~@/assets/img/warn-icon.png" alt="">
                </div>
                <p>{{'REJECT_UPLOAD_ID'|t}}</p>
                <p>{{'REJECT_UPLOAD_ID_REASON1'|t}}
                    <span class="c-red">{{reason}}</span>
                    {{'REJECT_UPLOAD_ID_REASON2'|t}}</p>
                <el-button type="primary" class="flex-btn" @click="reUpload">{{'REUPLOAD_ID'|t}}</el-button>
            </div>
            <!-- idState=='SUCCESS'的时候不予进入 -->
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { mapState } from 'vuex';
    import { Rules } from '@/providers/rules';
    import { User } from '@/services';
    export default {
        name: 'email-component',
        data() {
            let _imgs = (rule, value, callback) => {
                if (value == '' || value == null) callback(new Error(this.$t('UPLOAD_PIC')));
                else if (value.size > 1.2 * 1024 * 1024) callback(new Error(this.$t('PIC_MAX_1.2M')));
                else callback();
            }
            let _id = (rule, value, callback) => {
                let pattern = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
                if (this.proveWay == 1)
                    if (!pattern.test(value)) {
                        return callback(new Error(this.$t('ERRORID')));
                    } else { return callback(); }
                if (this.proveWay == 2)
                    if (!value) {
                        return callback(new Error(this.$t('ERROR_EMPTY')));
                    } else { return callback(); }
                if (this.proveWay == 3)
                    if (!value) {
                        return callback(new Error(this.$t('ERROR_EMPTY')));
                    } else { return callback(); }
            }
            return {
                isAble: false,
                canShow: false,
                currentValue: false,
                setEmailBool: true,
                dialogImageUrl: '',
                dialogVisible: false,
                canShow: false,
                idState: null,
                proveWay: 1,
                locals: [],
                idForm: {
                    local: '',
                    name: '',
                    id: '',
                    date1: '',
                    date2: '',
                    imgHand: null,
                    imgFace: null,
                    imgBack: null
                },
                rules: {
                    local: Rules.noEmpty,
                    name: Rules.name,
                    id: [
                        ...Rules.noEmpty,
                        { validator: _id, trigger: 'change' }
                    ],//身份证identity
                    date1: Rules.noEmpty,
                    date2: Rules.noEmpty,
                    imgHand: [{ validator: _imgs, trigger: 'change' }],
                    imgFace: [{ validator: _imgs, trigger: 'change' }],
                    imgBack: [{ validator: _imgs, trigger: 'change' }],
                },
                reason: ''
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ])
        },
        mounted() {
            if (this.userStatus.credentialInfoState == undefined)
                return this.$router.push('/user/safe');
            this.getState();
            this.getLocal();
        },
        methods: {
            getState() {
                User.getMemberAuth({
                }).then(res => {
                    this.idState = res.oneData.auditState;
                    this.reason = res.oneData.remark;
                    this.canShow = true;
                }).catch(err => {

                })
            },

            getLocal() {
                User.getMemberAuthAddress().then(res => {
                    this.locals = res.listData;
                }).catch(err => {

                })
            },
            // 文件上传
            changeFile($event, type, formInputValue) {
                var input = $event.target;
                var files = $event.target.files[0];
                if (files) {
                    var reader = new FileReader();
                    reader.onload = () => {
                        var dataURL = reader.result;
                        var output = document.getElementById(type);
                        output.style.display = 'inline';
                        output.src = dataURL;
                        console.log(output);
                    };
                    reader.readAsDataURL(input.files[0]);
                    this.idForm[formInputValue] = input.files[0];
                }
                this.$refs.idForm.validateField(formInputValue);
            },
            // 点击上传文件
            uploadFIle(id) {
                document.getElementById(id).click();
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            close($event) {
                this.$router.replace('/user/safe');
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    this.isAble = true;
                    let fd = new FormData();
                    fd.append('type', this.proveWay);//证件类型(1:身份证，2：护照，3：驾驶证)
                    fd.append('address', this.idForm.local);//证件地址
                    fd.append('dealName', this.idForm.name);//证件人名称
                    fd.append('idNumber', this.idForm.id);//证件号码
                    if (this.proveWay == 1) {
                        fd.append('beginDate', (this.idForm.date1).format('yyyy-MM-dd'));//开始时间
                        fd.append('endDate', (this.idForm.date2).format('yyyy-MM-dd'));//结束时间 
                        fd.append('photo1', this.idForm.imgHand);
                    }
                    fd.append('photo2', this.idForm.imgFace);
                    fd.append('photo3', this.idForm.imgBack);
                    User.addMemberAuth(fd)
                        .then(res => {
                            this.isAble = false;
                            this.idState = 'AUDITING';
                        }).catch(err => {
                            this.isAble = false;
                        })
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            reUpload() {
                this.idState = null;
            }
        },
        components: {
            userMask
        },
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/safe';
</style>