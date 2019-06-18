<template>
  <div class="sale-template">
    <el-row class="box-flex">
      <el-col :span="12">
        <div class="grid-content">
          <div class="box-flex sale-verif-cont">
            <div class="sale-verif"></div>
            <div class="flex">
              <p>{{initData.entrust.nickname}}</p>
              <p>{{'TRADER_NUM'|t}} : {{initData.count}}</p>
            </div>
          </div>
          <div class="sale-list" style="justify-content:flex-start">
            <div class="sale-item">
              <h3>{{'ADVERT_PRICE'|t}}</h3>
              <div class="sale-item-desc">
                <span>{{$C(initData.entrust.dealPrice)}}</span> CNY</div>
            </div>
            <!-- <div class="sale-item">
                <h3>{{'PREMIUM'|t}}</h3>
                <div class="sale-item-desc">
                  <span>{{initData.entrust.discussPrice}}%</span>
                </div>
              </div> -->
            <div class="sale-item">
              <h3>{{'TRADE_QUOTAS'|t}}</h3>
              <div class="sale-item-desc">
                <span>{{$C(initData.entrust.minLimitPrice)}}-{{$C(initData.entrust.maxLimitPrice)}}</span> {{initData.entrust.coinName}}</div>
            </div>
            <div class="sale-item">
              <h3>{{'ABLE_TRADRE_NUM'|t}}</h3>
              <div class="sale-item-desc">
                <span>{{$C(initData.entrust.usableNumber)}}</span> {{initData.entrust.coinName}}</div>
            </div>
            <div class="sale-item">
              <h3 v-if="$route.query.type=='BUY_TYPE'">{{'PAYMENT_TERM'|t}}</h3>
              <h3 v-else>{{'PAYMENT_TERMS'|t}}</h3>
              <div class="sale-item-desc">
                <span>{{'THIRDMIN'|t}}</span>
              </div>
            </div>
            <div class="sale-item">
              <h3 v-if="$route.query.type=='BUY_TYPE'">{{'PAGEMENT_METHOD'|t}}</h3>
              <h3 v-else>{{'PAYMENT_ACOUNTS'|t}}</h3>
              <div class="sale-item-desc">
                <i class="icon" v-if="initData.entrust.payType.indexOf(',')== -1" :class="initData.entrust.payType"></i>
                <i class="icon" v-else v-for="(item,key) of initData.entrust.payType.split(',')" :key=key :class="item"></i>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="11" :offset="1">
        <div class="grid-content textarea-wrap">
          <h3>{{'AD_MESSAGE'|t}}：</h3>
          <!-- <div class="textareaValue">在线中，可以联系我，支付宝微信，转账勿必备注*相关信息</div> -->
          <div class="textareaValue">{{initData.entrust.remark}}</div>
        </div>
      </el-col>
    </el-row>
    <div class="border"></div>
    <el-row class="box-flex">
      <el-col :span="12">
        <div class="grid-content">
          <div class="form-wrap">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top">
              <el-form-item prop="price" :label="$t('TRANSACTION_PRICE')+'：'">
                <el-input v-model="ruleForm.price" :placeholder="$t('TRANSACTION_PRICE')" class="send_code c2c-input" disabled>
                  <span slot="append">CNY</span>
                  <!-- <span slot="append" class="c2b-input-text c-success">CNY</span> -->
                </el-input>
              </el-form-item>
              <el-form-item prop="dealNum" :label="$t('NUM')+'：'">
                <!-- <el-input v-model="ruleForm.dealNum" :placeholder="$t('NUM')+'0-'+$C(initData.entrust.usableNumber)+initData.entrust.coinName"
                  class="send_code c2c-input" @keyup.native="fixeNumber(ruleForm,'dealNum',20)">
                  <span slot="append"> {{initData.entrust.coinName}}</span>
                </el-input> -->
                <el-input v-model="ruleForm.dealNum" :placeholder="$t('NUM')+$C(initData.entrust.minLimitPrice)+'-'+$C(initData.entrust.maxLimitPrice)+initData.entrust.coinName"
                  class="send_code c2c-input" @keyup.native="fixeNumber(ruleForm,'dealNum',20)">
                  <span slot="append"> {{initData.entrust.coinName}}</span>
                </el-input>
              </el-form-item>

              <el-form-item prop="tradePassword" :label="$t('USER_TRADE_PASS')+'：'">
                <el-input v-model="ruleForm.tradePassword " :placeholder="$t('USER_TRADE_PASS_PLACE')" class="c2c-input" type="password">
                </el-input>
              </el-form-item>
              <el-form-item v-show="deductData.deductCoinName!=initData.entrust.coinName&&$route.query.type=='SELL_TYPE'">
                <el-checkbox-group v-model="ruleForm.deductState" v-tippy='{ interactive : true ,arrow : true, arrowTransform : "translateX(-260px)",placement : "top-start"}'
                  :title="deductStateText">
                  <el-checkbox :label="$t('PAYFREE')" name="deductState"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-button @click="submitForm('ruleForm','showBool')" class="no-margin sale-btn">
                <span v-if="$route.query.type=='BUY_TYPE'">{{'CONFIRM_HE_PURCHASE'|t}}</span>
                <span v-else>{{'CONFIRM_HE_SALE'|t}}</span>
              </el-button>
              <!-- <el-button  @click="submitForm('ruleForm')" class="no-margin sale-btns">{{'CONFIRM_HE_PURCHASE'|t}}</el-button> -->
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col :span="11" :offset="1">
        <div class="grid-content textarea-wrap">
          <h3>{{'TRADE_NOTICE'|t}}：</h3>
          <div class="textareaValue">
            <p>{{'ADMSG1'|t}}</p>
            <p>{{'ADMSG2'|t}}</p>
            <p>{{'ADMSG3'|t}}</p>
            <p>{{'ADMSG4'|t}}{{initData.entrust.coinName}}{{'ADMSG4_3'|t}}
              <span class="c-blue">{{'ADMSG4_1'|t}}</span>{{'ADMSG4_2'|t}}
            </p>
            <p>{{'ADMSG5'|t}}</p>
            <p>{{'ADMSG6'|t}}</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <user-mask :value="showBool" position width="600px" height="400px" @close="showBool=false">
      <div class="sale-pay-cont">
        <div class="pay-type-tab">
          <a href="javascript:;" class="type-tab-item" v-for="(item,key) of payInfo" :key=key @click='switchPayTab(item,key)' :class="key==defaultKey?'active':''">{{item.payType|t}}</a>
          <!-- <a href="javascript:;" class="type-tab-item">支付宝付款</a>
            <a href="javascript:;" class="type-tab-item ">微信付款</a> -->
        </div>
        <!-- 支付宝或者微信 -->
        <div class="pay-type-code" v-if="payInfoItem.payType!='UNIONPAY'">
          <!-- <img src="https://qr.api.cli.im/qr?data=%25E6%259B%25BE%25E6%25A2%25A6%25E6%2583%25B3%25E4%25BB%2597%25E5%2589%2591%25E8%25B5%25B0%25E5%25A4%25A9%25E6%25B6%25AF%25EF%25BC%258C%25E5%259B%25A0%25E4%25B8%25BA%25E6%25B2%25A1%25E9%2592%25B1%25E6%2594%25BE%25E5%25BC%2583%25E4%25BA%2586%25E8%25AE%25A1%25E5%2588%2592&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=09493f3975a83481f3a25fcce0a02163" alt=""> -->
          <img :src="imgPath+payInfoItem.url" alt="">
          <p v-show="$route.query.type=='BUY_TYPE'">{{'DIMENSIONAL_CODE'|t}}</p>
        </div>
        <!-- 银行卡 -->
        <div class="pay-type-account" style="width: 80%" v-else>
          <div class="bank-title">{{'UNIONPAY'|t}}</div>
          <div class="bank-info">
            <p>{{payInfoItem.unionPay.code|bankStr}}</p>
            <span>{{'BANK_NAMES'|t}}：{{payInfoItem.unionPay.name}}</span>
          </div>
        </div>
        <el-form :model="subForm" :rules="rules" ref="subForm">
          <div class="box-flex">
            <div class="flex mr-10">
              <el-form-item :label="$t('TOTAL_TRANSACTION')+'：'">
                <el-input v-model="subForm.count" :placeholder="$t('TOTAL_TRANSACTION') " disabled>
                  <span slot="suffix" class="c2b-input-text">CNY</span>
                </el-input>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item :label="$t('NUM')+'：'">
                <el-input v-model="subForm.num" :placeholder="$t('NUM_PLACE')" disabled>
                  <span slot="suffix" class="c2b-input-text">BTC</span>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item>
            <!-- <el-button type="primary" class="flex-btn">{{'DETERMINE'|t}}</el-button> -->
            <el-button type="primary" class="flex-btn" style="background: #752BF7;border-color:#752BF7 " @click="submitForm('subForm')"
              :loading="loadingBool" :disbaled='loadingBool'>
              <span v-if="$route.query.type=='BUY_TYPE'">{{'CONFIRM_HE_PURCHASE'|t}}</span>
              <span v-else>{{'CONFIRM_HE_SALE'|t}}</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </user-mask>
  </div>
