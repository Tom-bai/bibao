<template>
  <div class="trade clearfix" style="width: 100%;">
    <trade-left class="left"></trade-left>
    <trade-right class="right"></trade-right>
  </div>
</template>
<script>
  import tradeLeft from '@/page/trade/left.vue';
  import tradeRight from '@/page/trade/right.vue';
  import { Ajax } from '@/ajax';
  import { mapGetters } from 'vuex';
  import { Func } from '@/providers';
  export default {
    data() {
      return {
        websoket: null,
        coinDataList: [],
        lang: Func.getCookie('lang')
      };
    },
    components: {
      tradeLeft,
      tradeRight
    },
    computed: {
      // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'tradeCoinItem',
      ])
    },
    watch: {

    },
    methods: {
      // websoketFn() {
      //   let _this = this;
      //   let _user = this.USERID() ? this.USERID() : 'guest';
      //   let coin = this.$route.query.coin;
      //   let block = this.$route.query.block;
      //   //用户id/币种id/币区id
      //   _this.websoket = new WebSocket(`ws://192.168.50.126:8201/webSocket/BBTrade/${_user}/${coin}/${block}`)
      //   _this.websoket.onopen = function () {
      //   };
      //   _this.websoket.onmessage = function (evt) {
      //     var received_msg = JSON.parse(evt.data).datas;
      //     _this.$store.dispatch('SETTARDEDATA', received_msg);
      //     if (received_msg.message) {
      //       _this.$notify({
      //          title: this.$t('WARMTIPS'),
      //         type: received_msg.message.code == 'SUCCESS' ? 'success' : 'warning',
      //         message: received_msg.message[_this.lang + 'Message']
      //       });
      //     }
      //   };
      //   _this.websoket.onclose = function () {
      //     _this.websoket = null;
      //     console.log("连接已关闭...");
      //   };
      // },
      sendMsg(data) {
        this.websoket.send(data);
      }
    },
    destroyed() {
      // this.websoket.onclose();
      // websocket.onclose();
      console.log('页面切换前关闭websoket');
      // this.websoket.close()
    },
    created() {
      // this.websoketFn();
    }
  };
</script>
<style lang="scss" scoped>
  .trade {
    display: flex;
    justify-content: center;
    padding: 10px;
    .left {
      width: 370px;
      border: 1px solid #DFE1E5;
      border-radius: 4px;
      margin-right: 10px;
      float: left;
    }
    .right {
      float: left;
      flex: 1;
      height: 100%;
      /* border: 1px solid #DFE1E5; */
      border-radius: 4px;
      width: calc(100% - 380px);
    }
  }
</style>