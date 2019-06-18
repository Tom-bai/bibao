<template>
    <div class="c2b-template">
        <!-- userStatus.credentialInfoState=='0'|| -->
        <div class="c2b-tip" v-if="userStatus.tradePasswordState=='0'||payInfo.length=='0'">
            <div style="display:inline-block;">
                <i class="icon"></i>{{'C2B_VERIF1'|t}}
                <!-- <router-link to="/user/safe/identity" v-if="userStatus.credentialInfoState=='0'">{{'REAL_NAME'|t}}</router-link> -->
                <router-link to="/user/safe/trade" v-if="userStatus.tradePasswordState=='0'">{{'USER_TRADE_PASS'|t}}{{'SETTING'|t}}</router-link>
                <router-link to="/user/safe" v-if="payInfo.length=='0'">{{'TRADER_TYPE_SET'|t}}</router-link>
                {{'C2B_VERIF2'|t}}
                <span>>></span>
            </div>
        </div>
        <div class="c2b-tip" v-show="userStatus.credentialInfoState=='1'&&userStatus.tradePasswordState=='1'&&payInfo.length!='0'">
            <!-- <i class="icon"></i>{{'C2B_VERIF'|t}} -->
            <p>{{'C2B_ADVERT'|t}}</p>
            <!-- <span>{{'REAL_NAME'|t}}>></span> -->
        </div>
        <div class="tab-list mt-20">
            <!-- <div class="tab-item active">USDT兑换</div> -->
            <div class="tab-item" v-for="(item,key) of coinList" :key=key :class="defalutIndex==key?'active':''" @click='swtichTab(item,key)'>{{item.coinName}}</div>
        </div>
        <el-row :gutter="20" class="mt-20">
            <el-col :span="12">
                <div class="grid-content">
                    <div class="form-wrap">
                        <el-form :model="buyForm" :rules="rules" ref="buyForm" class="demo-ruleForm">
                            <el-form-item prop="price">
                                <el-input v-model="buyForm.price" :placeholder="$t('TRANSACTION_PRICE_PLACE')" class="c2b-input" type="number" disabled>
                                    <span slot="prefix" class="c2b-input-text-left">{{'TRANSACTION_PRICE'|t}}：</span>
                                    <span slot="suffix" class="c2b-input-text c-red">CNY/{{itemInfo.coinName}}</span>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="amount">
                                <el-input v-model="buyForm.amount" class="c2b-input" @keyup.native="fixeNumber(buyForm,'amount',20)">
                                    <span slot="prefix" class="c2b-input-text-left">{{'NUM'|t}}：</span>
                                    <span slot="suffix" class="c2b-input-text c-red">{{itemInfo.coinName}}</span>
                                </el-input>
                            </el-form-item>
                            <p class="mb-10">{{'NEED'|t}} :
                                <span class="c-red">{{allBuyCount}}</span> CNY</p>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('buyForm','CTB_TRAN_BUY','showBool1')" class="flex-btn" style="background: #F5322D;border:none">立即购买</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content">
                    <div class="form-wrap">
                        <el-form :model="sellForm" :rules="rules" ref="sellForm" class="demo-ruleForm">
                            <el-form-item prop="price">
                                <el-input v-model="sellForm.price" :placeholder="$t('TRANSACTION_PRICE_PLACE')" class="c2b-input" type="number" disabled>
                                    <span slot="prefix" class="c2b-input-text-left">{{'TRANSACTION_PRICE'|t}}：</span>
                                    <span slot="suffix" class="c2b-input-text c-success">CNY/{{itemInfo.coinName}}</span>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="amount">
                                <el-input v-model="sellForm.amount" class="c2b-input" @keyup.native="fixeNumber(sellForm,'amount',20)">
                                    <span slot="prefix" class="c2b-input-text-left">{{'NUM'|t}}：</span>
                                    <span slot="suffix" class="c2b-input-text c-success">{{itemInfo.coinName}}</span>
                                </el-input>
                            </el-form-item>
                            <p class="mb-10">{{'AVAILABLE'|t}} :
                                <span class="c-success">{{allsellCount}}</span> CNY</p>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('sellForm','CTB_TRAN_SELL','showBool')" class="flex-btn" style="background: #00BB39;border:none">立即出售</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
        </el-row>
        <h3 class="recharge-title">{{'TRADE_NOTICE'|t}}：</h3>
        <div class="recharge-text-wrap" style="text-align: left">
            {{wordbook}}
            <!-- <p> 1.买卖商户均为实地考察认证商户，并提供100万usdt保证金，您每次兑换会冻结商户资产，商户资产不够时，不能接单，可放心兑换；</p>
            <p> 2.买卖商户均为实名认证商户，并提供保证金，可放心兑换；</p>
            <p> 3.如需申请成为商户请发邮件到123456@qq.com；</p>
            <p> 4.商家处理时间9:00 - 21:00非处理时间的订单会在第二天9:00开始处理，一般接单后24小时内会完成打款。</p> -->
        </div>
        <h3 class="recharge-title mt-20 mb-10">{{'PLATFORM_TRANSACTION_RECORD'|t}}：</h3>
        <el-row class="mb-10">
            <el-col :span="12">
                <el-table :data="buyData" style="width: 100%" :row-class-name="tableRowClassName" border class="c2b-datalist">
                    <el-table-column prop="nickname" :label="$t('MERCHANT')" width="180">
                        <template slot-scope="scope">
                            {{scope.row.nickname|phoneStr}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" :label="$t('QUANTITY_SOLD')" width="180">
                    </el-table-column>
                    <el-table-column :label="$t('TYPE')">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type=='CTB_TRAN_BUY'">{{'WANT_TO_BUY'|t}}</span>
                            <span v-else>{{'WANT_TO_SELL'|t}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" :label="$t('STATUS')"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <el-table :data="sellData" style="width: 100%" :row-class-name="tableRowClassNames" border class="c2b-datalist" empty-text="">
                    <el-table-column prop="nickname" :label="$t('MERCHANT')" width="180">
                        <template slot-scope="scope">
                            {{scope.row.nickname|phoneStr}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" :label="$t('QUANTITY_SOLD')" width="180">
                    </el-table-column>
                    <el-table-column :label="$t('TYPE')">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type=='CTB_TRAN_BUY'">{{'WANT_TO_BUY'|t}}</span>
                            <span v-else>{{'WANT_TO_SELL'|t}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" :label="$t('STATUS')"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!-- 确认兑换 -->
        <user-mask :value="showBool" position width="600px" height="500px" @close='showBool=false'>
            <div class="user-form-wrap">
                <div class="user-form-title">{{'C2C_TRADING'|t}}</div>
                <el-form :model="sellPayForm" :rules="rules" ref="sellPayForm" label-position="top">
                    <el-form-item prop="sellPayType" :label="$t('PAGEMENT_METHODS')">
                        <el-select v-model="sellPayForm.sellPayType" :placeholder="$t('CHOICE_RECEIVABLE')" class="form-select" @change="initCode('sellPayForm',sellPayForm.sellPayType)"
                            disabled>
                            <!-- <el-option v-for="item in payInfo" :key="item[lang+'Name']" :label="item[lang+'Name']" :value="item.value">
                            </el-option> -->
                            <el-option :label="$t('UNIONPAY')" value="UNIONPAY">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('PAYMENT_ACOUNTS')">
                        <!-- <el-input v-model="sellPayForm.code" :placeholder="$t('PAYMENT_ACOUNTS') " class="c2b-inputs" disabled></el-input> -->
                        <el-input v-model="sellPayForm.code" :placeholder="$t('PAYMENT_ACOUNTS') " class="c2b-inputs" disabled></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('NOTE_INFO')" prop="remarks">
                        <el-input v-model="sellPayForm.remarks" :placeholder="$t('NOTE_INFO') " class="c2b-inputs">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="tradePassword" :label="$t('USER_TRADE_PASS')+'：'">
                        <el-input v-model="sellPayForm.tradePassword " :placeholder="$t('USER_TRADE_PASS_PLACE')" class="c2b-inputs" type="password">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitPayForm('sellPay','sellForm','showBool','loadingBool')" class="flex-btn" style="background: #00BB39;border:none"
                            :loading="loadingBool" :disbaled='loadingBool'>{{'CONFIRM_HE_SALE'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </user-mask>
        <!-- 购买 -->
        <user-mask :value="showBool1" position width="600px" height="500px" @close='showBool1=false'>
            <div class="user-form-wrap">
                <div class="user-form-title">{{'WANT_TO_BUY'|t}}</div>
                <el-form :model="buyPayForm" :rules="rules" ref="buyPayForm" label-position="top">
                    <el-form-item prop="buyPayType" :label="$t('PAGEMENT_METHOD')">
                        <el-select v-model="buyPayForm.buyPayType" :placeholder="$t('PAGEMENT_METHOD')" class="form-select" @change="initCode('buyPayForm',buyPayForm.buyPayType)"
                            disabled>
                            <el-option v-for="item in payInfo" :key="item[lang+'Name']" :label="item[lang+'Name']" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('PAYMENT_ACOUNT')">
                        <el-input v-model="buyPayForm.code" :placeholder="$t('PAYMENT_ACOUNT')" class="c2b-inputs" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="$t('NOTE_INFO')" prop="remarks">
                        <el-input v-model="buyPayForm.remarks" :placeholder="$t('NOTE_INFO') " class="c2b-inputs">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="tradePassword" :label="$t('USER_TRADE_PASS')+'：'">
                        <el-input v-model="buyPayForm.tradePassword " :placeholder="$t('USER_TRADE_PASS_PLACE')" class="c2b-inputs" type="password">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitPayForm('buyPay','buyForm','showBool1','loadingBool1')" class="flex-btn" style="background: #F5322D;border:none"
                            :loading="loadingBool1" :disbaled='loadingBool1'>{{'CONFIRM_HE_PURCHASE'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </user-mask>
        <!-- 成功弹层 -->
        <user-mask :value="successBool" position width="600px" height="500px" @close='closeFn()'>
            <div class="success-mask">
                <i class="icon-success"></i>
                <div class="success-title">{{'TRADER_SUCCSSS'|t}}</div>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content">{{'PAYEE'|t}} : {{successData.name}}</div>
                    </el-col>
                    <el-col :span="24">
                        <div class="grid-content">{{$t('PAYMENT_ACOUNTS')}} :
                            <span class="c-blue">{{successData.code}}</span>
                            <span v-if="successData.bank">（{{successData.bank}}）</span>
                        </div>
                    </el-col>
                    <el-col :span="24" v-if="successData.address">
                        <div class="grid-content">{{$t('BANK_ADDREDD')}} :{{successData.address}}</div>
                    </el-col>
                    <el-col :span="24">
                        <div class="grid-content">{{$t('ORDER_NUMBER')}} : {{successData.orderNo}}</div>
                    </el-col>
                </el-row>
            </div>
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { Rules } from '@/providers/rules';
    import { Coins, C2b, C2c, User } from '@/services';
    import { mapState } from 'vuex';
    import { Func } from '@/providers';
    import { BigNumber } from 'bignumber.js';
    export default {
        data() {
            return {
                coinList: [],
                defalutIndex: '0',
                defaultType: 'CTB_TRAN_BUY',
                itemInfo: {},
                payInfo: [],
                lang: Func.getCookie('lang'),
                successData: {},
                showBool: false,
                showBool1: false,
                successBool: false,
                loadingBool: false,
                loadingBool1: false,
                buyForm: {
                    price: '',
                    amount: ''
                },
                sellForm: {
                    price: '',
                    amount: ''
                },
                buyPayForm: {
                    buyPayType: '',
                    remarks: '',
                    tradePassword: '',
                    code: ''
                },
                sellPayForm: {
                    sellPayType: 'UNIONPAY',
                    remarks: '',
                    tradePassword: '',
                    code: ''
                },
                rules: Rules,
                buyData: [],
                wordbook: '',
                sellData: []
            };
        },
        computed: {
            ...mapState([
                'userStatus'
            ]),
            allBuyCount() {
                return Number(this.mul(this.buyForm.price, this.buyForm.amount)) ? Number(this.mul(this.buyForm.price, this.buyForm.amount)) : '0';
            },
            allsellCount() {
                return Number(this.mul(this.sellForm.price, this.sellForm.amount)) ? Number(this.mul(this.sellForm.price, this.sellForm.amount)) : '0';
            }
        },
        methods: {
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
                } else {
                    b = obj[child].slice(0, 10);
                    this.$set(obj, child, b);
                }
            },
            closeFn() {
                this.buyForm.amount = '';
                this.sellForm.amount = '';
                this.successBool = false;
                // this.resetForm('buyForm');
                // this.resetForm('sellForm');
                // this.resetForm('buyPayForm');
                // this.resetForm('sellPayForm');
            },
            initCode(formName, value) {
                this[formName].code = this.payInfo.filter((item, key) => item.value == value)[0].value;
            },
            // 切换选项卡
            swtichTab(item, key) {
                if (this.defalutIndex == key) { return false };
                this.defalutIndex = key;
                this.itemInfo = item;
                this.transactionList(this.itemInfo);
            },
            tableRowClassName({ row, rowIndex }) {
                return 'warning-row';
            },
            tableRowClassNames({ row, rowIndex }) {
                return 'success-row';
            },
            submitPayForm(payType, formName, bool, loadingBoolean) {
                this.$refs[payType + 'Form'].validate(async (valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    }
                    let _parmas = this[payType + 'Form'];
                    let _parmasForm = this[formName];
                    this[loadingBoolean] = true;
                    try {
                        let res = await C2b.TransactionAdd({
                            price: _parmasForm.price,
                            amount: _parmasForm.amount,
                            coinId: this.itemInfo.id,
                            type: this.defaultType,
                            remark: _parmas.remarks,
                            tradePassword: this.AES(_parmas.tradePassword),
                            payType: _parmas[payType + 'Type']
                        });
                        this.successData = res.data;
                        if (payType == 'buyPay') {
                            this.successBool = true;
                        } else {
                            this.SUCCESS(this.$t('SUUCEESS_SEND_ADVERT'));
                        }
                        this.transactionList(this.itemInfo);
                    } catch (error) {
                        console.log(error);
                    }
                    this[bool] = false;
                    this[loadingBoolean] = false;
                });
            },
            submitForm(formName, type, bool) {
                if (!this.loginStatus()) {
                    this.ALERT(this.$t('NOTLOGIN'))
                    return false
                };
                let _status = this.userStatus;
                if (_status && _status.tradePasswordState == '0') {
                    this.$notify({
                        title: this.$t('WARMTIPS'),
                        type: 'warning',
                        message: this.$t('SET_TRADE_PASS')
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
                if (!this.payInfo) {
                    this.$notify({
                        title: this.$t('WARMTIPS'),
                        type: 'warning',
                        message: this.$t('TRADE_TYPE_SET')
                    });
                    return false;
                }
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    }
                    let _parmas = this[formName];
                    this.defaultType = type;
                    this[bool] = true;
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            async getCoinList() {
                try {
                    let res = await Coins.UseList();
                    this.coinList = res.listData;
                    this.itemInfo = this.coinList[0];
                    this.transactionList(this.itemInfo);
                } catch (error) {
                    console.log(error);
                }
            },
            async transactionList(item) {
                try {
                    let res = await C2b.TransactionList({
                        coinId: item.id
                    });
                    this.buyData = res.data.buyList;
                    this.sellData = res.data.sellList;
                    this.buyForm.price = res.data.price ? res.data.price : '0';
                    this.sellForm.price = res.data.price ? res.data.price : '0';
                    let map = new Map();
                    //  已撤销：CTB_UNDO 审核中：CTB_GOON 拒绝：CTB_CANCEL 通过：CTB_DONE 
                    map.set('CTB_UNDO', this.$t('CANCELED')).set('CTB_GOON', this.$t('CHECKING')).set('CTB_CANCEL', this.$t('REFUSE')).set('CTB_DONE', this.$t('ADOPT'))
                    for (let item of this.buyData) {
                        item.status = map.get(item.status);
                    };
                    for (let item of this.sellData) {
                        item.status = map.get(item.status);
                    };
                    this.wordbook = res.data[this.lang + 'WordbookValue']
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取状态
            getState() {
                User.getMemberState().then(res => {
                    this.$store.state.userStatus = res.oneData;
                }).catch(err => {
                    console.log(err)
                })
            },

            // 获取信息
            getData() {
                this.getCoinList();
                this.OrderPayList();
                this.getState();
            },
            // 广告用户付款信息
            async OrderPayList() {
                if (!this.loginStatus()) {
                    return false
                };
                try {
                    let res = await C2c.OrderPayList();
                    this.payInfo = res.listData;
                    for (let item of res.listData) {
                        if (item.value == 'UNIONPAY') {
                            this.sellPayForm.code = item.code;
                            this.buyPayForm.code = item.code;
                        }
                    }
                    this.sellPayForm.sellPayType = 'UNIONPAY';
                    this.buyPayForm.buyPayType = 'UNIONPAY';
                } catch (error) {
                    console.log(error);
                }
            },
        },
        created() {
            if (this.userStatus.tradePasswordState == '0') {
                this.ALERT(this.$t('SET_TRADE_PASS'), () => {
                    this.$router.push('/user/safe')
                });
                return false;
            }
            if (this.userStatus.bankState == '0') {
                this.ALERT(this.$t('ADD_BANKS'), () => {
                    this.$router.push('/user/safe')
                });
                return false;
            }
            this.getData();
        },
        components: { userMask }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/c2b';
</style>