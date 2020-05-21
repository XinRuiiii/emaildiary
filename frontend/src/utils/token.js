import RefreshToken from "../graphql/diarysend/RefreshToken.graphql";
import apolloProvider from "../apollo";
import router from "../router";


function getCurrentTime() {
    return ((new Date()).valueOf()) / 1000
}

export async function getToken() {
    if(localStorage.getItem('token')==='null'){
        alert('未登录，请先登录！')
        await router.push({name: 'signIn'})
    }
    let payload = JSON.parse(localStorage.getItem('payload'))
    const refreshExpiresIn = localStorage.getItem('refreshExpiresIn')
    // payload 为空说明用户已经退出登录
    if (payload.exp === '') {
        alert('您尚未登录，请先登录！')
        await this.$router.push({name: 'signIn'})
    } else if (getCurrentTime() < (payload.exp - 30)) {
        // 当前时间戳小于 token 过期时间戳，说明 token 没过期
        console.log('token未过期')
        return true
    } else if (getCurrentTime() < (refreshExpiresIn - 60)) {
        // 当前时间戳大于等于 token 过期时间戳，但小于 refreshToken 时间戳
        // 说明 token 过期，但是 refreshToken 没过期
        console.log('token已过期，updateToken')
        let state
        await updateToken().then(value => {
            state=value
            }
        )
        return state
    } else {
        // refreshToken 和 token 都过期了
        alert('登录信息已过期，请先登录！')
        await router.push({name: 'signIn'})
    }
    return false
}

export async function updateToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    let updateState
    await apolloProvider
        .defaultClient
        .mutate({
            mutation: RefreshToken,
            variables: {
                refreshToken: refreshToken
            }
        })
        .then(result => {
            // 把刷新的 token 等信息重新存储，覆盖旧信息
            console.log('token刷新成功')
            window.localStorage['payload'] = JSON.stringify(result.data.refreshToken.payload)
            window.localStorage['token'] = result.data.refreshToken.token
            window.localStorage['refreshToken'] = result.data.refreshToken.refreshToken
            window.localStorage['refreshTokenExpiresIn'] = result.data.refreshToken.refreshExpiresIn
            updateState = true
        })
        .catch((error) => {
            console.log('token刷新失败')
            console.log(error.message())
            updateState = false
        })
    return updateState
}
