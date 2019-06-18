<template>
    <div class="trade-left">
      <div class="search-cont">
        <div class="search-input">
          <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="input21">
          </el-input>
        </div>
        <el-button class="ml-10">收藏币种</el-button>
      </div>
      <div class="coin-list">
        <a href="javascript:;" v-for="(item,key) of coinList" :key=key class="coin-item" :class="defaultActive==item.id?'active':''">{{item.name}}</a>
      </div>
      <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column :label="$t('CURRENCY')" sortable width="150px">
          <template slot-scope="scope">
            <div class="box-flex">
              <i class="icon-star full"></i>
              <!-- <i class="icon-star empty"></i> -->
              <img class="coin-logo" src="~@/assets/img/coin-logo.png" />
              <span :class="">{{scope.row.date}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="$t('LATESTPRICES')" sortable>
          <template slot-scope="scope">
            <span :class="scope.row.ps>0?'c-red':scope.row.ps<0?'c-success':''">{{scope.row.name|Fixed(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="$t('RISEANDFALLS')" sortable>
          <template slot-scope="scope">
            <span :class="scope.row.ps>0?'c-red':scope.row.ps<0?'c-success':''">{{scope.row.ps|Fixed(4)}}%</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  <script>
    export default {
      name: 'trade-left',
      data() {
        return {
          input21: '',
          defaultActive: 1,
          coinList: [
            { id: 1, name: 'ETH' },
            { id: 2, name: 'BTC' },
            { id: 3, name: 'USDT' },
            { id: 4, name: 'PCNY' }
          ],
          tableData: [{
            date: 'BTC/ETH',
            name: '0.07911122',
            ps: '19.6'
          }, {
            date: 'PTN/ETH',
            name: '0.07911122',
            ps: '19.6'
          }, {
            date: 'BTC/ETH',
            name: '0.07911122',
            ps: '19.6'
          }, {
            date: 'BTC/ETH',
            name: '0.07911122',
            ps: '-2.6'
          }]
        };
      },
      methods: {
        formatter(row, column) {
          return row.address;
        }
      }
    };
  </script>
  <style scoped lang="scss">
    @import '~@/assets/sass/trade';
    .tag3 {
      color: #752BF7
    }
    .tag2 {
      color:rgba(0, 182, 0, 1);
    }
    .tag1 {
      color: rgba(249, 190, 36, 1)
    }
  </style>