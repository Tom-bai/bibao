<template>
    <div class="article-detail">
        <h3 class="article-title">{{art[$l+'Title']}}</h3>
        <p class="article-time">{{'TIME'|t}}：{{art.createDate}}</p>
        <article v-html="art[$l+'Content']"></article>
        <!-- <div class="article-sub-button-title">
            <router-link :to="'/guide/' + $route.params.type + '/' + last.id">上一篇：{{last[$l+'Title']}}</router-link>
            <router-link :to="'/guide/' + $route.params.type + '/' + next.id">上一篇：{{next[$l+'Title']}}</router-link>
        </div> -->
    </div>
</template>
<script>
import { Msg } from '@/services'
    export default {
        name:'',
        props:{
            art: null
        },
        data(){
            return {
                
            }
        },
        mounted(){
            
        },
        methods:{
            
        }
    }
</script>
<style lang='scss' scoped>
    @import '~@/assets/sass/news';
</style>