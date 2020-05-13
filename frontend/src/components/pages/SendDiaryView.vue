<template>
    <div id="diary" :style="{ width: screenWidth  + 'px', height: screenHeight + 'px'}">
        <time-card id="timeCard"></time-card>
        <div id="diaryTextArea">
            <DiaryEditor :diary-text.sync="diaryText"
                         :diary-title.sync="diaryTitle"
                         :editor-width="screenWidth*0.8">
            </DiaryEditor>
        </div>
        <wired-button id="btnSend" @click="sendDiary" elevation="3">发送</wired-button>
    </div>
</template>
<script>
    import SendDiary from '../../graphql/diarysend/CreateDiary.graphql'
    import DiaryEditor from "../DiaryComponents/DiaryEditor"
    import TimeCard from "../DiaryComponents/TimeCard"
    import {getToken} from "../../utils/token"

    export default {
        name: 'SendView',
        components: {TimeCard, DiaryEditor},
        data() {
            return {
                screenWidth: document.documentElement.clientWidth,
                screenHeight: document.documentElement.clientHeight,
                diaryTitle: '',
                diaryText: ''
            }
        },
        created() {
            getToken()
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
            // 发送日记
            async sendDiary() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: SendDiary,
                        variables: {
                            diaryTitle: this.diaryTitle,
                            diaryText: this.diaryText
                        }
                    })
                    .then(result => {
                        if (result.data.createDiary.success) {
                            alert('日记发送成功');
                            this.$router.push({name: 'index'})
                        } else {
                            alert('日记发送失败,请尝试重新发送')
                        }
                    })
                    .catch((error) => {
                        alert('发送日记失败')
                        console.log('发送日记失败：' + error.message)
                    })
            }
        }
    }

</script>


<style scoped>

    #diary {
        /*font-family: naughty-lite-2, serif;*/
        /*margin-left: 10%;*/
    }

    #timeCard {
        margin-left: 10%;
        margin-top: 5%;
    }

    #diaryTextArea {
        margin-left: 10%;
        margin-top: 3%;
    }

    #btnSend {
        margin-left: 10%;
        margin-top: 2%;
    }
</style>
