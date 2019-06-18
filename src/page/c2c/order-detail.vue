<template>
        <div class="sale-template">
            <el-row class="box-flex">
                <el-col :span="12">
                    <div class="grid-content">
                        <!-- <div class="box-flex sale-verif-cont">
                            <div class="sale-verif"></div>
                            <div class="flex">
                                <p>{{initData.entrust.username}}</p>
                                <p>{{'TRADER_NUM'	}} : {{initData.count}}</p>
                            </div>
                        </div> -->
                        <p>{{'Ad_Details'|t}}：</p>
                        <div class="sale-list" style="justify-content:flex-start">
                            <div class="sale-item">
                                <h3>{{'COINTYS'|t}}</h3>
                                <div class="sale-item-desc">{{initData.coinName}}</div>
                            </div>
                            <div class="sale-item">
                                <h3>{{'ADVERT_PRICE'|t}}</h3>
                                <div class="sale-item-desc">
                                    <!-- PCHY/ -->
                                    <span>{{$C(initData.price)}}</span> {{initData.coinName}}</div>
                            </div>
                            <!-- <div class="sale-item">
                                <h3>{{'PREMIUM'|t}}</h3>
                                <div class="sale-item-desc">
                                    <span>{{initData.discussPrice}}%</span>
                                </div>
                            </div> -->
                            <div class="sale-item">
                                <h3>{{'QUANTITY_SOLD'|t}}</h3>
                                <div class="sale-item-desc">{{$C(initData.dealDoneNumber)}}</div>
                            </div>
                            <div class="sale-item">
                                <h3>{{'TRADE_QUOTAS'|t}}</h3>
                                <div class="sale-item-desc">
                                    <span>{{$C(initData.minLimitPrice)}}-{{$C(initData.maxLimitPrice)}}</span>
                                    {{initData.coinName}}</div>
                            </div>
                            <div class="sale-item">
                                <h3>{{'QUANTITY_SOLDS'|t}}</h3>
                                <div class="sale-item-desc">
                                    <span>{{$C(initData.usableNumber)}}</span> {{initData.coinName}}</div>
                            </div>
                            <div class="sale-item">
                                <h3>{{'PAYMENT_TERM'|t}}</h3>
                                <div class="sale-item-desc">
                                    <span>{{'THIRDMIN'|t}}</span>
                                </div>
                            </div>
                            <div class="sale-item">
                                <h3>{{'PAGEMENT_METHOD'|t}}</h3>
                                <div class="sale-item-desc">
                                    <i class="icon" v-if="initData.payType.indexOf(',')== -1" :class="initData.payType"></i>
                                    <i class="icon" v-else v-for="(item,key) of initData.payType.split(',')" :key=key :class="item"></i>
                                </div>
                            </div>
                            <div class="sale-item">
                                <h3>{{'TRADING_STATE'|t}}</h3>
                                <div class="sale-item-desc">
                                    <span v-if="initData.state=='GO_ON'">{{'COMMISSIONED'|t}}</span>
                                    <span v-if="initData.state=='END'">{{'UNDO'|t}}</span>
                                    <span v-if="initData.state=='DONE'">{{'COMPLETE'|t}}</span>
                                    <span v-if="initData.state=='CLOSE'">{{'AUTOMATIC_REVOCATION'|t}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="11" :offset="1">
                    <div class="grid-content textarea-wrap">
                        <h3>{{'AD_MESSAGE'|t}}：</h3>
                        <!-- <div class="textareaValue">在线中，可以联系我，支付宝微信，转账勿必备注*相关信息</div> -->
                        <div class="textareaValue">{{initData.remark}}</div>
                    </div>
                </el-col>
            </el-row>
            <div class="border"></div>
            <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
                <el-table-column :label="$t('TRANSACTION_OBJECT')" width="200">
                    <template slot-scope="scope">
                        <div class="user-verif">
                            {{scope.row.username}}</div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('TRADE_TIME')" prop="createDate"> </el-table-column>
                <el-table-column :label="$t('TRANSACTION_PRICE')" prop="price">
                    <template slot-scope="scope">
                        {{$C(scope.row.price)}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('NUM')" prop="dealNumber">
                    <template slot-scope="scope">
                        {{$C(scope.row.dealNumber)}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('SERVER_CHARGE')" prop="ratio">
                    <template slot-scope="scope">
                        {{$C(scope.row.ratio)}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('TRADE_NUMBES')" prop="totalPrice">
                    <template slot-scope="scope">
                        {{$C(scope.row.totalPrice)}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('STATUS')" prop="states"></el-table-column>
            </el-table>
            <div class="block text-c mt-10 mb-10">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="limit"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </template>
    <script>
        import userMask from '@/components/mask';
        import { Rules } from '@/providers/rules';
        import { Coins, C2c } from '@/services';
        export default {
            data() {
                return {
                    defaultKey: '0',
                    textareaValue: '',
                    showBool: false,
                    limit: 10,
                    page: 1,
                    total: 0,
                    tableData: [],
                    subForm: {
                        num: '',
                        count: ''
                    },
                    rules: Rules,
                    ruleForm: {
                        price: '10',
                        dealNum: '',
                        tradePassword: ''
                    },
                    initData: {
                        payType: ''
                    },
                    payInfo: {},
                    payInfoItem: {}
                };
            },
            components: { userMask },
            methods: {
                handleCurrentChange(val) {
                    this.page = val;
                    this.EntrustDetailInfo()
                },
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                },
                async EntrustStateList() {
                    try {
                        let res = await C2c.EntrustStateList({});
                        this.payInfo = res.data.payType;
                        this.EntrustDetailInfo();
                    } catch (error) {
                        console.log(error);
                    }
                },
                async EntrustDetailInfo() {
                    try {
                        let res = await C2c.EntrustDetailInfo({
                            limit: this.limit,
                            page: this.page,
                            entrustId: this.$route.query.id
                        });
                        this.initData = res.oneData;
                        this.tableData = res.oneData.list;
                        this.total = res.oneData.total;
                        // DONE  DISPUTE_PAY   已完成
                        // CANCEL  AUTO_CANCEL DISPUTE_REFUND 失败
                        // WAIT_BUY_PAY WAIT_SELL_CONFIRM DISPUTE_GO_ON 处理中
                        for (let item of this.tableData) {
                            if (item.state == 'DONE' || item.state == 'DISPUTE_PAY') {
                                item.states = this.$t('COMPLETE');
                            } else if (item.state == 'CANCEL' || item.state == 'AUTO_CANCEL' || item.state == 'DISPUTE_REFUND') {
                                item.states = this.$t('FAILT');
                            } else {
                                item.states = this.$t('TREATED_IMG');
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
                // 获取初始化数据
                getData() {
                    this.EntrustStateList();
                }
            },
            created() {
                this.getData();
            }
        };
    </script>
    <style lang="scss" scoped>
        @import '~@/assets/sass/c2c';
        .sale-template .sale-list .sale-item {
            margin-right: 5px;
        }
    </style>