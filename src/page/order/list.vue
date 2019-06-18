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
          <h3>{{'C2C_ORDER'|t}}</h3>
        </div>
        <div class="input-suffix">
          <span>{{'CURRENCY'|t}}：</span>
          <el-select v-model="coinId" :placeholder="$t('CURRENCY_PLACE')">
            <el-option :label="$t('ALL')" value=""></el-option>
            <el-option v-for="(item,key) of coinList" :key=key :label="item.coinName" :value="item.id">
            </el-option>
          </el-select>
          <!-- <span>{{'STATUS'|t}}：</span> -->
          <span>{{'STATUS'|t}}：</span>
          <el-select v-model="state" :placeholder="$t('STATUS')">
            <el-option :label="$t('ALL')" value=""></el-option>
            <el-option v-for="(item,key) in stateData" :key="key" :label="item[lang+'Name']" :value="item.value">
            </el-option>
          </el-select>
          <span class="search-button" @click="searchData()">{{'TAB2_TITLE'|t}}</span>
        </div>
      </div>
    </div>
    <div class="content content-data" style="min-height: 500px">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="nickname" :label="$t('TRANSACTION_OBJECT')" sortable></el-table-column>
        <el-table-column prop="coinName" :label="$t('CURRENCY')" sortable></el-table-column>
        <el-table-column prop="dealNumber" :label="$t('NUM')" sortable>
          <template slot-scope="scope">
            {{$C(scope.row.dealNumber)}}
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('TRANSACTION_AMOUNT')" sortable>
          <template slot-scope="scope">
            {{$C(scope.row.price)}}{{scope.row.coinName}}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :label="$t('TRADING_HOURS')" sortable width="180"></el-table-column>
        <el-table-column :label="$t('STATUS')">
          <template slot-scope="scope">
            <el-button type="text">{{scope.row.states}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('OPERATION')" width="300">
          <template slot-scope="scope">
            <!--  确认付款  -->
            <el-button class="stateBtn" size="mini" v-if="scope.row.state=='WAIT_BUY_PAY'&&defaultIndex=='BUY_TYPE'" @click="comfirmOrder(scope.row,'WAIT_SELL_CONFIRM')">{{'COMFRIM_PAY'|t}}</el-button>
            <!-- 确认收款 -->
            <el-button class="stateBtn" size="mini" v-if="scope.row.state=='WAIT_SELL_CONFIRM'&&defaultIndex=='SELL_TYPE'" @click="ConfirmPayment(scope.row)">{{'CONFIRMCOLLECTING'|t}}</el-button>
            <!-- 申诉 -->
            <el-button class="stateBtn" size="mini" v-if="scope.row.state=='WAIT_SELL_CONFIRM'" @click="appealFn(scope.row)">{{'STATE_COMPLAINT'|t}}</el-button>
            <!-- 查看付款方式 |详情-->
            <el-button class="stateBtn" size="mini" @click="$router.push({path:'/order/detail',query:{id:scope.row.id,type:defaultIndex}})">
              <span v-if="scope.row.state=='WAIT_BUY_PAY'&&defaultIndex=='BUY_TYPE'">{{'CHECKPAYMENT'|t}}</span>
              <span v-else>{{'DETAIL'|t}}</span>
            </el-button>
            <!-- 取消 -->
            <el-button class="stateBtn" size="mini" v-if="scope.row.state=='WAIT_BUY_PAY'" @click="comfirmOrder(scope.row,'CANCEL')">{{'CANCEL'|t}}</el-button>
            <!-- 删除-->
            <el-button class="stateBtn" size="mini" v-if="scope.row.state!='WAIT_BUY_PAY'&&scope.row.state!='DISPUTE_GO_ON'&&scope.row.state!='WAIT_SELL_CONFIRM'"
              @click="deleteItem(scope.row,scope.$index,tableData)">{{'DELETE'|t}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block text-c mt-10 mb-10">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="limit"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 申述纠纷 -->
    <user-mask :value="appealBool" position width="600px" height="400px">
      <div class="user-form-wrap">
        <div class="user-form-title">{{'STATE_COMPLAINT'|t}}</div>
        <el-form :model="appealForms" :rules="rules" ref="appealForms">
          <!-- <el-form-item prop="reason" label="原因">
            <el-input v-model="appealForms.reason" placeholder="请输入详细的纠纷原因" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
          </el-form-item> -->
          <div class="zx-form-label">
            <div class="zx-form-title">
              <div class="title" style="font-size: 14px;margin-bottom: 5px;color: #48494c;">
                <span class="c-blue">*</span>&nbsp;{{'REASON'|t}}</div>
            </div>
            <el-form-item label="" prop="reason">
              <el-input v-model="appealForms.reason" :placeholder="$t('STATE_COMPLAINT_REASON')" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
            </el-form-item>
          </div>
          <!-- 文件上传 -->
          <div class="zx-form-label">
            <div class="zx-form-title">
              <div class="title" style="font-size: 14px;margin-bottom: 5px;color: #48494c;">
                <span class="c-blue">*</span>&nbsp;{{'IMG_VERIF'|t}}</div>
            </div>
          </div>
          <div class="box-flex space-between">
            <div class="upload-flex">
              <el-form-item prop="imgHand">
                <div class="form-file">
                  <div class="form-input-file appeal-pic">
                    <img src="" alt="" id="imgHandSrc">
                    <input type="file" accept="image/png, image/jpeg" @change="changeFile($event,'imgHandSrc','imgHand')" id="imgHand">
                  </div>
                </div>
              </el-form-item>
            </div>
            <div class="upload-flex" v-if="appealForms.imgHand">
              <el-form-item>
                <div class="form-file">
                  <div class="form-input-file appeal-pic">
                    <img src="" alt="" id="imgFaceSrc">
                    <input type="file" accept="image/png, image/jpeg" @change="changeFile($event,'imgFaceSrc','imgFace')" id="imgFace">
                  </div>
                </div>
              </el-form-item>
            </div>
            <div class="upload-flex" v-if="appealForms.imgHand">
              <el-form-item>
                <div class="form-file">
                  <div class="form-input-file appeal-pic">
                    <img src="" alt="" id="imgBackSrc">
                    <input type="file" accept="image/png, image/jpeg" @change="changeFile($event,'imgBackSrc','imgBack')" id="imgBack">
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
          <el-form-item>
            <el-button type="primary" class="flex-btn" style="background: #005EFF" @click="submitAppealForm('appealForms')" :loading="formBool"
              :disabled="formBool">{{'COMFIRM'|t}}{{'STATE_COMPLAINT'|t}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </user-mask>
    <!-- 确认交易 -->
    <user-mask :value="showBool" position width="600px" height="400px" @close="closeMask">
      <div class="user-form-wrap">
        <div class="user-form-title">{{'C2C_TRADING'|t}}</div>
        <el-form :model="conformForm" :rules="rules" ref="conformForm">
          <div class="box-flex">
            <div class="flex mr-10">
              <el-form-item :label="$t('NUM')">
                <el-input v-model="conformForm.dealNumber" :placeholder="$t('NUM_PLACE')" class="success-input c2c-input">
                </el-input>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item :label="$t('TRANSACTION_AMOUNT')">
                <el-input v-model="conformForm.price" :placeholder="$t('TRANSACTION_AMOUNT') " class="success-input c2c-input">
                </el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item prop="tradePassword" :label="$t('USER_TRADE_PASS')">
            <el-input v-model="conformForm.tradePassword" :placeholder="$t('USER_TRADE_PASS_PLACE')" class="c2c-input" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="flex-btn" style="background: #005EFF" @click="submitForm('conformForm')">{{'CERTAINTY_TRANSACTION'|t}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </user-mask>
  </div>
</template>
<script>
  import userMask from '@/components/mask';
  import { Rules } from '@/providers/rules';
  import { Order, Coins } from '@/services';
  import { Func } from '@/providers';

  export default {
    data() {
      return {
        showBool: false,
        appealBool: false,
        formBool: false,
        page: 1,
        limit: 10,
        total: 0,
        coinId: '',
        state: '',
        coinList: [],
        imgHand: '',
        imgFace: '',
        imgBack: '',
        defaultIndex: 'BUY_TYPE',
        confirmPayItem: {},
        appealItem: {},
        conformForm: {
          dealNumber: '',
          price: '',
          tradePassword: ''
        },
        appealForms: {
          reason: '',
          imgHand: null,
          imgFace: null,
          imgBack: null
        },
        lang: Func.getCookie('lang'),
        stateData: [],
        rules: {
          ...Rules,
          reason: [
            { required: true, message: this.$t('STATE_COMPLAINT_REASON') },
            { max: 100, message: this.$t('MAX_REMAKSS'), trigger: 'blur' }
          ],
          imgHand: [{ required: true, message: this.$t('UPLOAD_PIC') }],
          imgFace: [{ required: true, message: this.$t('UPLOAD_PIC') }],
          imgBack: [{ required: true, message: this.$t('UPLOAD_PIC') }]
        },
        tabList: [
          {
            id: 1,
            type: 'BUY_TYPE',
            name: this.$t('BUY_ORDER')
          },
          {
            id: 2,
            type: 'SELL_TYPE',
            name: this.$t('SELL_ORDER')
          }
        ],
        tableData: []
      };
    },
    components: { userMask },
    methods: {
      closeMask() {
        this.showBool = false;
        this.formBool = false;
      },
      // 提交
      submitAppealForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (!valid) {
            console.log('error submit!!');
            return false;
          }
          this.formBool = true;
          let _parmas = this[formName];
          let _item = this.appealItem;
          let formData = new FormData();
          formData.append('orderId', _item.id);
          formData.append('remark', _parmas.reason);
          formData.append('type', this.defaultIndex);
          formData.append('pic1', _parmas.imgHand);
          formData.append('pic2', _parmas.imgFace);
          formData.append('pic3', _parmas.imgBack)
          try {
            let res = await Order.DisputeAdd(formData);
            this.$notify({
              title: this.$t('WARMTIPS'),
              message: res[this.lang + 'Message'],
              type: 'success'
            });
            _item.state = 'DISPUTE_GO_ON';
            let stateMap = new Map();
            for (let items of this.stateData) {
              stateMap.set(items.value, items[this.lang + 'Name']);
            }
            _item.states = stateMap.get(_item.state);
            this.appealBool = false;
            this.resetForm(formName);
            this.clearFileVlaue('imgHand');
            this.clearFileVlaue('imgFace');
            this.clearFileVlaue('imgBack');
          } catch (error) {
            console.log(error);
          }
          this.formBool = false;
        });
      },
      clearFileVlaue(fileID) {
        var file = document.getElementById(fileID);
        var imgSrc = document.getElementById(fileID + 'Src');
        file.value = '';
        imgSrc.src = '';
      },
      // 文件上传
      changeFile($event, type, formInputValue) {
        var input = $event.target;
        var files = $event.target.files[0];
        if (files) {
          var reader = new FileReader();
          reader.onload = () => {
            var dataURL = reader.result;
            var output = document.getElementById(type);
            output['src'] = dataURL;
          };
          reader.readAsDataURL(input.files[0]);
          this.appealForms[formInputValue] = input.files[0];
        }
        this.$refs.appealForms.validateField(formInputValue);
      },
      // 点击上传文件
      uploadFIle(id) {
        document.getElementById(id).click();
      },
      // 申述
      appealFn(item) {
        this.appealItem = item;
        this.appealBool = true;
      },
      // 删除
      deleteItem(item, index, tableData) {
        this.$confirm(this.$t('DELETE_TIP'), this.$t('PROMPT'), {
          confirmButtonText: this.$t('DETERMINE'),
          cancelButtonText: this.$t('CANCEL'),
          type: 'warning'
        }).then(async () => {
          try {
            let res = await Order.OrderDelete({
              orderId: item.id
            });
            this.$notify({
              title: this.$t('WARMTIPS'),
              message: res[this.lang + 'Message'],
              type: 'success'
            });
            tableData.splice(index, 1);
          } catch (error) {
            console.log(error);
          }
        }).catch(() => { console.log('取消操作'); });
      },
      // 确认收款
      ConfirmPayment(item) {
        this.confirmPayItem = item;
        this.conformForm.dealNumber = this.$C(item.dealNumber) + ' ' + item.coinName;
        this.conformForm.price = this.$C(item.price) + 'CNY';
        this.showBool = true;
        // this.$confirm('此操作为确认收款，是否继续?', '提示', {
        //   confirmButtonText: this.$t('DETERMINE'),
        //    cancelButtonText: this.$t('CANCEL'),
        //   type: 'warning'
        // }).then(async () => {
        //   try {
        //     let res = await Order.Update({
        //       orderId: item.id
        //     });
        //     this.$notify({
        //        title: this.$t('WARMTIPS'),
        //       message: '成功',
        //       type: 'success'
        //     });
        //     item.state = 'DONE';
        //     let stateMap = new Map();
        //     for (let items of this.stateData) {
        //       stateMap.set(items.value, items[this.lang + 'Name']);
        //     }
        //     item.states = stateMap.get(item.state);
        //   } catch (error) {
        //     console.log(error);
        //   }
        // }).catch(() => { console.log('取消操作'); });
      },
      // 取消订单或者卖方确认付款
      comfirmOrder(item, type) {
        this.orderInfo = item;
        let tip = type == 'WAIT_SELL_CONFIRM' ? this.$t('COMFRIM_PAY_TIP') : this.$t('CANCEL_ORDER');
        if (type == 'WAIT_SELL_CONFIRM') {
          this.ConfirmPayment(item)
        } else {
          this.$confirm(tip, this.$t('PROMPT'), {
            confirmButtonText: this.$t('DETERMINE'),
            cancelButtonText: this.$t('CANCEL'),
            type: 'warning'
          }).then(async () => {
            try {
              let res = await Order.InfoUpdata({
                orderId: item.id,
                state: type
              });
              this.$notify({
                title: this.$t('WARMTIPS'),
                message: res[this.lang + 'Message'],
                type: 'success'
              });
              item.state = type == 'WAIT_SELL_CONFIRM' ? 'WAIT_SELL_CONFIRM' : 'CANCEL';
              let stateMap = new Map();
              for (let items of this.stateData) {
                stateMap.set(items.value, items[this.lang + 'Name']);
              }
              item.states = stateMap.get(item.state);
            } catch (error) {
              console.log(error);
            }
          }).catch(() => { console.log('取消操作'); });
        }
      },
      // 搜索数据
      searchData() {
        this.page = 1;
        this.orderList();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.orderList();
        // this.getList(this.coinItem)
      },
      // 切换选项卡
      switchTab(item) {
        if (this.defaultIndex == item.type) { return false; }
        this.defaultIndex = item.type;
        this.coinId = '';
        this.state = '';
        this.orderList();
      },
      // 表单提交
      submitForm(formName) {

        this.$refs[formName].validate(async (valid) => {
          if (!valid) {
            console.log('error submit!!');
            return false;
          }
          let item = this.confirmPayItem;
          // 出售
          if (this.defaultIndex == 'SELL_TYPE') {
            try {
              let res = await Order.Update({
                orderId: item.id,
                tradePassword: this.AES(this[formName].tradePassword)
              });
              this.$notify({
                title: this.$t('WARMTIPS'),
                message: res[this.lang + 'Message'],
                type: 'success'
              });
              item.state = 'DONE';
              let stateMap = new Map();
              for (let items of this.stateData) {
                stateMap.set(items.value, items[this.lang + 'Name']);
              }
              item.states = stateMap.get(item.state);
              this.showBool = false;
              this.resetForm(formName);
            } catch (error) {
              console.log(error);
            }
          } else {
            // 购买
            try {
              let res = await Order.InfoUpdata({
                orderId: item.id,
                state: 'WAIT_SELL_CONFIRM',
                tradePassword: this.AES(this[formName].tradePassword)
              });
              item.state = 'WAIT_SELL_CONFIRM';
              let stateMap = new Map();
              for (let items of this.stateData) {
                stateMap.set(items.value, items[this.lang + 'Name']);
              }
              item.states = stateMap.get(item.state);
              this.showBool = false;
              this.$notify({
                title: this.$t('WARMTIPS'),
                message: res[this.lang + 'Message'],
                type: 'success'
              });
              this.resetForm(formName);
            } catch (error) {
              console.log(error);
            }
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 获取币种
      async getCoinList() {
        try {
          let res = await Coins.UseList();
          this.coinList = res.listData;
        } catch (error) {
          console.log(error);
        }
      },
      async orderList() {
        try {
          let res = await Order.List({
            page: this.page,
            limit: this.limit,
            coinId: this.coinId,
            state: this.state,
            type: this.defaultIndex
          });
          let stateMap = new Map();
          for (let item of this.stateData) {
            stateMap.set(item.value, item[this.lang + 'Name']);
          }
          for (let item of res.oneData.list) {
            item.states = stateMap.get(item.state);
          }
          this.tableData = res.oneData.list;
          this.total = res.oneData.total;
        } catch (error) {
          console.log(error);
        }
      },
      async stateList() {
        try {
          let res = await Order.StateList();
          this.stateData = res.listData;
        } catch (error) {
          console.log(error)
        }
      },
      getData() {
        this.getCoinList();
        this.stateList();
        this.orderList()
      }
    },
    created() {
      this.getData();
    }
  };
</script>
<style scoped lang="scss">
  @import '~@/assets/sass/order';
  @import '~@/assets/sass/safe';
  .stateBtn {
    margin: 3px auto;
  }
</style>