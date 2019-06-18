<template>
    <div class="content order-detail-cont">
        <div class="order-detail">
            <div class="text-r">
                <a href="javascript:;" @click="$router.push('/order')" class="c-blue">{{'RETURN_C2B_ORDER'|t}}>></a>
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
                            <div class="grid-content">{{'TRADING_NUMBER'|t]}}：{{infoData.orderNo}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TRANSACTION_OBJECT'|t}}：{{infoData.username}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TRADING_HOURS'|t}}：{{infoData.createDate}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'COINTYS'|t}}：{{infoData.coinName}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'PAGEMENT_METHODS'|t}}：{{infoData.payType}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'NUM'|t}}：{{infoData.dealNumber}}{{infoData.coinName}} </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'ACCOUNT'|t}}：{{infoData.payCode}}</div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TRANSACTION_AMOUNT'|t}}{{infoData.price}}CNY </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TRANSACTION_AMOUNT'|t}}{{infoData.price}}CNY </div>
                        </el-col>
                        <el-col :span="12" class="order-item">
                            <div class="grid-content">{{'TRANSACTION_AMOUNT'|t}}{{infoData.price}}CNY </div>
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
                return _state == 'DONE' ? 'icon-success' : _state == 'CANCEL' || _state == 'AUTO_CANCEL' ? 'icon-error' : 'icon-info';
            },
            getData() {
                this.stateList();
            },
            async OrderInfo() {
                try {
                    let res = await C2c.OrderInfo({
                        orderId: this.$route.query.id
                    });
                    this.infoData = res.oneData;
                    let stateMap = new Map();
                    for (let items of this.stateData) {
                        stateMap.set(items.value, items[this.lang + 'Name']);
                    }
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