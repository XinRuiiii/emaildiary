<template>
    <div id="diary" :style="{ width: screenWidth * 0.8 + 'px', height: screenHeight + 'px'}">
        <wired-button id="btnBack">返回主页</wired-button>
        <!--        暂时添加login登录-->
        <wired-button @click="login">登录</wired-button>
        <!--        暂时添加login登录-->
        <div id="diaryTextArea">
            <DiaryEditor :diary-text.sync="diaryText"
                         :diary-title.sync="diaryTitle">
            </DiaryEditor>
        </div>
        <wired-button id="btnSave" @click="saveDraft" elevation="3">保存</wired-button>
        <wired-button id="btnSend" @click="sendDiary" elevation="3">发送</wired-button>
    </div>
</template>
<script>
    import SendDiary from '../../graphql/diarysend/SendDiary.graphql'
    import Login from '../../graphql/diarysend/Login.graphql'
    import DiaryEditor from "../DiaryComponents/DiaryEditor";


    export default {
        name: 'SendView',
        components: {DiaryEditor},
        // 在 `methods` 对象中定义方法
        data() {
            return {
                screenWidth: document.documentElement.clientWidth,
                screenHeight: document.documentElement.clientHeight,
                diaryTitle: '',
                diaryText: '',
                // TODO 开发时暂时使用，后续修改
                email: '1429358374@qq.com',
                password: '111111',
            }
        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.documentElement.clientWidth
                    window.screenHeight = document.documentElement.clientHeight
                    this.screenHeight = document.documentElement.clientHeight
                    this.screenWidth = window.screenWidth
                })()
            }
        },
        methods: {
            //实现简单的登录
            login() {
                this.$apollo
                    .mutate({
                        mutation: Login,
                        variables: {
                            email: this.email,
                            password: this.password
                        },
                    })
                    .then(result => {
                        window.localStorage['token'] = result.data.tokenAuth.token;
                        alert('登录成功，token已保存。');
                    })
                    .catch((error) => {
                        alert('登录失败。');
                        console.log(error.message);
                    });
            }
            ,
            // TODO 保存草稿
            saveDraft: function () {
                alert('功能待完成');
            }
            ,
            // 发送日记
            sendDiary: function () {
                this.$apollo
                    .mutate({
                        mutation: SendDiary,
                        variables: {
                            diaryTitle: this.diaryTitle,
                            diaryText: this.diaryText
                        }
                    })
                    .then(() => {
                        console.log('日记发送成功，跳转到主页');
                        this.$router.push({path: '/'});
                    })
                    .catch((error) => {
                        alert('日记发送失败');
                        console.log('日记发送失败：' + error.message);
                    })
            },
            // 获取日期，天气
            showHeader: function () {
                let date = new Date();
                console.log(date) //Wed Aug 21 2019 10:00:58 GMT+0800 (中国标准时间)
                this.value =
                    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                console.log(this.value) //2019-8-20
            },
            created: function () {
                this.showHeader()
            }
        }
    }

</script>


<style scoped>

    #diary {
        font-family: naughty-lite-2, serif;
        margin-left: 10%;
    }

    #diaryTextArea {
        width: 100%;
        margin-top: calc(5vh);
    }

    #btnSave {
        float: right;
        display: block;
        margin-top: 5%;
    }

    #btnSend {
        float: right;
        display: block;
        margin-top: 5%;
    }
</style>
