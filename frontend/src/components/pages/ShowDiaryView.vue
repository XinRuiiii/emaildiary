<template>
    <div id="showDiary" :style="{ width: screenWidth * 0.8 + 'px', height: screenHeight + 'px'}">
        <div class="getDiaryBox">
            <month-select :year.sync="year"
                          :month.sync="month">
            </month-select>
            <wired-button id="btnGet" @click="getDiaries" elevation="3">获取日记</wired-button>
        </div>
        <wired-card fill="#f3d2c1">本月共有{{diaries.length}}篇日记</wired-card>
        <div v-if="isGet&!isEdit">
            <wired-button id="btnNext" @click="getLastDiary" elevation="4">上一篇</wired-button>
            <wired-button id="btnNext" @click="getNextDiary" elevation="4">下一篇</wired-button>
        </div>
        <div v-if=isGet>
            <wired-card id="diaryReleaseTime">发布时间：{{diaries[currentDiaryIndex].releaseTime.split('.')[0]}}</wired-card>
            <wired-card id="diaryUpdateTime">修改时间：{{diaries[currentDiaryIndex].updateTime.split('.')[0]}}</wired-card>
            <div id="staticDiary" v-if=!isEdit>
                <div>
                    <wired-card id="diaryTitle">标题： {{diaries[currentDiaryIndex].title}}</wired-card>
                    <wired-button id="btnEdit" @click="isEdit=true">编辑日记</wired-button>
                    <wired-card id="diaryText" v-html="diaries[currentDiaryIndex].content"
                                :style="{ width: screenWidth * 0.8 + 'px'}" :width="screenWidth">
                    </wired-card>
                </div>
            </div>
            <div id="editDiary" v-if=isEdit>
                <wired-button @click="getDiaries">取消编辑</wired-button>
                <DiaryEditor :diary-text.sync="diaries[currentDiaryIndex].content"
                             :diary-title.sync="diaries[currentDiaryIndex].title"
                             :editor-width="screenWidth*0.8">
                </DiaryEditor>
                <wired-button id="btnUpdateDiary" @click="updateDiary">更新日记</wired-button>
            </div>
            <wired-button id="btnDeleteDiary" @click="deleteDiary" elevation="3">删除日记</wired-button>
        </div>

    </div>
</template>

<script>
    import DiaryEditor from "../DiaryComponents/DiaryEditor"
    import SpecificDiaries from "../../graphql/diarysend/SpecificDiaries.graphql"
    import DeleteDiary from '../../graphql/diarysend/DeleteDiary.graphql'
    import UpdateDiary from '../../graphql/diarysend/UpdateDiary.graphql'
    import MonthSelect from "../DiaryComponents/MonthSelect"
    import {getToken} from "../../utils/token"

    export default {
        name: "ShowDiaryView",
        components: {MonthSelect, DiaryEditor},
        data() {
            return {
                screenWidth: document.documentElement.clientWidth,
                screenHeight: document.documentElement.clientHeight,
                diaries: [],
                currentDiaryIndex: "",
                isGet: false,
                isEdit: false,
                date: new Date(),
                year: null,
                month: null
            }
        },
        created() {
            this.initTime()
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
            initTime: function () {
                this.year = this.date.getFullYear()
                this.month = this.date.getMonth() + 1
            },
            async getDiaries() {
                this.isEdit = false
                if (!await getToken()) {
                    return
                }
                console.log('token鉴定完毕')
                this.$apollo
                    .mutate({
                        mutation: SpecificDiaries,
                        variables: {
                            releaseYear: this.year,
                            releaseMonth: this.month
                        }
                    })
                    .then(result => {
                        console.log('获取日记成功')
                        this.diaries = result.data.specificDiaries
                        this.currentDiaryIndex = 0
                        if (this.diaries.length !== 0) {
                            this.isGet = true
                        } else {
                            alert("还没有日记，快去记录第一篇日记吧")
                            this.isGet = false
                        }
                    })
                    .catch((error) => {
                        alert('获取日记失败')
                        console.log('获取日记失败：' + error.message);

                    })
            },
            getLastDiary: function () {
                if (this.currentDiaryIndex === 0) {
                    alert("已经是第一篇日记啦")
                } else {
                    this.currentDiaryIndex -= 1
                }
            },
            getNextDiary: function () {
                if (this.currentDiaryIndex < this.diaries.length - 1) {
                    this.currentDiaryIndex += 1
                } else {
                    alert("已经是最后一篇日记啦")
                }
            },
            async updateDiary() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: UpdateDiary,
                        variables: {
                            releaseTime: this.diaries[this.currentDiaryIndex].releaseTime,
                            title: this.diaries[this.currentDiaryIndex].title,
                            content: this.diaries[this.currentDiaryIndex].content
                        }
                    })
                    .then(result => {
                        alert('更新日记成功')
                        console.log('更新日记成功' + result.data)
                        this.getDiaries()
                    })
                    .catch((error) => {
                        alert('更新日记失败');
                        console.log('更新日记失败：' + error.message)
                    })
            },
            async deleteDiary() {
                if (!await getToken()) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: DeleteDiary,
                        variables: {
                            releaseTime: this.diaries[this.currentDiaryIndex].releaseTime
                        }
                    })
                    .then(result => {
                        alert('删除该日记成功')
                        console.log('删除日记成功' + result.data)
                        this.getDiaries()
                    })
                    .catch((error) => {
                        alert('删除日记失败');
                        console.log('删除发送失败：' + error.message)
                    })
            }
        }
    }
</script>

<style scoped>
    #showDiary {
        margin-left: 10%;
    }

    .getDiaryBox {
        display: flex;
        flex-direction: row;
        margin-top: 5%;
    }
</style>
