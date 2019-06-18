<template>
    <div>
        <router-view/>
    </div>
</template>
<script>
    import { mapGetters, mapState } from 'vuex'
    import { BB } from "@/services";
    import { Func } from '@/providers';
    export default {
        data() {
            return {
                reconnectCount: 5,// socket 出错，最多重连5次
                websoket: null,
                lang: Func.getCookie('lang')
            };
        },
        methods: {
            // 获取币区
            getBlocks() {
                BB.getBlocks({}, false).then(res => {
                    this.blockList = res.listData;
                    this.$store.dispatch('BLOCKLIST', res.listData);
                    let _item = this.$route.query.block ? res.listData.filter(item => item.blockId == this.$route.query.block)[0] : res.listData[0];
                    this.getCoinsByBlock({
                        item: _item,
                        value: ''
                    });
                })
            },
            // 获取币区下的币种
            getCoinsByBlock(data, bool) {
                BB.getCoinsByBlock({
                    blockId: data.item.blockId,//币区
                    productCoinName: data.value //搜索内容
                }, false).then(res => {
                    this.coinDataList = res.listData;
                    this.$store.dispatch('COINDATALIST', res.listData);
                    let _item = this.$route.query.block && !bool ? this.coinDataList.filter(item => item.priceCoinId == this.$route.query.block && item.productCoinId == this.$route.query.coin)[0] : this.coinDataList[0];
                    if (_item) {
                        this.$store.dispatch('SETCOINITEM', _item);
                    }
                    if (!this.websoket) {
                        this.websoketFn(_item);
                    } else {
                        let _parmas = {
                            'request': 'changePair',
                            productCoinId: _item.productCoinId, // 币种
                            priceCoinId: _item.priceCoinId // 币区
                        }
                        this.sendMsg(JSON.stringify(_parmas));
                    }
                    if (!this.$route.query.block || bool || data.router) {
                        this.$router.push({ name: 'trade_info', query: { block: _item.priceCoinId, coin: _item.productCoinId } });
                    }
                })
            },
            websoketFn(item) {
                let _this = this;
                let productCoinId = item.productCoinId;
                let priceCoinId = item.priceCoinId;
                let heartCheck = {
                    timeout: 30000,
                    timeoutObj: null,
                    serverTimeoutObj: null,
                    reset: () => {
                        clearTimeout(heartCheck.timeoutObj);
                        clearTimeout(heartCheck.serverTimeoutObj);
                        heartCheck.start();
                    },
                    start: () => {
                        heartCheck.timeoutObj = setTimeout(() => {
                            this.websoket.send("alive");
                            heartCheck.serverTimeoutObj = setTimeout(() => {
                                this.websoket.send("alive");
                            }, heartCheck.timeout)
                        }, heartCheck.timeout)
                    }
                };
                //用户id/币种id/币区id
                // _this.websoket = new WebSocket(`wss://${process.env.SOCKETHOST}webSocket/BBTrade/${productCoinId}/${priceCoinId}`)
                /*
                productCoinId：产品币ID，
                priceCoinId：价格币ID
                */
                let SOCKETHOST;
                if (process.env.NODE_ENV === 'development') {
                    SOCKETHOST = process.env.SOCKETHOST;
                } else {
                    SOCKETHOST = window.location.hostname + '/';
                }
                _this.websoket = new WebSocket(`wss://${SOCKETHOST}webSocket/BBTrade/${productCoinId}/${priceCoinId}`);
                // _this.websoket = new WebSocket(`ws://${SOCKETHOST}webSocket/BBTrade/${productCoinId}/${priceCoinId}`);
                _this.websoket.onopen = () => {
                    heartCheck.start();
                };
                _this.websoket.onmessage = (evt) => {
                    let lang = _this.$l;
                    if (evt.data == 'fine') {
                        console.log('接受到消息重新计时');
                        heartCheck.reset();
                    } else {
                        var received_msg = JSON.parse(evt.data).datas;
                        if (received_msg.breakInfo) {
                            let info = received_msg.breakInfo;
                            _this.ALERT(info[lang + 'Message'], () => {
                            }, 'warning');
                        }
                        // 币币交易
                        if (_this.socketMsg && JSON.parse(_this.socketMsg).formName) {
                            // _this.$children[0].$children[1].$refs[JSON.parse(_this.socketMsg).formName].resetFields();
                            _this.$children[0].$children[1][JSON.parse(_this.socketMsg).formName].entrustNum = '';
                            _this.$store.dispatch('SETBOOLEAN', { type: JSON.parse(_this.socketMsg).formName + 'Bool', bool: false });
                        }
                        //  fullPage

                        if (received_msg.message) {
                            _this.$notify({
                                title: _this.$t('WARMTIPS'),
                                type: received_msg.message.code == 'SUCCESS_ENTRUST_DEAL' || received_msg.message.code == 'SUCCESS' || received_msg.message.code == 'SUCCESS_ENTRUST_YES_MATCHED' || received_msg.message.code == 'SUCCESS_ENTRUST_NO_MATCHED' ? 'success' : 'warning',
                                message: received_msg.message[_this.lang + 'Message']
                            });
                        }
                        if (received_msg.checkTradePassword) {
                            if (received_msg.checkTradePassword.code == 'DEALPWD_FAIL') {
                                _this.$notify({
                                    title: _this.$t('WARMTIPS'),
                                    type: received_msg.checkTradePassword.code == 'SUCCESS' ? 'success' : 'warning',
                                    message: received_msg.checkTradePassword[_this.lang + 'Message']
                                });
                            } else {
                                _this.$children[0].showMaskBool = false;
                            }
                        }

                        _this.$store.dispatch('SETTARDEDATA', received_msg);
                    }
                };
                this.websoket.onerror = (event) => {
                    this.reconnectCount--;
                    if (this.reconnectCount > 0) {
                        setTimeout(() => {
                            this.websoketFn({
                                productCoinId: _this.$route.query.coin,
                                priceCoinId: _this.$route.query.block
                            });
                        }, 2000)
                    } else {
                        this.WARN(this.$t('NODATA_REFLUSE'));
                    }
                };
                // this.websoket.onclose = () => {
                //     setTimeout(() => {
                //         this.websoketFn({
                //             productCoinId: _this.$route.query.coin,
                //             priceCoinId: _this.$route.query.block
                //         });
                //     }, 5000);
                //     console.log("closed...");
                // };
                _this.websoket.onclose = () => {
                    _this.websoket = null;
                    clearTimeout(heartCheck.timeoutObj);
                    clearTimeout(heartCheck.serverTimeoutObj);
                    console.log("连接已关闭...");
                };
                // _this.websoket.onerror = (error) => {
                //     console.log(error);
                //     console.log('websoket 连接出错');
                //     clearTimeout(heartCheck.timeoutObj);
                //     clearTimeout(heartCheck.serverTimeoutObj);
                // }
                //心跳检测
                // var heartCheck = {
                //     timeout: 30000,//15秒
                //     timeoutObj: null,
                //     serverTimeoutObj: null,
                //     reset: function () {
                //         clearTimeout(this.timeoutObj);
                //         clearTimeout(this.serverTimeoutObj);
                //         return this;
                //     },
                //     start: function () {
                //         var self = this;
                //         this.timeoutObj = setTimeout(function () {
                //             //这里发送一个心跳，后端收到后，返回一个心跳消息，
                //             //onmessage拿到返回的心跳就说明连接正常
                //             if (_this.websoket) {
                //                 _this.websoket.send("alive");
                //             }
                //             self.serverTimeoutObj = setTimeout(function () {
                //                 if (_this.websoket) {
                //                     _this.websoket.send("alive");
                //                 }
                //                 console.log(self.timeout + '还未推送消息回来,主动关闭，然后重连');
                //                 //如果超过一定时间还没重置，说明后端主动断开了
                //                 // _this.websoket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                //             }, self.timeout)
                //         }, this.timeout)
                //     }
                // }
            },
            sendMsg(data) {
                this.websoket.send(data);
            }
        },
        computed: {
            // 使用对象展开运算符将 getter 混入 computed 对象中
            ...mapGetters([
                'socketMsg',
                'blockData'
            ])
        },
        watch: {
            socketMsg(newValue) {
                if (!newValue) { return false };
                this.sendMsg(newValue)
            },
            // 币种切换
            blockData(newValue) {
                if (!newValue) { return false };
                this.getCoinsByBlock(newValue, true)
            },
            $route(to, from) {
                // 组件更新，从fullpage页面跳转回来时出现的bug
                if (to.name == 'trade_info' && from.name == 'trade_full') {
                    this.getBlocks();
                }
            }
        },
        destroyed() {
            if (this.websoket) {
                // this.websoket = null;
                this.websoket.close()
            }
        },
        created() {
            // console.log();
            this.getBlocks();
        }
    };
</script>
<style lang="scss" scoped>
    @import '~@/assets/sass/user';
</style>