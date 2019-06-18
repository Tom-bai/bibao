<template>
    <div class="bank-template">
        <user-mask @close="close($event)" :value='setEmailBool' height="590px" width="100%">
            <div class="user-form-wrap" v-show="showBool==0">
                <div class="user-form-title">{{'BIND_ACC_BANK'|t}}</div>
                <el-form :model="bindForm" :rules="rules" ref="bindForm" class="demo-ruleForm">
                    <el-form-item prop="name">
                        <el-input v-model="bindForm.name" :placeholder="$t('BANK_NAME')"></el-input>
                    </el-form-item>
                    <el-form-item prop="bank">
                        <el-input v-model="bindForm.bank" :placeholder="$t('BANK')"></el-input>
                    </el-form-item>
                    <el-form-item prop="branch">
                        <el-input v-model="bindForm.branch" :placeholder="$t('BANK_BRANCH')"></el-input>
                    </el-form-item>
                    <el-form-item prop="addr">
                        <el-input v-model="bindForm.addr" :placeholder="$t('BANK_ADDREDD')"></el-input>
                    </el-form-item>
                    <el-form-item prop="num">
                        <el-input v-model="bindForm.num" :placeholder="$t('BANK_NUM')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!-- <el-button type="primary" @click="submitForm('bindForm')" class=-btn">{{'DETERMINE'|t}}</el-button> -->
                        <el-button type="primary" @click="submitForm('bindForm')" :loading="isAble" :disabled="isAble" class="flex-btn">{{'DETERMINE'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="bank-list-wrap" v-show="showBool==1">
                <div class="user-form-title">{{'CARD'|t}}</div>
                <ul class="bank-list box-flex">
                    <li class="bank-item" v-for="item in bankList" :key="item.a">
                        <h3>{{item.bank}}{{item.branch}}</h3>
                        <p>{{item.code}}</p>
                        <!-- {{item.flag}} -->
                        <label @click="setDefCard(item)">
                            <!-- <el-radio v-model="item.flag" :label="true" v-text="item.flag?'已默认':'设为默认卡'"></el-radio> -->
                            <i :class="item.flag?'active dots el-icon-check':'dots el-icon-check'"></i>
                            <span :class="item.flag?'active':''">
                                <s>{{'IS_DEF'|t}}
                                    <br>{{'SET_DEF'|t}}</s>
                            </span>
                        </label>
                        <i class="el-icon-delete delbtn" @click="delBank(item)"></i>
                    </li>
                    <li class="bank-item">
                        <div class="add-bank" @click="showBool=0">+{{'ADD_BANK'|t}}+</div>
                    </li>
                </ul>
            </div>
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { mapState } from 'vuex';
    import { Rules } from '@/providers/rules';
    import { User } from '@/services'

    export default {
        components: {
            userMask
        },
        data() {
            return {
                setEmailBool: true,
                isAble: false,
                bindForm: {
                    name: '',
                    bank: '',
                    branch: '',
                    addr: '',
                    num: '',
                },
                showBool: 1,
                rules: {
                    name: Rules.noEmpty,
                    bank: [...Rules.noEmpty, { max: 15, message: this.$t('NAX_LENGTH15'), trigger: 'blur' }],
                    branch: [...Rules.noEmpty, { max: 15, message: this.$t('NAX_LENGTH15'), trigger: 'blur' }],
                    addr: Rules.noEmpty,
                    num: Rules.bankNum,
                },
                bankList: []
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ])
        },
        mounted() {
            if (this.userStatus.bankState == undefined)
                return this.$router.push('/user/safe');
            this.getBankList();
            // this.showBool = this.userStatus.bankState;
        },
        methods: {
            // 获取银行卡列表
            getBankList() {
                User.getBankcard({
                }).then(res => {
                    this.bankList = res.listData;
                }).catch(err => {

                })
            },

            // 设置默认交易卡
            setDefCard(row) {
                if (row.flag) return
                User.defaultBankcard({
                    cardId: row.id,//银行卡ID
                }).then(res => {
                    this.getBankList();
                }).catch(err => {

                })
            },

            // 删除银行卡
            delBank(row) {
                this.$confirm(this.$t('WANT_DEL'), this.$t('PROMPT'), {
                    confirmButtonText: this.$t('COMFIRM'),
                    cancelButtonText: this.$t('CANCEL'),
                    type: 'warning'
                }).then(() => {
                    User.removeBankcard({
                        cardId: row.id,//银行卡ID
                    }).then((res) => {
                        // 下次路由切换时，获取/更新认证状态
                        this.$store.state.userStatusChangeSignal = 1;
                        this.SUCCESS(this.$t('DEL_SUCC'))
                        this.getBankList();
                    }).catch(err => {

                    })
                })
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
                    User.addBankcard({
                        username: this.bindForm.name,//用户姓名
                        bank: this.bindForm.bank,//银行名称
                        branchBank: this.bindForm.branch,//银行支行
                        address: this.bindForm.addr,//银行地址
                        card: this.bindForm.num,//银行账号
                    }).then(res => {
                        this.isAble = false;
                        // 下次路由切换时，获取/更新认证状态
                        this.$store.state.userStatusChangeSignal = 1;
                        this.SUCCESS(this.$t('ADD_BANK_SUCC'));
                        this.showBool = 1;
                        this.resetForm('bindForm');
                        this.getBankList();
                    }).catch(err => {
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