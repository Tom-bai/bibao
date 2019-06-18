<template>
    <div class="c2c-wrap">
        <div class="c2c-banner">
            <div class="c2c-banner-wrap">
                <img src="~@/assets/img/c2c-banner.png" alt="" class="c2c-img">
                <div v-show="loginStatus()">
                    <div class="otb-banner-text" v-if="userStatus.credentialInfoState=='0'">
                        <p>{{'YOU_NEED'|t}}
                            <span class="c-success">{{'REAL_NAME'|t}}>></span>{{'PUBLIC_ADVERT'|t}}</p>
                        <a href="javascript:;" class="c2c-banner-btn">{{'ADVERTISING'|t}}</a>
                    </div>
                    <div class="otb-banner-text" v-if="userStatus.credentialInfoState=='1'">
                        <p>{{'PUBLIC_C2C_ADVERT'|t}}</p>
                        <a href="javascript:;" class="c2c-banner-success-btn" @click="$router.push('/c2c/advert')">{{'ADVERTISING'|t}}</a>
                    </div>
                </div>
                <div class="otb-banner-text" v-show="!loginStatus()">
                    <p>{{'YOU_NEED'|t}}
                        <router-link to="/signin" class="c-success">{{'LOGIN_TITLE'|t}}</router-link>
                        {{'OR'|t}}
                        <router-link to="/signup" class="c-success">{{'SIGNUP'|t}}</router-link>
                        {{'PUBLIC_ADVERT'|t}}
                    </p>
                    <!-- <a href="javascript:;" class="c-success" @click="$router.push('/signin')">登录</a>或 -->
                    <!-- <a href="javascript:;" class="c-success" @click="$router.push('/signup')">{{'LOGIN_TITLE'|t}} </a>才能够发布广告哦!</p> -->
                </div>
                <!-- loginStatus -->
            </div>

        </div>
        <div class="user-cont">
            <div class="tab-list">
                <a href="javascript:;" class="tab-item" v-for="(item,key) of tabList" :key="key" :class="defaultIndex==item.type?'active':''"
                    @click="switchTab(item)">{{item.name}}</a>
            </div>
        </div>
        <div class="text-c mt-10">
            <el-input :placeholder="'MINPRICE'|t" v-model="leftValue" @keyup.enter.native="search()" style="width: 200px;">
            </el-input>
            <el-input :placeholder="'MAXPRICE'|t" v-model="rightValue" @keyup.enter.native="search()" style="width: 200px;">
            </el-input>
            <el-button type="primary" class="flex-btn" style="background: #752bf7;width: 100px" @click="search">{{'DETERMINE'|t}}</el-button>
        </div>
        <div class="box-flex space-between c2c-search-wrap">
            <div class="c2c-coin">
                <a href="javascript:;" class="c2c-coin-item" :class="defaultCoinIndex=='-1'?'active':''" @click="getList({},'-1')">{{'ALLCOIN'|t}}</a>
                <a href="javascript:;" class="c2c-coin-item" v-for="(item,key) of coinList" :key=key @click="getList(item,key)" :class="key==defaultCoinIndex?'active':''">{{item.coinName}}</a>
            </div>
            <div class="c2c-search float-r c2c-search-mutity" style="z-index: 9;display: none;">
                <el-input placeholder="中国 / 人民币 / 全部付款方式" v-model="select">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
                </el-input>
                <div class="c2c-search-mask" v-show="showBool" style="position: fixed;left:0;right:0;bottom:0;top:0;background: rgba(0,0,0,0);z-index: 2"
                    @click="showBool=!showBool"></div>
                <transition name="slide-fade">
                    <div class="c2c-search-cont" v-if="showBool" ref="c2cSearchCont">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top">
                            <el-form-item label="国家" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择国家" class="form-select">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('CURRENCY')" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择币种" class="form-select">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="支付方式" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择支付方式" class="form-select">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="限额" prop="region">
                                <el-input v-model="ruleForm.region" placeholder="输入交易金额"></el-input>
                            </el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form>
                    </div>
                </transition>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
            <el-table-column :label="$t('HAS_AUTH')" sortable width="200">
                <template slot-scope="scope">
                    <div class="user-verif">
                        <i class="icon success"></i>
                        <!-- <i class="icon info"></i> -->
                        {{scope.row.nickname}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="name" :label="defaultIndex=='BUY_TYPE'?$t('PAGEMENT_METHOD'):$t('PAGEMENT_METHODS')" sortable width="180">
                <template slot-scope="scope">
                    <div class="pay-type">
                        <i class="icon" v-for="(item,key) of scope.row.payType.split(',')" :key="key" :class="item"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="coinName" :label="$t('CURRENCY')"></el-table-column>
            <el-table-column :label="$t('QUOTA')" sortable>
                <template slot-scope="scope">
                    <div>{{$C(scope.row.minLimitPrice)}} ~ {{$C(scope.row.maxLimitPrice)}}{{scope.row.coinName}}</div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('ADVERT_PRICE')" sortable>
                <template slot-scope="scope">
                    <span class="c2c-btn-text">{{$C(scope.row.dealPrice)}}CNY</span>
                </template>
            </el-table-column>
            <el-table-column prop="usableNumber" :label="$t('NUM')" sortable>
                <template slot-scope="scope">
                    <span class="c2c-btn-text">{{$C(scope.row.usableNumber)}} {{scope.row.coinName}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('OPERATION')">
                <template slot-scope="scope">
                    <a href="javascript:;" class="c2c-btn" @click="goPath(scope.row)">
                        <span v-if="defaultIndex=='BUY_TYPE'">{{'WANT_TO_SELL'|t}}</span>
                        <span v-else>{{'WANT_TO_BUY'|t}}</span>
                    </a>
                </template>
            </el-table-column>
        </el-table>
        <div class="block text-c mt-10 mb-10">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="limit"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { Coins, C2c } from '@/services';
    import { mapState, mapGetters } from 'vuex';
    export default {
        data() {
            return {
                showBool: false,
                select: '',
                total: 0,
                defaultIndex: 'BUY_TYPE',
                defaultCoinIndex: '-1',
                leftValue: '',
                rightValue: '',
                ruleForm: {
                    name: '',
                    region: ''
                },
                coinList: [],
                page: 1,
                limit: 10,
                flag: false, // 判断是否已认证
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    region: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    date1: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    date2: [
                        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    type: [
                        { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                    ],
                    resource: [
                        { required: true, message: '请选择活动资源', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请填写活动形式', trigger: 'blur' }
                    ]
                },
                tabList: [
                    {
                        id: 1,
                        name: this.$t('I_WANT_TO_SELL'),
                        type: 'BUY_TYPE'
                    },
                    {
                        id: 2,
                        name: this.$t('I_WANT_TO_BUY'),
                        type: 'SELL_TYPE'
                    }
                ],
                tableData: [],
                coinItem: {},
                payInfo: []
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ]),
        },
        methods: {
            // 广告用户付款信息
            async entrustPayInfo() {
                try {
                    let res = await C2c.EntrustPayInfo({});
                    this.payInfo = res.listData;
                } catch (error) {
                    console.log(error);
                }
            },
            goPath(item) {
                if (!this.loginStatus()) {
                    this.ALERT(this.$t('NOTLOGIN'));
                    return false;
                }
                // 提醒绑定-------
                // 交易方式绑定
                let payState = false;
                if (this.userStatus.alipayState == 1 || this.userStatus.wechatState == 1 || this.userStatus.bankState == 1) {
                    payState = true;
                } else {
                    payState = false;
                }

                // 有其中一项没通过就跳转到认证页面
                let IDWord = this.userStatus.credentialInfoState ? '' : this.$t('BEFORE_TRADE_ID');
                let dealPwdWord = this.userStatus.tradePasswordState ? '' : this.$t('BEFORE_TRADE_TRADECODE');
                let payWord = payState ? '' : this.$t('BEFORE_TRADE_COLLECT');
                let allWord = (IDWord + dealPwdWord + payWord).slice(0, -1);
                if (!(payState && this.userStatus.credentialInfoState && this.userStatus.tradePasswordState)) {
                    this.ALERT(this.$t('BEFORE_TRADE_TEXT1') + allWord + this.$t('BEFORE_TRADE_TEXT2'), () => {
                        this.$router.push('/user/safe')
                    });
                    return
                }

                // 提醒交易方式不同-------
                let BANKPAY_Text = '';
                let ALIPAY_Text = '';
                let WECHATPAY_Text = '';
                if (
                    (/UNIONPAY/.test(item.payType) && this.userStatus.bankState == 1) ||
                    (/ALIPAY/.test(item.payType) && this.userStatus.alipayState == 1) ||
                    (/WECHAT/.test(item.payType) && this.userStatus.wechatState == 1)
                ) {
                    // 全部通过时跳转页面
                    this.$router.push({ path: '/c2c/sale', query: { memberId: item.memberId, id: item.id, type: this.defaultIndex == 'BUY_TYPE' ? 'SELL_TYPE' : 'BUY_TYPE' } })
                }
                else {
                    if (/UNIONPAY/.test(item.payType)) BANKPAY_Text = this.$t('BANKPAY') + ',';
                    if (/ALIPAY/.test(item.payType)) ALIPAY_Text = this.$t('ALIPAY') + ',';
                    if (/WECHAT/.test(item.payType)) WECHATPAY_Text = this.$t('WECHATPAY') + ',';
                    let alltext = BANKPAY_Text + ALIPAY_Text + WECHATPAY_Text;
                    this.WARN(this.$t('PAYWAY_NO_MATCH1') + alltext.slice(0, -1) + this.$t('PAYWAY_NO_MATCH2'))
                }
                // var arr = [];
                // for (let items of item.payType.split(',')) {
                //     for (let i of this.payInfo) {
                //         if (items == i.payType) {
                //             arr.push(i)
                //         }
                //     }
                // }
                // if (!arr.length) {
                //     this.ALERT(this.$t('SET_PAY_TYPES'), () => {
                //         this.$router.push('/user/safe')
                //     });
                //     return false;
                // }
                // this.$router.push({ path: '/c2c/sale', query: { memberId: item.memberId, id: item.id, type: this.defaultIndex == 'BUY_TYPE' ? 'SELL_TYPE' : 'BUY_TYPE' } })
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getList(this.coinItem)
            },
            // 切换列表
            switchTab(item) {
                this.defaultIndex = item.type;
                this.page = 1;
                this.getList({}, -1);
            },
            handleIconClick() {
                this.showBool = !this.showBool;
                // this.$refs.c2cSearchCont.focus();
            },
            submitForm(formName) {
                this.select = '中国/CNY/支付宝';
                this.handleIconClick();
                // this.$refs[formName].validate((valid) => {
                //   if (valid) {
                //     alert('submit!');
                //   } else {
                //     console.log('error submit!!');
                //     return false;
                //   }
                // });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getData() {
                this.getCoinList();
                if (this.loginStatus()) {
                    // this.entrustPayInfo();
                }
                this.getList({});
            },
            getList(item, key) {
                if (key || key == '0') {
                    this.defaultCoinIndex = key;
                }
                this.coinItem = item;
                this.entrustList(this.coinItem);
            },
            search() {
                this.page = 1;
                this.limit = 10;
                this.entrustList(this.coinItem);
            },
            async entrustList(item) {
                try {
                    let res = await C2c.EntrustList({
                        page: this.page,
                        limit: this.limit,
                        left: this.leftValue,
                        right: this.rightValue,
                        coinId: item.id ? item.id : '',
                        type: this.defaultIndex
                    });
                    this.tableData = res.oneData.list;
                    this.total = res.oneData.total;
                    this.flag = res.oneData.flag;
                } catch (error) {
                    console.log(error);
                }
            },
            async getCoinList() {
                try {
                    let res = await Coins.UseList();
                    this.coinList = res.listData;
                } catch (error) {
                    console.log(error);
                }
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>
<style lang="scss" scoped>
    @import '~@/assets/sass/c2c';
    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>