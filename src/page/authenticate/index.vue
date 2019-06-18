<template>
    <div class="cont">
        <user-mask height="500px" width="100%" class="email-template content" :value='showBool'>
            <div>
                <div class="cont-box" v-if="step=='false'">
                    <img src="~@/assets/img/authenticate.png" alt="" class="">
                    <el-button type="primary" @click="AuthenticateAdd" :loading="isAble" :disabled="isAble" class="flex-btn">{{'I_WANT_TO_APPLY'|t}}</el-button>
                </div>
                <div v-else class="cont-table">
                    <div class="grid-content bg-purple">
                        <el-table :data="tableData" style="width: 100%" :header-row-class-name="bingHeaderStyle" class="mt-10">
                            <el-table-column prop="id" label="APPID" sortable></el-table-column>
                            <el-table-column prop="createDate" :label="$t('TIME')" sortable></el-table-column>
                            <!-- <el-table-column label="状态">
                                <template slot-scope="scope">
                                    {{$C(scope.row.rebateSumNumber)}}
                                </template>
                            </el-table-column> -->
                            <el-table-column label="APPKey">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="AuthenticateTheKey">{{'VIEW_KEY'|t}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </user-mask>
        <user-mask width="400px" height='200px' :value="showMask" position hide-close-btn>
            <div class="mask-box">
                <h2>APPKey</h2>
                <div class="appkey-box">
                    {{openKey}}
                </div>
                <div class="btn-groups">
                    <a href="javascript:;" class="copy" v-clipboard:copy="openKey" v-clipboard:success="onCopy" v-clipboard:error="onError">{{'COPY'|t}}</a>
                    <a href="javascript:;" class="require" @click="showMask=false">{{'COMFIRM'|t}}</a>
                </div>
            </div>
        </user-mask>
    </div>
</template>
<script>
    import userMask from '@/components/mask';
    import { User } from "@/services"
    export default {
        data() {
            return {
                tableData: [],
                showBool: true,
                showMask: false,
                step: 'false',
                openKey: '',
                isAble: false
            }
        },
        components: { userMask },
        methods: {
            onCopy(e) {
                this.showMask = false;
                this.SUCCESS(this.$t('COPY_SUCCESS'))
            },
            onError(e) {
                this.showMask = false;
                this.WARN('Failed to copy texts')
            },
            async AuthenticateAdd() {
                this.isAble = true;
                try {
                    let res = await User.AuthenticateAdd();
                    this.step = 'true';
                    this.AuthenticateGetOpen();
                } catch (error) {
                    console.log(error);
                }
                this.isAble = false;
            },
            async AuthenticateGetOpen() {
                try {
                    let res = await User.AuthenticateGetOpen();
                    this.tableData = res.listData;
                } catch (error) {
                    console.log(error);
                }
            },
            async AuthenticateTheKey() {
                try {
                    let res = await User.AuthenticateTheKey();
                    this.openKey = res.oneData;
                    this.showMask = true;
                } catch (error) {
                    console.log(error);
                }
            },
            async getData() {
                try {
                    let res = await User.AuthenticateCheckOpen();
                    this.step = res.data.check;
                    if (this.step == 'true') {
                        this.AuthenticateGetOpen();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        computed: {
            bingHeaderStyle() {
                return 'bindHeaderClassName';
            }
        },
        created() {
            this.getData();
        }
    }
</script>
<style lang="scss" scoped>
    .cont {
        width: 1200px;
        margin: auto;
    }

    .cont-table {
        width: 1100px;
        margin: 0 auto;
    }

    .mask-box {
        h2 {
            font-size: 18px;
            text-align: center;
            color: #333333;
        }
        .appkey-box {
            margin-top: 10px;
            padding: 10px;
            border-radius: 4px;
            background: rgba(244, 248, 254, 1);
            border: 1px dashed #0093F9;
        }
        .btn-groups {
            margin-top: 20px;
            text-align: right;
            a {
                padding: 8px 20px;
                font-size: 14px;
                border-radius: 4px;
                &.copy {
                    background: #EBF2FF;
                    color: #005EFF;
                    margin-right: 10px;
                }
                &.require {
                    color: white;
                    background: #005EFF;
                }
            }
        }
    }

    .cont-box {
        width: 306px;
        margin: 0 auto;
        text-align: center;
        img {
            margin: 40px 0;
            width: 80%;
        }
    }
</style>