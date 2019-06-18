<template>
    <div class="news-template">
        <div class="news-banner">
            <div class="cont">
                <div class="news-tab">
                    <router-link to="/news/notice" class="news-tab-item" active-class="active">{{'BULLETIN'|t}}</router-link>
                    <router-link to="/news" class="news-tab-item" active-class="active">{{'NEWS'|t}}</router-link>
                </div>
            </div>
        </div>
        <div class="new-view">
            <router-view/>
        </div>
        <div class="copy-right">
            {{footerData[$l+'ServerCopyright']}}
        </div>
    </div>
</template>
<script>
    import { Msg } from '@/services'
    export default {
        data() {
            return {
                footerData: {}
            };
        },
        mounted() {
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
            }
        }
    };
</script>
<style lang="scss" scoped>
    .cont {
        width: 1200px;
        margin: 0 auto;
    }

    .new-view {
        min-height: 800px;
    }

    .news-template {
        position: relative;
        .news-banner {
            height: 150px;
            width: 100%;
            background: #DE211D url('~@/assets/img/news-banner.png') bottom right no-repeat;
            /* background: #0048e1 -webkit-linear-gradient(right, #0048e1, #005eff); */
            .cont {
                height: 100%;
                display: flex;
                align-items: flex-end;
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
            padding: 8px 30px;
            color: white;
            border-radius: 4px;
            margin-right: 15px;
            transition: all ease 1s;
            background: rgba(0,0,0,.3);
            &.router-link-exact-active {
                background: #DE211D;
                color: white;
            }
            /* &.active {
                background: #752BF7;
                color: white;
            } */
            &:hover {
                background: #DE211D;
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