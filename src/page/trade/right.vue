<template>
    <div class="trade-right">
        <!--头部 -->
        <div class="trade-right-top box-flex">
            <div class="top-item flex">
                <!-- <img :src="imgPath+tradeCoinItem.productCoinImg" alt="" class="top-item-logo"> -->
                <span>{{tradeCoinItem.productCoinCore}}/{{tradeCoinItem.priceCoinCore}}</span>
                <!-- <span class="introduce-text-btn" v-tip.bottom="introductText">{{'INTRODUCTTEXT'|t}}</span> -->
                <span class="introduce-text-btn" v-tippy='{ interactive : true ,arrow : true, arrowTransform : "scale(0.75)",placement : "bottom-right"}'
                    :title="introductText">{{'INTRODUCTTEXT'|t}}</span>
            </div>
            <div class="top-item flex">
                <h3 class="top-item-title" :class="tradeCoinItem.riseAndFall>0?'c-red':tradeCoinItem.riseAndFall<0?'c-success':''">{{$C(tradeCoinItem.latestPrice)}}</h3>
                <!-- <p>≈5590.5CNY</p> -->
                <p>{{'LATESTPRICE'|t}}</p>
            </div>
            <div class="top-item flex">
                <h3 class="top-item-title" :class="tradeCoinItem.riseAndFall>0?'c-red':tradeCoinItem.riseAndFall<0?'c-success':''">{{tradeCoinItem.riseAndFall}}%</h3>
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
        <div class="kline-component" :class="posBool?'kline-pos':'kline-info'">
            <!-- target="_blank"  -->
            <router-link target="_blank" :to="{path:'/trade/full',query:{block:$route.query.block,coin:$route.query.coin}}" style="position: absolute;right: 10px;top: 2px;color: white">
                <span>{{'FULL_SCREEN_KLINE'|t}}>> </span>
            </router-link>
            <!-- ${process.env.KLINEHOST}?lang=zh&symbol=${this.tradeCoinItem.productCoinId}-${this.tradeCoinItem.priceCoinId} -->
            <!-- <iframe :src="klineSrc" frameborder="0" style="height: 100%;width:100%"></iframe> -->
            <iframe :src="'/static/kline/index.html?lang='+lang+'&symbol='+tradeCoinItem.productCoinId+'-'+tradeCoinItem.priceCoinId"
                frameborder="0" style="height: 100%;width:100%"></iframe>
            <!-- <iframe src="http://47.75.51.148//kline.html?lang=zh&symbol=30-40/" frameborder="0" style="height: 100%;width:100%"></iframe> -->
        </div>
        <!-- sale -->
        <div class="sale-cont border radius mt-10">
            <el-row>
                <!-- 买 -->
                <el-col :span="8" class="pr-15">
                    <div class="grid-content pd-10">
                        <div class="sale-title">{{'AVALIABLE'|t}}
                            <span class="c-red" v-if="UserBalance.priceCoinPrice||UserBalance.priceCoinPrice=='0'">{{$C(UserBalance.priceCoinPrice)}}{{tradeCoinItem.priceCoinCore}}</span>
                            <!-- <span class="c-red" v-if="loginStatus()">{{UserBalance.priceCoinPrice|Fixed}}{{tradeCoinItem.priceCoinCore}}</span> -->
                            <span class="c-red" v-else>--{{tradeCoinItem.priceCoinCore}}</span>
                        </div>
                        <div class="form-wrap">
                            <el-form :model="buyForm" :rules="rules" ref="buyForm" class="demo-ruleForm">
                                <el-form-item prop="entrustPrice">
                                    <el-input v-model="buyForm.entrustPrice" class="c2b-input" @change="setSlider('buySlider','buyForm',UserBalance.priceCoinPrice)"
                                        @keyup.native="fixeNumber(buyForm,'entrustPrice',tradePairsData.priceLimit)" type="number">
                                        <span slot="prefix" class="c2b-input-text-left">{{'BUY_PRICE'|t}}</span>
                                        <span slot="suffix" class="c2b-input-text">{{tradeCoinItem.priceCoinCore}}</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="entrustNum">
                                    <el-input v-model="buyForm.entrustNum" class="c2b-input" @change="setSlider('buySlider','buyForm',UserBalance.priceCoinPrice)"
                                        @keyup.native="fixeNumber(buyForm,'entrustNum',tradePairsData.productLimit)" type="number">
                                        <span slot="prefix" class="c2b-input-text-left">{{'BUY_IN_NUM'|t}}</span>
                                        <span slot="suffix" class="c2b-input-text">{{tradeCoinItem.productCoinCore}}</span>
                                    </el-input>
                                </el-form-item>
                                <div class="box-flex sale-slider">
                                    <div class="flex mr-20">
                                        <el-slider v-model="buySlider" :step="5" show-stops class="red-bar" @change="setTradeNum('buySlider','buyForm',UserBalance.priceCoinPrice)"
                                            :format-tooltip="formatTooltip">
                                        </el-slider>
                                    </div>
                                    <span class="ml-10">{{buySlider|Fixed(tradePairsData.priceLimit)}}%</span>
                                    <!-- <span class="ml-10">{{buySlider|Fixed(tradePairsData.priceLimit)}}%</span> -->
                                </div>
                                <div class="clearfix mb-10 mt-10 sale-desc">
                                    <p class="float-l">{{'EXPECTED_TRANSACTION'|t}}：
                                        <span class="c-red">{{buyTotal}}</span> {{tradeCoinItem.priceCoinCore}}</p>
                                    <span class="float-r">{{'SERVER_CHARGE'|t}}：{{fee(tradePairsData.productCoinScale)}}%</span>
                                </div>
                                <el-form-item prop="tradePassword">
                                    <el-input v-model="buyForm.tradePassword" :placeholder="'USER_TRADE_PASS'|t" type="password" class="c2b-input" :disabled="userStatus.tradePasswordState=='0'">
                                        <span slot="prefix" class="c2b-input-text-left">{{'PASSWORD'|t}}</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item v-show="tradePairsData.deductCoinName!=tradeCoinItem.productCoinCore">
                                    <el-checkbox-group v-model="buyForm.deductState" v-tippy='{ interactive : true ,arrow : true, arrowTransform : "translateX(-100px)",placement : "top-start"}' :title="deductStateText">
                                        <el-checkbox :label="$t('PAYFREE')" name="deductState"></el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item v-if="loginStatus()">
                                    <el-button type="primary" @click="submitForm('buyForm','BUY')" class="flex-btn" style="background: #F5322D;border:none" :loading="buyFormBool"
                                        :disabled="buyFormBool">
                                        <span v-if="!buyFormBool">{{'PURCHASE_IMMEDIATELY'|t}}</span>
                                        <span v-else>{{'ENTRUSTMENT_RELEASE'|t}}</span>
                                    </el-button>
                                </el-form-item>
                                <div class="sale-submit-btn" v-else>
                                    <span class="c-blue" @click="$router.push('/signin')">{{'LOGIN_TITLE'|t}}</span>
                                    <span>{{'OR'|t}}</span>
                                    <span class="c-blue" @click="$router.push('/signup')">{{'SIGNUP'|t}}</span>
                                    <span>{{'TRADE'|t}}</span>
                                </div>
                            </el-form>
                        </div>
                    </div>
                </el-col>
                <!-- 卖 -->
                <el-col :span="8" class="pl-15 pr-15">
                    <div class="grid-content pd-10">
                        <div class="sale-title">{{'AVALIABLE'|t}}
                            <span class="c-success" v-if="UserBalance.productCoinNum||UserBalance.productCoinNum=='0'">{{$C(UserBalance.productCoinNum)}}{{tradeCoinItem.productCoinCore}}</span>
                            <!-- <span class="c-success" v-if="loginStatus()">{{UserBalance.productCoinNum|Fixed}}{{tradeCoinItem.productCoinCore}}</span> -->
                            <span class="c-success" v-else>--{{tradeCoinItem.productCoinCore}}</span>
                        </div>
                        <div class="form-wrap">
                            <el-form :model="sellForm" :rules="rules" ref="sellForm" class="demo-ruleForm">
                                <el-form-item prop="entrustPrice">
                                    <el-input v-model="sellForm.entrustPrice" class="c2b-input" @change="setSlider('sellSlider','sellForm',UserBalance.productCoinNum)"
                                        @keyup.native="fixeNumber(sellForm,'entrustPrice',tradePairsData.priceLimit)" type="number">
                                        <span slot="prefix" class="c2b-input-text-left">{{'SELL_OUT_PRICE'|t}}</span>
                                        <span slot="suffix" class="c2b-input-text">{{tradeCoinItem.priceCoinCore}}</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="entrustNum">
                                    <el-input v-model="sellForm.entrustNum" class="c2b-input" @change="setSlider('sellSlider','sellForm',UserBalance.productCoinNum,'entrustNum')"
                                        @keyup.native="fixeNumber(sellForm,'entrustNum',tradePairsData.productLimit)" type="number">
                                        <span slot="prefix" class="c2b-input-text-left">{{'SELL_OUT_NUM'|t}}</span>
                                        <span slot="suffix" class="c2b-input-text">{{tradeCoinItem.productCoinCore}}</span>
                                    </el-input>
                                </el-form-item>
                                <div class="box-flex sale-slider">
                                    <div class="flex mr-20">
                                        <el-slider v-model="sellSlider" :step="5" show-stops class="success-bar" @change="setTradeNum('sellSlider','sellForm',UserBalance.productCoinNum)"
                                            :format-tooltip="formatTooltip">
                                        </el-slider>
                                    </div>
                                    <span class="ml-10">{{sellSlider|Fixed(tradePairsData.productLimit)}}%</span>
                                    <!-- <span class="ml-10">{{sellSlider|Fixed(2)}}%</span> -->
                                </div>
                                <div class="clearfix mb-10 mt-10 sale-desc">
                                    <p class="float-l">{{'EXPECTED_TRANSACTION'|t}}：
                                        <span class="c-success">{{sellTotal}}</span> {{tradeCoinItem.priceCoinCore}}</p>
                                    <span class="float-r">{{'SERVER_CHARGE'|t}}：{{fee(tradePairsData.priceCoinScale)}}%</span>
                                </div>
                                <el-form-item prop="tradePassword">
                                    <el-input v-model="sellForm.tradePassword" :placeholder="'USER_TRADE_PASS'|t" type="password" class="c2b-input" :disabled="userStatus.tradePasswordState=='0'">
                                        <span slot="prefix" class="c2b-input-text-left">{{'PASSWORD'|t}}</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item v-show="tradePairsData.deductCoinName!=tradeCoinItem.priceCoinCore">
                                    <el-checkbox-group v-model="sellForm.deductState"  v-tippy='{ interactive : true ,arrow : true, arrowTransform : "translateX(-100px)",placement : "top-start"}' :title="deductStateText">
                                        <el-checkbox :label="$t('PAYFREE')" name="deductState"></el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item v-if="loginStatus()">
                                    <el-button type="primary" @click="submitForm('sellForm','SELL')" class="flex-btn" style="background: #00BB39;border:none"
                                        :loading="sellFormBool" :disabled="sellFormBool">
                                        <span v-if="!sellFormBool">{{'SELL_IMMEDIATELY'|t}}</span>
                                        <span v-else>{{'ENTRUSTMENT_RELEASE'|t}}</span>
                                    </el-button>
                                </el-form-item>
                                <div class="sale-submit-btn" v-else>
                                    <span class="c-blue" @click="$router.push('/signin')">{{'LOGIN_TITLE'|t}}</span>
                                    <span>{{'OR'|t}}</span>
                                    <span class="c-blue" @click="$router.push('/signup')">{{'SIGNUP'|t}}</span>
                                    <span>{{'TRADE'|t}}</span>
                                </div>
                            </el-form>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8" class="pl-15">
                    <!-- 平台出售订单 -->
                    <div class="grid-content">
                        <div class="trade-list">
                            <div class="trade-item title">
                                <div class="trade-info">{{'TYPE'|t}}</div>
                                <div class="trade-info">{{'ADVERT_PRICE'|t}}( {{tradeCoinItem.priceCoinCore}} )</div>
                                <div class="trade-info">{{'NUMS'|t}}( {{tradeCoinItem.productCoinCore}} )</div>
                                <div class="trade-info deep" @mouseover="showBool=true" @mouseout="showBool=false" :class="showBool?'deep-rotate':''">
                                    <span>{{'DEPTH'|t}}</span>
                                    <transition name="slide-fade">
                                        <ul class="deep-cont" v-show="showBool">
                                            <li v-for="(item,key) of deepList" @click="chooseDepth(item)" :class="defaultDeepItem==item?'active':''">{{item.text}}</li>
                                        </ul>
                                    </transition>
                                </div>
                            </div>
                        </div>
                        <div class="trade-list list list-sell" ref="sellScroll">
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

                        <!-- 最新汇率 -->
                        <div class="trade-now-price">
                            <span>{{'NOWPRICE'|t}}：</span>
                            <span class="c-red">1 </span>
                            <!-- <span>{{tradeCoinItem.productCoinCore!=tradeCoinItem.price}} </span> -->
                            <span>{{tradeCoinItem.productCoinCore}} </span>
                            <span class="c-info">≈{{CNYData}}CNY</span>
                        </div>

                        <!-- 平台收购订单 -->
                        <!-- <div class="trade-list">
                                <div class="trade-item title">
                                    <div class="trade-info">{{'TYPE'|t}}</div>
                                    <div class="trade-info">{{'ADVERT_PRICE'|t}}( {{tradeCoinItem.priceCoinCore}} )</div>
                                    <div class="trade-info">{{'NUMS'|t}}( {{tradeCoinItem.productCoinCore}} )</div>
                                </div>
                            </div> -->
                        <div class="trade-list list list-buy">
                            <div class="trade-item" v-for="(item,key) of buyData" :key=key @click="sellForm.entrustPrice=item.entrustPrice">
                                <div class="trade-info">{{'BUY'|t}}{{key+1}}</div>
                                <!-- <div class="trade-info">{{item.entrustPrice|Fixed(tradePairsData.priceLimit)}}</div> -->
                                <div class="trade-info">{{item.entrustPrice}}</div>
                                <div class="trade-info trade-info-bar">
                                    <!-- <span class="bar-text">{{item.entrustNum|Fixed(tradePairsData.productLimit)}}</span> -->
                                    <span class="bar-text">{{item.entrustNum}}</span>
                                    <div class="bar">
                                        <span :style="'width: '+item.maxPs+'%'"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 委托 -->
        <div class="entrust-cont">
            <el-row class="box-flex">
                <el-col :span="16" class="pr-15">
                    <div class="grid-content border radius no-border-b">
                        <div class="switch-tab clearfix">
                            <a href="javascript:;" class="tab-item" v-for='item of tabData' :key=item.id :class="defaultIndex==item.id?'active':''" @click="clickFn(item)">{{item.name}}</a>
                            <!-- <a href="javascript:;" class="tab-item">历史委托</a> -->
                            <div class="block text-c float-r" style="vertical-align: middle" v-show="total>limit">
                                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="limit"
                                    :total="total">
                                </el-pagination>
                            </div>
                        </div>
                        <!-- 当前委托 -->
                        <el-table :data="entrustData" style="width: 100%;min-height: 300px" v-show="defaultIndex=='changeUserEntrustNum'" height="300"
                            size="mini">
                            <!-- <div slot="empty" class="empty-text">
                                    详情请先
                                    <span class="c-blue">登录</span>或
                                    <span class="c-blue">注册</span>
                                </div> -->
                            <el-table-column prop="createDate" :label="$t('ENTRUS_TIME')" width="160">
                                <template slot-scope="scope">
                                    {{scope.row.createDate|Format}}
                                </template>
                                <!-- Format('hh:mm:ss') -->
                            </el-table-column>
                            <el-table-column prop="type" :label="$t('TYPE')">
                                <template slot-scope="scope">
                                    <!-- {{$t(scope.row.type)}} -->
                                    <span v-if="scope.row.type=='BUY'">{{'BUY'|t}}</span>
                                    <span v-else>{{'SELLS'|t}}</span>
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
                                    {{Number(mul(scope.row.entrustNum,scope.row.entrustPrice))}}
                                    <!-- |Fixed(tradePairsData.priceLimit) -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('STATUS')">
                                <!--  prop="state" -->
                                <template slot-scope="scope">
                                    <span>{{'COMMISSIONED'|t}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" :label="$t('OPERATION')" width="100">
                                <template slot-scope="scope">
                                    <el-button type='text' @click="cancelItem(scope.row.id)">{{'UNDO'|t}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 历史委托 -->
                        <el-table :data="historyData" style="width: 100%;min-height: 300px" v-show="defaultIndex=='changeUserOrdersNum'" height="300"
                            size="mini">
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
                                    <!-- {{$t(scope.row.type)}} -->
                                    <span v-if="scope.row.type=='BUY'">{{'BUY'|t}}</span>
                                    <span v-else>{{'SELLS'|t}}</span>
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

                <!-- 平台订单交易行情 -->
                <el-col :span="8" class="pd-10 border radius">
                    <div class="grid-content ">
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
                                <!-- {{key+1}} -->
                                <div class="trade-info">{{$C(item.unitPrice)}}</div>
                                <!-- |Fixed(tradePairsData.priceLimit) -->
                                <div class="trade-info">
                                    {{$C(item.totalNum)}}
                                    <!-- |Fixed(tradePairsData.productLimit) -->
                                </div>
                                <div class="trade-info">
                                    {{item.createDate|Format('hh:mm:ss')}}
                                </div>
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
    import { mapGetters, mapState } from 'vuex';
    import { Func } from '@/providers';
    import { BB } from "@/services";
    import { BigNumber } from 'bignumber.js';
    export default {
        name: 'trade-right',
        data() {
            return {
                defaultDeepItem: {},
                deepList: [
                    { num: '', text: this.$t('ALL') },
                    { num: '6', text: '0.000000' },
                    { num: '5', text: '0.00000' },
                    { num: '4', text: '0.0000' },
                    { num: '3', text: '0.000' },
                    { num: '2', text: '0.00' },
                    { num: '1', text: '0.0' },
                    { num: '0', text: '0' }
                ],
                showBool: false,
                page: 1,
                limit: 10,
                total: 0,
                buySlider: 0,
                sellSlider: 0,
                buyData: {},
                sellData: {},
                defaultIndex: 'changeUserEntrustNum',
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
                // klineSrc: 'http://localhost:3000/',
                introductText: '',
                deductStateText: '',
                posBool: false,
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
                marketOrders: [],
                bool: false,
                submitNums: 0,
                rules: {
                    entrustPrice: [
                        { required: true, message: this.$t('ENTER_TRADE_PRICE'), trigger: 'blur' },
                        { pattern: /^([+]?\d+(\.\d+)?)$/, message: this.$t('REQUIRE_NUMBER') },
                    ],
                    entrustNum: [
                        { required: true, message: this.$t('ENTER_TRADE_NUM'), trigger: 'blur' },
                        { pattern: /^([+]?\d+(\.\d+)?)$/, message: this.$t('REQUIRE_NUMBER') },
                        ],
                    ...Rules
                },
                historyData: [],
                entrustData: [],
                tradePairsData: {},
                UserBalance: {},
                CNYData: 0
            };
        },
        computed: {
            // 使用对象展开运算符将 getter 混入 computed 对象中
            ...mapGetters([
                'imgPath',
                'tradeData',
                'tradeCoinItem',
                'sellFormBool',
                'buyFormBool'
            ]),
            ...mapState([
                'userStatus'
            ]),
            klineSrc() {
                // if (this.tradeCoinItem.productCoinId && this.tradeCoinItem.priceCoinId) {
                //     return `${process.env.KLINEHOST}?lang=zh&symbol=${this.tradeCoinItem.productCoinId}-${this.tradeCoinItem.priceCoinId}`
                // }
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
            // 出售部分的预计总交易额
            sellTotal() {
                if (this.sellForm.entrustPrice && this.sellForm.entrustNum) {
                    let price = BigNumber(this.sellForm.entrustPrice);
                    let num = BigNumber(this.sellForm.entrustNum);
                    return this.$C(price.multipliedBy(num), this.tradePairsData.productLimit);
                } else {
                    return '0'
                }
            },
            lang() {
                return Func.getCookie('lang')
            }
        },
        watch: {
            'tradeCoinItem'(newValue, oldValue) {
                if (!newValue) { return }
                this.introductText = newValue[this.lang + 'ProductCoinRemark'] ? newValue[this.lang + 'ProductCoinRemark'] : 'undefined';
                this.sellForm.entrustPrice = this.$C(newValue.latestPrice);
                this.buyForm.entrustPrice = this.$C(newValue.latestPrice);
                this.ApproximateValue(newValue.productCoinId);
            },
            // 交易是的小数位数设置
            'tradeData.tradePairsData'(newValue, oldValue) {
                if (!newValue || !newValue.oneData) { return };
                let _data = newValue.oneData;
                this.tradePairsData = _data;
                this.tradePairsData.priceLimit = _data.priceCoinFormat.toString().split('.')[1].length;
                this.tradePairsData.productLimit = _data.productCoinFormat.toString().split('.')[1].length;
                this.deductStateText=`${this.$t('DEDUCTSTATETEXT_1')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_2')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_3')}；${this.$t('DEDUCTSTATETEXT_1')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_3_1')}${(BigNumber(1).minus(BigNumber(_data.discount))) * 100}%${this.$t('DEDUCTSTATETEXT_3_2')},${this.$t('DEDUCTSTATETEXT_4')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_5')}${_data.deductCoinName}，${this.$t('DEDUCTSTATETEXT_6')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_7')}`
            },
            'tradeData.marketOrders'(newValue, oldValue) {
                if (!newValue || !newValue.data) { return }
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
                // console.log(_buyData)
                // console.log(_sellData)

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
                setTimeout(() => {
                    // 滚动条跳转到指定位置
                    let ele = this.$refs.sellScroll;
                    ele.scrollTo(0, 1000); // x，y
                }, 1);
            }
        },
        methods: {
            // 深度
            chooseDepth(item) {
                let _parmas = {
                    request: 'chooseDepth',
                    depth: item.num
                };
                this.defaultDeepItem = item;
                this.$store.dispatch('SENDWEBSCOKETMSG', JSON.stringify(_parmas));
            },
            // 拉条显示
            formatTooltip(val) {
                if (val) {
                    val = val.toFixed(this.tradePairsData.priceLimit)
                    return val + '%'
                } else return 0 + '%'

            },
            // 手续费显示
            fee(dem) {
                if (dem - 0 == dem) {
                    return this.$C(dem * 100)
                } else {
                    return '--'
                }
            },
            // 乘法
            mul(a, b) {
                return BigNumber(a).multipliedBy(BigNumber(b))
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
            fixeNumber(obj, child, num) {
                let a, b, c;
                if (obj[child].indexOf('.') != -1) {
                    a = obj[child].split(".")
                    if (a[1].length > num) {
                        b = a[1].slice(0, num)
                        c = a[0] + '.' + b
                        this.$set(obj, child, c);
                    }
                }
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
                    this[slider] = price&&num?Number(this.$C(price.multipliedBy(num).div(bal).multipliedBy(100))):0;
                } else {
                    if (type == 'entrustNum') {
                        this[slider] = num?Number(this.$C(num.div(bal).multipliedBy(100))):0;
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
            submitForm(formName, type) {
                let _status = this.userStatus;
                // if (_status && _status.tradePasswordState == '0') {
                //     this.$notify({
                //         title: this.$t('WARMTIPS'),
                //         type: 'warning',
                //         message: this.$t('SET_TRADE_PASS')
                //     });
                //     return false;
                // }
                if (_status && _status.tradePasswordState == '0') {
                    this.ALERT(this.$t('SET_TRADE_PASS'), () => {
                        this.$router.push('/user/safe')
                    });
                    return false;
                }
                // if (_status && _status.credentialInfoState == '0') {
                //     this.$notify({
                //         title: this.$t('WARMTIPS'),
                //         type: 'warning',
                //         message: this.$t('REALNAME_VERIF_SET')
                //     });
                //     return false;
                // }
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    }
                    if (this[formName + 'Bool']) {
                        return false;
                    }
                    this.$store.dispatch('SETBOOLEAN', { type: formName + 'Bool', bool: true });
                    let _form = this[formName];
                    let coin = this.$route.query.coin;
                    let block = this.$route.query.block;
                    let _parmas = {
                        request: 'submitEntrust',
                        productCoinId: coin, // 币种id
                        priceCoinId: block, //币区ID
                        entrustPrice: _form.entrustPrice,
                        entrustNum: _form.entrustNum,
                        tradePassword: this.AES(_form.tradePassword),
                        type: type,
                        deductState: _form.deductState ? 'Y' : 'N',
                        nums: this.submitNums++, // 前端所需参数，解决表单数据相同重复点击无效问题
                        formName: formName // 前端所需参数，用于websock成功推送消息后，重置表单
                    };
                    this.$store.dispatch('SENDWEBSCOKETMSG', JSON.stringify(_parmas));
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        created() {
            //             this.introductText = `<div class="introduct-text"><h3>比特币（Bitcoin）</h3><div class="desc">比特币是目前使用最为广泛的一种数字货币。它诞生于2009年1月3日，是一种点对点（P2P）传输的数字加密货币，总量2100万枚。比特币网络每10分钟释放出一定数量币，预计在2140年达到极限。比特币涨幅曾接近460万倍，被投资者称为“数字黄金”。截止目前比特币总市值突破3748亿人民币。比特币因去中心化、全球流通、低交易费用、匿名流通等特点，备受科技爱好者青睐。近来华尔街、多国央行等传统金融机构开始研究比特币区块链技术，中国人民银行也公布研发数字货币的计划。日本政府正式承认比特币为法定支付方式，越来越多的日本商家接受了比特币支付。
            // 发行时间 : 2008/11/1<br/>发行总量 : 2100万<br/>流通总量 : 1673.82万<br/>白皮书 :<span class='c-blue'>https://bitcoin.org/bitcoin.pdf<br/></span>官网 :<span class='c-blue'>https://bitcoin.org/en/<br/></span>区块查询 :<span class='c-blue'>https://blockchain.info/</span> <br/> </div></div>`;
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/trade';
    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateY(10px);
        opacity: 0;
    }
</style>