</template>
<script>
  import userMask from '@/components/mask';
  import { Rules } from '@/providers/rules';
  import { Coins, C2c, BB } from '@/services';
  import { Func } from '@/providers';
  import { mapGetters, mapState } from "vuex";
  import { BigNumber } from 'bignumber.js';

  export default {
    data() {
      // 最小交易限额不能小于后台设置的交易限额
      var validatorMinPrice = (rule, value, callback) => {
        if (Number(value) < Number(this.initData.entrust.minLimitPrice) || Number(value) > Number(this.initData.entrust.maxLimitPrice)) {
          // return callback(new Error(`输入值不能小于${this.initData.entrust.minLimitPrice}`));
          return callback(new Error(`${this.$t('INPUT_VALUE')}${this.$C(this.initData.entrust.minLimitPrice)}-${this.$C(this.initData.entrust.maxLimitPrice)}${this.$t('BETWEEN')}`));
        }
        // if (Number(value) && Number(value) > Number(this.initData.entrust.maxLimitPrice)) {
        // return callback(new Error(`${this.$t('VALIDATORMINPRICE_ERR2')}`));
        // return callback(new Error(`输入值不能大于${this.initData.entrust.maxLimitPrice}`));
        // }
        // if (Number(value) > Number(this.ruleForm.total)) {
        //   return callback(new Error(`${this.$t('VALIDATORMINPRICE_ERR3')}${this.ruleForm.total}`));
        // }
        callback();
      }
      return {
        lang: Func.getCookie('lang'),
        defaultKey: '0',
        textareaValue: '',
        showBool: false,
        loadingBool: false,
        deductData: {
          deductCoinName: ''
        },
        deductStateText: '',
        subForm: {
          num: '',
          count: ''
        },
        rules: {
          ...Rules,
          dealNum: [
            ...Rules.dealNum,
            { validator: validatorMinPrice, trigger: 'blur' }
          ]
        },
        ruleForm: {
          price: '',
          dealNum: '',
          tradePassword: '',
          deductState: false
        },
        initData: {
          entrust: {
            payType: ''
          }
        },
        payInfo: {},
        payInfoItem: {}
      };
    },
    components: { userMask },
    computed: {
      ...mapGetters(['imgPath'])
    },
    methods: {
      fixeNumber(obj, child, num) {
        let a, b, c;
        if (obj[child].indexOf('.') != -1) {
          a = obj[child].split(".")
          if (a[1].length > num) {
            b = a[1].slice(0, num)
            c = a[0] + '.' + b
            this.$set(obj, child, c);
          }
        }
      },
      // 切换选项卡
      switchPayTab(item, key) {
        this.defaultKey = key;
        this.payInfoItem = item;
      },
      submitForm(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            console.log('error submit!');
            return false;
          }
          if (type) {
            this[type] = true;
          }
          if (formName == 'ruleForm') {
            this.subForm.count = this.mul(this[formName].dealNum, this[formName].price);

            this.subForm.num = BigNumber(this[formName].dealNum);
          } else {
            this.orderAdd();
          }
        });
      },
      // 乘法
      mul(a, b) {
        return BigNumber(a).multipliedBy(BigNumber(b))
      },
      // 购买，出售操作
      async orderAdd() {
        this.loadingBool = true;
        let _parmas = this.ruleForm;
        try {
          let res = await C2c.OrderAdd({
            entrustId: this.$route.query.id,
            dealNum: _parmas.dealNum,
            price: _parmas.price,
            coinPrice: this.initData.coinPrice,
            tradePassword: this.AES(_parmas.tradePassword),
            type: this.$route.query.type,
            payType: this.payInfoItem.payType,
            deductState: _parmas.deductState ? 'Y' : 'N'
          });
          this.SUCCESS(res[this.lang + 'Message']);
          this.resetForm('ruleForm');
          this.resetForm('subForm');
          this.ruleForm.price = this.$C(this.initData.entrust.dealPrice);
          this.getData();
        } catch (error) {
          console.log(error);
        }
        this.showBool = false;
        this.loadingBool = false;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 广告用户付款信息
      async entrustPayInfo() {
        try {
          let res = await C2c.EntrustPayInfo({
            entrustId: this.$route.query.id
          });
          var arr = [];
          for (let items of this.initData.entrust.payType.split(',')) {
            for (let i of res.listData) {
              if (items == i.payType) {
                arr.push(i)
              }
            }
          }
          this.payInfo = arr;
          console.log(res);
          this.payInfoItem = arr[0];
        } catch (error) {
          console.log(error);
        }
      },
      // 获取广告详细信息
      async entrustInfo() {
        try {
          let res = await C2c.EntrustInfo({
            entrustId: this.$route.query.id,
            memberId: this.$route.query.memberId
          });
          this.initData = res.oneData;
          this.ruleForm.price = this.$C(this.initData.entrust.dealPrice);
          this.entrustPayInfo();
          // this.ruleForm.price = this.initData.entrust.dealPrice;
        } catch (error) {
          console.log(error);
        }
      },
      async DeductData() {
        try {
          let res = await BB.DeductData();
          this.deductData = res.oneData;
          let _data = res.oneData;
          this.deductStateText = `${this.$t('DEDUCTSTATETEXT_1')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_2')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_3')}；${this.$t('DEDUCTSTATETEXT_1')}${_data.deductCoinName}${this.$t('DEDUCTSTATETEXT_3_1')}${(BigNumber(1).minus(BigNumber(_data.discount))) * 100}%${this.$t('DEDUCTSTATETEXT_3_2')}`
        } catch (error) {
          console.log(error);
        }
      },
      // 获取初始化数据
      getData() {
        this.entrustInfo();
        this.DeductData();
      }
    },
    created() {
      this.getData();
    }
  };
</script>
<style lang="scss" scoped>
  @import '~@/assets/sass/c2c';
  .sale-template .sale-list .sale-item {
    margin-right: 5px;
  }
</style>