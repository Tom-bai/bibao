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
          <h3>{{'C2B_ORDER'|t}}</h3>
        </div>
        <div class="input-suffix">
          <!-- <span>{{'CURRENCY'|t}}：</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
          <span>{{'CURRENCY'|t}}：</span>
          <el-select v-model="coinId" :placeholder="$t('CURRENCY_PLACE')">
            <el-option :label="$t('ALL')" value=""></el-option>
            <el-option v-for="(item,key) of coinList" :key=key :label="item.coinName" :value="item.id">
            </el-option>
          </el-select>
          <span>{{'STATUS'|t}}：</span>
          <el-select v-model="status" :placeholder="$t('STATUS')">
            <el-option :label="$t('ALL')" value=""></el-option>
            <el-option v-for="(item,key) in statusData" :key="key" :label="item[lang+'Name']" :value="item.value">
            </el-option>
          </el-select>
          <!-- <span class="demonstration">申请时间：</span>
          <el-date-picker v-model="date" type="date" placeholder="选择日期" class="mr-10">
          </el-date-picker> -->
          <span class="search-button" @click="searchData()">{{'TAB2_TITLE'|t}}</span>
        </div>
      </div>
    </div>
    <div class="content content-data" style="min-height: 500px">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="orderNo" :label="$t('ORDER_NUMBER')" sortable width="180"></el-table-column>
        <el-table-column prop="coinName" :label="$t('CURRENCY')" sortable width="180"></el-table-column>
        <el-table-column prop="price" :label="$t('ADVERT_PRICE')" sortable>
          <template slot-scope="scope">
            {{$C(scope.row.price)}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('NUM')" sortable>
          <template slot-scope="scope">
            {{$C(scope.row.amount)}}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :label="$t('TIME')" sortable></el-table-column>
        <el-table-column :label="$t('STATUS')" sortable>
          <template slot-scope="scope">
            <el-button type="text" class="c-red" size="mini">{{scope.row.statue}}</el-button>
            <!-- <el-button type="text" class="c-red">已成交</el-button> -->
            <!-- <el-button type="text" class="c-red">处理中</el-button> -->
            <!-- <el-button>确定交易</el-button> -->
            <el-button v-if="scope.row.status=='CTB_GOON'" @click="deleteItem(scope.row)" size="mini">{{'UNDO'|t}}</el-button>
            <el-button @click="$router.push({path:'/order/c2b/detail',query:{id:scope.row.id}})" type="text" size="mini">{{'DETAIL'|t}}</el-button>
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
  import { Rules } from '@/providers/rules';
  import { Coins, C2b, C2c, Order } from '@/services';
  import { Func } from '@/providers';
  export default {
    data() {
      return {
        coinList: [],
        page: 1,
        limit: 10,
        total: 0,
        defaultIndex: 'CTB_TRAN_BUY',
        coinId: '',
        status: '',
        date: '',
        rules: Rules,
        lang: Func.getCookie('lang'),
        tabList: [
          {
            id: 1,
            type: 'CTB_TRAN_BUY',
            name: this.$t('BUY_DETAIL')
          },
          {
            id: 2,
            type: 'CTB_TRAN_SELL',
            name: this.$t('SELL_DETAIL')
          }
        ],
        statusData: [],
        tableData: []
      };
    },
    components: { userMask },
    methods: {
      // 分页切换
      handleCurrentChange(val) {
        this.page = val;
        this.transactionGetList();
      },
      // 搜索数据
      searchData() {
        this.page = 1;
        this.transactionGetList();
      },
      // 选项卡切换
      switchTab(item) {
        if (this.defaultIndex == item.type) { return false };
        this.defaultIndex = item.type;
        this.page = 1;
        this.status = '';
        this.coinId = '';
        this.transactionGetList();
      },
      // 撤销
      deleteItem(item) {
        this.$confirm(this.$t('DELETE_ORDER_TIP'), this.$t('PROMPT'), {
          confirmButtonText: this.$t('DETERMINE'),
          cancelButtonText: this.$t('CANCEL'),
          type: 'warning'
        }).then(async () => {
          try {
            let res = await C2b.TransactionUndo({
              orderId: item.id
            });
            this.$notify({
              title: this.$t('WARMTIPS'),
              message: res[this.lang + 'Message'],
              type: 'success'
            });
            item.status = 'CTB_UNDO';
            let map = new Map();
            for (let item of this.statusData) {
              map.set(item.value, item[this.lang + 'Name']);
            }
            item.statue = map.get(item.status);
          } catch (error) {
            console.log(error);
          }
        }).catch(() => { console.log('取消操作'); });
      },
      // 获取币种数据
      async getCoinList() {
        try {
          let res = await Coins.UseList();
          this.coinList = res.listData;
        } catch (error) {
          console.log(error);
        }
      },
      // 获取tabel数据
      async transactionGetList() {
        try {
          let res = await C2b.TransactionGetList({
            page: this.page,
            limit: this.limit,
            type: this.defaultIndex,
            coinId: this.coinId,
            status: this.status
          });
          let map = new Map();
          for (let item of this.statusData) {
            map.set(item.value, item[this.lang + 'Name']);
          }
          for (let items of res.oneData.list) {
            items.statue = map.get(items.status);
          };
          this.tableData = res.oneData.list;
          this.total = res.oneData.total;
        } catch (error) {
          console.log(error);
        }
      },
      // 获取状态
      async TransactionStateList() {
        try {
          let res = await C2b.TransactionStateList();
          this.statusData = res.listData;
        } catch (error) {
          console.log(error);
        }
      },
      getData() {
        this.getCoinList();
        this.TransactionStateList();
        this.transactionGetList();
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