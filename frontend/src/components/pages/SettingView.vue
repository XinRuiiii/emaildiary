<template>
    <div class="setting">
        <wired-card class="settingCard" fill="#fef6e4">
            <div class="settingBox" :style="{width:screenWidth*0.6+'px'}">
                <!--                身份牌-->
                <wired-card fill="#FFB6C1">
                    <div class="pInformation" :style="{width:screenWidth*0.5+'px'}">
                        <setting-pInfo></setting-pInfo>
                    </div>
                </wired-card>
                <!--                修改-->
                <wired-card fill="#f3d2c1">
                    <!--            订阅修改-->
                    <wired-card>
                        <emailAlert></emailAlert>
                        <subscribe ref="reportSubscribe"></subscribe>
                        <wired-button class="saveBtn">
                            <div style="width: 100px" @click="saveSubscribe">
                                保存
                            </div>
                        </wired-button>
                    </wired-card>
                    <!--           昵称修改-->
                    <wired-card class="alterInfoCard">
                        <div class="nameBox">
                            <div class="editRow">
                                <label class="text" id="name">昵称：</label>
                                <!--        昵称输入框-->
                                <wired-input class="input" id="userNameInput" :value="userName"
                                             @input="userName=$event.target.value"
                                             placeholder="请输入新的昵称"/>
                            </div>
                            <wired-button elevation="2" class="saveBtn" id="saveNameBtn" v-on:click="saveName">
                                <div style="width: 100px">
                                    保存
                                </div>
                            </wired-button>
                        </div>
                    </wired-card>
                    <!--           密码修改-->
                    <wired-card class="alterInfoCard">
                        <div :style="{width:screenWidth*0.5+'px'}">
                            <change-psw ref="headerChild"></change-psw>
                            <wired-button elevation="2" id="savePswBtn" v-on:click="savePsw">
                                <div style="width: 100px">
                                    保存
                                </div>
                            </wired-button>
                        </div>
                    </wired-card>
                </wired-card>
            </div>
        </wired-card>
    </div>
</template>

<script>
    import pInformation from "./SettingComponents/pInformation";
    import EmailAlert from "./SettingComponents/EmailAlert";
    import Subscribe from "./SettingComponents/Subscribe";
    import changePsw from "./SettingComponents/changePsw";
    import UpdateUser from "../../graphql/user/UpdateUser.graphql"
    import UpdatePsw from "../../graphql/user/UpdatePsw.graphql"
    import {getToken} from '../../utils/token'


    export default {
        name: "SettingView",
        components: {
            'setting-pInfo': pInformation,
            'emailAlert': EmailAlert,
            'subscribe': Subscribe,
            'change-psw': changePsw,
        },
        data() {
            return {
                screenWidth: document.documentElement.clientWidth,
                screenHeight: document.documentElement.clientHeight,
                userName: ''
            }
        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth
                    window.screenHeight = document.documentElement.clientHeight
                    this.screenHeight = document.documentElement.clientHeight
                    this.screenWidth = window.screenWidth
                })()
            }
        },
        methods: {
            async saveName() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: UpdateUser,
                        variables: {
                            name: this.userName
                        }
                    })
                    .then((result => {
                        if (result.data.updateUser.success) {
                            alert('昵称修改成功')
                            this.isNameShow = false;
                        } else {
                            alert('昵称修改失败')
                        }
                    }))
                    .catch((error) => {
                        console.log(error.message)
                    })
            },
            async savePsw() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: UpdatePsw,
                        variables: {
                            password: this.$refs.headerChild.pswConfirm,
                            code: this.$refs.headerChild.veriCode
                        }
                    })
                    .then(result => {
                        if (result.data.updatePassword.success) {
                            alert('密码修改成功')
                            this.isPswShow = false
                        } else {
                            alert('修改失败')
                        }
                    })
                    .catch((error) => {
                        console.log(error.message)
                        return false
                    })
                this.isPswShow = false;
            },
            async saveSubscribe(){
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: UpdateUser,
                        variables: {
                            name: this.userName
                        }
                    })
                    .then((result => {
                        if (result.data.updateUser.success) {
                            alert('订阅成功')
                            this.isNameShow = false;
                        } else {
                            alert('订阅失败')
                        }
                    }))
                    .catch((error) => {
                        console.log(error.message)
                    })
            }
        }
    }
</script>

<style scoped>
    .setting {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .settingCard {
        padding: 3% 10% 3% 10%;
    }

    .settingBox {
        display: flex;
        flex-direction: column;
        align-items: center;

    }

    .pInformation {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .editRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .input {
        width: 50%;
    }

    .text {
        font-size: 30px;
        display: block;
    }

    .alterInfoCard {
        display: block;
        margin-top: 3%;
    }

    .saveBtn {
        display: block;
    }

    #saveNameBtn:hover {
        background-color: aquamarine;
    }

    #savePswBtn:hover {
        background-color: aquamarine;
    }

</style>
