<template>
    <div id="showDiary">
        <wired-card class="diaryCard" fill="#fef6e4">
            <!--            日记本统计数据-->
            <div class="diaryStatistics" v-if="isGet&!isEdit">
                <wired-button id="btnNext" @click="getLastDiary" elevation="2">上一篇</wired-button>
                <wired-card fill="#f3d2c1">本月共有{{diaries.length}}篇日记</wired-card>
                <wired-button id="btnNext" @click="getNextDiary" elevation="2">下一篇</wired-button>
            </div>
            <wired-card v-if=isGet>
                <div>
                    <!--                    显示日记-->
                    <div id="staticDiary" v-if=!isEdit>
                        <div class="diaryTitleBox">
                            <wired-card id="diaryTitle" fill="#fef6e4">{{diaries[currentDiaryIndex].title}}</wired-card>
                            <wired-fab class="btnFabRight" @click="deleteDiary">
                                <font-awesome-icon icon="trash-alt"/>
                            </wired-fab>
                            <wired-fab class='btnFabRight' @click="isEdit=true">
                                <font-awesome-icon icon="pencil-alt"/>
                            </wired-fab>
                        </div>
                        <wired-card id="diaryText" v-html="diaries[currentDiaryIndex].content"
                                    fill="#f3d2c1"
                                    :style="{ width: screenWidth * 0.8 + 'px'}" :width="screenWidth">
                        </wired-card>
                        <div class="diaryTime">
                            <label class="diaryReleaseTime">发布：{{diaries[currentDiaryIndex].releaseTime.split('.')[0]}}
                            </label>
                            <label class="diaryUpdateTime">修改：{{diaries[currentDiaryIndex].updateTime.split('.')[0]}}
                            </label>
                        </div>
                    </div>
                    <!--                    编辑日记-->
                    <div id="editDiary" v-if=isEdit>
                        <div>
                            <wired-fab class="btnFabLeft" @click="getDiaries">
                                <font-awesome-icon icon="undo-alt"/>
                            </wired-fab>
                            <wired-fab class="btnFabLeft" @click="updateDiary">
                                <font-awesome-icon icon="save"/>
                            </wired-fab>
                        </div>
                        <div>
                            <DiaryEditor class="diaryEditor"
                                         :diary-text.sync="diaries[currentDiaryIndex].content"
                                         :diary-title.sync="diaries[currentDiaryIndex].title"
                                         :editor-width="screenWidth*0.8">
                            </DiaryEditor>
                        </div>
                    </div>
                </div>
            </wired-card>
            <!--            选择年份和月份-->
            <div class="getDiaryBox">
                <month-select :year.sync="year"
                              :month.sync="month"
                              :select-width="screenWidth*0.6">
                </month-select>
                <wired-button id="btnGet" @click="getDiaries" elevation="3">获取</wired-button>
            </div>
        </wired-card>
    </div>
</template>

<script>
    import DiaryEditor from "../DiaryComponents/DiaryEditor"
    import SpecificDiaries from "../../graphql/diarysend/SpecificDiaries.graphql"
    import DeleteDiary from '../../graphql/diarysend/DeleteDiary.graphql'
    import UpdateDiary from '../../graphql/diarysend/UpdateDiary.graphql'
    import MonthSelect from "../DiaryComponents/MonthSelect"
    import {getToken} from "../../utils/token"
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {faPencilAlt, faTrashAlt, faUndoAlt, faSave} from '@fortawesome/free-solid-svg-icons'

    library.add(faPencilAlt, faTrashAlt, faUndoAlt, faSave)

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
                this.$apollo
                    .mutate({
                        mutation: SpecificDiaries,
                        variables: {
                            releaseYear: this.year,
                            releaseMonth: this.month
                        }
                    })
                    .then(result => {
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
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 5% 0 5%;
    }

    .diaryCard {
        padding: 2% 5% 2% 5%;

    }

    .getDiaryBox {
        display: flex;
        flex-direction: row;
        margin-top: 2%;
        justify-content: space-evenly;
    }

    .diaryStatistics {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
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

    .diaryTime {
        display: flow;
        float: right;
    }

    .diaryReleaseTime {
        font-size: 15px;
    }

    .diaryUpdateTime {
        font-size: 15px;
    }

    .btnFabRight {
        --wired-fab-bg-color: #f582ae;
        margin-left: 3%;
        float: right;
    }

    .btnFabLeft {
        --wired-fab-bg-color: #f582ae;
        margin-left: 3%;
    }

</style>
