<template>
    <div id="diary">
        <wired-card class="diaryCard" fill="#fef6e4">
            <div class="diaryBox" v-if="isGet">
                <div id="staticDiary" v-if=!isEdit>
                    <div>
                        <wired-card id="diaryTitle" fill="#fef6e4">{{diary.title}}</wired-card>
                        <wired-fab class='btnFab' @click="isEdit=true">
                            <font-awesome-icon icon="pencil-alt"/>
                        </wired-fab>
                        <wired-fab class="btnFab" @click="deleteDiary">
                            <font-awesome-icon icon="trash-alt"/>
                        </wired-fab>
                        <div class="diaryTime">
                            <label class="diaryReleaseTime">发布：{{diary.releaseTime.split('.')[0]}}
                            </label>
                            <label class="diaryUpdateTime">修改：{{diary.updateTime.split('.')[0]}}
                            </label>
                        </div>
                        <wired-card id="diaryText" v-html="diary.content"
                                    fill="#f3d2c1"
                                    :style="{ width: screenWidth * 0.8 + 'px'}">
                        </wired-card>
                    </div>
                </div>
                <div id="editDiary" v-if=isEdit>
                    <wired-fab class="btnFab" @click="getDiary">
                        <font-awesome-icon icon="undo-alt"/>
                    </wired-fab>
                    <wired-button id="btnUpdateDiary" @click="updateDiary">更新日记</wired-button>
                    <DiaryEditor :diary-text.sync="diary.content"
                                 :diary-title.sync="diary.title"
                                 :editor-width="screenWidth*0.8">
                    </DiaryEditor>

                </div>
            </div>
        </wired-card>
    </div>
</template>

<script>
    import UpdateDiary from "../../graphql/diarysend/UpdateDiary.graphql"
    import DeleteDiary from "../../graphql/diarysend/DeleteDiary.graphql"
    import DiaryEditor from "../DiaryComponents/DiaryEditor"
    import SpecificDiary from "../../graphql/diarysend/SpecificDiary.graphql"
    import {getToken} from "../../utils/token"

    export default {
        name: "DiaryDetailView",
        components: {DiaryEditor},
        data() {
            return {
                screenHeight: document.documentElement.clientHeight,
                screenWidth: document.documentElement.clientWidth,
                diary: {
                    title: this.$route.params.title,
                    content: this.$route.params.content,
                    releaseTime: this.$route.params.releaseTime,
                    updateTime: this.$route.params.updateTime
                },
                releaseTime: this.$route.params.releaseTime,
                isEdit: false,
                isGet: true
            }
        },
        created() {
            getToken()
            this.releaseTime = this.$route.params.releaseTime
            this.getDiary()
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
        computed: {
            releaseTimeText() {
                return this.diary.releaseTime.split('.')[0]
            },
            updateTimeText() {
                return this.diary.updateTime.split('.')[0]
            }
        },
        methods: {
            async getDiary() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: SpecificDiary,
                        variables: {
                            releaseTime: this.diary.releaseTime
                        }
                    })
                    .then(result => {
                        this.diary = result.data.user.diaries.edges[0].node
                        this.isEdit = false
                        console.log(this.diary)
                    })
                    .catch((error) => {
                        alert('获取日记失败')
                        console.log('获取日记失败：' + error.message)
                    })
            },
            updateDiary: function () {
                getToken()
                this.$apollo
                    .mutate({
                        mutation: UpdateDiary,
                        variables: {
                            releaseTime: this.diary.releaseTime,
                            title: this.diary.title,
                            content: this.diary.content
                        }
                    })
                    .then(result => {
                        if (result.data.updateDiary.success) {
                            alert('更新日记成功')
                            this.isEdit = false
                            this.getDiary()
                        } else {
                            alert('更新日记失败,请重新尝试')
                        }
                    })
                    .catch((error) => {
                        if (error.message === "GraphQL error: Signature has expired") {
                            this.updateDiary()
                        } else {
                            alert('更新日记失败')
                            console.log('更新日记失败：' + error.message)
                        }
                    })
            },
            deleteDiary: function () {
                getToken()
                this.$apollo
                    .mutate({
                        mutation: DeleteDiary,
                        variables: {
                            releaseTime: this.diary.releaseTime
                        }
                    })
                    .then(result => {
                        if (result.data.deleteDiary.success) {
                            alert('删除该日记成功')
                            this.$router.push({name: 'index'})
                        }
                    })
                    .catch((error) => {
                        if (error.message === "GraphQL error: Signature has expired") {
                            this.updateDiary()
                        } else {
                            alert('删除日记失败')
                            console.log('删除失败：' + error.message)
                        }
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
        padding: 2% 5% 2% 5%;
    }

    .diaryCard{
        padding:2% 5% 2% 5%;
    }

    .diaryBox {
        display: flex;
        flex-direction: column;
    }

    #staticDiary {
        align-content: center;
    }

    #diaryTitle {
        font-weight: bold;
        font-size: 30px;
    }

    #diaryText {
        font-size: 20px;
    }

    .diaryReleaseTime {
        font-size: 15px;
    }

    .diaryUpdateTime {
        font-size: 15px;
    }

    #btnUpdateDiary {
        margin-left: 5%;
    }

    .btnFab {
        --wired-fab-bg-color: #f582ae;
        margin-left: 3%;
    }

    .diaryBox {
        /*padding: 5% 5% 5% 5%;*/
    }
</style>
