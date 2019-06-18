<template>
    <div class='datalist_icon'>
        <!-- v-tip="hoverShow" -->
        <span v-tippy='{ interactive : true ,arrow : true, arrowTransform : "scale(0.75)",placement : "right-start"}' :title="hoverShow">
            {{'COLLECT'|t}}
            <i class="el-icon-question" style="font-size:20px;vertical-align:middle;margin-left:5px; color:rgb(222,33,29)"></i>
        </span>
    </div>
</template>
<script>
    export default {
        name: 'datalist_icon',
        data() {
            return {
                hoverShow: `<div class="column-tip-cont" style="text-align:left">
                        <h3>${this.$t('TIPS')}：</h3>
                        <p>${this.$t('ZH_ONE')}
                            <span class="c-fail">${this.$t('COIN_MINE')}：</span>
                            ${this.$t('COIN_MINE_TEXT1')}
                            <span class="c-fail">"${this.$t('COIN_MINE_TEXT2')}"</span>
                            ${this.$t('COIN_MINE_TEXT3')}
                        </p>
                        <p>${this.$t('ZH_TWO')}
                            <span class="c-fail">${this.$t('COIN_HAVE')}：</span>
                            ${this.$t('COIN_HAVE_TEXT1')}
                            <span class="c-success">"${this.$t('COIN_HAVE_TEXT2')}"</span>
                            ${this.$t('COIN_HAVE_TEXT3')}
                        </p>
                        <p>${this.$t('ZH_THREE')}
                            <span class="c-fail">${this.$t('ORDER_STATE')}：</span>
                            ${this.$t('ORDER_STATE_TEXT1')}
                            <span class="c-blue">"${this.$t('ORDER_STATE_TEXT2')}"</span>
                            ${this.$t('ORDER_STATE_TEXT3')}
                        </p>
                    </div>`
            }
        },
        mounted() {

        },
        methods: {

        }
    }
</script>
<style lang='scss' scoped>
</style>