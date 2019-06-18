<template>
  <div class="trade-right fullPage" ref="fullPage">
    <el-row class="kline-wrap" ref="klineWrap">
      <el-col :span="19">
        <div class="grid-content">
          <!--头部 -->
          <div class="trade-right-top box-flex" ref='tradeTop'>
            <div class="top-item flex">
              <img src="~@/assets/img/coin-logo.png" alt="" class="top-item-logo">
              <span>BTC/ETH</span>
              <span class="introduce-text-btn" v-tip.right="introductText">{{'INTRODUCTTEXT'|t}}</span>
            </div>
            <div class="top-item flex">
              <h3 class="top-item-title c-red">0.07911122</h3>
              <p>≈5590.5CNY</p>
            </div>
            <div class="top-item flex">
              <h3 class="top-item-title c-red">+19.6%</h3>
              <p>{{'RISEANDFALL'|t}}</p>
            </div>
            <div class="top-item flex">
              <h3 class="top-item-title c-red">0.08528</h3>
              <p>{{'HIGHESTPRICE'|t}}</p>
            </div>
            <div class="top-item flex">
              <h3 class="top-item-title c-success">0.078241</h3>
              <p>{{'LOWESTPRICE'|t}}</p>
            </div>
            <div class="top-item flex">
              <h3 class="top-item-title c-info" @click="checkSrc">14461653.74 BTC</h3>
              <p>{{'TRADINGVOLUME'|t}}</p>
            </div>
          </div>
          <!-- k线图 -->
          <!-- <div class="kline-component" style="z-index:9999;position:fixed;left: 0;right: 0;top: 0;bottom: 0;"> -->
          <div class="kline-component" ref="kline">
            <!-- <a :href="klineSrc" style="position: absolute;right: 10px;top: 2px;color: white" target="_blank">
              <span>全屏K线>> </span>
            </a> -->
            <iframe :src="klineSrc" frameborder="0" style="height: 100%;width:100%"></iframe>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content">
          <div class="trade-list">
            <div class="trade-item title">
              <div class="trade-info">类型</div>
              <div class="trade-info">价格( ETH )</div>
              <div class="trade-info">数量( BTC )</div>
            </div>
          </div>
          <div class="trade-list list list-sell">
            <div class="trade-item" v-for="(item,key) of dataList" :key=key>
              <div class="trade-info">卖{{key+1}}</div>
              <div class="trade-info">{{item.val|Fixed(7)}}</div>
              <div class="trade-info">
                {{item.val|Fixed(7)}}
              </div>
            </div>
          </div>
          <div class="trade-now-price">
            <span>现价：</span>
            <span class="c-red">0.07911122 </span>
            <span>ETH </span>
            <span class="c-info">≈5590.5CNY</span>
          </div>
          <div class="trade-list">
            <div class="trade-item title">
              <div class="trade-info">类型</div>
              <div class="trade-info">价格( ETH )</div>
              <div class="trade-info">数量( BTC )</div>
            </div>
          </div>
          <div class="trade-list  list list-buy">
            <div class="trade-item" v-for="(item,key) of dataList" :key=key>
              <div class="trade-info">卖{{key+1}}</div>
              <div class="trade-info">{{item.val|Fixed(7)}}</div>
              <div class="trade-info">{{item.val|Fixed(7)}}
              </div>
            </div>
          </div>
          <div class="trade-list">
            <div class="trade-item title">
              <div class="trade-info">类型</div>
              <div class="trade-info">价格( ETH )</div>
              <div class="trade-info">数量( BTC )</div>
            </div>
          </div>
          <div class="trade-list list list-sell">
            <div class="trade-item" v-for="(item,key) of dataList" :key=key>
              <div class="trade-info">卖{{key+1}}</div>
              <div class="trade-info">{{item.val|Fixed(7)}}</div>
              <div class="trade-info">
                {{item.val|Fixed(7)}}
              </div>
            </div>
          </div>
          <div class="trade-list list list-buy">
            <div class="trade-item" v-for="(item,key) of dataList" :key=key>
              <div class="trade-info">卖{{key+1}}</div>
              <div class="trade-info">{{item.val|Fixed(7)}}</div>
              <div class="trade-info">{{item.val|Fixed(7)}}
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- sale -->
    <div class="sale-cont " ref="sale">
      <el-row class="" style="height: 100%;">
        <el-col :span="15 " class="full-page-table">
          <div class="grid-content">
            <div class="switch-tab clearfix">
              <a href="javascript:;" class="tab-item active">当前委托</a>
              <a href="javascript:;" class="tab-item">成交记录</a>
            </div>
            <el-table :data="tableData" style="width: 100%;">
              <div slot="empty" class="empty-text">
                详情请先
                <span class="c-blue">登录</span>或
                <span class="c-blue">注册</span>
              </div>
              <el-table-column prop="date" label="委托时间" width="180"></el-table-column>
              <el-table-column prop="name" label="类型" width="180"></el-table-column>
              <el-table-column prop="address" label="数量"></el-table-column>
              <el-table-column prop="address" label="价格"></el-table-column>
              <el-table-column prop="address" label="委托总额"></el-table-column>
              <el-table-column prop="address" :label="$t('STATUS')"></el-table-column>
              <el-table-column prop="address" label="操作"></el-table-column>
            </el-table>
          </div>
        </el-col>
        <!-- 买 -->
        <el-col :span="9" class="box-flex full-page-trade">
          <div class="grid-content flex mr-10">
            <div class="sale-title">{{'AVALIABLE'|t}}
              <span class="c-red">--ETH</span>
            </div>
            <div class="form-wrap">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" :placeholder="$t('REQUIRE_PHONE_EMAIL')" class="c2b-input">
                    <span slot="prefix" class="c2b-input-text-left">买入价</span>
                    <span slot="suffix" class="c2b-input-text">ETH</span>
                  </el-input>
                </el-form-item>
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" :placeholder="$t('PASSWORD_PLACE')" class="c2b-input">
                    <span slot="prefix" class="c2b-input-text-left">买入量</span>
                    <span slot="suffix" class="c2b-input-text">BTC</span>
                  </el-input>
                </el-form-item>
                <div class="box-flex sale-slider">
                  <div class="flex mr-20">
                    <el-slider v-model="value7" :step="5" show-stops class="red-bar">
                    </el-slider>
                  </div>
                  <span class="ml-10">{{value7|Fixed}}%</span>
                </div>
                <div class="clearfix mb-10 mt-10 sale-desc">
                  <p class="float-l">{{'EXPECTED_TRANSACTION'|t}}：
                    <span class="c-red">99.99</span> CNY</p>
                  <span class="float-r">{{'SERVER_CHARGE'|t}}：0.1%</span>
                </div>
                <!-- <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" type="passworld" :placeholder="$t('USER_TRADE_PASS_PLACE')" class="c2b-input">
                    <span slot="prefix" class="c2b-input-text-left">{{'USER_TRADE_PASS'|t}}</span>
                  </el-input>
                </el-form-item> -->
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')" class="flex-btn" style="background: #F5322D;border:none">立即购买</el-button>
                </el-form-item>
                <!-- <div class="sale-submit-btn">
                  <span class="c-blue">{{'LOGIN_TITLE'|t}}</span>
                  <span>{{'OR'|t}}</span>
                  <span class="c-blue">{{'SIGNUP'|t}}</span>
                  <span>{{'TRADE'|t}}</span>
                </div> -->
              </el-form>
            </div>
          </div>
          <div class="grid-content flex ml-10">
            <div class="sale-title">{{'AVALIABLE'|t}}
              <span class="c-success">--ETH</span>
            </div>
            <div class="form-wrap">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" :placeholder="$t('REQUIRE_PHONE_EMAIL')" class="c2b-input">
                    <span slot="prefix" class="c2b-input-text-left">买入价</span>
                    <span slot="suffix" class="c2b-input-text">ETH</span>
                  </el-input>
                </el-form-item>
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" :placeholder="$t('PASSWORD_PLACE')" class="c2b-input">
                    <span slot="prefix" class="c2b-input-text-left">买入量</span>
                    <span slot="suffix" class="c2b-input-text">BTC</span>
                  </el-input>
                </el-form-item>
                <div class="box-flex sale-slider">
                  <div class="flex mr-20">
                    <el-slider v-model="value7" :step="5" show-stops class="success-bar">
                    </el-slider>
                  </div>
                  <span class="ml-10">{{value7|Fixed}}%</span>
                </div>
                <div class="clearfix mb-10 mt-10 sale-desc">
                  <p class="float-l">{{'EXPECTED_TRANSACTION'|t}}：
                    <span class="c-success">99.99</span> CNY</p>
                  <span class="float-r">{{'SERVER_CHARGE'|t}}：0.1%</span>
                </div>
                <!-- <el-form-item prop="name">
                    <el-input v-model="ruleForm.name" type="passworld" :placeholder="$t('USER_TRADE_PASS_PLACE')" class="c2b-input">
                      <span slot="prefix" class="c2b-input-text-left">{{'USER_TRADE_PASS'|t}}</span>
                    </el-input>
                  </el-form-item> -->
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')" class="flex-btn" style="background: #00BB39;border:none">立即购买</el-button>
                </el-form-item>
                <!-- <div class="sale-submit-btn">
                  <span class="c-blue">{{'LOGIN_TITLE'|t}}</span>
                  <span>{{'OR'|t}}</span>
                  <span class="c-blue">{{'SIGNUP'|t}}</span>
                  <span>{{'TRADE'|t}}</span>
                </div> -->
              </el-form>
            </div>
          </div>
          <div class="trade-pass">
            <div class="trade-pass-mask"></div>
            <div class="trade-pass-form">
              <div class="form-wrap">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                  <el-form-item prop="name" :label="$t('USER_TRADE_PASS')">
                    <el-input v-model="ruleForm.name" type="passworld" :placeholder="$t('USER_TRADE_PASS_PLACE')" >
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" class="flex-btn" style="background: #00BB39;border:none">确定</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'trade-right',
    data() {
      return {
        klineSrc: 'http://localhost:8082/',
        introductText: '',
        posBool: false,
        ruleForm: {
          name: ''
        },
        bool: false,
        value7: 0,
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        dataList: [
          { val: 0.1356857, ps: 10 },
          { val: 0.175657, ps: 40 },
          { val: 0.13857, ps: 88 },
          { val: 0.135357, ps: 33 },
          { val: 0.12857, ps: 55 },
          { val: 0.144557, ps: 20 }
        ],
        tableData: []
      };
    },
    methods: {
      checkSrc() {
        this.klineSrc = 'http://localhost:8082/?lang=en-us';
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
      },
      init() {
        this.$refs.fullPage.style.height = document.body.clientHeight - 72 + 'px';
        this.$refs.klineWrap.$el.style.height = document.body.clientHeight - 430 + 'px';
        this.$refs.kline.style.height = document.body.clientHeight - 430 - 80 + 'px';
        this.klineSrc = `http://localhost:8082/?height=${document.body.clientHeight - 430}`;
      },
      onresize() {
        window.onresize = () => {
          this.init();
        };
      }
    },
    created() {
      this.introductText = `<div class="introduct-text"><h3>比特币（Bitcoin）</h3><div class="desc">比特币是目前使用最为广泛的一种数字货币。它诞生于2009年1月3日，是一种点对点（P2P）传输的数字加密货币，总量2100万枚。比特币网络每10分钟释放出一定数量币，预计在2140年达到极限。比特币涨幅曾接近460万倍，被投资者称为“数字黄金”。截止目前比特币总市值突破3748亿人民币。比特币因去中心化、全球流通、低交易费用、匿名流通等特点，备受科技爱好者青睐。近来华尔街、多国央行等传统金融机构开始研究比特币区块链技术，中国人民银行也公布研发数字货币的计划。日本政府正式承认比特币为法定支付方式，越来越多的日本商家接受了比特币支付。
发行时间 : 2008/11/1<br/>发行总量 : 2100万<br/>流通总量 : 1673.82万<br/>白皮书 :<span class='c-blue'>https://bitcoin.org/bitcoin.pdf<br/></span>官网 :<span class='c-blue'>https://bitcoin.org/en/<br/></span>区块查询 :<span class='c-blue'>https://blockchain.info/</span> <br/> </div></div>`;
      document.body.style.overflow = 'hidden';
      this.onresize();
    },
    mounted() {
      this.init();
    }
  };
</script>
<style scoped lang="scss">
  @import '~@/assets/sass/trade';
</style>