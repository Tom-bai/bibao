<template>
    <div class="public-footer">
        <ul class="box-flex official-partner">
            <li class="official-partner-item" v-for="item in partnerData" :key="item.a">
                <a :href="item[$l+'ImgPath']" target="_blank">
                    <img :src="imgPath + item[$l+'Img']" alt="">
                </a>
            </li>
        </ul>
        <div class="border-b clearfix"></div>
        <div class="footer-middle">
            <div class="footer-logo">
                <img src="~@/assets/img/footer-logo.png" alt="">
            </div>
            <ul class="footer-nav box-flex">
                <router-link tag="li" :to="'/guide/' + item.type" v-for="item in guideList" :key="item.a">{{item[$l+'Name']}}</router-link>
                <li>
                    <a :href="openpath"  target="_blank">{{'OPEN_PLATFORM'|t}}</a>
                </li>
            </ul>
            <div class="contact text-c">
                <div class="box-flex">
                    <span class="tell">{{footerData[$l+'ServerPhone']}}</span>
                    <a href="mailto:hq@inesv.com" class="mail  ml-10">{{footerData[$l+'ServerEmail']}}</a>
                </div>
                <p>{{footerData[$l+'ServerName']}}</p>
            </div>
        </div>
        <div class="border-b clearfix"></div>
        <div class="footer-middle">
            <div class="footer-copyright">
                <!-- Copyright © 2016 - 2018 inesv.com All Rights Reserved.{{'HONG_QANG'|t}} -->
                 {{footerData[$l+'ServerCopyright']}}
            </div>
        </div>
    </div>
</template>
<script>
    import { Home, Msg } from "@/services";
    import { mapGetters } from "vuex";

    export default {
        name: 'public-footer',
        data() {
            return {
                partnerData: [],
                guideList: [],
                footerData:{},
                openpath: process.env.OPEN_APTH
            };
        },
        computed: {
            ...mapGetters(['imgPath'])
        },
        mounted() {
            this.getData();
            this.getFooterData();
            this.getGuideList();
        },
        methods: {
            async getFooterData() {
                try {
                    let res = await Msg.FootInfoMation();
                    this.footerData = res.oneData;
                } catch (error) {
                    console.log(error);
                }
            },
            getData() {
                Home.getHomeInfo({
                    type: 'YQLJ'
                }, false).then(res => {
                    this.partnerData = res.listData;
                }).catch(err => {

                })
            },
            getGuideList() {
                Msg.footerList({}, false).then(res => {
                    this.guideList = res.listData;
                })
            }
        }
    };
</script>
<style scoped lang="scss">
    @import '../assets/sass/footer.scss';
</style>