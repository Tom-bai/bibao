<template>
  <div class="question-wrap">
    <div class="step-wrap">
      <!-- 步骤条 -->
      <el-steps :active="defalutActive">
        <el-step title="安全验证"></el-step>
        <el-step title="创建安全问题"></el-step>
        <el-step title="邮箱验证"></el-step>
      </el-steps>
    </div>
    <div class="" v-show="defalutActive==2">
      <div class="question-message">
        <i class="icon"></i>请认真设置并记牢安全问题和答案，以防影响您安全问题等账户重要操作。
      </div>
      <el-form :model="mobileForm" :rules="rules" ref="mobileForm" class="demo-ruleForm">
        <el-form-item prop="name" label="登录安全语">
          <el-input v-model="mobileForm.name" placeholder="登录安全语">
          </el-input>
        </el-form-item>
        <div class="question-desc">
          为了避免钓鱼网站，请您输入一段有意义的话语，如您的座右铭等。该安全域将会在您每次登 录时出现，若不出现或者内容不区配，说明您登录的网址可能是钓鱼网站
        </div>
        <el-form-item prop="name" label="安全问题 1">
          <el-select v-model="mobileForm.name" placeholder="请选择完全问题" class="form-select">
            <el-option label="手机验证" value="shanghai"></el-option>
            <el-option label="邮箱验证" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="mobileForm.name" placeholder="请输入答案" type='password'>
          </el-input>
        </el-form-item>
        <el-form-item prop="name" label="安全问题 2">
          <el-select v-model="mobileForm.name" placeholder="请选择完全问题" class="form-select">
            <el-option label="手机验证" value="shanghai"></el-option>
            <el-option label="邮箱验证" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="mobileForm.name" placeholder="请输入答案" type='password'>
          </el-input>
        </el-form-item>
        <el-form-item prop="name" label="安全问题 3">
          <el-select v-model="mobileForm.name" placeholder="请选择完全问题" class="form-select">
            <el-option label="手机验证" value="shanghai"></el-option>
            <el-option label="邮箱验证" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="mobileForm.name" placeholder="请输入答案" type='password'>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('mobileForm')" class="flex-btn">{{'DETERMINE'|t}}</el-button>
          <!-- <el-button type="primary" class="flex-btn">{{'CHANGE_EMAIL'|t}}</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="question-message text-c question-message-three" v-show='defalutActive==3'>
      验证邮件已发送至您的邮箱
      <span class="c-green">feehao123@gamil.com</span>请前往邮箱点击邮件中的链接进行验证
    </div>
    <div>
      <h3 class="text-c">
        <img src="~@/assets/img/success-icon.png" style="vertical-align: middle;width: 30px;height: 30px;margin-right: 5px;" />邮箱认证成功！</h3>
      <div class="question-message">
        您的安全问题设置成功！请记牢您设置的问题和答案，以防影响您安全问题等账户重要操作。
      </div>
    </div>
  </div>
</template>
<script>
  import { Rules } from '@/providers/rules';
  export default {
    data() {
      return {
        defalutActive: 2,
        mobileForm: {
          name: ''
        },
        rules: Rules
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  };
</script>
<style scoped lang="scss">
  @import '~@/assets/sass/safe';
</style>