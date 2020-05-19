<template>
    <!--存储日记的box-->
    <div class="box">
        <waterfall v-if="isGet" id="diaryWaterFall" :line-gap="230" :watch="diaries">
            <!-- each component is wrapped by a waterfall slot -->
            <waterfall-slot
                    v-for="(item, index) in shows"
                    :width="200"
                    :height="item.height"
                    :order="index"
                    :key="item.id"
            >
                <wired-card class="lateDiaryCard" @click="toDiaryDetail(index)" :fill="item.color">
                    <div class="lateDiary" :style="{height:item.height+'px'}">
                        <wired-card class="diaryTime">{{item.releaseTime}}</wired-card>
                        <div class="diaryText">{{item.text}}</div>
                    </div>
                </wired-card>
            </waterfall-slot>
        </waterfall>
        <wired-button v-if="isGet" @click="getPagingDiaries">加载更多</wired-button>
        <wired-card v-if="!isGet" fill="#FFB6C1">
            快去写第一篇日记吧
        </wired-card>
    </div>
    <!--存储日历的box-->
</template>

<script>
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
    import PagingDiaries from '../../../graphql/diarysend/PagingDiaries.graphql'
    import {getToken} from "../../../utils/token"


    export default {
        name: "DiaryList",
        components: {
            Waterfall,
            WaterfallSlot
        },
        data() {
            return {
                colors: ['#FFB6C1', '#6495ED', '#7FFFAA', '#ba55d3', '#FAFAD2',
                    '#FFA07A', '#A9A9A9', '#B0C4DE', '#c3f0ca', '#ffd803'],
                diaries: [],
                shows: [],
                before: null,
                last: 16,
                hasPreviousPage: true,
                startCursor: null,
                isGet: false
            }
        },
        created() {
            this.getPagingDiaries()
        },
        mounted() {
            document.querySelector('.box').addEventListener('scroll', this.handleScroll, true)
        },
        methods: {
            getShow: function (index) {
                const re1 = new RegExp("<.+?>", "g");
                let diary = this.diaries[index].node.content
                const simpleText = diary.replace(re1, '')
                let state = simpleText.length / 10 + 1
                if (state > 4) {
                    state = 4
                }
                state = Math.ceil(Math.random() * state)
                let result = {height: null}
                if (state === 1) {
                    result.height = 125
                } else {
                    result.height = 75 * state
                }
                result.text = simpleText.substring(0, 10 * state)
                result.color = this.colors[Math.floor(Math.random() * this.colors.length)]
                result.releaseTime = this.diaries[index].node.releaseTime.substring(0, 10)
                return result;
            },
            setShows: function () {
                this.shows = []
                for (let i = 0; i < this.diaries.length; i++) {
                    this.shows = this.shows.concat(this.getShow(i))
                }
            },
            async getPagingDiaries() {
                if (!await getToken()) {
                    return
                }
                if (!this.hasPreviousPage) {
                    return
                }
                this.$apollo
                    .mutate({
                        mutation: PagingDiaries,
                        variables: {
                            before: this.startCursor,
                            last: this.last
                        }
                    })
                    .then(result => {
                        this.diaries = this.diaries.concat(result.data.user.diaries.edges)
                        this.setShows()
                        this.isGet = true
                        this.hasPreviousPage = result.data.user.diaries.pageInfo.hasPreviousPage
                        this.startCursor = result.data.user.diaries.pageInfo.startCursor
                        if (this.diaries.length === 0) {
                            this.isGet = false
                        }
                    })
                    .catch((error) => {
                        this.isGet = false
                        console.log('获取日记失败：' + error.message)
                    })
            },
            toDiaryDetail: function (index) {
                let diary = this.diaries[index].node
                this.$router.push({
                    name: 'diary', params: {
                        releaseTime: diary.releaseTime,
                        updateTime: diary.updateTime,
                        content: diary.content,
                        title: diary.title
                    }
                })
            },
            handleScroll() {
                // TODO 滚动条检测待完成，暂时用按钮替代
                let el = document.querySelector('.box')
                let scrollTop = el.scrollTop
                let scrollHeight = el.scrollHeight
                let clientHeight = el.clientHeight
                // console.log('scrollTop:' + scrollTop)
                // console.log('scrollHeight' + scrollHeight)
                // console.log('clientHeight' + clientHeight)
                // console.log('offectTop' + el.offsetTop)
                if (scrollTop + clientHeight === scrollHeight) {
                    console.log("距顶部" + scrollTop + "可视区高度" + clientHeight + "滚动条总高度" + scrollHeight)
                    alert("距顶部" + scrollTop + "可视区高度" + clientHeight + "滚动条总高度" + scrollHeight)
                    alert('滚动完毕')
                }
            },
        }

    }
</script>

<style scoped>
    .box {
        overflow: scroll;
        overflow-x: hidden;
        height: 100px;
        align-items: center;
    }

    .lateDiaryCard {
        width: 200px;
    }

    .diaryTime {
        position: relative;
        margin-right: 20px;
    }

    ::-webkit-scrollbar {
        width: 1px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        background: rgba(0, 0, 0, 0.2);
    }

    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(255, 0, 0, 0.4);
    }

</style>
