<template>
    <div class="article-detail">
        <h3 class="article-title">{{art.currentInformation[$l+'Title']}}</h3>
        <p class="article-time">{{'TIME'|t}}：{{art.currentInformation.createDate}}</p>
        <article v-html="art.currentInformation[$l+'Content']"></article>
        <div class="article-sub-button-title">
            <router-link v-if="art.lastInformation!=null" :to="'/news/detail/'+art.lastInformation.id">{{'PRE_ART'|t}}：{{art.lastInformation[$l+'Title']}}</router-link>
            <router-link v-if="art.nextInformation!=null" :to="'/news/detail/'+art.nextInformation.id">{{'NEXT_ART'|t}}：{{art.nextInformation[$l+'Title']}}</router-link>
        </div>
    </div>
</template>

<script>
import {Msg} from '@/services'
    export default {
        name:'newsDetail',
        data(){
            return {
                art:{
                    currentInformation:{},
                    lastInformation:{},
                    nextInformation:{}
                }
            }
        },
        mounted(){
            this.getArtical();
        },
        methods:{
            getArtical(){
                Msg.getArtical({
                    id:this.$route.params.id
                }).then((res)=>{
                    console.log(res.oneData)
                    this.art = res.oneData;
                })
            }
        },
        watch:{
            '$route.params.id':function(n,o){
                if(n){
                    this.getArtical();
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '~@/assets/sass/news';
</style>