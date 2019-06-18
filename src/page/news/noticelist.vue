<template>
    <div class="new-list">
        <div class="box-flex">
            <router-link tag="div" :to="'/news/detail/'+item.id" class="news-item" v-for='(item,key) of listData' :key="key">
                <h3 class="news-title">
                    <a href="javascript:;">{{item[$l+'Title']}}</a>
                </h3>
                <p class="news-desc">{{item.createDate}}</p>
            </router-link>
        </div>
        <!-- 分页器 -->
        <el-pagination layout="prev, pager, next" :current-page="curpage" :page-size="pageSize" :total="numCount" class="pagination"
             @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>
<script>
import {Msg} from '@/services'

    export default {
        data() {
            return {
                listData:[],
                curpage:1,
                pageSize:10,
                numCount:0,
            };
        },
        mounted(){
            this.getInfoList(1);
        },
        methods: {
            getInfoList(page){
                Msg.getInfoList({
                    type: 'INFORMATION_NOTICE',//INFORMATION_NOTICE公告    INFORMATION_NEWS新闻    INFORMATION_HLEP系统文章;
                    pageSize:this.pageSize,
                    pageNum:page
                }).then((res)=>{
                    this.listData = res.oneData.list;
                    this.numCount = res.oneData.total;
                })
            },

            // currentPage 改变时会触发
            handleCurrentChange(page) {
                this.getInfoList(page);
            },
        }
    };
</script>
<style lang="scss" scoped>
    @import '~@/assets/sass/news';
</style>