a<template>
    <div class="datalist">
        <div class="box-flex datalist-search space-between clearfix">
            <ul class="trade-list box-flex flex">
                <li :class="activeBlock.blockId==item.blockId ? 'trade-item active':'trade-item'" v-for="item in blockList" :key="item.a"
                    @click="changeActive(item)">{{item[$l+'BlockName']}}</li>
            </ul>
            <div class="search-input">
                <el-input :placeholder="'SEARCH_COIN'|t" v-model="searchInput" @keyup.enter.native="search">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="search" style="cursor:pointer;"></i>
                </el-input>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="main-datalist" height="400" size="medium" @row-click="rowClick" :row-class-name="rowClassName"
            :cell-style="cellStyle" :stripe="true">
            <!-- :row-class-name="tableRowClassName"> -->
            <el-table-column width="100" :render-header="renderHeader">
                <template slot-scope="scope">
                    <i :class="starCSS(scope.row)" @click="addFavorite(scope.row)" style="font-size: 25px;cursor:pointer;"></i>
                </template>
            </el-table-column>
            <el-table-column prop="" :label="$t('CURRENCY')" width="180">
                <template slot-scope="scope">
                    <span :class="scope.row.isTag==3?'c-blue':''">{{scope.row.productCoinCore}} / {{scope.row.priceCoinCore}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="latestPrice" :label="$t('ADVERT_PRICE') + tableBlockName" width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.riseAndFall == 0">{{$C(scope.row.latestPrice)}}{{tableBlockName2(scope.row)}}</span>
                    <span v-else :class="scope.row.riseAndFall>0?'up':'down'">{{$C(scope.row.latestPrice)}}{{tableBlockName2(scope.row)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="highestPrice" :label="$t('HIGHEST')+ tableBlockName">
                <template slot-scope="scope">
                    {{$C(scope.row.highestPrice)}}{{tableBlockName2(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column prop="lowestPrice" :label="$t('LOWEST')+ tableBlockName">
                <template slot-scope="scope">
                    {{$C(scope.row.lowestPrice)}}{{tableBlockName2(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column prop="tradingVolume" :label="'VOLUME_OF_TRANSACTION'|t">
                <template slot-scope="scope">
                    {{$C(scope.row.tradingVolume)}}{{scope.row.productCoinCore}}
                </template>
            </el-table-column>
            <el-table-column prop="riseAndFall" :label="'24H_CHANGE'|t">
                <template slot-scope="scope">
                    <span v-if="scope.row.riseAndFall == 0">{{$M(scope.row.riseAndFall)}}%</span>
                    <span v-else :class="scope.row.riseAndFall>0?'up':'down'">{{$M(scope.row.riseAndFall)}}%</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="address" label="PCNY/USDT"></el-table-column> -->
            <el-table-column :label="'OPERATION'|t">
                <template slot-scope="scope">
                    <router-link class="goLink" :to="{path:'/trade',query:{block:scope.row.priceCoinId,coin:scope.row.productCoinId}}">{{'GO_TRADE'|t}}>></router-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import { BB } from "@/services";
    import { mapState, mapGetters } from "vuex";
    import datalist_icon from "./datalist_icon";
    import { Func } from '@/providers';
    export default {
        name: 'data-list',
        components: { datalist_icon },
        data() {
            return {
                websoket: null,
                keepWSAliveTimer: null,
                heartCheck: {
                    reconnectCount: 5,
                    timeout: 50000,
                    timeoutObj: null,
                    serverTimeoutObj: null,
                    reset: () => {
                        this.heartCheck.reconnectCount = 5;
                        if (this.heartCheck.timeoutObj)
                            clearTimeout(this.heartCheck.timeoutObj);
                        if (this.heartCheck.serverTimeoutObj)
                            clearTimeout(this.heartCheck.serverTimeoutObj);
                        console.log('reset')
                        this.heartCheck.timeoutObj = setTimeout(() => {
                            this.websoket.send("alive");
                            // 发送过去过了timeout还没接受到消息的话就断开重连
                            this.heartCheck.serverTimeoutObj = setTimeout(() => {
                                this.websoket.close();
                                this.websoketFn();//重连
                            }, this.heartCheck.timeout)
                        }, this.heartCheck.timeout)
                    },
                },
                cellStyle: { 'padding': '8px 0' },
                searchInput: '',
                blockList: [],
                activeBlock: {},
                tableData: [],
                operating: ''
            };
        },
        computed: {
            ...mapState(['activeCoin']),
            tableBlockName() {
                if (this.activeBlock['enBlockName'] == 'Marked')
                    return ''
                let temp = this.activeBlock.blockName ? this.activeBlock.blockName : ''
                return ' (' + temp + ')'
            },
        },
        mounted() {
            this.getBlocks(true);
            // 开启websocket
            this.websoketFn();
        },
        beforeDestroy() {
            if (this.websoket)
                this.websoket.close();
        },
        methods: {
            // 切换币区
            changeActive(item) {
                this.activeBlock = item;
                this.searchInput = '';
                this.operating == '';
            },

            // 点击当前币区下的币种（table的row）
            rowClick(row, event, column) {
                this.$store.state.activeCoin = row;
            },

            // 添加收藏
            addFavorite(row) {
                if (!this.loginStatus()) {
                    this.WARN(this.$t('SIGNIN_FIRST'))
                    return
                }
                if (row.isTag == 2 || row.isTag == 3) return
                BB.addCoinTransactionPairUser({
                    productCoinId: row.productCoinId,//币种
                    priceCoinId: row.priceCoinId,//币区
                }).then(res => {
                    // clearTimeout(this.coinsTimer);
                    this.getCoinsByBlock();
                })
            },

            // 搜索
            search() {
                this.operating = 'search';
                this.getCoinsByBlock(true);
            },

            // 获取币区
            getBlocks(firstTime = false) {
                BB.getBlocks({
                }, false).then(res => {
                    this.blockList = res.listData;
                    if (firstTime) {
                        this.activeBlock = res.listData[0];
                    }
                })
            },

            // 获取币区下的币种
            getCoinsByBlock(isBlockChange) {
                BB.getCoinsByBlock({
                    blockId: this.activeBlock.blockId,//币区
                    productCoinName: this.operating == 'search' ? this.searchInput : '' //搜索内容
                }, false).then(res => {
                    this.tableData = res.listData;
                    if (isBlockChange && res.listData.length) {
                        // 默认读取第一个币种的数据
                        this.$store.state.activeCoin = res.listData[0];
                    }
                })
            },
            // websocket
            websoketFn() {
                this.websoket = new WebSocket(`wss://` + BB.getCoinsByWS);
                // this.websoket = new WebSocket(`ws://` + BB.getCoinsByWS);
                // 开启的回调
                this.websoket.onopen = () => {
                    this.heartCheck.reset();
                    console.log('opened...')
                };
                // 通信时
                this.websoket.onmessage = (evt) => {
                    // 重置之前的心跳
                    this.heartCheck.reset();
                    let data;
                    if (evt.data != 'fine') {
                        data = JSON.parse(evt.data);
                        // 多少天交易量更新
                        if (data.tradeStatistics.code == 'SUCCESS')
                            this.$store.state.daysNum = data.tradeStatistics.oneData;
                        // 交易信息更新
                        if (data.tradeBlockInfo.code == 'SUCCESS')
                            for (let i = 0; i < this.tableData.length; i++) {
                                if (this.tableData[i].priceCoinId == data.tradeBlockInfo.oneData.priceCoinId
                                    && this.tableData[i].productCoinId == data.tradeBlockInfo.oneData.productCoinId) {
                                    this.$set(this.tableData, i, data.tradeBlockInfo.oneData);
                                }
                            }
                    }
                };
                this.websoket.onerror = (event) => {
                    this.heartCheck.reconnectCount--;
                    if (this.heartCheck.reconnectCount > 0) {
                        setTimeout(() => {
                            this.websoketFn();//重连
                        }, 2000)
                    } else {
                        this.WARN(this.$t('NODATA_REFLUSE'));
                    }
                };
                this.websoket.onclose = () => {
                    if (this.heartCheck.timeoutObj)
                        clearTimeout(this.heartCheck.timeoutObj);
                    if (this.heartCheck.serverTimeoutObj)
                        clearTimeout(this.heartCheck.serverTimeoutObj);
                    console.log("closed...");
                };
            },
            // 获取 币种/币区 的交易量
            getTradeNum() {
                BB.tradeStatistics({
                    productCoinId: this.activeCoin.productCoinId,//币种
                    priceCoinId: this.activeCoin.priceCoinId,//币区
                }).then(res => {
                    this.$store.state.daysNum = res.oneData;
                })
            },

            // hover提示
            renderHeader(h, { column, $index }) {
                return h(datalist_icon)
            },

            // 星星颜色
            starCSS(row) {
                let temp = 'defStar';
                if (row.isTag == 1) temp = 'c-fail';
                if (row.isTag == 2) temp = 'c-success';
                if (row.isTag == 3) temp = 'c-blue';
                return 'el-icon-star-on ' + temp
            },

            // 高亮被选中那行
            rowClassName({ row, rowIndex }) {
                if (row.productCoinId == this.activeCoin.productCoinId && row.priceCoinId == this.activeCoin.priceCoinId) {
                    return 'high_line';
                } else {
                    return ''
                }
            },

            // 收藏区table数据处的价格单位
            tableBlockName2(row) {
                if (this.activeBlock['enBlockName'] != 'Marked')
                    return ''
                else
                    return ' ' + row.priceCoinCore
            },
        },
        watch: {
            activeBlock: function (n, o) {
                if (n != o) {
                    // if(this.coinsTimer) clearTimeout(this.coinsTimer);
                    this.tableData = [];
                    this.getCoinsByBlock(true);
                }
            },
            activeCoin: function (n, o) {
                if (n != o) {
                    // if(this.coinTimer) clearTimeout(this.coinTimer);
                    this.getTradeNum();
                }
            }
        }
    };
</script>
<style scoped lang="scss">
    @import '../assets/sass/_public.scss';
    @import '../assets/sass/datalist.scss';
    .defStar {
        color: #aaa;
    }

    .goLink {
        color: $defaultColor;
        transition: color .3s;
        &:hover {
            color: #86b5ff;
        }
    }
</style>