<template>
    <div class="trade clearfix" style="width: 100%;">
      <trade-left class="left"></trade-left>
      <trade-right class="right"></trade-right>
    </div>
  </template>
  <script>
    import tradeLeft from '@/page/intelligent/left.vue';
    import tradeRight from '@/page/intelligent/right.vue';
    export default {
      data() {
        return {
  
        };
      },
      components: {
        tradeLeft,
        tradeRight
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