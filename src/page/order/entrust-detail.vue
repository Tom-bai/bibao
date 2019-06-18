<template>
    <div class="content order-detail-cont clearfix">
        <div class="order-detail">
            <div class="text-r">
                <a href="javascript:;" @click="$router.push('/order/entrust')" class="c-blue">{{'RETURN_ORDER_ENSTRUST'|t}}>></a>
            </div>
            <div class="order-conts">
                <div class="order-state">
                    <i class="icon"></i>
                    <h3>{{infoData.states}}</h3>
                </div>
                <!-- <div class="order-state">
                    <i class="icon icon-error"></i>
                    <h3>出售失败</h3>
                </div> -->
            </div>
            <el-row class="order-info">
                <el-col :span="20" :offset="2">
                    <el-row>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'ENTRUSTPRICE'|t}} : {{$C(infoData.entrustPrice)}}</div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'ENTRUSTNUM'|t}} : {{$C(infoData.entrustNum)}} {{infoData.productCoinName}}</div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TRADE_TIME'|t}}：{{infoData.createDate}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'COINTYS'|t}}：{{infoData.productCoinName}}/{{infoData.priceCoinName}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'CLINCH'|t}}：{{$C(infoData.dealNum)}}{{infoData.productCoinName}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TOTAL_ENTRUSTMENT'|t}}：{{$C(infoData.entrustNum*infoData.entrustPrice)}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'POUNDAGE'|t}}：{{$C(infoData.poundage)}} {{infoData.poundageCoin}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'DEDUCTIBLE_STATE'|t}}：{{infoData.deductState=='Y'?$t('YES'):$t('NO')}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item"  v-if="infoData.deductState=='Y'">
                            <div class="grid-content">{{'AMOUNT_OF_DEDUCTIBLE'|t}}：{{$C(infoData.deductedNum)}}{{infoData.deductionCoin}} </div>
                        </el-col>
                        <!--  -->
                    </el-row>
                </el-col>
            </el-row>
            <div class="clearfix">
                <el-col :span="20" :offset="2" class="mt-20 clearfix">
                    <el-row>
                        <el-table :data="tableData" style="width: 100%" height="300px">
                            <el-table-column prop="createDate" :label="$t('ENTRUS_TIME')" sortable width="180"></el-table-column>
                            <el-table-column prop="" :label="$t('CURRENCY')" sortable width="100">
                                <template slot-scope="scope">
                                    {{infoData.productCoinName}}/{{infoData.priceCoinName}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" :label="$t('ORDER_TYPER')" sortable width="100">
                                <template slot-scope="scope">
                                    {{scope.row.type|t}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="poundage" :label="$t('SERVER_CHARGE')" sortable width="100">
                                <template slot-scope="scope">
                                    {{$C(scope.row.poundage)}}{{scope.row.poundageCoin}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="unitPrice" :label="$t('UNITPRICE')" sortable>
                                <template slot-scope="scope">
                                    {{$C(scope.row.unitPrice)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="totalProductNum" :label="$t('QUANTITY_SOLD')" sortable></el-table-column>
                            <el-table-column :label="$t('TOTALPRICE')" sortable>
                                <template slot-scope="scope">
                                    {{$C(scope.row.totalPrice)}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <div class="block text-c mt-10 mb-10">
                            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="limit"
                                :total="total">
                            </el-pagination>
                        </div> -->
                    </el-row>
                </el-col>
            </div>
        </div>
    </div>
</template>
<script>
    import { C2c, Order } from '@/services';
    import { Func } from '@/providers';
    export default {
        data() {
            return {
                infoData: {},
                lang: Func.getCookie('lang'),
                stateData: [],
                page: 1,
                limit: 10,
                total: 0,
                tableData: []
            };
        },
        methods: {
            // bindClass() {
            //     let _state = this.infoData.state;
            //     return _state == 'DONE' ? 'icon-success' : _state == 'CANCEL' || _state == 'AUTO_CANCEL' ? 'icon-error' : 'icon-info';
            // },
            handleCurrentChange(val) {
                this.page = val;
                // this.getList(this.coinItem)
            },
            async BbCenterUserEntrustDetail() {
                try {
                    let res = await Order.BbCenterUserEntrustDetail({
                        entrustId: this.$route.query.id
                    });
                    this.infoData = res.oneData;
                    let stateMap = new Map();
                    let typeMap = new Map();
                    stateMap.set('ACTIVE', this.$t('COMMISSIONED')).set('CALCEL', this.$t('UNDO')).set('DONE', this.$t('COMPLETE'));
                    typeMap.set('SELL', this.$t('SELLS')).set('BUY', this.$t('BUY'));
                    let item = this.infoData;
                    item.states = stateMap.get(item.state);
                    item.types = typeMap.get(item.type);
                } catch (error) {
                    console.log(error);
                }
            },
            async BbCenterUserOrders() {
                try {
                    let res = await Order.BbCenterUserOrders({
                        entrustId: this.$route.query.id
                    })
                    this.tableData= res.data.orders;
                } catch (error) {
                    console.log(error)
                }
            },
            async getData() {
                this.BbCenterUserEntrustDetail();
                this.BbCenterUserOrders();
            },
        },
        created() {
            this.getData();
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/order.scss';
</style>