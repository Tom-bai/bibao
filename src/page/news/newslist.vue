<template>
    <div class="notice-list">
        <!-- <div class="box-flex"> -->
            <router-link tag="div" :to="'/news/detail/'+item.id" class="notice-item flex" v-for='item in listData' :key="item.a">
                <p class="notice-time fr">{{item.createDate}}</p>
                <h3 class="notice-title"> {{item[$l+'Title']}} </h3>
                <p class="notice-desc">{{summary(item[$l+'Content'])}}</p>
            </router-link>
            <!-- 分页器 -->
            <el-pagination layout="prev, pager, next" :current-page="curpage" :page-size="pageSize" :total="numCount" class="pagination"
                @current-change="handleCurrentChange"></el-pagination>
        <!-- </div> -->
    </div>
</template>
<script>
import { Msg } from "@/services";

export default {
    data() {
        return {
            listData: [],
            curpage: 1,
            pageSize: 5,
            numCount: 0
        };
    },
    mounted() {
        this.getInfoList(1);
    },
    methods: {
        getInfoList(page) {
            Msg.getInfoList({
                type: 'INFORMATION_NEWS', //INFORMATION_NOTICE公告    INFORMATION_NEWS新闻    INFORMATION_HLEP系统文章;
                pageSize: this.pageSize,
                pageNum: page
            }).then(res => {
                this.listData = res.oneData.list;
                this.numCount = res.oneData.total;
            });
        },

        // currentPage 改变时会触发
        handleCurrentChange(page) {
            this.getInfoList(page);
        },

        // 后端没有简介字段，需要前端截取部分文字
        summary(content){
            let pattern=/<[^>]+>/gi;
            // let pattern=/<\s*\/?\s*[a-zA-z_]([^>]*?["][^"]*["])*[^>"]*>/g;
            if(content){
                content = content.replace(pattern,'');
                return content
                // if(content.length > 150){
                //     content = content.slice(0,150);
                // }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/sass/news";
</style>