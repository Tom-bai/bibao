<template>
    <div class="trade-right fullPage" ref="fullPage">
        <el-row class="kline-wrap" ref="klineWrap">
            <el-col :span="19">
                <div class="grid-content">
                    <!--头部 -->
                    <div class="trade-right-top box-flex">
                        <div class="top-item flex" style="position: relative;justify-content: left;padding-left: 30px;" @mouseover="showBool=true"
                            @mouseout="showBool=false">
                            <img :src="imgPath+tradeCoinItem.productCoinImg" alt="" class="top-item-logo" style="height: 35px;width: 35px;border-radius: 35px;margin-right: 5px;cursor: pointer;">
                            <span>{{tradeCoinItem.productCoinCore}}/{{tradeCoinItem.priceCoinCore}}</span>
                            <span class="triangle"></span>
                            <transition name="slide-fade">
                                <div class="coin-fix-box" v-show="showBool">
                                    <div class="block-coin">
                                        <a href="javascript:;" v-for="(item,key) of blockList" :key=key class="coin-item" :class="activeBlock.blockId==item.blockId?'active':''"
                                            @click="changeActive(item)" v-text="$l=='en'?item[$l+'BlockName']:item['blockName']"></a>
                                    </div>
                                    <div class="price-coin">
                                        <a href="javascript:;" v-for="(item,key) of coinDataList" :key=key class="coin-item" @click="rowClick(item)">
                                            <img :src="imgPath+item.productCoinImg" alt="" class="item-logo">
                                            <span>{{item.productCoinCore}} / {{item.priceCoinCore}}</span>
                                        </a>
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <div class="top-item flex">
                            <h3 class="top-item-title" :class="tradeCoinItem.riseAndFall>0?'c-red':tradeCoinItem.riseAndFall<0?'c-success':''">{{$C(tradeCoinItem.latestPrice)}}</h3>
                            <!-- <p>≈5590.5CNY</p> -->
                            <p>{{'LATESTPRICE'|t}}</p>
                        </div>
                        <div class="top-item flex">
                            <h3 class="top-item-title" :class="tradeCoinItem.riseAndFall>0?'c-red':tradeCoinItem.riseAndFall<0?'c-success':''">{{$M(tradeCoinItem.riseAndFall)}}%</h3>
                            <p>{{'RISEANDFALL'|t}}</p>
                        </div>
                        <div class="top-item flex">
                            <h3 class="top-item-title c-red">{{$C(tradeCoinItem.highestPrice)}}</h3>
                            <p>{{'HIGHESTPRICE'|t}}</p>
                        </div>
                        <div class="top-item flex">
                            <h3 class="top-item-title c-success">{{$C(tradeCoinItem.lowestPrice)}}</h3>
                            <p>{{'LOWESTPRICE'|t}}</p>
                        </div>
                        <div class="top-item flex">
                            <h3 class="top-item-title c-info">{{$C(tradeCoinItem.tradingVolume)}} {{tradeCoinItem.productCoinCore}}</h3>
                            <p>{{'TRADINGVOLUME'|t}}</p>
                        </div>
                    </div>
                    <!-- k线图 -->
                    <!-- <div class="kline-component" style="z-index:9999;position:fixed;left: 0;right: 0;top: 0;bottom: 0;"> -->
                    <div class="kline-component" ref="kline">
                        <!-- <iframe :src="klineSrc" frameborder="0" style="height: 100%;width:100%"></iframe> -->
                        <iframe :src="'/static/kline/index.html?lang='+lang+'&symbol='+tradeCoinItem.productCoinId+'-'+tradeCoinItem.priceCoinId"
                            frameborder="0" style="height: 100%;width:100%"></iframe>
                    </div>
                </div>
            </el-col>
            <el-col :span="5" style="overflow: hidden;">
                <div class="grid-content">

                    <!-- 平台出售订单 -->
                    <div class="trade-list">
                        <div class="trade-item title">
                            <div class="trade-info">{{'TYPE'|t}}</div>
                            <div class="trade-info">{{'ADVERT_PRICE'|t}}( {{tradeCoinItem.priceCoinCore}} )</div>
                            <div class="trade-info">{{'NUMS'|t}}( {{tradeCoinItem.productCoinCore}} )</div>
                        </div>
                    </div>
                    <div class="trade-list list list-sell">
                        <div class="trade-item" v-for="(item,key) of sellData" :key=key @click="buyForm.entrustPrice=item.entrustPrice">
                            <div class="trade-info">{{'SELLS'|t}}{{sellData.length - key}}</div>
                            <!-- <div class="trade-info">{{item.entrustPrice|Fixed(tradePairsData.priceLimit)}}</div> -->
                            <div class="trade-info">{{$C(item.entrustPrice)}}</div>
                            <div class="trade-info trade-info-bar">
                                <!-- <span class="bar-text">{{item.entrustNum|Fixed(tradePairsData.productLimit)}}</span> -->
                                <span class="bar-text">{{$C(item.entrustNum)}}</span>
                                <div class="bar">
                                    <span :style="'width: '+item.maxPs+'%'"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="trade-now-price">
                        <span>{{'NOWPRICE'|t}}：</span>
                        <span class="c-red">1 </span>
                        <span>{{tradeCoinItem.productCoinCore}} </span>
                        <span class="c-info">≈{{CNYData}}CNY</span>
                    </div> -->
                    <!-- 最新汇率 -->
                    <div class="trade-now-price">
                        <span>{{'NOWPRICE'|t}}：</span>
                        <span class="c-red">1 </span>
                        <span>{{tradeCoinItem.productCoinCore}} </span>
                        <span class="c-info">≈{{CNYData}}CNY</span>
                    </div>

                    <!-- 平台收购订单 -->
                    <div class="trade-list">
                        <div class="trade-item title">
                            <div class="trade-info">{{'TYPE'|t}}</div>
                            <div class="trade-info">{{'ADVERT_PRICE'|t}}( {{tradeCoinItem.priceCoinCore}} )</div>
                            <div class="trade-info">{{'NUMS'|t}}( {{tradeCoinItem.productCoinCore}} )</div>
                        </div>
                    </div>
                    <div class="trade-list list list-buy">
                        <div class="trade-item" v-for="(item,key) of buyData" :key=key @click="sellForm.entrustPrice=item.entrustPrice">
                            <div class="trade-info">{{'BUY'|t}}{{key+1}}</div>
                            <div class="trade-info">{{$C(item.entrustPrice)}}</div>
                            <div class="trade-info trade-info-bar">
                                <span class="bar-text">{{$C(item.entrustNum)}}</span>
                                <div class="bar">
                                    <span :style="'width: '+item.maxPs+'%'"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 平台订单交易行情 -->
                    <div class="trade-list">
                        <div class="trade-item title">
                            <div class="trade-info">{{'TYPE'|t}}</div>
                            <div class="trade-info">{{'ADVERT_PRICE'|t}}({{tradeCoinItem.priceCoinCore}})</div>
                            <div class="trade-info">{{'NUMS'|t}}({{tradeCoinItem.productCoinCore}})</div>
                            <div class="trade-info">{{'TIME'|t}}</div>
                        </div>
                    </div>
                    <div class="trade-list scroll-list ">
                        <div class="trade-item" v-for="(item,key) of marketOrders" :key=key :class="item.type=='SELL'?'sell':'buy'">
                            <div class="trade-info">
                                <span>{{item.type=='SELL'?$t('SELLS'):$t('BUY')}}</span>
                            </div>
                            <div class="trade-info">{{$C(item.unitPrice)}}</div>
                            <div class="trade-info">{{$C(item.totalNum)}}</div>
                            <div class="trade-info">{{item.createDate|Format('hh:mm:ss')}}</div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- sale -->
        <div class="sale-cont " ref="sale">
            <el-row class="" style="height: 100%;">
                <el-col :span="15 " class="full-page-table">
                    <div class="grid-content">
                        <div class="switch-tab clearfix">
                            <a href="javascript:;" class="tab-item" v-for='item of tabData' :key=item.id :class="defaultIndex==item.id?'active':''" @click="clickFn(item)">{{item.name}}</a>
                            <div class="block text-c float-r" style="vertical-align: middle" v-show="total>limit">
                                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="limit"
                                    :total="total">
                                </el-pagination>
                            </div>
                            <!-- <a href="javascript:;" class="tab-item">历史委托</a> -->
                        </div>
                        <!-- 当前委托 -->
                        <el-table :data="entrustData" style="width: 100%;" v-show="defaultIndex=='changeUserEntrustNum'" size="mini" height="240">
                            <!-- <div slot="empty" class="empty-text">
                                    详情请先
                                    <span class="c-blue">登录</span>或
                                    <span class="c-blue">注册</span>
                                </div> -->
                            <el-table-column prop="createDate" :label="$t('ENTRUS_TIME')" width="180">
                                <template slot-scope="scope">
                                    {{scope.row.createDate|Format}}
                                </template>
                                <!-- Format('hh:mm:ss') -->
                            </el-table-column>
                            <el-table-column prop="type" :label="$t('TYPE')">
                                <template slot-scope="scope">
                                    {{$t(scope.row.type)}}
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('CLINCH')">
                                <template slot-scope="scope">
                                    {{$C(scope.row.dealNum)}}
                                    <!-- |Fixed(tradePairsData.productLimit) -->
                                </template>
                            </el-table-column>
                            <!-- dealNum -->
                            <el-table-column :label="$t('AMOUNT')">
                                <template slot-scope="scope">
                                    {{$C(scope.row.entrustNum)}}
                                    <!-- |Fixed(tradePairsData.productLimit) -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('ADVERT_PRICE')">
                                <template slot-scope="scope">
                                    {{$C(scope.row.entrustPrice)}}
                                    <!-- |Fixed(tradePairsData.priceLimit) -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('TOTAL_ENTRUSTMENT')">
                                <template slot-scope="scope">
                                    {{$C(scope.row.entrustNum*scope.row.entrustPrice)}}
                                    <!-- |Fixed(tradePairsData.priceLimit) -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('STATUS')">
                                <!--  prop="state" -->
                                <template slot-scope="scope">
                                    <span>{{'COMMISSIONED'|t}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" :label="$t('OPERATION')">
                                <template slot-scope="scope">
                                    <el-button type='text' @click="cancelItem(scope.row.id)">{{'UNDO'|t}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <!-- 历史委托 -->
                        <el-table :data="historyData" style="width: 100%" v-show="defaultIndex=='changeUserOrdersNum'" size="mini" height="240">
                            <!-- <div slot="empty" class="empty-text">
                                    详情请先
                                    <span class="c-blue">登录</span>或
                                    <span class="c-blue">注册</span>
                                </div> -->
                            <el-table-column prop="createDate" :label="$t('DEAL_TIME')" width="180">
                                <template slot-scope="scope">
                                    {{scope.row.createDate|Format}}
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('TYPE')">
                                <template slot-scope="scope">
                                    {{$t(scope.row.type)}}
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('AMOUNT')">
                                <template slot-scope="scope">
                                    {{$C(scope.row.totalNum)}}
                                    <!-- |Fixed(tradePairsData.priceLimit) -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('ADVERT_PRICE')">
                                <template slot-scope="scope">
                                    {{$C(scope.row.unitPrice)}}
                                    <!-- |Fixed(tradePairsData.priceLimit) -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('TRANSACTION_ACCOUNT')">
                                <template slot-scope="scope">
                                    {{$C(scope.row.totalPrice)}}
                                    <!-- |Fixed(tradePairsData.priceLimit) -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('STATUS')">
                                <template slot-scope="scope">
                                    <span>{{'CLINCH'|t}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>

                <!-- 买 -->
                <el-col :span="9" class="box-flex full-page-trade">
                    <div class="grid-content flex mr-10">
                        <div class="sale-title">{{'AVALIABLE'|t}}
                            <span class="c-red" v-if="UserBalance.priceCoinPrice||UserBalance.priceCoinPrice=='0'">{{$C(UserBalance.priceCoinPrice)}}{{tradeCoinItem.priceCoinCore}}</span>
                            <span class="c-red" v-else>--{{tradeCoinItem.priceCoinCore}}</span>
                        </div>
                        <div class="form-wrap">
                            <el-form :model="buyForm" :rules="rules" ref="buyForm" class="demo-ruleForm">
                                <el-form-item prop="entrustPrice">
                                    <el-input v-model="buyForm.entrustPrice" :placeholder="$t('BUY_PLACE')" class="c2b-input" @change="setSlider('buySlider','buyForm',UserBalance.priceCoinPrice)">
                                        <span slot="prefix" class="c2b-input-text-left">{{'BUY_PRICE'|t}}</span>
                                        <span slot="suffix" class="c2b-input-text">{{tradeCoinItem.priceCoinCore}}</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="entrustNum">
                                    <el-input v-model="buyForm.entrustNum" :placeholder="$t('BUY_IN_NUM_PLACE')" class="c2b-input" @change="setSlider('buySlider','buyForm',UserBalance.priceCoinPrice)">
                                        <span slot="prefix" class="c2b-input-text-left">{{'BUY_IN_NUM'|t}}</span>
                                        <span slot="suffix" class="c2b-input-text">{{tradeCoinItem.productCoinCore}}</span>
                                    </el-input>
                                </el-form-item>
                                <div class="box-flex sale-slider">
                                    <div class="flex mr-20">
                                        <el-slider v-model="buySlider" :step="5" show-stops class="red-bar" @change="setTradeNum('buySlider','buyForm',UserBalance.priceCoinPrice)">
                                        </el-slider>
                                    </div>
                                    <span class="ml-10">{{buySlider|Fixed(tradePairsData.priceLimit)}}%</span>
                                </div>
                                <div class="clearfix mt-10 sale-desc">
                                    <p class="float-l">{{'EXPECTED_TRANSACTION'|t}}：
                                        <span class="c-red">{{buyTotal}}</span> {{tradeCoinItem.priceCoinCore}}</p>
                                    <span class="float-r">{{'SERVER_CHARGE'|t}}：{{fee(tradePairsData.productCoinScale)}}%</span>
                                </div>
                                <el-form-item class="no-margin">
                                    <el-checkbox-group v-model="buyForm.deductState">
                                        <el-checkbox :label="$t('PAYFREE')" name="deductState"></el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item v-if="loginStatus()">
                                    <el-button type="primary" @click="submitForm('buyForm','BUY')" class="flex-btn" style="background: #F5322D;border:none">{{'PURCHASE_IMMEDIATELY'|t}}</el-button>
                                </el-form-item>
                                <div class="sale-submit-btn" v-else>
                                    <span class="c-blue">{{'LOGIN_TITLE'|t}} </span>
                                    <span>{{'OR'|t}}</span>
                                    <span class="c-blue">{{'SIGNUP'|t}}</span>
                                    <span>{{'TRADE'|t}}</span>
                                </div>
                            </el-form>
                        </div>
                    </div>
                    <!-- 卖 -->
                    <div class="grid-content flex ml-10">
                        <div class="sale-title">{{'AVALIABLE'|t}}
                            <span class="c-success" v-if="UserBalance.productCoinNum||UserBalance.productCoinNum=='0'">{{$C(UserBalance.productCoinNum)}}{{tradeCoinItem.productCoinCore}}</span>
                            <span class="c-success" v-else>--{{tradeCoinItem.productCoinCore}}</span>
                        </div>
                        <div class="form-wrap">
                            <el-form :model="sellForm" :rules="rules" ref="sellForm" class="demo-ruleForm">
                                <el-form-item prop="entrustPrice">
                                    <el-input v-model="sellForm.entrustPrice" :placeholder="$t('SELL_OUT_PLACE')" class="c2b-input" @change="setSlider('sellSlider','sellForm',UserBalance.productCoinNum)">
                                        <span slot="prefix" class="c2b-input-text-left">{{'SELL_OUT_PRICE'|t}}</span>
                                        <span slot="suffix" class="c2b-input-text">{{tradeCoinItem.priceCoinCore}}</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="entrustNum">
                                    <el-input v-model="sellForm.entrustNum" :placeholder="$t('SELL_OUT_NUM_PLACE')" class="c2b-input" @change="setSlider('sellSlider','sellForm',UserBalance.productCoinNum,'entrustNum')">
                                        <span slot="prefix" class="c2b-input-text-left">{{'SELL_OUT_NUM'|t}}</span>
                                        <span slot="suffix" class="c2b-input-text">{{tradeCoinItem.productCoinCore}}</span>
                                    </el-input>
                                </el-form-item>
                                <div class="box-flex sale-slider">
                                    <div class="flex mr-20">
                                        <el-slider v-model="sellSlider" :step="5" show-stops class="success-bar" @change="setTradeNum('sellSlider','sellForm',UserBalance.productCoinNum)">
                                        </el-slider>
                                    </div>
                                    <span class="ml-10">{{sellSlider|Fixed(tradePairsData.priceLimit)}}%</span>
                                </div>
                                <div class="clearfix mt-10 sale-desc">
                                    <p class="float-l">{{'EXPECTED_TRANSACTION'|t}}：
                                        <span class="c-success">{{sellTotal}}</span> {{tradeCoinItem.priceCoinCore}}</p>
                                    <span class="float-r">{{'SERVER_CHARGE'|t}}：{{fee(tradePairsData.priceCoinScale)}}%</span>
                                </div>
                                <el-form-item class="no-margin">
                                    <el-checkbox-group v-model="sellForm.deductState">
                                        <el-checkbox :label="$t('PAYFREE')" name="deductState"></el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item v-if="loginStatus()">
                                    <el-button type="primary" @click="submitForm('sellForm','SELL')" class="flex-btn" style="background: #00BB39;border:none">{{'SELL_IMMEDIATELY'|t}}</el-button>
                                </el-form-item>
                                <div class="sale-submit-btn" v-else>
                                    <span class="c-blue">{{'LOGIN_TITLE'|t}} </span>
                                    <span>{{'OR'|t}}</span>
                                    <span class="c-blue">{{'SIGNUP'|t}}</span>
                                    <span>{{'TRADE'|t}}</span>
                                </div>
                            </el-form>
                        </div>
                    </div>
                    <div class="trade-pass" v-show="showMaskBool">
                        <div class="trade-pass-mask"></div>
                        <div class="trade-pass-form">
                            <div class="form-wrap">
                                <el-form :model="maskForm" :rules="rules" ref="maskForm" class="demo-ruleForm">
                                    <el-form-item prop="tradePassowrd" :label="$t('USER_TRADE_PASS')">
                                        <el-input v-model="maskForm.tradePassowrd" type="password" :placeholder="$t('USER_TRADE_PASS_PLACE')">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="checkMaskForm('maskForm')" class="flex-btn" style="background: #00BB39;border:none">{{'DETERMINE'|t}}</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import { Rules } from '@/providers/rules';
    import { mapGetters } from 'vuex';
    import { BB } from "@/services";
    import { Func } from '@/providers';
    import { BigNumber } from 'bignumber.js';
    export default {
        name: 'trade-right',
        data() {
            return {
                page: 1,
                limit: 10,
                total: 0,
                CNYData: 0,
                showBool: false,
                websoket: null,
                buySlider: 0,
                sellSlider: 0,
                showMaskBool: true,
                blockList: [],
                coinDataList: [],
                activeBlock: {},
                tabData: [
                    {
                        id: 'changeUserEntrustNum',
                        name: this.$t('COMMISSIONED_CURRENT')
                    },
                    {
                        id: 'changeUserOrdersNum',
                        name: this.$t('HISTORY_CURRENT')
                    },
                ],
                buyData: {},
                sellData: {},
                historyData: [],
                entrustData: [],
                marketOrders: [],
                UserBalance: {},
                defaultIndex: 'changeUserEntrustNum',
                introductText: '',
                posBool: false,
                maskForm: {
                    tradePassowrd: ''
                },
                sellForm: {
                    entrustPrice: '',
                    entrustNum: '',
                    tradePassword: '',
                    deductState: false
                },
                buyForm: {
                    entrustPrice: '',
                    entrustNum: '',
                    tradePassword: '',
                    deductState: false
                },
                submitNum: 1,
                // tradeData: {},
                ruleForm: {
                    name: ''
                },
                bool: false,
                rules: {
                    entrustPrice: [
                        { required: true, message: this.$t('ENTER_TRADE_PRICE'), trigger: 'blur' },
                        { pattern: /^([+]?\d+(\.\d+)?)$/, message: i18n.t('REQUIRE_NUMBER') }
                    ],
                    entrustNum: [
                        { required: true, message: this.$t('ENTER_TRADE_NUM'), trigger: 'blur' },
                        { pattern: /^([+]?\d+(\.\d+)?)$/, message: i18n.t('REQUIRE_NUMBER') }
                    ],
                    ...Rules
                },
                tableData: [],
                tradePairsData: {}
            };
        },
        watch: {
            tradeCoinItem(newValue, oldValue) {
                if (!newValue) { return }
                this.ApproximateValue(newValue.productCoinId);
            },
            // 交易是的小数位数设置
            'tradeData.tradePairsData'(newValue, oldValue) {
                if (!newValue || !newValue.oneData) { return };
                this.tradePairsData = newValue.oneData;
                this.tradePairsData.priceLimit = newValue.oneData.priceCoinFormat.toString().split('.')[1].length;
                this.tradePairsData.productLimit = newValue.oneData.productCoinFormat.toString().split('.')[1].length;
            },
            'tradeData.marketOrders'(newValue, oldValue) {
                if (!newValue || !newValue.data) { return };
                this.marketOrders = newValue.data.marketOrders;
            },
            // 用户资产
            'tradeData.marketUserBalance'(newValue, oldValue) {
                if (!newValue || !newValue.data) { return }
                this.UserBalance = newValue.data;
            },
            // 历史委托
            'tradeData.marketUserOrders'(newValue, oldValue) {
                if (!newValue || !newValue.data) { return }
                this.historyData = newValue.data.marketUserOrders;
                this.total = newValue.data.total;
            },
            // 当前委托
            'tradeData.marketUserEntrusts'(newValue, oldValue) {
                if (!newValue || !newValue.oneData) { return }
                this.entrustData = newValue.oneData.list;
                this.total = newValue.oneData.total;
            },
            // 买卖数据
            'tradeData.marketEntrusts'(newValue, oldValue) {
                if (!newValue || !newValue.data) { return }
                let _buyData = newValue.data.buyMarketEntrusts;
                let _sellData = newValue.data.sellMarketEntrusts;
                let maxBuyNum = this.getMaxNum(_buyData);
                let maxSellNum = this.getMaxNum(_sellData);
                for (let item of _buyData) {
                    item.maxPs = (item.entrustNum / maxBuyNum).toFixed(2) * 100;//显示面积，无需精确
                }
                for (let item of _sellData) {
                    item.maxPs = (item.entrustNum / maxSellNum).toFixed(2) * 100;//显示面积，无需精确
                }
                this.buyData = _buyData;
                this.sellData = _sellData;
            }
        },
        computed: {
            // 使用对象展开运算符将 getter 混入 computed 对象中
            ...mapGetters([
                'imgPath',
                'tradeData',
                'tradeCoinItem'
            ]),
            // 出售部分的预计总交易额
            sellTotal() {
                if (this.sellForm.entrustPrice && this.sellForm.entrustNum) {
                    let price = BigNumber(this.sellForm.entrustPrice);
                    let num = BigNumber(this.sellForm.entrustNum);
                    console.log(this.tradePairsData.productLimit);
                    return this.$C(price.multipliedBy(num), this.tradePairsData.productLimit);
                } else {
                    return '0'
                }
            },
            // 购买部分的预计总交易额
            buyTotal() {
                if (this.buyForm.entrustPrice && this.buyForm.entrustNum) {
                    let price = BigNumber(this.buyForm.entrustPrice);
                    let num = BigNumber(this.buyForm.entrustNum);
                    return this.$C(price.multipliedBy(num));
                } else {
                    return '0'
                }
            },
            lang() {
                return Func.getCookie('lang')
            }
        },
        methods: {
            // 手续费显示
            fee(dem) {
                if (dem - 0 == dem) {
                    return this.$C(dem * 100)
                } else {
                    return '--'
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                let _parmas = {
                    request: this.defaultIndex,
                    pageNum: this.page
                }
                this.$store.dispatch('SENDWEBSCOKETMSG', JSON.stringify(_parmas));
                // this.getList(this.coinItem)
            },
            //货币与CNY的兑换
            async ApproximateValue(coin) {
                try {
                    let res = await BB.ApproximateValue({
                        coinId: coin
                    });
                    this.CNYData = res.data.CNY;
                } catch (error) {
                    console.log(error)
                }
            },
            // 切换交易对
            rowClick(item) {
                // this.$router.push({ path: '/trade', query: { block: item.priceCoinId, coin: item.productCoinId } });
                this.$store.dispatch('SETCOINITEM', item);
                let _parmas = {
                    'request': 'changePair',
                    productCoinId: item.productCoinId, // 币种
                    priceCoinId: item.priceCoinId // 币区
                }
                this.$store.dispatch('SENDWEBSCOKETMSG', JSON.stringify(_parmas))
                // this.$parent.sendMsg(JSON.stringify(_parmas));
            },
            // 切换币区
            changeActive(item) {
                this.activeBlock = item;
                this.searchInput = '';
                this.getCoinsByBlock();
            },
            // 获取币区
            getBlocks(firstTime = false) {
                BB.getBlocks({
                }, false).then(res => {
                    this.blockList = res.listData;
                    this.activeBlock = res.listData[0];
                    this.getCoinsByBlock();
                })
            },

            // 获取币区下的币种
            getCoinsByBlock(isBlockChange) {
                BB.getCoinsByBlock({
                    blockId: this.activeBlock.blockId,//币区
                    productCoinName: this.operating == 'search' ? this.searchInput : '' //搜索内容
                }, false).then(res => {
                    this.coinDataList = res.listData;
                    let _item = this.coinDataList[0];
                    this.$store.dispatch('SETCOINITEM', _item);
                    this.$parent.websoketFn(_item)
                })
            },
            // 更新滑块条
            setSlider(slider, form, balance, type) {
                let _form = this[form];
                let price = BigNumber(_form.entrustPrice);
                let num = BigNumber(_form.entrustNum);
                let bal = BigNumber(balance);
                if (!balance) { return }
                // let _value = this[slider];
                if (slider == 'buySlider') {
                    this[slider] = Number(this.$C(price.multipliedBy(num).div(bal).multipliedBy(100)));
                } else {
                    if (type == 'entrustNum') {
                        this[slider] = Number(this.$C(num.div(bal).multipliedBy(100)));
                    }
                }
            },
            // 滑块联动
            setTradeNum(slider, form, balance) {
                let _form = this[form];
                let price = BigNumber(_form.entrustPrice);
                let _value = BigNumber(this[slider]);
                let bal = BigNumber(balance);
                if (!balance) { return }
                if (slider == 'buySlider') {
                    // 买的滑块
                    if (!_form.entrustPrice) {
                        _form.entrustNum = 0;
                    } else {
                        _form.entrustNum = Number(this.$C(bal.multipliedBy(_value.div(100)).div(price))).toFixed(this.tradePairsData.productLimit);
                    }
                } else {
                    // 卖的滑块
                    _form.entrustNum = Number(this.$C(bal.multipliedBy(_value.div(100)))).toFixed(this.tradePairsData.productLimit);
                }

            },
            // 撤销委托
            cancelItem(entrustId) {
                this.$store.dispatch('SENDWEBSCOKETMSG', JSON.stringify({ request: 'cancelEntrust', 'entrustId': entrustId }));
            },
            // 切换选项卡
            clickFn(item) {
                this.defaultIndex = item.id;
                if (this.defaultIndex == 'changeUserEntrustNum') {
                    if (this.tradeData.marketUserEntrusts) {
                        this.total = this.tradeData.marketUserEntrusts.oneData.total;
                    } else {
                        this.total = 0;
                    }
                } else {
                    if (this.tradeData.marketUserOrders) {
                        this.total = this.tradeData.marketUserOrders.data.total;
                    } else {
                        this.total = 0;
                    }
                }
            },
            // 获取数据中的entrustNum最大值
            getMaxNum(data) {
                let arr = [];
                for (let item of data) {
                    arr.push(item.entrustNum);
                }
                return Math.max.apply(null, arr);
            },
            checkMaskForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    }
                    // this.showMaskBool = false;

                    let _parmas = {
                        request: 'validateTrade',
                        showMaskBool: true,
                        num: this.submitNum++,
                        tradePassword: this.AES(this.maskForm.tradePassowrd)
                    };
                    this.$store.dispatch('SENDWEBSCOKETMSG', JSON.stringify(_parmas));
                });
            },
            submitForm(formName, type) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    }
                    let _form = this[formName];
                    let coin = this.$route.query.coin;
                    let block = this.$route.query.block;
                    let _parmas = {
                        request: 'submitEntrust',
                        productCoinId: coin,// 币种id
                        priceCoinId: block,//币区ID
                        entrustPrice: _form.entrustPrice,
                        entrustNum: _form.entrustNum,
                        deductState: _form.deductState ? 'Y' : 'N',
                        tradePassword: this.AES(this.maskForm.tradePassowrd),
                        type: type
                    };
                    this.$store.dispatch('SENDWEBSCOKETMSG', JSON.stringify(_parmas));

                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            init() {
                this.$refs.fullPage.style.height = window.innerHeight - 86 + 'px';
                this.$refs.klineWrap.$el.style.height = window.innerHeight - 550 + 'px';
                this.$refs.kline.style.height = window.innerHeight - 550 - 80 + 'px';
                this.getBlocks();
            },
            lockScroll() {
                window.onmousewheel = (event) => {
                    return false;
                };
            },
            unlockScroll() {
                window.onmousewheel = (event) => {
                    return true;
                };
            },
            onresize() {
                window.onresize = () => {
                    this.init();
                };
            },
        },
        destroyed() {
            document.body.style.overflow = 'inherit';
            this.unlockScroll();
        },
        created() {
            document.body.style = 'overflow:hidden;';
            this.onresize();
            // let newValue = this.tradeData.marketEntrusts;
            // let _buyData = newValue.data.buyMarketEntrusts;
            // let _sellData = newValue.data.sellMarketEntrusts;
            // let maxBuyNum = this.getMaxNum(_buyData);
            // let maxSellNum = this.getMaxNum(_sellData);
            // for (let item of _buyData) {
            //     item.maxPs = (item.entrustNum / maxBuyNum).toFixed(2) * 100;
            // }
            // for (let item of _sellData) {
            //     item.maxPs = (item.entrustNum / maxSellNum).toFixed(2) * 100;
            // }
            // this.buyData = _buyData;
            // this.sellData = _sellData;

        },
        mounted() {
            this.init();
        }
    };
</script>
<style scoped lang="scss">
    html,
    body {
        height: 100%;
    }

    @import '~@/assets/sass/trade';
    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateY(10px);
        opacity: 0;
    }
</style>