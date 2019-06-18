<template>
    <div class="news-template">
        <div class="news-banner">
            <div class="cont">
                <div class="news-tab">
                    <a href="javascript:;" :class="$route.params.type==item.type?'news-tab-item active':'news-tab-item'" v-for="item in guideList"
                        :key="item.id" @click="headLinkClick(item)">{{item[$l+'Name']}}</a>
                </div>
            </div>
        </div>
        <artListTemp v-if="listData!=null" :list="listData"></artListTemp>
        <artTemp v-else :art="oneData"></artTemp>
        <div class="copy-right">
            {{footerData[$l+'ServerCopyright']}}
        </div>
    </div>
</template>
<script>
    import { Msg } from '@/services'
    import artListTemp from "./guide/artListTemp"
    import artTemp from "./guide/artTemp"
    export default {
        components: { artListTemp, artTemp },
        data() {
            return {
                guideList: [],
                oneData: {},
                listData: [],
                footerData: {}
            };
        },
        computed: {
            activeItem() {
                return this.$route.params.type
            }
        },
        mounted() {
            this.getGuideList();
            this.getInfo();
            this.getFooterData();
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
            // 获取头部链接
            getGuideList() {
                Msg.footerList({}, false).then(res => {
                    this.guideList = res.listData;
                })
            },
            // 获取内容
            getInfo() {
                Msg.getDefMsg({
                    type: this.$route.params.type//INFORMATION_NOTICE公告        INFORMATION_NEWS新闻        INFORMATION_HLEP系统文章;
                }).then((res) => {
                    this.listData = res.listData;
                    this.oneData = res.oneData;
                    if ((!this.$route.params.id) && (this.listData != null && this.listData.length > 0)) {
                        this.$router.replace('/guide/' + this.$route.params.type + '/' + this.listData[0].id);
                    }
                })
            },
            // 头部链接点击
            headLinkClick(item) {
                if (this.$route.params.type != item.type) {
                    this.$router.push('/guide/' + item.type)
                    this.getInfo();
                }
            }
        },
    };
</script>
<style lang="scss" scoped>
    @import './../assets/sass/_default.scss';
    .cont {
        width: $wrapW;
        margin: 0 auto;
    }

    .new-view {
        min-height: 800px;
        width: $wrapW;
        padding-top: 30px;
        margin: 0 auto;
        color: $color_type6;
    }

    .news-template {
        position: relative;
        .news-banner {
            height: 150px;
            width: 100%;
            /* background: #752BF7\0\9; */
            // background-color: #0d2765;
            // background-image: url('~@/assets/img/news-banner.png') ;
            // background-size: cover;
            /* background: #0048e1 -webkit-linear-gradient(right, #0048e1, #005eff); */
            background: url('~@/assets/img/news-banner.png') no-repeat center/cover;
            .cont {
                height: 100%;
                display: flex;
                align-items: flex-end;
                /* background: url('~@/assets/img/news-banner.png') bottom right no-repeat; */
            }
        }
    }

    .news-tab {
        padding: 10px;
        margin-bottom: 20px;
        display: table-cell\0\9;
        vertical-align: bottom;
        height: 130px\0\9;
        .news-tab-item {
            display: inline-block;
            padding: 8px 30px;
            color: white;
            border-radius: 4px;
            margin-right: 15px;
            transition: all ease 1s;
            cursor: pointer;
            background: rgba(0,0,0, 0.3);
            &.active {
                background: #da2723;
                color: white;
            }
            &:hover {
                background: #da2723;
                color: white;
            }
        }
    }

    .copy-right {
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-top: 1px solid rgba(157, 162, 169, 0.3);
        font-size: 12px;
        color: #9DA2A9;
    }
</style>