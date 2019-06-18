<template>
    <div class="order-list">
        <div class="user-cont">
            <div class="tab-list">
                <!-- <div class="tab-item" v-for="(item,key) of tabList" :key="key" :class="defalutType==item.type?'active':''">
                    {{item.name}}
                </div> -->
                <div class="tab-item" v-for="(item,key) of tabList" :key="key" :class="defalutType==item.type?'active':''" @click="switchTab(item)">
                    {{item.name}}
                </div>
            </div>
        </div>
        <div class="coin-list">
            <div class="content box-flex space-between asset-record clearfix">
                <div class="flex">
                    <i class="record-icon"></i>
                    <h3>{{'MY_ADVERT'|t}}</h3>
                </div>
                <div class="input-suffix">
                    <span>{{'TRADE_TYPE'|t}}：</span>
                    <el-select v-model="payType" :placeholder="$t('TRADE_TYPE_PLACE')">
                        <el-option :label="$t('ALL')" value=""></el-option>
                        <el-option v-for="(item,key) of payInfo" :key="key" :label="item[lang+'Name']" :value="item.value">
                        </el-option>
                    </el-select>
                    <span>{{'CURRENCY'|t}}：</span>
                    <el-select v-model="coinId" :placeholder="$t('CURRENCY_PLACE')">
                        <el-option :label="$t('ALL')" value=""></el-option>
                        <el-option v-for="(item,key) of coinList" :key=key :label="item.coinName" :value="item.id">
                        </el-option>
                    </el-select>
                    <!-- <span>{{'STATUS'|t}}：</span>
                    <el-select v-model="state" placeholder="请选择">
                        <el-option :label="$t('ALL')" value=""></el-option>
                        <el-option v-for="(item,key) in stateData" :key="key" :label="item[lang+'Name']" :value="item.value">
                        </el-option>
                    </el-select> -->
                    <span class="search-button" @click="searchData()">{{'TAB2_TITLE'|t}}</span>
                </div>
            </div>
        </div>
        <div class="content content-data">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="coinName" :label="$t('CURRENCY')" sortable width="100"></el-table-column>
                <el-table-column prop="dealPrice" :label="$t('UNIT_PRICE')" sortable>
                    <template slot-scope="scope">
                        {{$C(scope.row.dealPrice)}}{{scope.row.coinName}}
                    </template>
                </el-table-column>
                <el-table-column prop="usableNumber" :label="$t('RESIDUAL_QUANTITY')" sortable>
                    <template slot-scope="scope">
                        {{$C(scope.row.usableNumber)}}
                    </template>
                </el-table-column>
                <el-table-column prop="dealNumber" :label="$t('TARGET_TRADING_VOLUME')" sortable>
                    <template slot-scope="scope">
                        {{$C(scope.row.dealNumber)}}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="discussPrice" :label="$t('PREMIUM')" sortable></el-table-column> -->
                <el-table-column :label="$t('QUOTA')" sortable>
                    <template slot-scope="scope">
                        {{$C(scope.row.minLimitPrice)}}-{{$C(scope.row.maxLimitPrice)}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('STATUS')" sortable>
                    <template slot-scope="scope">
                        <el-button type="text" class="c-red" v-if="scope.row.state=='GO_ON'">{{'COMMISSIONED'|t}}</el-button>
                        <el-button type="text" class="c-red" v-if="scope.row.state=='END'">{{'UNDO'|t}}</el-button>
                        <el-button type="text" class="c-red" v-if="scope.row.state=='DONE'">{{'COMPLETE'|t}}</el-button>
                        <el-button type="text" class="c-red" v-if="scope.row.state=='CLOSE'">{{'AUTOMATIC_REVOCATION'|t}}</el-button>
                        <!-- <el-button type="text" class="c-red">交易成功</el-button> -->
                        <!-- <el-button type="text" class="c-red">交易失败</el-button> -->
                        <!-- <el-button>确定交易</el-button> -->
                    </template>
                </el-table-column>
                <el-table-column :label="$t('OPERATION')" sortable width="200">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" class="c-red" v-if="scope.row.state=='GO_ON'">{{'COMMISSIONED'|t}}</el-button>
                        <el-button type="text" class="c-red" v-if="scope.row.state=='END'">{{'UNDO'|t}}</el-button>
                        <el-button type="text" class="c-red" v-if="scope.row.state=='DONE'">{{'COMPLETE'|t}}</el-button>
                        <el-button type="text" class="c-red" v-if="scope.row.state=='CLOSE'">{{'AUTOMATIC_REVOCATION'|t}}</el-button> -->
                        <!-- <el-button type="text" class="c-red">交易成功</el-button> -->
                        <!-- <el-button type="text" class="c-red">交易失败</el-button> -->
                        <!-- <el-button>确定交易</el-button> -->
                        <el-button v-if="defalutType!='CANCLE_TYPE'&&scope.row.state=='GO_ON'" @click="cancelOrder(scope.row.id)" size="mini">{{'UNDO'|t}}</el-button>
                        <el-button v-if="defalutType=='CANCLE_TYPE'" @click="cancelOrder(scope.row.id)" size="mini">{{'DELETE'|t}}</el-button>
                        <el-button type="text" @click="$router.push({name:'c2c_order_detail',query:{id:scope.row.id}})" size="mini">{{'DETAIL'|t}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block text-c mt-10 mb-10">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="limit"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <user-mask :value="showBool" position width="600px" height="500px">
            <div class="user-form-wrap">
                <div class="user-form-title">{{'C2C_TRADING'|t}}</div>
                <el-form :model="mobileForm" :rules="rules" ref="mobileForm">
                    <div class="box-flex">
                        <div class="flex mr-10">
                            <el-form-item prop="name" :label="$t('NUM')">
                                <el-input v-model="mobileForm.name" :placeholder="$t('NUM_PLACE') ">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="flex">
                            <el-form-item prop="name" :label="$t('TRANSACTION_AMOUNT')">
                                <el-input v-model="mobileForm.name" :placeholder="$t('TRANSACTION_AMOUNT') ">
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item prop="name" :label="$t('USER_TRADE_PASS')">
                        <el-input v-model="mobileForm.name" :placeholder="$t('USER_TRADE_PASS_PLACE')">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <!-- <el-button type="primary" @click="submitForm('mobileForm')" class="flex-btn">{{'DETERMINE'|t}}</el-button> -->
                        <el-button type="primary" class="flex-btn">{{'CERTAINTY_TRANSACTION'|t}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { Rules } from '@/providers/rules';
    import { Coins, C2c, Order } from '@/services';
    import { Func } from '@/providers';
    export default {
        data() {
            return {
                coinList: [],
                stateData: [],
                showBool: false,
                payInfo: [],
                coinId: '',
                state: '',
                payType: '',
                page: 1,
                limit: 10,
                total: 0,
                defalutType: 'BUY_TYPE',
                lang: Func.getCookie('lang'),
                mobileForm: {
                    name: '',
                    type: []
                },
                rules: Rules,
                tabList: [
                    {
                        id: 1,
                        type: 'BUY_TYPE',
                        name: this.$t('ADVERTISEMENT')
                    },
                    {
                        id: 2,
                        type: 'SELL_TYPE',
                        name: this.$t('AN_ADVERTISEMENT_FOR_SALE')
                    },
                    {
                        id: 3,
                        type: 'CANCLE_TYPE',
                        name: this.$t('REVOCATION_OF_ADVERTISING')
                    }
                ],
                tableData: []
            };
        },
        components: { userMask },
        methods: {
            // 取消删除广告
            async cancelOrder(id) {
                try {
                    let res = await C2c.EntrustUserEdit({
                        type: this.defalutType,
                        entrustId: id
                    });
                    console.log(res);
                    this.SUCCESS(res[this.lang + 'Message']);
                    this.EntrustUserList();
                } catch (error) {
                    console.log(error)
                }
            },
            searchData() {
                this.page = 1;
                this.EntrustUserList();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.EntrustUserList();
            },
            // 切换选项卡
            switchTab(item) {
                if (this.defalutType == item.type) { return false; }
                this.defalutType = item.type;
                this.coinId = '';
                this.state = '';
                this.payType = '';
                this.EntrustUserList();
            },
            // 获取币种
            async getCoinList() {
                try {
                    let res = await Coins.UseList();
                    this.coinList = res.listData;
                } catch (error) {
                    console.log(error);
                }
            },
            async EntrustUserList() {
                try {
                    let res = await C2c.EntrustUserList({
                        page: this.page,
                        limit: this.limit,
                        coinId: this.coinId,
                        type: this.defalutType,
                        // state: this.state,
                        payType: this.payType
                    });
                    this.tableData = res.oneData.list;
                    let map = new Map();
                    for (let item of this.payInfo) {
                        map.set(item.value, [this.lang + 'Name']);
                    }
                    for (let item of this.tableData) {
                        item.states = map.get(item.state);
                    }
                    this.total = res.oneData.total;
                } catch (error) {
                    console.log(error)
                }
            },
            async EntrustStateList() {
                try {
                    let res = await C2c.EntrustStateList({});
                    this.payInfo = res.data.payType;
                    // this.stateData = res.data.state;
                    this.EntrustUserList();
                } catch (error) {
                    console.log(error);
                }
            },
            getData() {
                this.getCoinList();
                this.EntrustStateList();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        created() {
            this.getData();
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/asset';
    @import '~@/assets/sass/order.scss';
</style>