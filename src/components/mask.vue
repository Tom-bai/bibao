<template>
  <div class="user-mask" v-show="currentValue" :class="bindClass()">
    <div class="user-mask-bg" v-show="position"></div>
    <div class="user-mask-cont" :style="style()">
      <i class="close-icon" @click="close($event)" v-show="!hideCloseBtn"></i>
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'user-mask',
    props: {
      value: {
        type: Boolean,
        default: false,
        required: true
      },
      hideCloseBtn:{
        type:Boolean,
        default:false
      },
      position: {
        type: Boolean,
        default: false
      },
      boxShadow: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '60%'
      },
      height: {
        type: String,
        default: '60%'
      }
    },
    data() {
      return {
        currentValue: this.value,
        pos: this.position
      };
    },
    watch: {
      value(val) {
        this.initScroll(val);
        this.currentValue = val;
      }
    },
    methods: {
      unLockScroll() {
        window.onmousewheel = (event) => {
          return true;
        };
      },
      lockScroll() {
        window.onmousewheel = (event) => {
          return false;
        };
      },
      // 绑定style
      style() {
        return { width: this.width, minHeight: this.height };
      },
      // 绑定class
      bindClass() {
        return `${this.pos ? 'position' : 'boxShadow'}`;
      },
      // 关闭弹层
      close($event) {
        this.currentValue = false;
        this.$emit('input', false);
        this.$emit('close', $event);
      },
      initScroll(value) {
        if (this.position) {
          if (value) {
            this.lockScroll();
          } else {
            this.unLockScroll();
          }
        }
      }
    },
    mounted() {
      this.initScroll(this.value);
    }
  };
</script>
<style lang="scss" scoped>
  .user-mask {
    position: relative;
    &.boxShadow {
      background: rgba(255, 255, 255, 1);
      border-radius: 12px;
      box-shadow: 0px 4px 25px rgba(40, 43, 49, 0.05);
      .user-mask-cont {
        width: 100%;
        display: flex;
        /* align-items: center; */
        justify-content: center;
        margin: 50px 0;
      }
    }
    &.position {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      z-index: 99;
    }
    &-bg {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
    &-cont {
      background: white;
      position: relative;
      padding: 50px;
      border-radius: 4px;
      .close-icon {
        height: 30px;
        width: 30px;
        position: absolute;
        right: 5px;
        top: 5px;
        background: url('~@/assets/img/close-icon.png') no-repeat center center;
        background-size: 90% 90%;
        z-index: 999;
        cursor: pointer;
      }
    }
  }
</style>
