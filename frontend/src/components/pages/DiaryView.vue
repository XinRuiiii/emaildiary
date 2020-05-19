<template>
    <div id="diary" :style="{ width: screenWidth * 0.8 + 'px', height: screenHeight + 'px'}">
        <div class="diaryBox" v-if="isGet">
            <div id="diaryTime">
                <wired-card id="diaryReleaseTime">发布时间：{{releaseTimeText}}</wired-card>
                <wired-card id="diaryUpdateTime">修改时间：{{updateTimeText}}</wired-card>
            </div>
            <div id="staticDiary" v-if=!isEdit>
                <div>
                    <wired-card id="diaryTitle">标题： {{diary.title}}</wired-card>
                    <wired-button id="btnEdit" @click="isEdit=true">编辑日记</wired-button>
                    <wired-button id="btnDeleteDiary" @click="deleteDiary" elevation="3">删除日记</wired-button>
                    <wired-card id="diaryText" v-html="diary.content"
                                :style="{ width: screenWidth * 0.8 + 'px'}">
                    </wired-card>
                </div>
            </div>
            <div id="editDiary" v-if=isEdit>
                <wired-button @click="isEdit=false">取消编辑</wired-button>
                <DiaryEditor :diary-text.sync="diary.content"
                             :diary-title.sync="diary.title"
                             :editor-width="screenWidth*0.8">
                </DiaryEditor>
                <wired-button id="btnUpdateDiary" @click="updateDiary">更新日记</wired-button>
            </div>
        </div>
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
        margin-left: 10%;
    }

    .diaryBox {
        display: flex;
        flex-direction: column;
    }
</style>
