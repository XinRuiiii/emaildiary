<template>
    <div class="dropDown">
        <!--        退出登录-->
        <wired-fab class="btnFab btnFabMarginLeft" @click="logout">
            <font-awesome-icon icon="sign-out-alt"/>
        </wired-fab>
    </div>
</template>

<script>
    import Logout from '../../../graphql/user/Logout.graphql';
    import {getToken} from "../../../utils/token";

    export default {
        name: "Avatar",
        methods: {
            async logout() {
                const refreshToken = localStorage.getItem('refreshToken');
                console.log('退出登录时获取的refreshToken:', refreshToken);
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: Logout,
                        variables: {
                            refreshToken: refreshToken
                        }
                    })
                    .then(() => {
                        localStorage.setItem('payload', null);
                        localStorage.setItem('token', null);
                        localStorage.setItem('refreshToken', null);
                        localStorage.setItem('refreshExpiresIn', null);
                        alert('已退出登录并清空存储信息');
                    })
                    .catch((error) => {
                        alert('退出失败');
                        console.log('退出登录失败原因：', error.message)
                    })
            },
            signIn() {
                this.$router.push('/signIn')
            }
        }
    }
</script>

<style scoped>
</style>
