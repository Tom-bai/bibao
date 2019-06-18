<template>
    <div class='invite'>
        <div>
            <h3>{{'COPY_JOIN'|t}}</h3>
            <div>
                <el-input v-model="inviteLink" readonly></el-input>
            </div>
            <div>
                <el-button type="primary" v-clipboard:copy="inviteLink" v-clipboard:success="onCopy" v-clipboard:error="onError"
                    style="width:100%;">{{'COPY_LINK'|t}}</el-button>
            </div>
        </div>
        <div>
            <div class="header">
                <img src="~@/assets/img/icon-person.png" alt="">
                <span>{{'FRIEND_LIST'|t}}</span>
            </div>
            <el-table :data="friendsData" style="width: 100%" :header-cell-style="headerStyle" :cell-style="cellStyle" height="284px">
                <el-table-column prop="nickname" :label="'USER_ACC'|t"></el-table-column>
                <el-table-column prop="" :label="'ISVER'|t">
                    <template slot-scope="scope">{{isVer(scope.row)}}</template>
                </el-table-column>
                <el-table-column prop="createDate" :label="'REGTIME'|t">
                    <template slot-scope="scope">{{date(scope.row)}}</template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination layout="prev, pager, next" :current-page="curpage1" :page-size="pageSize1" :total="numCount1" class="pagination"
                @current-change="handleCurrentChange1"></el-pagination>
        </div>
        <div>
            <div class="header">
                <img src="~@/assets/img/icon-record.png" alt="">
                <span>{{'FRIENDS_MONEY'|t}}</span>
            </div>
            <el-table :data="moneyData" style="width: 100%" :header-cell-style="headerStyle" :cell-style="cellStyle" height="520px">
                <el-table-column prop="createDate" :label="'TIME'|t"></el-table-column>
                <el-table-column prop="spendingCoinName" :label="'COINTYS'|t"></el-table-column>
                <el-table-column prop="incomeNumber" :label="'CANGET_MONEY'|t">
                    <template slot-scope="scope">{{$C(scope.row.incomeNumber)}}</template>
                </el-table-column>
                <el-table-column prop="spendingNickName" :label="'WHO_GIVE'|t"></el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination layout="prev, pager, next" :current-page="curpage2" :page-size="pageSize2" :total="numCount2" class="pagination"
                @current-change="handleCurrentChange2"></el-pagination>
        </div>
    </div>
</template>
<script>
    import { User } from "@/services";
    export default {
        name: 'invite',
        data() {
            return {
                headerStyle: { 'background': '#F6F7FC', 'text-align': 'center' },
                cellStyle: { 'text-align': 'center' },
                inviteLink: '',
                friendsData: [],
                moneyData: [],
                curpage1: 1,
                pageSize1: 5,
                numCount1: 0,
                curpage2: 1,
                pageSize2: 10,
                numCount2: 0,
            }
        },

        mounted() {
            this.getFriendsList(1);
            this.getCode(1);
            this.getRecord(1);
        },
        methods: {
            date(row) {
                let d = new Date(row.createDate)
                return d.format('yyyy-MM-dd h:m:s');
            },
            isVer(row) {
                if (row.credentialInfoState == 'SUCCESS') return this.$t('PASSVER')
                else return this.$t('NOTPASSVER')
            },
            // currentPage 改变时会触发
            handleCurrentChange1(page) {
                this.getFriendsList(page);
            },
            // currentPage 改变时会触发
            handleCurrentChange2(page) {
                this.getRecord(page);
            },
            onCopy(e) {
                this.SUCCESS(this.$t('COPY_SUCCESS'))
            },
            onError(e) {
                this.WARN('Failed to copy texts')
            },

            // 获取好友
            getFriendsList(page) {
                User.invitationFriends({
                    pageNum: page,
                    pageSize: this.pageSize1
                }).then(res => {
                    this.friendsData = res.oneData.list;
                    this.numCount1 = res.oneData.total;
                })
            },
            // 获取邀请码
            getCode() {
                User.invitation({
                }).then(res => {
                    this.inviteLink = location.host + '/#/signup?code=' + res.oneData;
                })
            },
            // 获取分润
            getRecord(page) {
                User.fenrunRecord({
                    pageNum: page,
                    pageSize: this.pageSize2
                }).then(res => {
                    this.moneyData = res.oneData.list;
                    this.numCount2 = res.oneData.total;
                })
            }
        }
    }
</script>
<style lang='scss' scoped>
    @import "./../../assets/sass/_default";
    .invite {
        width: $wrapW;
        padding-bottom: 70px;
        margin: 0 auto;
        &>div {
            &:nth-of-type(1) {
                width: 500px;
                margin: 116px auto 60px;
                text-align: center;
            }
            .header {
                margin-top: 35px;
                color: #001939;
                font-size: 16px;
                line-height: 58px; // i {
                //     color: $defaultColor;
                //     vertical-align: baseline;
                // }
                img {
                    vertical-align: middle;
                    &+span {
                        vertical-align: middle;
                    }
                }
            }
            &>div {
                margin-top: 19px;
            }
        }
    }
</style>