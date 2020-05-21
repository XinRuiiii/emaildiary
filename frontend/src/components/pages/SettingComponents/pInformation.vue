<template>
    <div>
        <wired-card fill="#FFB6C1" elevation="3" class="information">
            <div class="informationTitle">
                <wired-button id="showInfo" v-on:click="showInfo">我的身份牌</wired-button>
            </div>
            <!--昵称、邮箱、性别-->
            <div class="info">
                <!--昵称-->
                <div>
                    <div class="InformationRow">
                        <wired-card elevation="2">昵称</wired-card>
                        <wired-card>{{name}}</wired-card>
                    </div>
                    <wired-divider></wired-divider>
                </div>
                <!--邮箱-->
                <div>
                    <div class="InformationRow">
                        <wired-card elevation="2">邮箱</wired-card>
                        <wired-card>{{email}}</wired-card>
                    </div>
                    <wired-divider></wired-divider>
                </div>
                <!--                邮件提醒-->
                <div>
                    <div class="InformationRow">
                        <wired-card elevation="2">邮件提醒</wired-card>
                        <wired-card>{{remind}}</wired-card>
                    </div>
                    <wired-divider></wired-divider>
                </div>
                <!--                订阅-->
                <div>
                    <div class="InformationRow">
                        <wired-card elevation="2">订阅</wired-card>
                        <wired-card>{{report}}</wired-card>
                    </div>
                    <wired-divider></wired-divider>
                </div>
                <!--                注销用户-->
                <wired-button id="delInfo" v-on:click="sendCode">注销用户</wired-button>
                <div v-if="isDelShow">
                    <!--        验证码输入框-->
                    <wired-input class="input" id="veriCode" :value="veriCode"
                                 @input="veriCode=$event.target.value" placeholder="请输入收到的验证码"/>
                    <wired-button v-on:click="delInfo" id="delBtn">确定注销</wired-button>
                </div>
            </div>
        </wired-card>
    </div>
</template>
<script>
    import {getToken} from "../../../utils/token";
    import ShowUser from "../../../graphql/user/User.graphql";
    import GetCodeWhenDel from "../../../graphql/user/GetCodeWhenDel.graphql";
    import DeleteUser from "../../../graphql/user/DeleteUser.graphql";

    export default {
        name: "pInformation",
        data() {
            return {
                email: '',
                name: '',
                remind: '',
                report: '',
                veriCode: '',
                isDelShow: false
            }
        },
        created() {
            this.showInfo()
        },
        methods: {
            async showInfo() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: ShowUser
                    })
                    .then(result => {
                        this.email = result.data.user.email;
                        this.name = result.data.user.name;
                        if (result.data.user.dailyRemind) {
                            this.remind = "每天提醒";
                        } else if (result.data.user.weeklyRemind) {
                            this.remind = "每周提醒";
                        } else if (result.data.user.monthlyRemind) {
                            this.remind = "每月提醒";
                        } else if (result.data.user.yearlyRemind) {
                            this.remind = "每年提醒";
                        }
                        if (result.data.user.weeklyReport) {
                            this.report = "订阅周报";
                        } else if (result.data.user.monthlyReport) {
                            this.report = "订阅月报";
                        } else if (result.data.user.yearlyReport) {
                            this.report = "订阅年报";
                        }
                    })
                    .catch((error) => {
                        console.log(error.message)
                    })
            },
            async delInfo() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: DeleteUser,
                        variables: {
                            code: this.veriCode
                        }
                    })
                    .then(result => {
                        if (result.data.deleteUser.success) {
                            alert('注销成功')
                            this.isDelShow = false;
                            this.$router.push('/signIn');
                        } else {
                            alert('注销失败')
                        }
                    })
                    .catch((error) => {
                        console.log(error.message)
                    })
            },
            async sendCode() {
                this.isDelShow = true;
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: GetCodeWhenDel
                    })
                    .then(result => {
                        if (result.data.getCodeWhenDelete.success) {
                            alert('已将验证码发送到您的邮箱')
                        } else {
                            alert('发送失败')
                        }
                    })
                    .catch((error) => {
                        console.log(error.message)
                    })
            }
        }
    }
</script>

<style scoped>
    .informationTitle {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    #showInfo {
        font-size: 30px;
        font-weight: bold;
    }

    .InformationRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
