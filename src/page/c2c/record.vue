<template>
    <div class="order-list">
        <div class="coin-list">
            <div class="content box-flex space-between asset-record clearfix">
                <div class="flex">
                    <i class="record-icon"></i>
                    <h3>c2c{{'RECORD_OF_STATEMENTS'|t}}</h3>
                </div>
                <div class="input-suffix">
                    <span class="ml-10">{{'TYPE'|t}}：</span>
                    <el-select v-model="type" :placeholder="$t('TYPE')">
                        <el-option :label="$t('ALL')" value=''></el-option>
                        <el-option :label="$t('BUYER_APPLICATION')" value='BUY_TYPE'></el-option>
                        <el-option :label="$t('SELLER_APPLICATION')" value='SELL_TYPE'></el-option>
                        </el-option>
                    </el-select>
                    <span class="ml-10">{{'STATUS'|t}}：</span>
                    <el-select v-model="state" :placeholder="$t('TYPE_PALCE')">
                        <el-option :label="$t('ALL')" value=''></el-option>
                        <el-option v-for="(item,key) in stateList" :key="key" :label="item[lang+'Name']" :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="search-button" @click="searchData()">{{'TAB2_TITLE'|t}}</span>
                </div>
            </div>
        </div>
        <div class="content content-data">
            <el-table :data="tableData" style="width: 100%" @row-click="handleExpansion" ref="tableData">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <div class="grid-content">
                                    <div class="zx-form-label">
                                        <div class="zx-form-title">
                                            <div class="title" style="font-size: 14px;margin-bottom: 5px;color: #48494c;">
                                                <span class="c-blue">*</span>&nbsp;{{'REASON'|t}}
                                            </div>
                                        </div>
                                        <textarea name="textarea" :value="props.row.remark" class="expand-texarea" disabled></textarea>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="grid-content">
                                    <div class="zx-form-label">
                                        <div class="zx-form-title">
                                            <div class="title" style="font-size: 14px;margin-bottom: 5px;color: #48494c;">
                                                <span class="c-blue">*</span>&nbsp;{{'PHOTO'|t}}
                                            </div>
                                        </div>
                                        <el-row :gutter="10">
                                            <el-col :span="8">
                                                <div class="grid-content expand-img-wrap">
                                                    <img :src="imgPath+props.row.photo[0]" alt="">
                                                </div>
                                            </el-col>
                                            <el-col :span="8" v-if="props.row.photo[1]">
                                                <div class="grid-content expand-img-wrap">
                                                    <img :src="imgPath+props.row.photo[1]" alt="">
                                                </div>
                                            </el-col>
                                            <el-col :span="8" v-if="props.row.photo[2]">
                                                <div class="grid-content expand-img-wrap">
                                                    <img :src="imgPath+props.row.photo[2]" alt="">
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row class="mt-20" v-if="props.row.state!='AGREE'">
                            <el-col :span="24">
                                <div class="grid-content">
                                    <div class="zx-form-label">
                                        <div class="zx-form-title">
                                            <div class="title" style="font-size: 14px;margin-bottom: 5px;color: #48494c;">
                                                <span class="c-blue">*</span>&nbsp;{{'DISPUTE_FEEDBACK'|t}}
                                            </div>
                                        </div>
                                        <textarea name="textarea" :value="props.row.reason" class="expand-texarea" disabled></textarea>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('ORDER_NUMBER')" prop="orderNo" width="200"></el-table-column>
                <el-table-column :label="$t('TIME')" prop="createDate"></el-table-column>
                <el-table-column :label="$t('BUYER')" prop="buyNickName"></el-table-column>
                <el-table-column :label="$t('SELLER')" prop="sellNickName"></el-table-column>
                <el-table-column :label="$t('TYPE')">
                    <template slot-scope="props">
                        <span class="c-blue">{{props.row.types}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('STATUS')">
                    <template slot-scope="props">
                        <span :class="props.row.state=='AGREE'?'c-success':props.row.state=='DISAGREE'?'c-red':''">{{props.row.states}}</span>
                        <el-button size='mini' v-if="props.row.state=='AGREE'" class="ml-10" @click="deleteItem(props.row,props.$index,tableData)">{{'DELETE'|t}}</el-button>
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
    import { Order, Coins } from '@/services';
    import { mapGetters } from "vuex";
    import { Func } from '@/providers';
    export default {
        data() {
            return {
                showBool: false,
                defaultIndex: 1,
                type: '',
                state: '',
                page: 1,
                limit: 10,
                total: 0,
                stateList: [],
                lang: Func.getCookie('lang'),
                tableData: [],
                appealForms: {}
            }
        },
        computed: {
            ...mapGetters(['imgPath'])
        },
        methods: {
            handleExpansion(rowData) {
                // 关闭所有
                for (let item of this.tableData) {
                    if (item !== rowData) {
                        item.showBool = false;
                        this.$refs.tableData.toggleRowExpansion(item, item.showBool);
                    }
                }
                rowData.showBool = rowData.showBool ? false : true;
                this.$refs.tableData.toggleRowExpansion(rowData, rowData.showBool);
            },
            // 删除数据
            deleteItem(item, index, tableData) {
                // disputeDelete
                this.$confirm(this.$t('DELETE_TIP'), this.$t('WARMTIPS'), {
                    confirmButtonText: this.$t('DETERMINE'),
                    cancelButtonText: this.$t('CANCEL'),
                    type: 'warning'
                }).then(async () => {
                    try {
                        let res = await Order.DisputeDelete({
                            disputeId: item.id
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
            // 分页切换
            handleCurrentChange(val) {
                this.page = val;
                this.DisputeList();
            },
            // 搜索数据
            searchData() {
                this.page = 1;
                this.DisputeList();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                // this.$refs[formName].validate((valid) => {
                //   if (valid) {
                //     alert('submit!');
                //   } else {
                //     console.log('error submit!!');
                //     return false;
                //   }
                // });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 获取状态列表
            async DisputeStateList() {
                try {
                    let res = await Order.DisputeStateList();
                    this.stateList = res.listData;
                    this.DisputeList();
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取列表数据
            async DisputeList() {
                try {
                    let res = await Order.DisputeList({
                        page: this.page,
                        limit: this.limit,
                        state: this.state,
                        type: this.type
                    });
                    let typeMap = new Map();
                    let stateMap = new Map();
                    typeMap.set('BUY_TYPE', this.$t('BUYER_APPLICATION')).set('SELL_TYPE', this.$t('SELLER_APPLICATION'));
                    for (let item of this.stateList) {
                        stateMap.set(item.value, item[this.lang + 'Name']);
                    }
                    for (let item of res.oneData.list) {
                        item.states = stateMap.get(item.state);
                        item.types = typeMap.get(item.type);
                        item.photo = item.photo.split(',');
                    }
                    this.tableData = res.oneData.list;
                    this.total = res.oneData.total;
                } catch (error) {
                    console.log(error);
                }
            },
            getData() {
                this.DisputeStateList();
            }
        },
        mounted() {
        },
        created() {
            this.getData();
        }
    };
</script>
<style scoped lang="scss">
    /* @import '~@/assets/sass/asset'; */

    @import '~@/assets/sass/order.scss';
    .expand-texarea {
        height: 150px;
        width: 100%;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        padding: 5px;
        vertical-align: top;
        resize: none;
    }

    .expand-texarea:disabled {
        background: white;
    }

    .expand-img-wrap {
        width: 150px;
        height: 150px;
        border: 1px solid #ebeef5;
        img {
            height: 100%;
            width: 100%;
        }
    }
</style>