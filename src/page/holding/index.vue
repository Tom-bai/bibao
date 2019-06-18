<template>
    <div class="asset-template">
        <div class="coin-list">
            <div class="content clearfix">
                <div class="fr">
                    {{'EXPECTED_EARNINGS_TODAY'|t}}：
                    <span class="c-red">{{$C(earningsData) | wasNull  }}</span>{{activeCoin.coinName}}
                </div>
                <div class="ovh">
                    <button type="button" class="coin-item" v-for="item in coinList" :key="item.a" :class="activeCoin.id==item.id?'active':''"
                        @click="changeActive(item)">{{item.coinName}}</button>
                </div>
            </div>
        </div>
        <!-- <div class="coin-list coin-list-wraps">
            <div class="content box-flex space-between asset-record clearfix">
                <div class="">
                    <h3>{{'PARTICIPATION_ACTIVITIES'|t}}</h3>
                </div>
                <div class="input-suffix flex">
                    <el-input v-model="activeForm.dealNumber" :placeholder="$t('PARTICIPATION_ACTIVITIES')" class="send_code send__advert" @keyup.native="fixeNumber(activeForm,'dealNumber',20)">
                        <span slot="append" style="color: #040D2C">{{activeCoin.coinName}}</span>
                    </el-input>
                    <el-button @click="getActive(activeForm.dealNumber)" type="primary" class="ml-5">{{'COMFIRM'|t}}</el-button>
                </div>
            </div>
        </div> -->
        <div class='invite'>
            <div>
                <h3 class="mb-20">{{'PARTICIPATION_ACTIVITIES'|t}}</h3>
                <el-form :model="activeForm" :rules="rules" ref="activeForm" class="demo-ruleForm">
                    <el-form-item prop="dealNumber">
                        <el-input v-model="activeForm.dealNumber" :placeholder="$t('PARTICIPATION_ACTIVITIES')" class="send_code send__advert" @keyup.native="fixeNumber(activeForm,'dealNumber',20)">
                            <span slot="append" style="color: #040D2C">{{activeCoin.coinName}}</span>
                        </el-input>
                    </el-form-item>
                    <div>
                        <el-button @click="getActive('activeForm',activeForm.dealNumber)" type="primary" class="btn-flex" :disabled="loadingBool"
                            :loading="loadingBool" style="width: 100%">{{'COMFIRM'|t}}</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <!-- 活动记录 -->
        <div class="coin-list">
            <div class="content box-flex space-between asset-record clearfix">
                <div class="flex">
                    <i class="asset-icon"></i>
                    <h3>{{'ACTIVITY_RECORD'|t}}</h3>
                </div>
                <div class="input-suffix">
                    <span>{{'CURRENCY'|t}}：</span>
                    <el-select v-model="recordOption.coinId">
                        <el-option :label="'ALL'|t" value=""></el-option>
                        <el-option v-for="item in coinList" :key="item.a" :label="item.coinName" :value="item.id"></el-option>
                    </el-select>
                    <span>{{'STATUS'|t}}：</span>
                    <el-select v-model="recordOption.holdState">
                        <el-option :label="'ALL'|t" value=""></el-option>
                        <el-option :label="$t('COMPLETE')" value="FINISHED"></el-option>
                        <el-option :label="$t('HAVE_BEEN_CANCELLED')" value="CANCELED"></el-option>
                        <el-option :label="$t('IN_CURRENCY')" value="HOLDED"></el-option>
                    </el-select>
                    <el-button class="search-button" @click="search">{{'TAB2_TITLE'|t}}</el-button>
                </div>
            </div>
        </div>
        <div class="content content-data">
            <el-table :data="rowData" style="width: 100%">
                <el-table-column prop="partDate" :label="$t('PARTICIPATION_TIME')" sortable></el-table-column>
                <el-table-column prop="settleDate" :label="$t('SETTLEMENT_TIME')" sortable></el-table-column>
                <el-table-column prop="productCoinCore" :label="$t('PARTICIPATION_CURRENCY')" sortable></el-table-column>
                <el-table-column prop="coinNumber" :label="$t('PARTICIPATION_QUANTITY')" sortable></el-table-column>
                <el-table-column prop="periodRate" :label="$t('INTEREST_RATE')" sortable></el-table-column>
                <el-table-column prop="earnings" :label="$t('EXPECTED_EARNINGS')" sortable></el-table-column>
                <el-table-column :label="$t('PARTICIPATION_STATE')">
                    <template slot-scope="scope">
                        <span :class="scope.row.coinHoldState=='HOLDED'?'c-blue':scope.row.coinHoldState=='FINISHED'?'c-success':'c-red'">{{scope.row.coinHoldStates}}</span>
                        <el-button type="button" size="mini" class="ml-10" v-if="scope.row.coinHoldState=='HOLDED'" @click="cancelItem(scope.row)">{{'TAKE_OUT'|t}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination layout="prev, pager, next" :current-page="page" :page-size="limit" :total="total" class="pagination" @current-change="handleCurrentChange"
                v-if="total>limit"></el-pagination>
        </div>
    </div>
</template>
<script>
    import { User } from "@/services"
    import { mapState } from 'vuex';
    import { BigNumber } from 'bignumber.js';
    import { Rules } from '@/providers/rules';

    export default {
        data() {
            let _num = (rule, value, callback) => {
                if (this.$C(this.activeCoin.minWithdrawNumber) <= value) {
                    callback();
                } else {
                    callback(new Error(this.$t(this.$t('RECHARGE_LIMIT_TIPS1') + this.$C(this.activeCoin.minWithdrawNumber) + ' ' + this.activeCoin.coinName + this.$t('RECHARGE_LIMIT_TIPS2'))));
                }
            }
            return {
                activeForm: { dealNumber: '' },
                activeCoin: { id: '', enbalance: '' },
                rules: {
                    dealNumber: [
                        { trigger: 'blur', required: true, message: this.$t('NOEMPTY') },
                        ...Rules.num
                    ]
                },
                page: 1,
                limit: 10,
                total: 0,
                loadingBool: false,
                recordOption: {
                    coinId: '',
                    holdState: ''
                },
                rowData: [],
                earningsData: ''
            };
        },
        computed: {
            ...mapState(['coinList'])
        },
        mounted() {
            // this.getBalance();
            if (this.coinList[0].id != '') {//已经请求过的时候,否则在watch里面请求
                this.activeCoin = this.coinList[0];
                this.getData();
                this.UserEarnings();
            }
        },
        methods: {
            async UserEarnings() {
                try {
                    let res = await User.UserEarnings({
                        coinId: this.activeCoin.id
                    });
                    this.earningsData = res.oneData ? res.oneData : '0';
                } catch (error) {
                    console.log(error)
                }
            },
            cancelItem(item) {
                this.$confirm(this.$t('TAKE_OUT_TIP'), this.$t('WARMTIPS'), {
                    confirmButtonText: this.$t('DETERMINE'),
                    cancelButtonText: this.$t('CANCEL'),
                    type: 'warning'
                }).then(async () => {
                    try {
                        let res = await User.CoinHalfwayOut({
                            recordId: item.recordId,
                            holdState: item.coinHoldState
                        });
                        this.SUCCESS(res[this.$l + 'Message']);
                        let stateMap = new Map();
                        stateMap.set('FINISHED', this.$t('COMPLETE')).set('CANCELED', this.$t('HAVE_BEEN_CANCELLED')).set('HOLDED', this.$t('IN_CURRENCY'));
                        item.coinHoldState = 'CANCELED';
                        item.coinHoldStates = stateMap.get(item.coinHoldState);
                    } catch (error) {
                        console.log(error);
                    }
                }).catch(() => {
                    console.log('取消');
                });
            },
            async getData() {
                try {
                    let res = await User.ActivityList({
                        page: this.page,
                        limit: this.limit,
                        coinId: this.recordOption.coinId,
                        coinHoldState: this.recordOption.holdState
                    });
                    let stateMap = new Map();
                    stateMap.set('FINISHED', this.$t('COMPLETE')).set('CANCELED', this.$t('HAVE_BEEN_CANCELLED')).set('HOLDED', this.$t('IN_CURRENCY'));
                    for (let item of res.oneData.list) {
                        item.coinHoldStates = stateMap.get(item.coinHoldState);
                    }
                    this.rowData = res.oneData.list;
                    this.total = res.oneData.total;
                } catch (error) {
                    console.log(error);
                }
            },
            getActive(formName, num) {
                this.$refs[formName].validate(async (valid) => {
                    if (!valid) {
                        return
                    }
                    if (!num) { return false };
                    this.loadingBool = true;
                    try {
                        let res = await User.PartActivity({
                            coinId: this.activeCoin.id,
                            coinNumber: num
                        });
                        this.getData();
                    } catch (error) {
                        console.log(error);
                    }
                    this.loadingBool = false;
                    this.activeForm.dealNumber = '';
                })
            },
            fixeNumber(obj, child, num) {
                let a, b, c;
                if (obj[child].indexOf('.') != -1) {
                    a = obj[child].split(".")
                    if (a[1].length > num) {
                        b = a[1].slice(0, num)
                        c = a[0] + '.' + b
                        this.$set(obj, child, c);
                    }
                } else {
                    b = obj[child].slice(0, 10);
                    this.$set(obj, child, b);
                }
            },
            // 搜索
            search() {
                this.page = 1;
                this.getData();
                // this.getTransferrecord(1)
            },
            // 币种切换
            changeActive(item) {
                this.activeCoin = item;
                this.UserEarnings();
            },
            // currentPage 改变时会触发
            handleCurrentChange(page) {
                this.page = page;
                this.getData();

            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (this.activeRouter == 'WITHDRAW') {
                        this.withdraw();
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        watch: {
            coinList: function (n, o) {
                this.activeCoin = n[0];
                this.getData();
                this.UserEarnings();
            }
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/asset';
    .invite {
        width: $wrapW;
        margin: 0 auto;
        &>div {
            &:nth-of-type(1) {
                width: 500px;
                margin: 80px auto;
                text-align: center;
            }
            .header {
                margin-top: 35px;
                color: #001939;
                font-size: 16px;
                line-height: 58px;
                img {
                    vertical-align: middle;
                    &+span {
                        vertical-align: middle;
                    }
                }
            }
            &>div {
                margin-top: 19px;
            }
        }
    }

    .coin-list-wraps {
        background: white;
        padding-bottom: 30px;
        .send__advert.el-input-group {
            width: 90% !important;
        }
        .input-suffix.flex {
            float: right;
            text-align: right;
        }
    }

    .ml-5 {
        margin-left: 5px;
    }
</style>