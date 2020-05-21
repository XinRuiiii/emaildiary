<template>
    <div id="diary">
        <wired-card class="frame" elevation="4" fill="#fef6e4">
            <div class="page">
                <!--                时间卡片-->
                <div class="editorHeader">
                    <time-card id="timeCard"></time-card>
                    <wired-fab class="btnFabSend" @click="sendDiary">
                        <font-awesome-icon icon="save"/>
                    </wired-fab>
                </div>
                <!--                编辑日记-->
                <div id="diaryTextArea">
                    <DiaryEditor :diary-text.sync="diaryText"
                                 :diary-title.sync="diaryTitle"
                                 :editor-width="screenWidth*0.8"
                                 :editor-height="screenHeight*0.5">
                    </DiaryEditor>
                </div>

            </div>
        </wired-card>
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
                    window.screenWidth = document.body.clientWidth
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
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .frame {
        z-index: 0;
        padding: 3% 5% 3% 5%;
    }

    .editorHeader {
        display: flex;
        flex-direction: row;
        align-items: baseline;
    }

    #diaryTextArea {
        margin-top: 2%;
        align-items: center;
    }

    .btnFabSend {
        --wired-fab-bg-color: #f582ae;
        margin-left: 8%;
        margin-top: 2%;
    }

    #dialog {
        --wired-dialog-z-index: 999
    }
</style>
