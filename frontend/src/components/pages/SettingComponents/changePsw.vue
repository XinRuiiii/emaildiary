<template>
    <div>
        <!--        <wired-card fill="#8bd3dd" id="alterInfoCard">-->
        <div class="inputBox">
            <!--        密码输入框-->
            <div class="editRow">
                <label class="text" id="password">密码：</label>
                <wired-input class="input" type="password" id="pswInput" :value="psw" @input="psw=$event.target.value"
                             placeholder="请输入新的密码"/>
            </div>
            <!--        验证密码是否正确，不正确显示提示文本-->
            <div v-if="pswNotValid()">
                <h6 id="passwordAttention">
                    * 8到30位，数字、大写字母、小写字母、半角字符四选三
                </h6>
            </div>
        </div>
        <div class="inputBox">
            <!--        确认密码输入框-->
            <div class="editRow">
                <label class="text" id="passwordConfirm">确认密码：</label>
                <wired-input class="input" type="password" id="pswConfirmInput" :value="pswConfirm"
                             @input="pswConfirm=$event.target.value" placeholder="请再次输入密码"/>
            </div>
            <!--        验证两次密码是否一致，不一致显示提示文本-->
            <div v-if="pswNotSame()">
                <h6 id="pswSameAttention">
                    * 两次密码不一致
                </h6>
            </div>
        </div>
        <div class="inputBox editRow">
            <label class="text" id="verificationCode">验证码：</label>
            <!--        验证码输入框-->
            <wired-input class="input" id="veriCode" :value="veriCode"
                         @input="veriCode=$event.target.value" placeholder="请输入收到的验证码"/>
        </div>
        <wired-button id="sendCode" v-on:click="sendCode" elevation="2">发送验证码</wired-button>
        <!--        </wired-card>-->
    </div>
</template>

<script>
    import {getToken} from "../../../utils/token";
    import GetCodeWhenUpdatePsw from "../../../graphql/user/GetCodeWhenUpdatePsw.graphql"

    export default {
        name: "changeName",
        data() {
            return {
                psw: '',
                pswConfirm: '',
                veriCode: '',
            }
        },
        methods: {
            pswNotValid() {
                const pswPat = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,30}$/
                return !pswPat.test(this.psw);
            },
            pswNotSame() {
                return this.psw !== this.pswConfirm;
            },
            async sendCode() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: GetCodeWhenUpdatePsw
                    })
                    .then(result => {
                        if (result.data.getCodeWhenUpdatePassword.success) {
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
    .text {
        font-size: 30px;
        display: block;
    }

    .inputBox {
        justify-content: space-between;
    }

    .input {
        width: 50%;
    }

    #sendCode:hover {
        background-color: #ffcc99;
    }

    #passwordAttention {
        color: red;
        z-index: 9;
    }

    #pswSameAttention {
        color: red;
        z-index: 9;
    }

    .editRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
