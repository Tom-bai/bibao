<template>
    <div class="content order-detail-cont">
        <div class="order-detail">
            <div class="text-r">
                <a href="javascript:;" @click="$router.push('/order/c2b')" class="c-blue">{{'RETURN_C2C_ORDER'|t}}>></a>
            </div>
            <div class="order-conts">
                <div class="order-state">
                    <i class="icon" :class='bindClass()'></i>
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
                            <div class="grid-content">{{'TRADING_NUMBER'|t}}：{{infoData.orderNo}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TRANSACTION_OBJECT'|t}}：{{infoData.nickname}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TRADING_HOURS'|t}}：{{infoData.createDate}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'COINTYS'|t}}：{{infoData.coinName}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <!-- CTB_TRAN_BUY -->
                            <div class="grid-content">
                                <span v-if="infoData.type=='CTB_TRAN_BUY'">{{'PAGEMENT_METHOD'|t}}</span>
                                <span v-else>{{'PAGEMENT_METHODS'|t}}</span>：{{infoData.payType|t}} </div>
                        </el-col>
                        <!-- payType -->
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'NUM'|t}}：{{$C(infoData.amount)}}{{infoData.coinName}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'ACCOUNT'|t}}：{{infoData.code}}</div>
                        </el-col>
                        <!-- 银行卡 -->
                        <el-col :span="12" class="order-item" v-if="infoData.payType=='UNIONPAY'">
                            <!-- CTB_TRAN_BUY -->
                            <div class="grid-content">
                                {{'ADDRESS'|t}}：{{infoData.address}}
                            </div>
                        </el-col>
                        <el-col :span="12" class="order-item" v-if=" infoData.state == 'CTB_CANCEL'">  
                            <div class="grid-content">{{'AUDIT_STATUS'|t}}: {{ infoData.reason}}</div>
                        </el-col>
                        <!-- v-if=" infoData.state == 'CTB_CANCEL'" -->
                        <el-col :span="12" class="order-item" v-if=" infoData.state == 'CTB_CANCEL'">  
                            <div class="grid-content">{{'AUDIT_STATUS'|t}}: {{ infoData.reason}}</div>
                        </el-col>
                        <el-col :span="12" class="order-item" v-if=" infoData.state == 'CTB_CANCEL'">  
                            <div class="grid-content">{{'AUDIT_STATUS'|t}}: {{ infoData.reason}}</div>
                        </el-col>
                        <el-col :span="12" class="order-item" v-if=" infoData.state == 'CTB_CANCEL'">  
                            <div class="grid-content">{{'AUDIT_STATUS'|t}}: {{ infoData.reason}}</div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
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
                stateData: []
            };
        },
        methods: {
            bindClass() {
                let _state = this.infoData.state;
                return _state == 'CTB_DONE' ? 'icon-success' : _state == 'CTB_UNDO' || _state == 'CTB_CANCEL' ? 'icon-error' : 'icon-info';
            },
            getData() {
                this.OrderInfo();
            },
            async OrderInfo() {
                try {
                    let res = await Order.TransactionInfo({
                        id: this.$route.query.id
                    });
                    this.infoData = res.data;
                    let stateMap = new Map();
                    stateMap.set('CTB_DONE', this.$t('ADOPT')).set('CTB_CANCEL', this.$t('REFUSE')).set('CTB_GOON', this.$t('CHECKING')).set('CTB_UNDO', this.$t('CANCELED'));
                    this.infoData.states = stateMap.get(this.infoData.state);
                } catch (error) {
                    console.log(error);
                }
            },
            async stateList() {
                try {
                    let res = await Order.StateList();
                    this.stateData = res.listData;
                    this.OrderInfo();
                } catch (error) {
                    console.log(error)
                }
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