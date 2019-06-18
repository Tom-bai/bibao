<template>
    <div class="banner-wrap clearfix">
        <div class="home-banner">
            <!-- <div class="banner-desc"> -->
                <!-- 轮播图 -->
                <el-carousel :interval="5000" arrow="always" indicator-position="none" height="700px">
                    <el-carousel-item v-for="item in carouselData" :key="item.a">
                        <a :href="imgHref(item[$l+'ImgPath'])" target="_blank" v-if="isOtherLink(item[$l+'ImgPath'])"><img :src="imgPath + item[$l+'Img']" alt="" class="home-banner-img"/></a>
                        <router-link :to="imgHref(item[$l+'ImgPath'])" v-else><img :src="imgPath + item[$l+'Img']" alt="" class="home-banner-img"/></router-link>
                    </el-carousel-item>
                </el-carousel>
                <!-- 文案 -->
                <!-- <h2 class="banner-title" v-html="title"></h2>
                <h3 class="sub-title" v-typing="desc" v-html="desc"></h3> -->
                <div class="ad">
                    <a :href="item[$l+'ImgPath']" target="_blank" v-for="item in adData" :key="item.a" class="pic">
                        <img :src="imgPath + item[$l+'Img']" alt="">
                    </a>
                </div>
                <div class="banner-footer">
                    <div>
                        <div class="banner-footer-item">
                            <p>{{$C(daysNum.oneDays)}} {{activeCoin.productCoinCore}}</p>
                            <span>24 {{'HOURS_VOLUME'|t}}</span>
                        </div>
                        <div class="banner-footer-item">
                            <p>{{$C(daysNum.sevenDays)}} {{activeCoin.productCoinCore}}</p>
                            <span>7 {{'DAYS_VOLUME'|t}}</span>
                        </div>
                        <div class="banner-footer-item">
                            <p>{{$C(daysNum.thirtyDays)}} {{activeCoin.productCoinCore}}</p>
                            <span>30 {{'DAYS_VOLUME'|t}}</span>
                        </div>
                    </div>
                </div>
                <!-- <div>
                    <h2 class="banner-title" v-html="title"></h2>
                    <h3 class="sub-title" v-typing="desc" v-html="desc"></h3>

                    <div class="ad">
                        <a :href="item[$l+'ImgPath']" target="_blank" v-for="item in adData" :key="item.a" class="pic">
                            <img :src="imgPath + item[$l+'Img']" alt="">
                        </a>
                    </div>

                    <div class="banner-footer">
                        <div>
                            <div class="banner-footer-item">
                                <p>{{$C(daysNum.oneDays)}} {{activeCoin.productCoinCore}}</p>
                                <span>24 {{'HOURS_VOLUME'|t}}</span>
                            </div>
                            <div class="banner-footer-item">
                                <p>{{$C(daysNum.sevenDays)}} {{activeCoin.productCoinCore}}</p>
                                <span>7 {{'DAYS_VOLUME'|t}}</span>
                            </div>
                            <div class="banner-footer-item">
                                <p>{{$C(daysNum.thirtyDays)}} {{activeCoin.productCoinCore}}</p>
                                <span>30 {{'DAYS_VOLUME'|t}}</span>
                            </div>
                        </div>
                    </div>
                </div> -->
            <!-- </div> -->
        </div>
    </div>
</template>
<script>
    import { Home } from "@/services";
    import { mapGetters,mapState } from "vuex";

    export default {
        name: 'main-banner',
        data() {
            return {
                title:'',
                desc:'',
                carouselData: [],
                adData: []
            };
        },
        computed:{
            ...mapGetters(['imgPath']),
            ...mapState(['daysNum','activeCoin'])
        },
        mounted() {
            this.getBanner();
            this.getAd();
        },
        methods: {
            getBanner(){
                Home.getHomeInfo({
                    type:"LBT"
                }).then(res=>{
                    this.carouselData = res.listData;
                    if(this.carouselData.length > 0){
                        this.title = this.carouselData[0][this.$l+'Title'];
                        this.desc = this.carouselData[0][this.$l+'Desc'];
                    }
                }).catch(err=>{
                     
                })
            },

            getAd(){
                Home.getHomeInfo({
                    type:'XGG'
                }).then(res=>{
                    this.adData = res.listData;
                }).catch(err=>{
                     
                })
            },

            // 过滤href为null的情况
            imgHref(href){
                if(href) return href
                else return ''
            },
            // 判断是否是外链
            isOtherLink(href){
                return /http/.test(href)
            }
        }
    };    
</script>
<style scoped lang="scss">
    @import '../assets/sass/banner.scss';
</style>