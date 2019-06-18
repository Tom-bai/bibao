<template>
  <div class="order-list">
    <div class="user-cont">
      <div class="tab-list">
        <div class="tab-item" v-for="(item,key) of tabList" :key="key" :class="defaultIndex==item.type?'active':''" @click="switchTab(item)">
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="coin-list">
      <div class="content box-flex space-between asset-record clearfix">
        <div class="flex">
          <i class="record-icon"></i>
          <h3>{{'ENTRUSTMENT_MANAGEMENT'|t}}</h3>
        </div>
        <div class="input-suffix">
          <span class="demonstration">{{'TIME'|t}}：</span>
          <el-date-picker v-model="times" type="daterange" align="right" unlink-panels range-separator="-" :start-placeholder="$t('START_TIMES')"
            :end-placeholder="$t('END_TIMES')" @change="searchData" style="width: 300px">
            <!-- :picker-options="pickerOptions2" -->
          </el-date-picker>
          <span class="ml-10" v-show="defaultIndex!='ACTIVE'">{{'STATUS'|t}}：</span>
          <el-select v-model="state" :placeholder="$t('STATUS')" style="width: 100px;" v-show="defaultIndex!='ACTIVE'" @change="searchData">
            <el-option :label="$t('ALL')" value=''></el-option>
            <el-option :label="$t('COMMISSIONED')" value='ACTIVE'></el-option>
            <el-option :label="$t('UNDO')" value='CALCEL'></el-option>
            <el-option :label="$t('COMPLETE')" value='DONE'></el-option>
          </el-select>
          <span class="ml-10">{{'CURRENCY'|t}}：</span>
          <el-select v-model="productCoinId" :placeholder="$t('CURRENCY_PLACE')" style="width: 100px;" @change="searchData">
            <el-option :label="$t('ALL')" value=''></el-option>
            <el-option :label="item.coinName" :value="item.id" v-for="(item,key) of coinList" :key=key></el-option>
          </el-select>
          <span class="ml-10">{{'BLOCK'|t}}：</span>
          <el-select v-model="priceCoinId" :placeholder="$t('BLOCK')" style="width: 100px;" @change="searchData">
            <el-option :label="$t('ALL')" value=''></el-option>
            <el-option :label="item.coinName" :value="item.id" v-for="(item,key) of coinList" :key=key></el-option>
          </el-select>
          <div style="width:100px; margin-right: 5px;">
            <el-select v-model="type" :placeholder="$t('TRANSACTION_TYPE')" class="form-select" @change="searchData">
              <el-option :label="$t('ALL')" value=''></el-option>
              <el-option :label="$t('BUY')" value='BUY'></el-option>
              <el-option :label="$t('SELLS')" value='SELL'></el-option>
            </el-select>
          </div>
          <!-- <span class="search-button" @click="searchData">{{'TAB2_TITLE'|t}}</span> -->
        </div>
      </div>
    </div>
    <div class="content content-data" style="min-height: 500px;">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="createDate" :label="$t('ENTRUS_TIME')" width="180">
          <template slot-scope="scope">
            {{scope.row.createDate|Format}}
          </template>
          <!-- 'yyyy-MM-dd hh:mm:ss -->
        </el-table-column>
        <el-table-column prop="coinName" :label="$t('CURRENCY')" width="100">
          <template slot-scope="scope">
            {{scope.row.productCoinName}}/{{scope.row.priceCoinName}}
          </template>
        </el-table-column>
        <el-table-column prop="types" :label="$t('TYPE')" width="100"></el-table-column>
        <el-table-column :label="$t('CLINCH')+'/'+$t('ENTRUSTNUM')" width="">
          <template slot-scope="scope">
            {{$C(scope.row.dealNum)}}/{{$C(scope.row.entrustNum)}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('ADVERT_PRICE')">
          <template slot-scope="scope">
            {{scope.row.entrustPrice}} {{scope.row.priceCoinName}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('TOTAL_ENTRUSTMENT')">
          <template slot-scope="scope">
            {{mul(scope.row.entrustNum,scope.row.entrustPrice)}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('TYPE')" width="100">
          <template slot-scope="scope">
            {{scope.row.states|t}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('OPERATION')" width="300">
          <template slot-scope="scope">
            <!-- <el-button type="text" v-show="defaultIndex=='ACTIVE'">{{'COMMISSIONED'|t}}</el-button> -->
            <!-- <el-button type="text" class="c-red">交易成功</el-button> -->
            <!-- <el-button type="text" class="c-red">交易失败</el-button> -->
            <!-- <el-button>确定交易</el-button> -->
            <el-button size="mini" v-show="scope.row.state=='ACTIVE'" @click="cancelItem(scope.row)">{{'UNDO'|t}}</el-button>
            <el-button size="mini" @click="$router.push({path:'/order/entrust/detail',query:{id:scope.row.id}})">{{'DETAIL'|t}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block text-c mt-10 mb-10">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="limit"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import userMask from '@/components/mask';
  import { Order, Coins } from "@/services";
  import { Func } from '@/providers';
  import { BigNumber } from 'bignumber.js';
  export default {
    data() {
      return {
        state: '', // 状态
        type: '', // 类型
        times: [new Date(+new Date() - 30 * 24 * 60 * 60 * 1000), new Date()], // 时间
        priceCoinId: '', // productCoinId
        productCoinId: '', // priceCoinId
        defaultIndex: 'ACTIVE',
        page: 1,
        limit: 10,
        total: 0,
        lang: Func.getCookie('lang'),
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value7: '',
        tabList: [
          {
            id: 1,
            type: 'ACTIVE',
            name: this.$t('COMMISSIONED_CURRENT')
          },
          {
            id: 2,
            type: '',
            name: this.$t('HISTORY_CURRENT')
          }
        ],

        value: '',
        tableData: [],
        coinList: []
      };
    },
    components: { userMask },
    methods: {
      // 乘法
      mul(a, b) {
        let x = new BigNumber(a.toString());
        let y = new BigNumber(b.toString());
        let z = x.multipliedBy(y).decimalPlaces(20).toString();
        return z;
      },
      // 撤销数据
      cancelItem(item) {
        this.$confirm(this.$t('REVOKE_TIP'), this.$t('WARMTIPS'), {
          confirmButtonText: this.$t('DETERMINE'),
          cancelButtonText: this.$t('CANCEL'),
          type: 'warning'
        }).then(async () => {
          try {
            let res = await Order.BbCenterCancelEntrust({
              entrustId: item.id
            });
            this.SUCCESS(res[this.lang + 'Message']);
            item.state = 'CALCEL';
            item.states = 'UNDO';
            // let stateMap = new Map();
            // let typeMap = new Map();
            // stateMap.set('ACTIVE', '委托中').set('CALCEL', '撤销').set('DONE', '完成');
            // item.states = stateMap.get(item.state);
          } catch (error) {
            console.log(error)
          }
        }).catch(() => {

        });
      },
      handleCurrentChange(val) {
        this.page = val;
        this.BbCenterUserEntrusts();
      },
      // 切换选项卡
      switchTab(item) {
        if (this.defaultIndex == item.type) { return false };
        this.defaultIndex = item.type;
        this.state = ''; // 状态
        this.type = ''; // 类型
        this.times = [new Date(+new Date() - 30 * 24 * 60 * 60 * 1000), new Date()]; // 时间
        this.priceCoinId = ''; // productCoinId
        this.productCoinId = ''; // priceCoinId
        this.page = 1;
        this.limit = 10;
        this.BbCenterUserEntrusts();
      },
      async getCoinList() {
        try {
          let res = await Coins.UseList();
          this.coinList = res.listData;
        } catch (error) {
          console.log(error);
        }
      },
      // 搜索数据
      searchData() {
        this.BbCenterUserEntrusts();
      },
      submitForm(formName) {
      },
      async BbCenterUserEntrusts() {
        try {
          let res = await Order.BbCenterUserEntrusts({
            productCoinId: this.productCoinId,
            priceCoinId: this.priceCoinId,
            type: this.type,
            state: this.defaultIndex == 'ACTIVE' ? 'ACTIVE' : this.state,
            startDate: this.times[0].format('yyyy-MM-dd hh:mm:ss'),
            endDate: this.times[1].format('yyyy-MM-dd hh:mm:ss'),
            pageNum: this.page,
            pageSize: this.limit,
          });
          this.tableData = res.oneData.list;
          let stateMap = new Map();
          let typeMap = new Map();
          stateMap.set('ACTIVE', this.$t('COMMISSIONED')).set('CALCEL', this.$t('UNDO')).set('DONE', this.$t('COMPLETE'));
          typeMap.set('SELL', this.$t('SELLS')).set('BUY', this.$t('BUY'));
          for (let item of this.tableData) {
            item.states = stateMap.get(item.state);
            item.types = typeMap.get(item.type);
          }
          this.total = res.oneData.total;
        } catch (error) {
          console.log(error);
        }
      },
      getData() {
        this.getCoinList();
        this.BbCenterUserEntrusts();
      }
    },
    created() {
      this.getData();
    }
  };
</script>
<style scoped lang="scss">
  /* @import '~@/assets/sass/asset'; */

  @import '~@/assets/sass/order.scss';
</style>