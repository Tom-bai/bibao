<template>
  <div class="email-template" v-show='currentValue'>
    <user-mask @close="close($event)" :value='setEmailBool' height="100px" width="100%">
      <div>111
        <span>邮箱绑定</span>及
        <span>GOOLE认证>></span>
      </div>
    </user-mask>
  </div>
</template>
<script>
  import userMask from '@/components/mask';
  export default {
    name: 'mobile-component',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value(val) {
        this.currentValue = val;
        this.setEmailBool = val;
      }
    },
    data() {
      return {
        currentValue: this.value,
        setEmailBool: false
      };
    },
    components: {
      userMask
    },
    methods: {
      close($event) {
        // console.log(this.verfiEmailGoole);
        this.$parent.showList = true;
        this.currentValue = false;
        this.$emit('input', false);
        this.$emit('close', $event);
      }
    },
    mounted() { }
  };
</script>
<style scoped lang="scss">
</style>