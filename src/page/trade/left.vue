<template>
    <div class="trade-left">
        <div class="search-cont">
            <!-- <div class="search-input"> -->
            <el-input :placeholder="$t('COIN_SEARCH')" v-model="searchInput" @keyup.enter.native="search">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="search" style="cursor:pointer;"></i>
            </el-input>
            <!-- </div> -->
            <!-- <el-button class="ml-10">收藏币种</el-button> -->
        </div>
        <div class="coin-list">
            <a href="javascript:;" v-for="(item,key) of blockList" :key=key class="coin-item" :class="activeBlock.blockId==item.blockId?'active':''"
                @click="changeActive(item)" v-text="$l=='en'?item[$l+'BlockName']:item['blockName']">
            </a>
        </div>
        <el-table :data="coinDataList" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" @row-click="rowClick"
            :row-class-name="rowClassName">
            <el-table-column :label="$t('CURRENCY')" width="150px">
                <template slot-scope="scope">
                    <div class="box-flex">
                        <i :class="starCSS(scope.row)" @click.stop="addFavorite(scope.row,coinDataList,scope.$index)" style="font-size: 20px;cursor:pointer;"></i>
                        <!-- :class="scope.row.isTag==3?'c-blue':''" -->
                        <span :class="'tag'+ scope.row.isTag" >{{scope.row.productCoinCore}} / {{scope.row.priceCoinCore}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('LATESTPRICES')">
                <template slot-scope="scope">
                    <!-- <span :class="scope.row.ps>0?'c-red':scope.row.ps<0?'c-success':''">{{scope.row.name|Fixed(4)}}</span> -->
                    <span :class="scope.row.riseAndFall>0?'up':scope.row.riseAndFall<0?'down':''">{{$C(scope.row.latestPrice)}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('RISEANDFALLS')">
                <template slot-scope="scope">
                </template>
                <template slot-scope="scope">
                    <!-- <span :class="scope.row.ps>0?'c-red':scope.row.ps<0?'c-success':''">{{scope.row.ps|Fixed(4)}}%</span> -->
                    <span :class="scope.row.riseAndFall>0?'up':scope.row.riseAndFall<0?'down':''">{{$M(scope.row.riseAndFall)}}%</span>
                    <!-- <span v-if="scope.row.riseAndFall == 0">{{scope.row.riseAndFall}}%</span> -->
                    <!-- <span v-else :class="scope.row.riseAndFall>0?'up':'down'">{{scope.row.riseAndFall}}%</span> -->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { BB } from "@/services";
    import { Func } from '@/providers';
    export default {
        name: 'trade-left',
        data() {
            return {
                // blockList: [],
                activeBlock: {
                    blockId: ''
                },
                operating: '',
                lang: Func.getCookie('lang'),
                // coinDataList: [],
                searchInput: '',
                nums: 1
            };
        },
        computed: {
            // 使用对象展开运算符将 getter 混入 computed 对象中
            ...mapGetters([
                'tradeData',
                'blockList',
                'coinDataList'
            ]),
        },
        watch: {
            // 左边币种数据
            'tradeData.marketPairsData'(newValue, oldValue) {
                if (!newValue || !newValue.listData) { return; };
                this.getCoinsByBlock({
                    item: this.activeBlock,
                    value: ''
                });
                // websoket 推送过来的数据，跟原来的数据匹配
                // newValue.listData.forEach(item => {
                //     this.coinDataList.forEach(items => {
                //         if (item.priceCoinId == items.priceCoinId && item.productCoinId == items.productCoinId) {
                //             items = item;
                //         }
                //     });
                // });
                // this.$store.dispatch('COINDATALIST', newValue.listData);
                // if (this.$route.query.block) {
                //     newValue.listData.map((item) => {
                //         if (item.priceCoinId == this.$route.query.block && item.productCoinId == this.$route.query.coin) {
                //             this.$store.dispatch('SETCOINITEM', item);
                //         }
                //     });
                // } else {
                //     let _item = newValue.listData[0];
                //     this.$store.dispatch('SETCOINITEM', _item);
                // }
            },
            blockList(newValue) {
                if (!newValue) { return };
                if (this.$route.query.block) {
                    this.activeBlock = newValue.filter(item => item.blockId == this.$route.query.block)[0];
                } else {
                    this.activeBlock = newValue[0];
                }
            }
        },
        methods: {
            getCoinsByBlock(data, bool) {
                BB.getCoinsByBlock({
                    blockId: data.item.blockId,//币区
                    productCoinName: data.value //搜索内容
                }, false).then(res => {
                    // this.coinDataList = res.listData;
                    this.$store.dispatch('COINDATALIST', res.listData);
                    let _item = this.$route.query.block && !bool ? res.listData.filter(item => item.priceCoinId == this.$route.query.block && item.productCoinId == this.$route.query.coin)[0] : res.listData[0];
                    if (_item) {
                        this.$store.dispatch('SETCOINITEM', _item);
                    }
                })
            },
            // 高亮被选中那行
            rowClassName({ row, rowIndex }) {
                let _query = this.$route.query;
                if (_query.block) {
                    if (row.productCoinId == _query.coin && row.priceCoinId == _query.block) {
                        return 'high_line';
                    } else {
                        return ''
                    }
                }
            },
            // 添加收藏
            addFavorite(row, rows, index) {
                if (!this.loginStatus()) { return }
                if (row.isTag == 2 || row.isTag == 3) return
                BB.addCoinTransactionPairUser({
                    productCoinId: row.productCoinId,//币种
                    priceCoinId: row.priceCoinId,//币区
                }).then(res => {
                    row.isTag = row.isTag == '0' ? '1' : '0';
                    this.getCoinsByBlock({
                        item: this.activeBlock,
                        value: ''
                    })
                    // if (this.USERID() == this.activeBlock.blockId) {
                    //     rows.splice(index, 1);
                    // }
                });
            },
            // 星星颜色
            starCSS(row) {
                let temp = 'defStar';
                if (row.isTag == 1) temp = 'c-fail';
                if (row.isTag == 2) temp = 'c-success';
                if (row.isTag == 3) temp = 'c-blue';
                return 'el-icon-star-on ' + temp
            },
            // 搜索数据
            search() {
                this.$store.dispatch('SWITCHBLOCK', {
                    item: this.activeBlock,
                    value: this.searchInput
                })
            },
            // 切换交易对
            rowClick(item) {
                this.$router.push({ name: 'trade_info', query: { block: item.priceCoinId, coin: item.productCoinId } });
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
                this.$store.dispatch('SWITCHBLOCK', {
                    item: item,
                    value: '',
                    router: true
                })
            }
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/_public';
    @import '~@/assets/sass/trade';
    .coin-list{
        padding-top: 20px;
    }
    .tag3 {
      color: #752BF7;
    }
    .tag2 {
      color:rgba(0, 182, 0, 1);
    }
    .tag1 {
      color: rgba(249, 190, 36, 1)
    }
</style>