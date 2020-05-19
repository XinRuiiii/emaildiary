<template>
    <div style="width: 100%; height: 100%">
        <wired-card id="box" elevation="4"></wired-card>
        <wired-card id="background" fill="#6495ED">
        </wired-card>
        <img src="../../assets/images/logo3.png" id="logo">
        <wired-button id="inBtn" v-on:click="sUp=false" elevation="4">
            <div style="width: 200px">
                登录
            </div>
        </wired-button>
        <wired-button id="upBtn" v-on:click="sUp=true" elevation="4">
            <div style="width: 200px">
                注册
            </div>
        </wired-button>
        <div v-if="sUp">
            <sign-up></sign-up>
        </div>
        <div v-else>
            <sign-in></sign-in>
        </div>
        <img src="../../assets/images/boy.png" id="boy">
        <img src="../../assets/images/girl.png" id="girl">
    </div>
</template>

<script>
    import SignIn from "./SignComponents/SignIn";
    import SignUp from "./SignComponents/SignUp";

    export default {
        name: "SignInOrUp",
        data() {
            return {
                sUp: false
            }
        },
        components: {
            'sign-in': SignIn,
            'sign-up': SignUp
        },
        methods: {
            register() {
                console.log(this.email, this.userName, this.psw)
                this.$apollo
                    .mutate({
                        mutation: CreateUser,
                        variables: {
                            email: this.email,
                            name: this.userName,
                            password: this.psw
                        }
                    })
                    .then(result => {
                        if (result.data.createUser.user.isActive) {
                            alert('注册成功')
                        } else {
                            alert('注册失败')
                        }
                    })
                    .catch((error) => {
                        alert(error.message)
                    })
            },
            login() {
                this.$apollo
                    .mutate({
                        mutation: Login,
                        variables: {
                            email: this.emailLogin,
                            password: this.pswLogin
                        },
                    })
                    .then(result => {
                        localStorage.setItem('payload', JSON.stringify(result.data.tokenAuth.payload));
                        localStorage.setItem('token', result.data.tokenAuth.token);
                        localStorage.setItem('refreshToken', result.data.tokenAuth.refreshToken);
                        localStorage.setItem('refreshExpiresIn', result.data.tokenAuth.refreshExpiresIn);
                        console.log('登录获取到的payload:', JSON.stringify(result.data.tokenAuth.payload));
                        console.log('登录获取到的token:', result.data.tokenAuth.token);
                        console.log('登录获取到的refreshToken:', result.data.tokenAuth.refreshToken);
                        console.log('登录获取到的refreshExpiresIn:', result.data.tokenAuth.refreshExpiresIn);
                        alert('登录成功，token & refreshToken 已保存。');
                        this.$router.go(-1);
                    })
                    .catch((error) => {
                        alert('登录失败。');
                        console.log(error.message);
                    });
            },
            del() {
                this.$apollo
                    .mutate({
                        mutation: DeleteUser
                    })
                    .then((result) => {
                        if (result.data.deleteUser.user.isActive) {
                            alert('注销失败')
                        } else {
                            alert('注销成功');
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
    #box {
        position: absolute;
        width: 90.2%;
        height: 92.2%;
        margin-left: 4.99%;
        margin-top: 0.99%;
        z-index: -1;
    }

    #background {
        position: absolute;
        width: 90%;
        height: 92%;
        margin-left: 5%;
        margin-top: 1%;
        z-index: -1;
        opacity: 0.5;
    }

    #inBtn {
        position: absolute;
        margin-left: 28%;
        margin-top: 20%;
    }

    #inBtn:hover {
        background-color: #6495ED;
    }

    #upBtn {
        position: absolute;
        margin-left: 55%;
        margin-top: 20%;
    }

    #upBtn:hover {
        background-color: #6495ED;
    }

    #logo {
        position: absolute;
        width: 50%;
        height: 15%;
        margin-top: 10%;
        margin-left: 25%;

    }

    .inOrUp {
        position: absolute;
    }

    #boy {
        position: absolute;
        margin-left: 6%;
        width: 15%;
        margin-top: 32.5%;
    }

    #girl{
        position: absolute;
        margin-left: 80%;
        width: 15%;
        margin-top: 32%;
    }
</style>
