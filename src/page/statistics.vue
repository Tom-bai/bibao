<template>
    <div class="statistics-cont">
        <div class="statistics-title">
            <img src="~@/assets/img/statistics-icon.png" alt="" class="statistics-icon">
            <h3>{{'MONEY_HOLDING_STATISTICS'|t}}</h3>
        </div>
        <div class="map-box clearfix mb-20">
            <div class="map-box-left">
                <img src="../assets/img/asset-map.png" alt="">
            </div>
            <div class="map-box-right">
                <!-- <el-row>
                    <el-col :span="8">
                        <div class="grid-content text-c">
                            <canvasCircle :text="coinUserCountData[0].userSumNum+$t('PEOPLE')" :coinName="coinUserCountData[0].coinName" iconURL="../../static/first.png"
                                maskColor="#FA595F" :percentage='coinUserCountData[0].userSumRatio*100'></canvasCircle>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content text-c">
                            <canvasCircle :text="coinUserCountData[1].userSumNum+$t('PEOPLE')" :coinName="coinUserCountData[1].coinName" iconURL="../../static/second.png"
                                maskColor="#FEA20A" :percentage='coinUserCountData[1].userSumRatio*100'></canvasCircle>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content text-c">
                            <canvasCircle :text="coinUserCountData[2].userSumNum+$t('PEOPLE')" :coinName="coinUserCountData[2].coinName" iconURL="../../static/three.png"
                                maskColor="#FED530" :percentage='coinUserCountData[2].userSumRatio*100'></canvasCircle>
                        </div>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="8" v-for='(item,key) of data1' :key="key">
                        <div class="grid-content text-c">
                            <canvasCircle :text="item.userSumNum+$t('PEOPLE')" :coinName="item.coinName" :iconURL="item.iconURL" :maskColor="item.maskColor"
                                :percentage='item.userSumRatio*100'></canvasCircle>
                        </div>
                    </el-col>
                </el-row>
                <!-- <el-row class="mt-20">
                    <el-col :span="8">
                        <div class="grid-content text-c">
                            <canvasCircle :text="coinUserCountData[3].userSumNum+$t('PEOPLE')" :coinName="coinUserCountData[3].coinName" maskColor="#0FCD84"
                                :percentage='coinUserCountData[3].userSumRatio*100'></canvasCircle>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content text-c">
                            <canvasCircle :text="coinUserCountData[4].userSumNum+$t('PEOPLE')" :coinName="coinUserCountData[4].coinName" maskColor="#0097FE"
                                :percentage='coinUserCountData[4].userSumRatio*100'></canvasCircle>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content text-c">
                            <canvasCircle :text="coinUserCountData[5].userSumNum+$t('PEOPLE')" :coinName="coinUserCountData[5].coinName" maskColor="#6F53DE"
                                :percentage='coinUserCountData[5].userSumRatio*100'></canvasCircle>
                        </div>
                    </el-col>
                </el-row> -->
                <el-row class="mt-20">
                    <el-col :span="8" v-for="(item,key) of canvasCircleData" :key='key' class="mb-20" v-if="item.userSumRatio!=0">
                        <div class="grid-content text-c">
                            <canvasCircle :text="item.userSumNum+$t('PEOPLE')" :coinName="item.coinName" :maskColor="item.maskColor" :percentage='item.userSumRatio*100'></canvasCircle>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="statistics-title mt-20 mb-20">
            <img src="~@/assets/img/ranking-icon.png" alt="" class="statistics-icon">
            <h3>{{'TRADE_RANKINGS'|t}}(TOP100)</h3>
        </div>
        <el-table :data="tableData" style="width: 100%" :header-row-class-name="bingHeaderStyle">
            <el-table-column :label="$t('RANKING')">
                <template slot-scope="scope">
                    <span class="table--text">{{scope.row.index}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="nickName" :label="$t('USER_ACC')">
            </el-table-column>
            <el-table-column prop="tradeSumPrice" :label="$t('VOLUME_OF_TRANSACTION')+'（'+$t('DEPRECIATION_OF_RMB')+'）'">
                <template slot-scope="scope">
                    {{$M(scope.row.tradeSumPrice)}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next"
            :total="total" class="pagination mt-20" v-if="total>pageSize">
        </el-pagination>
    </div>
</template>
<script>
    import canvasCircle from '@/components/canvasCircle';
    import { BB } from '@/services';
    export default {
        data() {
            return {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                coinUserCountData: [],
                tableData: [],
                totalData: [],
                canvasCircleData: [],
                data1: []
            }
        },
        components: {
            canvasCircle
        },
        computed: {
            bingHeaderStyle() {
                return 'bindHeaderClassName';
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.getTabeleData(val, this.pageSize)
            },
            getTabeleData(currentPages, pageSize) {
                this.tableData = this.totalData.slice((currentPages - 1) * pageSize, currentPages * pageSize);
            },
            async getData() {
                try {
                    let res = await BB.GetCoinUserCount({});
                    let _datas = res.data.coinUserCountData
                    this.data1 = _datas.slice(0, 3);
                    this.data1.forEach((ele, key) => {
                        if (key == '0') {
                            ele.iconURL = '../../static/first.png';
                            ele.maskColor = '#FA595F';
                        } else if (key == '1') {
                            ele.iconURL = '../../static/second.png';
                            ele.maskColor = '#FEA20A';
                        } else {
                            ele.iconURL = '../../static/three.png';
                            ele.maskColor = '#FED530';
                        }
                    });
                    this.canvasCircleData = _datas.slice(3, _datas.length);
                    this.canvasCircleData.forEach((eles, key) => {
                        if (key == '0') {
                            eles.maskColor = '#0FCD84';
                        } else if (key == '1') {
                            eles.maskColor = '#0097FE';
                        } else if (key == '3') {
                            eles.maskColor = '#6F53DE';
                        } else {
                            eles.maskColor = '#03A9F4';
                        }
                    })
                    this.total = res.data.coinUserTradeRankTotal;
                    this.totalData = res.data.coinUserTradeRankData;
                    this.totalData.map((item, key) => item.index = key + 1);
                    this.getTabeleData(this.currentPage, this.pageSize)
                } catch (error) {
                    console.log(error);
                }
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>
<style scoped lang="scss">
    @import '../assets/sass/statistics.scss';
    .table--text {
        padding: 2px 16px;
        border-radius: 2px;
        background: #F6F7FC;
        display: inline-block;
        font-size: 14px;
    }
</style>