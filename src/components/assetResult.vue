<template>
    <div class='assetResult'>
            <div style="width: 800px" class="user-recharge-success">
                <div class="state-icon">
                    <img src="~@/assets/img/success-icon.png" alt="" v-if="rowData.state === 'SUCCESS'">
                    <img src="~@/assets/img/info-icon.png" alt="" v-if="rowData.state === 'AUDITING'">
                    <img src="~@/assets/img/info-icon.png" alt="" v-if="rowData.state === 'BLOCK_SYNCHING'">
                    <img src="~@/assets/img/error-icon.png" alt="" v-if="rowData.state === 'FAIL'">
                    <img src="~@/assets/img/error-icon.png" alt="" v-if="rowData.state === 'AUDITING_FAIL'">
                </div>
                <div class="recharge-title-text">{{titleText}}</div>
                <div class="recharge-address">
                    <span class="left">{{typeFn(rowData.type)}}{{'ADDRESS'|t}}:</span>
                    <span class="right">{{address}}</span>
                </div>
                <div class="recharge-list box-flex">
                    <div class="recharge-item">
                        <h3>{{'CURRENCY'|t}}</h3>
                        <p>{{rowData.coinName}}</p>
                    </div>
                    <div class="recharge-item">
                        <h3>{{'TYPE'|t}}</h3>
                        <p>{{typeFn(rowData.type)}}</p>
                    </div>
                    <div class="recharge-item">
                        <h3>{{'SERVER_CHARGE'|t}}</h3>
                        <p>{{rowData.fee}}</p>
                    </div>
                    <div class="recharge-item">
                        <h3>{{"RECHARGE_AMOUNT"|t}}</h3>
                        <p>{{rowData.tradeNum}}</p>
                    </div>
                    <div class="recharge-item">
                        <h3>{{'ACTUAL_ACCOUNT'|t}}</h3>
                        <p>{{rowData.tradeNum}}</p>
                    </div>
                </div>
                <div class="recharge-time">
                    <div class="time">{{'RECHARGE_TIME'|t}}：{{rowData.createDate}} / {{'TRADING_NUMBER'|t}}：{{rowData.id}}</div>
                    <p class="tell">{{'TEL'|t}}：xxxxxxxxxx</p>
                </div>
            </div>
    </div>
</template>
<script>
    export default {
        name:'assetResult',
        props:{
            rowData:{
                type:Object
            }
        },
        data(){
            return {
                
            }
        },
        computed:{
            titleText(){
                if(this.rowData.state ==='SUCCESS' && this.rowData.type == 'RECHARGE') return this.$t('RECHARGE_SUCC')
                if(this.rowData.state ==='SUCCESS' && this.rowData.type == 'WITHDRAW') return this.$t('WITHDRAW_SUCC')
                if(this.rowData.state ==='AUDITING') return this.$t('UNDER_REVIEW_WAIT')
                if(this.rowData.state ==='FAIL' && this.rowData.type == 'RECHARGE') return this.$t('RECHARGE_ERR')
                if(this.rowData.state ==='FAIL' && this.rowData.type == 'WITHDRAW') return this.$t('WITHDRAW_ERR')
                if(this.rowData.state ==='BLOCK_SYNCHING') return this.$t('BLOCK_SYNCHING')
                if(this.rowData.state ==='AUDITING_FAIL') return this.$t('AUDITING_FAIL')
                return ''
            },
            address(){
                if(this.rowData.type == 'RECHARGE') return this.rowData.outAddress
                if(this.rowData.type == 'WITHDRAW') return this.rowData.inAddress
                return ''
            }
        },
        mounted(){
            
        },
        methods:{
            typeFn(type){
                if(type == 'RECHARGE') return this.$t('RECHARGE');
                if(type == 'WITHDRAW') return this.$t('WITHDRAWLS');
                return ''
            },
            // addrFn(){
            //     if(type == 'RECHARGE') return this.rowData.inAddress;
            //     if(type == 'WITHDRAW') return this.rowData.outAddress;
            //     return ''
            // }
        }
    }
</script>
<style lang='scss' scoped>
    @import '~@/assets/sass/safe';
    @import '~@/assets/sass/asset';
</style>