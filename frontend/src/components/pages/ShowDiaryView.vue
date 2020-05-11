<template>
    <div id="showDiary" :style="{ width: screenWidth * 0.8 + 'px', height: screenHeight + 'px'}">
        <wired-button id="btnGet" @click="getDiaries" elevation="3">获取日记</wired-button>
        <wired-button id="btnNext" @click="getLastDiary" elevation="4">上一篇</wired-button>
        <wired-button id="btnNext" @click="getNextDiary" elevation="4">下一篇</wired-button>
        <div v-if=isGet>
            <wired-card id="diaryReleaseTime">发布时间：{{currentDiary.releaseTime}}</wired-card>
            <wired-card id="diaryUpdateTime">修改时间：{{currentDiary.updateTime}}</wired-card>
            <div id="staticDiary" v-if=!isEdit>
                <wired-card id="diaryTitle">标题： {{currentDiary.title}}</wired-card>
                <wired-button id="btnEdit" @click="isEdit=true">编辑日记</wired-button>
                <wired-card id="diaryText" v-html="currentDiary.content"
                            :style="{ width: screenWidth * 0.8 + 'px'}">
                </wired-card>
            </div>
            <div v-if=isEdit>
                <wired-button @click="getDiaries">取消编辑</wired-button>
                <DiaryEditor :diary-text.sync="currentDiary.content"
                             :diary-title.sync="currentDiary.title">
                </DiaryEditor>
                <wired-button id="btnUpdateDiary" @click="updateDiary">更新日记</wired-button>
            </div>
        </div>
        <wired-button id="btnDeleteDiary" @click="deleteDiary" elevation="3">删除日记</wired-button>
    </div>
</template>

<script>
    import DiaryEditor from "../DiaryComponents/DiaryEditor";
    import GetDiaries from '../../graphql/diarysend/GetDiaries.graphql'
    import DeleteDiary from '../../graphql/diarysend/DeleteDiary.graphql'
    import UpdateDiary from '../../graphql/diarysend/UpdateDiary.graphql'

    export default {
        name: "ShowDiaryView",
        components: {DiaryEditor},
        data() {
            return {
                screenWidth: document.documentElement.clientWidth,
                screenHeight: document.documentElement.clientHeight,
                diaries: [],
                currentDiary: "",
                currentDiaryIndex: "",
                isGet: false,
                isEdit: false
            }
        },
        created() {
            this.getDiaries()
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
            getDiaries: function () {
                this.isEdit = false
                this.$apollo
                    .mutate({
                        mutation: GetDiaries,
                        variables: {}
                    })
                    .then(result => {
                        console.log('获取日记成功')
                        this.diaries = result.data.user.diaries
                        if (this.diaries.length !== 0) {
                            this.isGet = true
                            this.currentDiaryIndex = 0
                            this.showDiary()
                        } else {
                            alert("还没有日记，快去记录第一篇日记吧")
                        }
                    })
                    .catch((error) => {
                        alert('获取日记失败');
                        console.log('获取日记失败：' + error.message);
                    })
            },
            showDiary: function () {
                this.currentDiary = this.diaries[this.currentDiaryIndex]
            },
            getLastDiary: function () {
                if (this.currentDiaryIndex === 0) {
                    alert("已经是第一篇日记啦")
                } else {
                    this.currentDiaryIndex -= 1
                    this.showDiary()
                }
            },
            getNextDiary: function () {
                if (this.currentDiaryIndex < this.diaries.length - 1) {
                    this.currentDiaryIndex += 1
                    this.showDiary()
                } else {
                    alert("已经是最后一篇日记啦")
                }
            },
            updateDiary: function () {
                this.$apollo
                    .mutate({
                        mutation: UpdateDiary,
                        variables: {
                            releaseTime: this.currentDiary.releaseTime,
                            title: this.currentDiary.title,
                            content: this.currentDiary.content
                        }
                    })
                    .then(result => {
                        alert('更新日记成功')
                        console.log('更新日记成功' + result.data)
                        this.getDiaries()
                    })
                    .catch((error) => {
                        alert('更新日记失败');
                        console.log('更新日记失败：' + error.message);
                    })
            },
            deleteDiary: function () {
                this.$apollo
                    .mutate({
                        mutation: DeleteDiary,
                        variables: {
                            releaseTime: this.currentDiary.releaseTime
                        }
                    })
                    .then(result => {
                        alert('删除该日记成功')
                        console.log('删除日记成功' + result.data)
                        this.getDiaries()
                    })
                    .catch((error) => {
                        alert('删除日记失败');
                        console.log('删除发送失败：' + error.message);
                    })
            }
        }
    }
</script>

<style scoped>
    #showDiary {
        margin-left: 10%;
    }
</style>
