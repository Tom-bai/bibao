<template>
    <div class="main">
        <main-banner></main-banner>
        <data-list></data-list>
        <div class="box-flex main-desc">
            <div class="flex main-item boxShadow">
                <img src="~@/assets/img/main-quicker.png" alt="">
                <h3>{{'MAIN_TITLE1'|t}}</h3>
                <p>{{'MAIN_TEXT1' |t}}</p>
            </div>
            <div class="flex main-item boxShadow">
                <img src="~@/assets/img/main-major.png" alt="">
                <h3>{{'MAIN_TITLE2'|t}}</h3>
                <p>{{'MAIN_TEXT2' |t}}</p>
            </div>
            <div class="flex main-item boxShadow">
                <img src="~@/assets/img/main-safe.png" alt="">
                <h3>{{'MAIN_TITLE3'|t}}</h3>
                <p>{{'MAIN_TEXT3' |t}}</p>
            </div>
            <div class="flex main-item boxShadow">
                <img src="~@/assets/img/main-experience.png" alt="">
                <h3>{{'MAIN_TITLE4'|t}}</h3>
                <p>{{'MAIN_TEXT4' |t}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    import mainBanner from '@/components/banner.vue';
    import dataList from '@/components/main-datalist.vue';
    export default {
        data() {
            return {

            };
        },
        components: { mainBanner, dataList },
    };
</script>
<style scoped lang="scss">
    @import '~@/assets/sass/main.scss';
</style>