<template>
    <div class="email-template" v-show='currentValue'>
      <user-mask @close="close($event)" :value='setEmailBool' height="500px" width="100%">
        <!-- 绑定手机号码 -->
        <div class="user-form-wrap" v-show="userStatus.phoneState==0">
          <div class="user-form-title">绑定手机号码 </div>
          <el-form :model="mobileForm" :rules="rules" ref="mobileForm" class="demo-ruleForm">
            <el-form-item prop="name">
              <el-input v-model="mobileForm.name" :placeholder="$t('MOBILE_PLACE')">
              </el-input>
            </el-form-item>
            <el-form-item prop="name">
              <el-input v-model="mobileForm.name" :placeholder="$t('CODE_LABEL')" class="send_code">
                <span slot="append"><YZMBTN :refForm="$refs.mobileForm" prop1="name" :phone="mobileForm.name" @getKey="getKey"/></span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <!-- <el-button type="primary" @click="submitForm('mobileForm')" class="flex-btn">{{'DETERMINE'|t}}</el-button> -->
              <el-button type="primary" @click="userStatus.phoneState=1" class="flex-btn">更换手机号码</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 更换手机号码 -->
        <div class="user-form-wrap" v-show="userStatus.phoneState==1">
          <div class="user-form-title">更换手机号码</div>
          <el-form :model="mobileForm" :rules="rules" ref="mobileForm" class="demo-ruleForm">
            <el-form-item prop="name">
              <el-input v-model="mobileForm.name" :placeholder="$t('OLD_MOBILE')">
              </el-input>
            </el-form-item>
            <el-form-item prop="name">
              <el-input v-model="mobileForm.name" :placeholder="$t('PASSWORD_PLACE')">
              </el-input>
            </el-form-item>
            <el-form-item prop="name">
              <el-input v-model="mobileForm.name" placeholder="新手机号码">
              </el-input>
            </el-form-item>
            <el-form-item prop="name">
              <el-input v-model="mobileForm.name" :placeholder="$t('EMAIL_CODE_REQUIRE')" class="send_code">
                <span slot="append"><YZMBTN :refForm="$refs.mobileForm" prop1="name" :phone="mobileForm.name" @getKey="getKey"/></span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <!-- <el-button type="primary" @click="submitForm('mobileForm')" class="flex-btn">{{'DETERMINE'|t}}</el-button> -->
              <el-button type="primary" @click="userStatus.phoneState=0" class="flex-btn">绑定邮箱</el-button>
            </el-form-item>
          </el-form>
        </div>
      </user-mask>
    </div>
  </template>
  <script>
    import userMask from '@/components/mask';
    import { mapState } from 'vuex';
    import YZMBTN from '@/components/YZMBtn.vue';
    export default {
      name: 'email-component',
      components: { userMask, YZMBTN },

      props: {
        value: {
          type: Boolean,
          default: false
        }
      },
      data() {
        return {
          currentValue: false,
          setEmailBool: false,
          mobileForm: {
            name: '',
            type: []
          },
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            type: [
              { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
            ]
          }
        };
      },
      computed: {
        ...mapState([
          'userStatus'
        ])
      },
      watch: {
        value(val) {
          this.currentValue = val;
          this.setEmailBool = val;
        }
      },
      mounted() {
        this.init();
      },
      methods: {
        getKey(key){
          this.key = key;
        },
        close($event) {
          // console.log(this.verfiEmailGoole);
          this.$parent.showList = true;
          this.currentValue = false;
          this.$emit('input', false);
          this.$emit('close', $event);
        },
        init() {
          this.currentValue = this.value;
          this.setEmailBool = this.value;
          if (this.value) {
            this.$parent.showList = false;
          }
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    };
  </script>
  <style scoped lang="scss">
    @import '~@/assets/sass/user.scss';
  </style>