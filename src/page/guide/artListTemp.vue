<template>
    <div class="help-block">
        <el-row>
            <el-col :span="5">
                <div class="grid-content bg-purple">
                    <div class="slider-nav">
                        <router-link tag="div" :to="'/guide/' + $route.params.type + '/' + item.id" v-for="(item,index) in list" :key="item.a" active-class="active" class="nav-item">
                            <span class="item-id">{{index + 1}}</span>
                            <span class="item-title">{{item[$l+'Title']}}</span>
                        </router-link>
                    </div>
                </div>
            </el-col>
            <el-col :span="18" :offset="1">
                <div class="grid-content help-block-article">
                    <h3>{{art[$l+'Title']}}</h3>
                    <article v-html="art[$l+'Content']"></article>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { Msg } from '@/services'
    export default {
        props:{
            list: Array
        },
        data() {
            return {
                art: {},
                last: {},
                next: {}
            };
        },
        mounted(){// （数据还没请求回来）
            if(this.$route.params.id){
                this.getArtical(this.$route.params.id);
            }
        },
        methods:{
            getArtical(id){
                Msg.getArtical({
                    id: id
                }).then(res=>{
                    this.art = res.oneData.currentInformation;
                    this.last = res.oneData.lastInformation;
                    this.next = res.oneData.nextInformation;
                })
            }
        },
        watch:{
            '$route.params.id': function(n,o){
                if(n && n != o){
                    this.art = {};
                    this.last = {};
                    this.next = {};
                    this.getArtical(n);
                }
            }
        }
    };
</script>
<style scoped lang="scss">
    .help-block {
        width: 1200px;
        margin: 50px auto;
    }

    .slider-nav {
        background: #282828;
        color: white;
        min-width: 240px;
        .nav-item {
            padding-top: 1px;
            min-width: 250px;
            height: 50px;
            line-height: 50px;
            color: white;
            display: flex;
            position: relative;
            transition: all ease 0.5s;
            &:not(:last-of-type) {
                border-bottom: 0.5px solid rgba(255, 255, 255, 0.48);
            }
            &.active {
                background: #DE211D;
                color: white;
                &::after {
                    content: '';
                    position: absolute;
                    right: 15px;
                    top: 20px;
                    height: 8px;
                    width: 8px;
                    transform: rotate(45deg);
                    border-top: 1px solid rgba(255, 255, 255, 1);
                    border-right: 1px solid rgba(255, 255, 255, 1);
                }
            }
            &:hover {
                @extend .active;
            }
            .item-id {
                min-width: 60px;
                text-align: center;
                border-right: 0.5px solid rgba(255, 255, 255, 0.48);
                margin-right: 25px;
                display: inline-block;
            }
            .item-title {
                cursor: pointer;
                font-size: 14px;
            }
        }
    }

    .help-block-article {
        border: 1px solid #DCDCDC;
        padding: 25px;
            
            h3 {
                padding: 15px 0;
                font-size: 18px;
                color: #333333;
            }
            article {
                position: relative;
                min-height: 50vh;
            }
    }
</style>