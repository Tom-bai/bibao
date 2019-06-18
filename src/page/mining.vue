<template>
    <div class="mining-template">
        <div class="mining-wrap">
            <div class="mining-cont">
                <h3>{{'MINING_PROFIT'|t}}
                    <i class="icon-question" v-tippy='{ interactive : true ,arrow : true, arrowTransform : "scale(0.75)",placement : "bottom-right"}'
                        :title="tip"></i>
                </h3>
                <div class="mining-cont-pos">
                    <el-row>
                        <el-col :span="3">
                            <div class="grid-content pos-left">
                                <ul class="coin-list">
                                    <li class="coin-item" v-for="(item,key) of coinList" :key=key :class="activeCoin.id==item.id?'active':''" @click="setItem(item)">{{item.coinName}}</li>
                                    <!-- <li class="coin-item active">ETC</li>
                                    <li class="coin-item">USDT</li> -->
                                </ul>
                            </div>
                        </el-col>
                        <el-col :span="21">
                            <div class="post-right">
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <div class="grid-content">
                                            <div class="icon-left bg1">
                                                <img src="~@/assets/img/mining-icon6.png" alt="">
                                            </div>
                                            <div class="text-right">
                                                <h3>{{'TODAY_RANKINGS'|t}}</h3>
                                                <p>{{'EXCEED'|t}}{{$C(initData.todayRank)}}%{{'USERSS'|t}}</p>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="grid-content">
                                            <div class="icon-left bg2">
                                                <img src="~@/assets/img/mining-icon1.png" alt="">
                                            </div>
                                            <div class="text-right">
                                                <h3>{{'EVERY_DAY'|t}}{{activeCoin.coinName}}{{'A_BONUS'|t}}</h3>
                                                <p>{{$C(initData.todayBonus)}}{{initData.coinName}}</p>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="grid-content">
                                            <div class="icon-left bg3">
                                                <img src="~@/assets/img/mining-icon3.png" alt="">
                                            </div>
                                            <div class="text-right">
                                                <h3>{{'MY_TRANSACTION_FEE_TODAY'|t}}</h3>
                                                <p>{{$C(initData.todayFee)}}{{activeCoin.coinName}}</p>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <div class="grid-content">
                                            <div class="icon-left bg4">
                                                <img src="~@/assets/img/mining-icon4.png" alt="">
                                            </div>
                                            <div class="text-right">
                                                <h3>{{'PLATFORM_TODAY'|t}}</h3>
                                                <p>{{$C(initData.todayContainer)}}{{activeCoin.coinName}}</p>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="grid-content">
                                            <div class="icon-left bg5">
                                                <img src="~@/assets/img/mining-icon5.png" alt="">
                                            </div>
                                            <div class="text-right">
                                                <h3>{{'DIGS_IN_YESTERDAY'|t}}</h3>
                                                <p>{{$C(initData.yesterdayMine)}}{{initData.coinName}}</p>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="grid-content">
                                            <div class="icon-left bg6">
                                                <img src="~@/assets/img/mining-icon2.png" alt="">
                                            </div>
                                            <div class="text-right">
                                                <h3>{{'MY_YESTERDAY_BONUS'|t}}</h3>
                                                <p>{{$C(initData.yesterdayBonus)}}{{activeCoin.coinName}}</p>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="mining-cont mt-20 pb-20">
            <div class="statistics-title clearfix">
                <div class="fl">
                    <img src="~@/assets/img/solution-icon.png" alt="" class="statistics-icon">
                    <h3>{{'REVENUE_RECORD'|t}}</h3>
                </div>
                <div class="fr">
                    {{'CUMULATIVE_INCOME'|t}}：
                    <span class="text">{{$C(initData.sumIncome)}}</span>{{activeCoin.coinName}}
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" :header-row-class-name="bingHeaderStyle" class="mt-10">
                <el-table-column prop="createDate" :label="$t('DATES')" sortable>
                    <template slot-scope="scope">
                        <el-button type='text'>{{scope.row.createDate}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" :label="$t('DESCRIBE')" sortable></el-table-column>
                <el-table-column :label="initData.coinName+$t('PROFIT')">
                    <template slot-scope="scope">
                        {{$C(scope.row.rebateSumNumber)}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t(activeCoin.coinName)+$t('PROFIT')">
                    <template slot-scope="scope">
                        {{$C(scope.row.coinNumber)}}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :current-page="page" :page-size="limit" :total="total" class="pagination" @current-change="handleCurrentChange"
                v-if="total>limit"></el-pagination>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { BB } from "@/services"
    export default {
        data() {
            return {
                tip: '',
                page: 1,
                limit: 10,
                total: 0,
                activeCoin: {},
                tableData: [],
                initData: {}
            }
        },
        methods: {
            // currentPage 改变时会触发
            handleCurrentChange(page) {
                this.page = page;
                this.searchItem(this.activeCoin);

            },
            setItem(item) {
                this.activeCoin = item;
                this.searchItem(this.activeCoin);
            },
            async searchItem(item) {
                try {
                    let res = await BB.MineList({
                        page: this.page,
                        limit: this.limit,
                        coinId: this.activeCoin.id
                    });
                    this.total = res.oneData.total;
                    this.tip = res.oneData[this.$l + 'Remark'];
                    this.initData = res.oneData;
                    this.tableData = res.oneData.list;
                } catch (error) {
                    console.log(error);
                }
            }
        },
        watch: {
            coinList: function (n, o) {
                this.activeCoin = n[0];
                this.searchItem(this.activeCoin);
            }
        },
        mounted() {
            if (this.coinList[0].id != '') {
                this.activeCoin = this.coinList[0];
                this.searchItem(this.activeCoin);
            }
        },
        computed: {
            ...mapState(['coinList']),
            bingHeaderStyle() {
                return 'bindHeaderClassName';
            }
        },
    }
</script>
<style scoped lang="scss">
    @import '../assets/sass/mining.scss';
</style>