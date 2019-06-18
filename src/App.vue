<template>
    <div id="app">
        <public-header v-if="!$route.meta.hidenav"></public-header>
        <router-view/>
        <public-footer v-show="!$route.meta.hidefooter"></public-footer>
    </div>
</template>

<script>
    import PublicHeader from '@/components/header';
    import PublicFooter from '@/components/footer';
    import { User, Coins, Login } from '@/services';
    export default {
        name: 'App',
        components: {
            PublicHeader,
            PublicFooter
        },
        // beforeRouteEnter (to, from, next) {
        //     next(vm => {
        //     })
        // }
    };
</script>

<style scoped lang="scss">
    @import "./assets/sass/_default";
    #app {
        height: 100%;
        width: 100%;
        min-width: $homeW;
        /* min-width: $wrapW; */
        overflow-x: hidden;
        overflow-y: scroll;
    }
</style>