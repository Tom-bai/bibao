<template>
    <div class="user">
        <div class="user-banner">
            <div class="user-pic" v-if="loginStatus()">
                <!-- <img src="./../assets/img/c2c-verif-icon.png" alt=""> -->
                <img :src="imgPath+photo" alt="" v-show="photo" id="imgUserSrc">
                <img src="./../assets/img/c2c-verif-icons.png" alt="" v-show="photo==''">
                <input type="file" class="photo-file" accept="image/png, image/jpeg" @change="changeFile($event,'imgUserSrc','imgUser')"
                    id="imgUser">
            </div>
            <div class="user-info" v-if="loginStatus()">
                <!-- {{'ACCOUNT'|t}}： -->
                <div class="nickname-wrap" v-if="!setNickNameBool">
                    <span>{{nickname}}</span>
                    <i class="icon edit-icon" @click='setNickNameBool=true'></i>
                </div>
                <div class="nickname-wrap" v-if="setNickNameBool">
                    <input type="text" maxlength="12" v-model="nickname" @blur="blurFn()" autofocus @keyup.enter="blurFn()" class="nickname-input" ref='nicknameinput'  v-focus>
                </div>
            </div>
            <div class="justfiy clearfix" v-if="loginStatus()">
                <span class="success fl mr-10" style="color:white">{{ $store.state.userStatus.credentialInfoState==1 ? $t('PASSVER'):$t('NOTPASSVER')}}</span>
                <div class="user-signup-time fl">{{'REGTIME'|t}}：{{createDate}}</div>
                <button type="button" class="ghostBtn fr" @click="signOut" :loading="isAble" :disabled="isAble">{{'SIGNOUT'|t}}</button>
            </div>
        </div>
        <div class="user-cont">
            <div class="tab-list">
                <router-link class="tab-item" v-for="(item,key) of tabList" :to="item.router" :key="key" active-class="active">{{item.name}}</router-link>
            </div>
        </div>
        <router-view/>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { Login, User } from "@/services"
    import { Func } from '@/providers';
    export default {
        data() {
            return {
                isAble: false,
                setNickNameBool: false,
                
                // defaultIndex: 1,
                tabList: [
                    {
                        id: 1,
                        name: this.$t('SAFE_LINK'),
                        router: '/user/safe'
                    },
                    {
                        id: 2,
                        name: this.$t('ASSET_LINK'),
                        router: '/user/asset'
                    },
                    {
                        id: 4,
                        name: this.$t('MONENY_HOLDING'),
                        router: '/user/holding'
                    },
                    {
                        id: 3,
                        name: this.$t('INVITE_LINK'),
                        router: '/user/invite'
                    },
                    {
                        id: 5,
                        name: this.$t('OPEN_PLATFORM'),
                        router: '/user/authenticate'
                    }
                ],
                username: Func.getCookie('username'),
                photo: Func.getCookie('photo'),
                nickname: Func.getCookie('nickname'),
                name: Func.getCookie('nickname'),
            };
        },
        computed: {
            createDate() {
                // let s = sessionStorage.getItem('registerTime');
                let s = Func.getCookie('registerTime');
                if (s != null) return s.slice(0, 10);
            },
            ...mapGetters([
                'imgPath'
            ])
        },
        created(){
            
        },
        methods: {
            // 文件上传
            async changeFile($event, type, formInputValue) {
                var input = $event.target;
                var files = $event.target.files[0];
                if (files) {
                    var reader = new FileReader();
                    reader.onload = async () => {
                        var dataURL = reader.result;
                        var output = document.getElementById(type);
                        output['src'] = dataURL;
                    };
                    reader.readAsDataURL(input.files[0]);
                    try {
                        let parmas = new FormData();
                        parmas.append('photo', input.files[0]);
                        let res = await User.SetPhoto(parmas);
                        this.photo = res.data.photo;
                        Func.setCookie('photo', res.data.photo)
                    } catch (error) {
                        console.log(error);
                    }
                }
            },
            async blurFn() {
                let len = this.nickname.length;
                if (this.nickname == Func.getCookie('nickname')) { this.setNickNameBool = false; return false }
                try {
                    let res = await User.SetNickname({
                        nickname: this.nickname
                    });
                    Func.setCookie('nickname', this.nickname);
                    this.setNickNameBool = false;
                } catch (error) {
                    console.log(error)
                }
            },
            signOut() {
                this.isAble = true;
                Login.logout().then(res => {
                    this.isAble = false;
                    this.SUCCESS(this.$t('SIGNOUT_SUCC'));
                    Func.delCookie('registerTime');
                    Func.delCookie('username');
                    this.$store.state.userStatus = {};
                    this.$router.push('/signin');
                }).catch(err => {
                    this.isAble = false;
                })
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import '~@/assets/sass/user';
    .nickname-wrap {
        position: relative;
        height: 35px;
        line-height: 35px;
        z-index: 9999;
        .icon {
            height: 25px;
            width: 25px;
            display: inline-block;
            vertical-align: middle;
            &.edit-icon {
                background: url('~@/assets/img/edit-icon.png') no-repeat center center;
            }
        }
        .nickname-input {
            height: 25px;
            margin-top: 5px;
            border: none;
            padding: 0 5px;
        }
        input {
            z-index: 999;
        }
    }

    .user-pic {
        position: relative;
        overflow: hidden;
        #imgUser {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            opacity: 0;
        }
    }
</style>