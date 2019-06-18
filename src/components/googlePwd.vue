<template>
    <div class='googlePwd' v-show="show">
        <div class="box">
            <header>{{'ENTER_G_CODE'|t}}</header>
            <div :class="'inputs '+ borderColor">
                <input type="text" maxlength="1" v-model="inputs.i1" @keyup="turnGreen">
                <input type="text" maxlength="1" v-model="inputs.i2" @keyup="turnGreen">
                <input type="text" maxlength="1" v-model="inputs.i3" @keyup="turnGreen">
                <input type="text" maxlength="1" v-model="inputs.i4" @keyup="turnGreen">
                <input type="text" maxlength="1" v-model="inputs.i5" @keyup="turnGreen">
                <input type="text" maxlength="1" v-model="inputs.i6" @keyup="turnGreen">
            </div>
            <footer>
                <el-button plain type="primary" style="width:170px;" @click="cancel">{{'CANCEL'|t}}</el-button>
                <el-button type="primary" style="width:170px;" @click="submit">{{'DETERMINE'|t}}</el-button>
            </footer>
        </div>
    </div>
</template>
<script>
// 需要传入一个出现信号，输入密码后会返回允许下一步的布尔值
    export default {
        name:'googlePwd',
        props:{
            show: Boolean
        },
        data(){
            return {
                borderColor: 'normal',//  'normal'  /  'success'  /  'error'
                inputs:{
                    i1: '',
                    i2: '',
                    i3: '',
                    i4: '',
                    i5: '',
                    i6: '',
                }
            }
        },
        mounted(){
            
        },
        methods:{
            turnGreen(){
                this.borderColor = 'normal';
            },
            submit(){
                let isEmpty = false;
                for (let i = 1; i < 7; i++) {
                    if(this.inputs['i'+ i] == ''){
                        isEmpty = true;
                    }
                }
                if(isEmpty) {
                    this.borderColor = 'error';
                    return
                }
                // 调接口验证
                this.$emit('continue', true)
            },
            cancel(){
                this.$emit('cancel',false)
            }
        }
    }
</script>
<style lang='scss' scoped>
    .googlePwd {
        position: fixed;
        z-index: 3000;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(100, 100, 100, 0.6);
        .box {
            position: absolute;
            top: -100px;
            bottom: -100px;
            right: -100px;
            left: -100px;
            width: 560px;
            height: 280px;
            margin: auto;
            background-color: #fff;
            text-align: center;
            header {
                padding: 60px 0 25px;
                color: #002059;
            }
            .inputs {
                font-size: 0;
                margin-bottom: 30px;
                &.error {
                    input {
                        border-color: red;
                    }
                }
                input {
                    width: 50px;
                    height: 50px;
                    background-color: #F7F7F7;
                    margin-right: 10px;
                    outline: none;
                    border: 1px solid #EAEBED;
                    border-radius: 4px;
                    font-size: 20px;
                    color: #002059;
                    &:last-of-type {
                        margin-right: 0;
                    }
                }
            }
            footer {
                font-size: 0;
            }
        }
    }
</style>