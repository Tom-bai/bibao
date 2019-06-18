<template>
    <div class="c2c-wrap">
        <div class="user-form-title">{{'ADVERTISING'|t}}</div>
        <div class="user-cont">
            <div class="tab-list">
                <a href="javascript:;" class="tab-item" v-for="(item,key) of tabList" :key="key" :class="defaultIndex==item.type?'active':''"
                    @click="switchTab(item)">{{item.name}}</a>
            </div>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top" :class="defaultIndex=='BUY_TYPE'?'primary-form':'success-form'">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="form-wrap">
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'COINTYS'|t}}：</span>
                                <span class="desc"></span>
                            </div>
                            <el-form-item label="" prop="coinId">
                                <el-select v-model="ruleForm.coinId" :placeholder="$t('COINTY')" class="form-select" @change="entrustInit()">
                                    <el-option :label="item.coinName" :value="item.id" v-for="(item,key) of coinList" :key=key></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <!-- <div class="zx-form-label">
                                <div class="zx-form-title">
                                    <span class="title">{{'PREMIUM'|t}}：</span>
                                    <span class="desc">{{'PREMIUM_DESC'|t}}</span>
                                </div>
                                <div class="box-flex">
                                    <div class="box-flex flex" style="line-height: 40px;">
                                        <span class="pr-10">{{initData.left}}%</span>
                                        <el-slider v-model="value1" class="flex" :min="initData.left" :max="initData.right"></el-slider>
                                        <span class="ml-10 mr-10">{{initData.right}}%</span>
                                    </div>
                                    <div class="slide-input-wrap">
                                        <input class="slider-input" v-model="sliderValues" type="number" @blur="changeSlideValues(sliderValues)">
                                        <span class="slider-text" style="background: white;top:1px;bottom:1px;width: 20px">%</span>
                                    </div>
                                </div>
                            </div> -->
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'NUM'|t}}：</span>
                                <span class="desc"></span>
                            </div>
                            <el-form-item prop="dealNumber" label="">
                                <el-input v-model="ruleForm.dealNumber" :placeholder="$t('NUM_PLACE')" class="send_code send__advert" @keyup.native="fixeNumber(ruleForm,'dealNumber',20)">
                                    <span slot="append">{{coinList.filter(item=>item.id==ruleForm.coinId)[0]?coinList.filter(item=>item.id==ruleForm.coinId)[0].coinName:''}}</span>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'MINIMUN_LIMIT'|t}}：</span>
                                <span class="desc">{{'MINIMUN_LIMIT_DESC'|t}}</span>
                            </div>
                            <el-form-item prop="minLimitPrice" label="">
                                <el-input v-model="ruleForm.minLimitPrice" :placeholder="$t('MINIMUN_LIMIT_PLACE')" class="send_code send__advert" @keyup.native="fixeNumber(ruleForm,'minLimitPrice',20)">
                                    <span slot="append">{{coinList.filter(item=>item.id==ruleForm.coinId)[0]?coinList.filter(item=>item.id==ruleForm.coinId)[0].coinName:''}}</span>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'AD_MESSAGE'|t}}</span>
                                <span class="desc"></span>
                            </div>
                            <el-form-item prop="remark" label="">
                                <el-input v-model="ruleForm.remark" :placeholder="$t('AD_MESSAGE_PLACE')" type='textarea' :autosize="{ minRows: 11, maxRows: 11}"
                                    resize="none" v-show="defaultIndex=='BUY_TYPE'"></el-input>
                                <el-input v-model="ruleForm.remark" :placeholder="$t('AD_MESSAGE_PLACE')" type='textarea' :autosize="{ minRows:8.5, maxRows:8.5}"
                                    resize="none" v-show="defaultIndex=='SELL_TYPE'"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="flex">
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'MARKET_PRICE'|t}}:</span>
                            </div>
                            <el-form-item label="">
                                <el-input v-model="ruleForm.marketPrice" :placeholder="$t('MARKET_PRICE_PLACE')" class="send_code" disabled>
                                    <span slot="append">CNY</span>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'ADVERT_PRICE'|t}}：</span>
                                <!-- <span class="desc">{{'ADVERT_PRICE_DESC'|t}}</span> -->
                            </div>
                            <el-form-item prop="price" label="">
                                <el-input v-model="ruleForm.price" :placeholder="$t('ADVERT_PRICE')" class="send_code" @keyup.native="fixeNumber(ruleForm,'price',20)">
                                    <span slot="append">CNY</span>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="zx-form-label" v-if="defaultIndex=='BUY_TYPE'">
                            <div class="zx-form-title">
                                <span class="title">{{'PAGEMENT_METHOD'|t}}:</span>
                            </div>
                            <el-form-item label="" prop="payType">
                                <el-select v-model="ruleForm.payType" :placeholder="$t('CHOICE_RECEIVABLE')" class="form-select">
                                    <el-option :label="item[lang.toUpperCase()+'_PAY_KEY']" :value="item.PAY_VALUE" v-for="(item,key) of initData.list" :key=key></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'MAX_LIMIT'|t}}:</span>
                            </div>
                            <el-form-item prop="maxLimitPrice" label="">
                                <el-input v-model="ruleForm.maxLimitPrice" :placeholder="$t('MAX_LIMIT_PLACE')" class="send_code send__advert" @keyup.native="fixeNumber(ruleForm,'maxLimitPrice',20)">
                                    <span slot="append">{{coinList.filter(item=>item.id==ruleForm.coinId)[0]?coinList.filter(item=>item.id==ruleForm.coinId)[0].coinName:''}}</span>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'TOTAL_TRANSACTION'|t}}：</span>
                            </div>
                            <el-form-item label="">
                                <el-input v-model="ruleForm.total" :placeholder="$t('TOTAL_TRANSACTION')" disabled></el-input>
                            </el-form-item>
                        </div>
                        <div class="zx-form-label">
                            <div class="zx-form-title">
                                <span class="title">{{'USER_TRADE_PASS'|t}}:</span>
                            </div>
                            <el-form-item prop="tradePassowrd" label="">
                                <el-input v-model="ruleForm.tradePassowrd" :placeholder="$t('USER_TRADE_PASS_PLACE')" type='password'></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item v-show="deductData.deductCoinName!=coinList.filter(item=>item.id==ruleForm.coinId)[0].coinName">
                            <el-checkbox-group v-model="ruleForm.deductState" v-show="defaultIndex=='SELL_TYPE'" v-tippy='{ interactive : true ,arrow : true, arrowTransform : "translateX(-260px)",placement : "top-start"}' :title="deductStateText">
                                <el-checkbox :label="$t('PAYFREE')" name="deductState"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="7">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm',defaultIndex)" :loading="loadingBool" :disbaled='loadingBool' class="flex-btn"
                            :style="defaultIndex=='BUY_TYPE'?'background: #DE211D':'background:#DE211D;border-color: #DE211D'">{{'COMFIRM_SEND_ADVERT'|t}}</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import { Rules } from '@/providers/rules';
    import { Func } from '@/providers';
    import { mapState } from 'vuex';
    import { Coins, C2c, BB } from '@/services';
    import { BigNumber } from 'bignumber.js';
    export default {
        data() {
            // 最小交易限额不能小于后台设置的交易限额
            var validatorMinPrice = (rule, value, callback) => {
                if (Number(value) < Number(this.minTradeDonePrice)) {
                    return callback(new Error(`${this.$t('VALIDATORMINPRICE_ERR1')}${this.$C(this.minTradeDonePrice)}`));
                }
                if (Number(this.ruleForm.maxLimitPrice) && Number(value) > Number(this.ruleForm.maxLimitPrice)) {
                    return callback(new Error(`${this.$t('VALIDATORMINPRICE_ERR2')}`));
                }
                if (Number(value) > Number(this.ruleForm.dealNumber)) {
                    return callback(new Error(`${this.$t('VALIDATORMINPRICE_ERR3')}${this.$C(this.ruleForm.dealNumber)}`));
                }
                callback();
            }
            var validatorMaxLPrice = (rule, value, callback) => {
                if (Number(value) < Number(this.ruleForm.minLimitPrice)) {
                    return callback(new Error(`${this.$t('VALIDATORMAXLPRICE_ERR1')}`));
                }
                if (Number(value) > Number(this.ruleForm.dealNumber)) {
                    return callback(new Error(`${this.$t('VALIDATORMAXLPRICE_ERR2')}${this.$C(this.ruleForm.dealNumber)}`));
                }
                callback();
            }
            return {
                coinList: [],
                sliderValues: 0,
                value1: 0,
                minTradeDonePrice: 0, // 最小交易限额
                defaultIndex: 'BUY_TYPE',
                loadingBool: false,
                deductData: {
                    deductCoinName: ''
                },
                deductStateText: '',
                tabList: [
                    {
                        id: 1,
                        name: this.$t('WANT_TO_BUY'),
                        type: 'BUY_TYPE'
                    },
                    {
                        id: 2,
                        name: this.$t('WANT_TO_SELL'),
                        type: 'SELL_TYPE'
                    }
                ],
                ruleForm: {
                    coinId: '',
                    type: '',
                    dealNumber: '',
                    price: '',
                    discussPrice: '',
                    minLimitPrice: '',
                    maxLimitPrice: '',
                    marketPrice: '0',
                    payType: '',
                    remark: '',
                    tradePassowrd: '',
                    total: '',
                    deductState: false
                },
                lang: Func.getCookie('lang'),
                rules: {
                    dealNumber: [
                        { required: true, message: this.$t('NUM_PLACE'), trigger: 'blur' },
                        { type: 'number', message: this.$t('REQUIRE_NUMBER'), transform: value => +value },
                        { pattern: /^([+]?\d+(\.\d+)?)$/, message: this.$t('REQUIRE_NUMBER') },
                    ],
                    minLimitPrice: [
                        { required: true, message: this.$t('MINIMUN_LIMIT_PLACE'), trigger: 'blur' },
                        { type: 'number', message: this.$t('REQUIRE_NUMBER'), transform: value => +value },
                        { pattern: /^([+]?\d+(\.\d+)?)$/, message: this.$t('REQUIRE_NUMBER') },
                        { validator: validatorMinPrice, trigger: 'blur' }
                    ],
                    maxLimitPrice: [
                        { required: true, message: this.$t('MAX_LIMIT_PLACE'), trigger: 'blur' },
                        { type: 'number', message: this.$t('REQUIRE_NUMBER'), transform: value => +value },
                        { pattern: /^([+]?\d+(\.\d+)?)$/, message: this.$t('REQUIRE_NUMBER') },
                        { validator: validatorMaxLPrice, trigger: 'blur' }
                    ],
                    ...Rules
                },
                initData: { list: {} },
                numb: null
            };
        },

        methods: {
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
            changeSlideValues(values) {
                this.sliderValues = Number(values).toFixed(2);
                this.value1 = Number(Number(values).toFixed(2));
            },
            // 切换选项卡
            switchTab(item) {
                if (this.defaultIndex == item.type) { return false };
                this.defaultIndex = item.type;
                this.resetForm('ruleForm');
                this.getData();
            },
            // 提交页面信息
            submitForm(formName, type) {
                this.$refs[formName].validate(async (valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    }
                    let _parmas = this[formName];
                    this.loadingBool = true;
                    try {
                        let res = await C2c.EntrustAdd({
                            coinId: _parmas.coinId,
                            type: type,
                            dealNumber: _parmas.dealNumber,
                            price: _parmas.price,
                            // discussPrice: _parmas.discussPrice,
                            discussPrice: this.value1,
                            minLimitPrice: _parmas.minLimitPrice,
                            maxLimitPrice: _parmas.maxLimitPrice,
                            payType: _parmas.payType,
                            coinPrice: _parmas.marketPrice,
                            tradePassowrd: this.AES(_parmas.tradePassowrd),
                            remark: _parmas.remark,
                            deductState: _parmas.deductState ? 'Y' : 'N'
                        });
                        this.loadingBool = false;
                        this.SUCCESS(res[this.lang + 'Message']);
                        this.$router.push('/c2c');
                    } catch (error) {
                        this.loadingBool = false;
                        console.log(error);
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 显示小数点
            validNumLength(val, oldVal) {
                if (val && val > this.initData.right || val && val < this.initData.left) {
                    this.sliderValues = oldVal;
                }
                // this.sliderValues = this.sliderValues.toFixed(2)
                // this.sliderValues = this.sliderValues.replace(/\.{2,}/g, '.'); // 只保留第一个, 清除多余的
                // this.sliderValues = this.sliderValues.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                // this.sliderValues = this.sliderValues.replace(new RegExp('^(\\-)*(\\d+)\\.(\\d{1,2}).*$'), '$1$2.$3');
                // this.value1 = Number(this.sliderValues);
            },
            async getCoinList() {
                try {
                    let res = await Coins.UseList();
                    this.coinList = res.listData;
                    this.ruleForm.coinId = this.coinList[0].id;
                    this.entrustInit();
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取页面初始化信息
            async getData() {
                // this.numb = new BN(1.111);        
                this.getCoinList();
                this.DeductData();
            },
            async DeductData() {
                try {
                    let res = await BB.DeductData();
                    this.deductData = res.oneData;
                    let _data = res.oneData;
                    this.deductStateText = `${this.$t('DEDUCTSTATETEXT_1')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_2')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_3')}；${this.$t('DEDUCTSTATETEXT_1')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_3_1')}${(BigNumber(1).minus(BigNumber(_data.discount))) * 100}%${this.$t('DEDUCTSTATETEXT_3_2')}`
                } catch (error) {
                    console.log(error);
                }
            },
            async entrustInit() {
                try {
                    let res = await C2c.EntrustInit({
                        coinId: this.ruleForm.coinId,
                        type: this.defaultIndex
                    });
                    this.initData = res.oneData;
                    // this.value1 = (this.initData.right - this.initData.left) / 2;
                    // this.ruleForm.price = res.oneData.coinPrice * (1 - this.value1 / 100);
                    this.minTradeDonePrice = res.oneData.minTradeDonePrice; // 最小交易限额
                    this.ruleForm.marketPrice = res.oneData.coinPrice;
                } catch (error) {
                    console.log(error);
                }
            },
            // 乘法
            mul(a, b) {
                // BigNumber.config({ DECIMAL_PLACES: 15 });
                // let x = new BigNumber(a).decimalPlaces(20);
                // let y = new BigNumber(b).decimalPlaces(20);
                // console.log(x.toString().split('.')[1].length);
                // console.log(x.toString().split('.')[1]);
                // console.log(x.toString());
                // console.log(y.toString());
                // return new BigNumber(a * b).decimalPlaces(20);
                // console.log(new BigNumber(num).decimalPlaces(20).toString());
                let x = new BigNumber(a.toString());
                let y = new BigNumber(b.toString());
                let z = x.multipliedBy(y).decimalPlaces(20).toString();
                return z;
                // return BigNumber(a).multipliedBy(BigNumber(b));
            }
        },
        computed: {
            ...mapState([
                'userStatus'
            ])
        },
        watch: {
            value1(newVal, oldVal) {
                newVal = Number(newVal);
                this.sliderValues = newVal;
                this.ruleForm.price = this.initData.coinPrice * (1 - newVal / 100);
            },
            sliderValues(newVal, oldVal) {
                this.validNumLength(newVal, oldVal);
            },
            'ruleForm.price'(newVal, oldVal) {
                this.ruleForm.total = this.mul(newVal, this.ruleForm.dealNumber);
            },
            'ruleForm.dealNumber'(newVal, oldVal) {
                if (newVal == '') {
                    this.ruleForm.total = '';
                } else {
                    this.ruleForm.total = this.mul(newVal, this.ruleForm.price);
                }
            },
            'ruleForm.coinId'(newVal, oldVal) {
                // this.entrustInit();
            }
        },
        created() {
            if (this.userStatus.tradePasswordState == '0') {
                this.ALERT(this.$t('SET_TRADE_PASS'), () => {
                    this.$router.push('/user/safe')
                });
                return false;
            }
            this.getData();
        }
    };
</script>
<style lang="scss" scoped>
    @import '~@/assets/sass/user';
    @import '~@/assets/sass/c2c';
</style>