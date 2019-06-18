<template>
    <div class="asset-template">
        <div class="coin-list" v-show="!setBool">
            <div class="content clearfix">
                <div class="asset-tab-wrap fr" v-if="activeCoin.legalTender==false">
                    <span :class="activeRouter == 'RECHARGE' ? 'tab-item active':'tab-item'" @click="changeRouter('RECHARGE')">{{'RECHARGE'|t}}</span>
                    <span :class="activeRouter == 'WITHDRAW' ? 'tab-item active':'tab-item'" @click="changeRouter('WITHDRAW')">{{'WITHDRAWLS'|t}}</span>
                </div>
                <div class="ovh">
                    <button type="button" :disabled="item.legalTender==true && (activeRouter == 'RECHARGE'||activeRouter == 'WITHDRAW')" class="coin-item"
                        v-for="item in coinList" :key="item.a" :class="activeCoin.id==item.id?'active':''" @click="changeActive(item)">{{item.coinName}}</button>
                </div>
            </div>
        </div>

        <div v-show="!setBool">
            <!-- 资产与记录 -->
            <div v-show="activeRouter == 'LIST'">
                <div class="content box-flex space-between coin-asset-cont clearfix">
                    <!-- <div class="flex coin-asset-item">
                        <i class="icon icon-yellow"></i>
                        <p>总资产可用余额</p>
                        <h2>{{activeBalance.enbalance}} {{activeBalance.coinName}}</h2>
                    </div> -->
                    <div class="flex coin-asset-item">
                        <i class="icon icon-green"></i>
                        <p>{{'AVALIABLE'|t}}</p>
                        <h2>{{$C(activeBalance.enbalanceStr)}} {{activeBalance.coinName}}</h2>
                        <p> ≈ {{worthCny}} CNY</p>
                    </div>
                    <div class="flex    coin-asset-item">
                        <i class="icon icon-red"></i>
                        <p>{{'FREEZING'|t}}</p>
                        <h2>{{$C(activeBalance.unbalanceStr)}} {{activeBalance.coinName}}</h2>
                    </div>
                    <div class="flex coin-asset-item">
                        <i class="icon icon-blue"></i>
                        <p>{{'ALL_ASSETS'|t}}</p>
                        <h2>{{$C(activeBalance.totalBalance)}} {{activeBalance.coinName}}</h2>
                    </div>
                </div>
                <div class="coin-list">
                    <div class="content box-flex space-between asset-record clearfix">
                        <div class="flex">
                            <i class="asset-icon"></i>
                            <h3>{{'ASSETS_RECORD'|t}}</h3>
                        </div>
                        <div class="input-suffix">
                            <span>{{'CURRENCY'|t}}：</span>
                            <el-select v-model="recordOption.coinId">
                                <el-option :label="'ALL'|t" value=""></el-option>
                                <el-option v-for="item in coinList" :key="item.a" :label="item.coinName" :value="item.id"></el-option>
                            </el-select>
                            <span>{{'TYPE'|t}}：</span>
                            <el-select v-model="recordOption.type">
                                <el-option :label="'ALL'|t" value="0"></el-option>
                                <el-option :label="'RECHARGE'|t" value="1"></el-option>
                                <el-option :label="'WITHDRAWLS'|t" value="2"></el-option>
                            </el-select>
                            <el-button class="search-button" @click="search">{{'TAB2_TITLE'|t}}</el-button>
                        </div>
                    </div>
                </div>
                <div class="content content-data">
                    <el-table :data="recordData" style="width: 100%">
                        <el-table-column prop="createDate" :label="'TIME'|t" sortable width="180"></el-table-column>
                        <el-table-column prop="coinName" :label="'CURRENCY'|t" sortable width="180"></el-table-column>
                        <el-table-column prop="type" :label="'TYPE'|t" sortable width="180">
                            <template slot-scope="scope">{{typeFn(scope.row.type)}}</template>
                        </el-table-column>
                        <el-table-column prop="fee" :label="'SERVER_CHARGE'|t" sortable class="c-blue"></el-table-column>
                        <el-table-column prop="tradeNum" :label="'AMOUNT'|t" sortable>
                            <template slot-scope="scope">
                                <el-button type="text">{{scope.row.tradeNum}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column :label="'STATUS'|t" sortable>
                            <template slot-scope="scope">
                                <span class="c-red" v-if="scope.row.state==='AUDITING_FAIL'">{{'AUDITING_FAIL'|t}}</span>
                                <span class="c-red" v-if="scope.row.state==='FAIL'">{{'FAILT'|t}}</span>
                                <span class="c-fail" v-if="scope.row.state==='BLOCK_SYNCHING'">{{'BLOCK_SYNCHING'|t}}</span>
                                <span class="c-fail" v-if="scope.row.state==='AUDITING'">{{'CHECKING'|t}}</span>
                                <span class="c-success" v-if="scope.row.state==='SUCCESS'">{{'SUCCESS'|t}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="">
                            <template slot-scope="scope">
                                <el-button type="text" @click="goDetail(scope.row)">{{'DETAIL'|t}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页器 -->
                    <el-pagination layout="prev, pager, next" :current-page="curpage" :page-size="pageSize" :total="numCount" class="pagination"
                        @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>

            <!-- 充值提现 -->
            <user-mask @close="close($event)" :value='rechargeOrWithdrawBool' height="500px" width="100%" class="email-template content">
                <!-- 充值 -->
                <div class="user-form-wrap" style="width: 640px" v-show="activeRouter == 'RECHARGE'">
                    <div class="user-form-title">{{activeCoin.coinName}} {{'RECHARGE'|t}}</div>
                    <div class="google-cont">
                        <div class="qrcode">
                            <canvas ref="cvs" height="300px" width="300px" id="canvas" v-show="showQR"></canvas>
                        </div>
                        <div class="box-flex google-item">
                            <el-input v-model="inputText" readonly class="flex"></el-input>
                            <el-button type='primary' class="google-btn" v-clipboard:copy="inputText" v-clipboard:success="onCopy" v-clipboard:error="onError">{{'COPY_RECHARGE_LINK'|t}}</el-button>
                        </div>
                    </div>
                    <div class="recharge-text-wrap">
                        <h3>{{'RECHARGE_TEXT0'|t}}</h3>
                        <p>1. {{'RECHARGE_TEXT1'|t}}</p>
                        <p>2. {{'RECHARGE_TEXT2'|t}}</p>
                    </div>
                </div>

                <!-- 提现 -->
                <div class="user-form-wrap" style="width: 500px" v-show="activeRouter == 'WITHDRAW'">
                    <div class="user-form-title">{{activeCoin.coinName}} {{'WITHDRAWLS'|t}}</div>
                    <el-form :model="withdrawForm" :rules="rules" ref="withdrawForm" class="demo-ruleForm">
                        <el-form-item prop="addr">
                            <el-input v-model="withdrawForm.addr" :placeholder="'ENTER_WITHDROWS_ADDR'|t">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="num">
                            <el-input v-model="withdrawForm.num" :placeholder="'ENTER_TONUM'|t" type="text" @keyup.native="fixeNumber(withdrawForm,'num',8)">
                                <i slot="suffix" style="font-style: unset;">{{activeCoin.coinName}}</i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="remark">
                            <el-input v-model="withdrawForm.remark" :placeholder="'ENTER_MARK'|t">
                            </el-input>
                        </el-form-item>
                        <div class="asset-form-text">
                            {{'WITHDROWS_USE'|t}} :
                            <span class="c-blue">{{withdrawNeed}}</span>{{activeCoin.coinName}}
                            <span class="pos">{{'SERVER_CHARGE'|t}}:{{$M(activeCoinFee)}}{{activeCoin.coinName}}</span>
                        </div>
                        <el-form-item prop="pwd">
                            <el-input v-model="withdrawForm.pwd" type="password" :placeholder="$t('ENTERPASSWORD')"></el-input>
                        </el-form-item>
                        <el-form-item v-show="deductData.deductCoinName!=activeCoin.coinName">
                            <el-checkbox-group v-model="withdrawForm.deductState"  v-tippy='{ interactive : true ,arrow : true, arrowTransform : "translateX(-260px)",placement : "top-start"}' :title="deductStateText">
                                <el-checkbox :label="$t('PAYFREE')" name="deductState"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('withdrawForm')" :loading="isAble" :disabled="isAble" class="flex-btn">{{'CHECK_WITHDROWS'|t}}</el-button>
                            <!-- <el-button type="primary" @click="userStatus.alipayState=1" class="flex-btn">更换支付宝账号</el-button> -->
                        </el-form-item>
                    </el-form>
                    <div class="recharge-text-wrap" style="text-align: left">
                        <p>{{'MIN_WITHDROWS'|t}}：
                            <span>{{$C(this.activeCoin.minWithdrawNumber)}} {{activeCoin.coinName}}</span> . {{'WITHDROWS_TEXT'|t}}</p>
                    </div>
                </div>

                <!-- 结果 -->
                <resultTemp :rowData="rowData" v-show="!showBool"></resultTemp>
            </user-mask>
        </div>

        <user-mask @close="close($event)" :value='setBool' height="500px" width="100%" style="width:1200px;margin:auto;">
            <resultTemp :rowData="rowData"></resultTemp>
        </user-mask>
    </div>
</template>
<script>
    import { User,BB } from "@/services"
    import resultTemp from "@/components/assetResult"
    import userMask from '@/components/mask';
    import QRCode from 'qrcode';
    import { Rules } from '@/providers/rules';
    import { mapState } from 'vuex';
    import { BigNumber } from 'bignumber.js';
    export default {
        components: { userMask, resultTemp },
        data() {
            let _num = (rule, value, callback) => {
                if (this.$C(this.activeCoin.minWithdrawNumber) <= value) {
                    callback();
                } else {
                    callback(new Error(this.$t(this.$t('RECHARGE_LIMIT_TIPS1') + this.$C(this.activeCoin.minWithdrawNumber) + ' ' + this.activeCoin.coinName + this.$t('RECHARGE_LIMIT_TIPS2'))));
                }
            }
            return {
                timer: null,
                isAble: false,
                setBool: false,
                showBool: true,
                showQR: true,
                activeRouter: 'LIST',
                // balanceData: [{coinId:'',enbalance:''}],
                activeCoin: { id: '', enbalance: '' },
                activeBalance: { enbalance: '' },
                recordOption: {
                    coinId: '',
                    type: '0'//1 - 充值，2 - 提现， 0    - 全部
                },
                recordData: [],
                rowData: {},
                curpage: 1,
                pageSize: 10,
                numCount: 0,
                deductData: {
                    deductCoinName: ''
                },
                deductStateText: '',
                rules: {
                    addr: Rules.noEmpty,
                    num: [
                        ...Rules.num,
                        { validator: _num, trigger: "blur" }],
                    remark: Rules.noEmpty,
                    pwd: Rules.pwd,
                },
                inputText: '',
                withdrawForm: {
                    addr: '',
                    num: '',
                    remark: '',
                    pwd: '',
                    deductState: false
                },
                withdrawFee: '0'
            };
        },
        computed: {
            ...mapState(['coinList']),
            worthCny() {
                let temp = BigNumber(this.activeBalance.cnyPrice).multipliedBy(BigNumber(this.activeBalance.enbalance))
                if (temp == temp) return this.$M(temp)
                else return ''
            },
            rechargeOrWithdrawBool() {
                return this.activeRouter == 'RECHARGE' || this.activeRouter == 'WITHDRAW'
            },
            activeCoinFee() {
                return this.activeCoin.withdrawFee
            },
            withdrawNeed() {
                let temp = this.$C(BigNumber(this.withdrawForm.num).plus(BigNumber(this.activeCoinFee)))
                if (temp - 0 == temp) return temp
                else return '0'
            }
        },
        mounted() {
            // this.getBalance();
            if (this.coinList[0].id != '') {//已经请求过的时候,否则在watch里面请求
                this.activeCoin = this.coinList[0];
                this.getBalanceByCoinno();
            }
            this.getTransferrecord(1);
            this.DeductData();
        },
        beforeDestroy() {
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        methods: {
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
            // 搜索
            search() {
                this.getTransferrecord(1)
            },

            // 币种切换
            changeActive(item) {
                // this.activeRouter = 'LIST';
                this.activeCoin = item;
                if (this.activeRouter == 'LIST') this.getBalanceByCoinno();
                if (this.activeRouter == 'RECHARGE') this.recharge();//获取二维码
            },

            // 充值提现切换
            changeRouter(activeRouter) {
                // 充值获取充值地址
                if (activeRouter == 'RECHARGE') this.recharge();//获取二维码

                this.activeRouter = activeRouter;
                // this.showBool = true;
            },

            // currentPage 改变时会触发
            handleCurrentChange(page) {
                this.getTransferrecord(page);
            },

            // // 全部资产
            // getBalance(){
            //     User.getBalance().then((res)=>{
            //         // console.log(res.data);
            //         this.balanceData = res.listData;
            //         this.activeCoin = res.listData[0];
            //     })
            // },

            // 单币种资产
            getBalanceByCoinno() {
                this.activeBalance = { enbalance: '' };
                User.getBalanceByCoinno({
                    coinId: this.activeCoin.id,
                }).then((res) => {
                    this.activeBalance = res.oneData;
                })
            },

            // 记录
            getTransferrecord(page) {
                User.getTransferrecord({
                    coinId: this.recordOption.coinId,
                    type: this.recordOption.type,
                    pageSize: page,
                    limitSize: this.pageSize,
                }, false).then((res) => {
                    this.recordData = res.oneData.list;
                    this.numCount = res.oneData.total;
                    if (this.timer) {
                        clearInterval(this.timer);
                    }
                    this.timer = setInterval(() => {
                        this.getTransferrecord(page)
                    }, 10000)
                })
            },

            typeFn(type) {
                if (type == 'RECHARGE') return this.$t('RECHARGE');
                if (type == 'WITHDRAW') return this.$t('WITHDRAWLS');
                return ''
            },

            // 详情按钮
            goDetail(row) {
                this.setBool = true;
                this.rowData = row;
            },

            close() {
                this.setBool = false;
                this.activeRouter = 'LIST'
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (this.activeRouter == 'WITHDRAW') {
                        this.withdraw();
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            // 只能输入多少位
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


            // 提现
            withdraw() {
                this.isAble = true;
                User.withdraw({
                    coinId: this.activeCoin.id,//货币ID
                    inAddress: this.withdrawForm.addr,//转入地址
                    tradeNum: this.withdrawForm.num,//转账数量
                    remark: this.withdrawForm.remark,//备注
                    tradePwd: this.AES(this.withdrawForm.pwd),//交易密码
                    deductState: this.withdrawForm.deductState ? 'Y' : 'N'
                }).then(res => {
                    this.isAble = false;
                    this.SUCCESS(this.$t('WITHDROW_SUCC'));
                    this.resetForm('withdrawForm');
                    this.activeRouter = 'LIST';
                    this.getBalanceByCoinno();
                    this.getTransferrecord(1);
                }).catch(err => {
                    this.isAble = false;
                })
            },
            // ===================================== 充值 =================================================
            onCopy(e) {
                this.SUCCESS(this.$t('COPY_SUCCESS'))
            },
            onError(e) {
                this.WARN('Failed to copy texts')
            },
            // 充值
            recharge() {
                this.showQR = false;
                this.inputText = '';
                User.recharge({
                    coinId: this.activeCoin.id,//货币ID
                }).then(res => {
                    this.showQR = true;
                    this.inputText = res.oneData;
                    QRCode.toCanvas(this.$refs.cvs, res.oneData, function (error) {
                        if (error) {
                            console.error(error)
                        } else {
                            console.log('success!');
                        }
                    })
                }).catch(err => {
                    this.inputText = '';
                })
            },
        },
        watch: {
            coinList: function (n, o) {
                this.activeCoin = n[0];
                this.getBalanceByCoinno();
            }
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/asset';
</style>