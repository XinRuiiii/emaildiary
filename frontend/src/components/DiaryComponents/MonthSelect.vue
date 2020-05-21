<template>
    <div id="dateSelect" :style="{width: selectWidth}">
        <!--        选择年份-->
        <div id="yearSelectBox">
            <wired-button @click="getLastYear">
                <font-awesome-icon icon="caret-left"/>
            </wired-button>
            <wired-card>{{selectYear}}</wired-card>
            <wired-button @click="getNextYear">
                <font-awesome-icon icon="caret-right"/>
            </wired-button>
        </div>
        <!--        选择月份-->
        <div id="monthSelectBox">
            <wired-button @click="getLastMonth">
                <font-awesome-icon icon="caret-left"/>
            </wired-button>
            <wired-card>{{selectMonth}}</wired-card>
            <wired-button @click="getNextMonth">
                <font-awesome-icon icon="caret-right"/>
            </wired-button>
        </div>
    </div>
</template>

<script>
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {faCaretLeft, faCaretRight} from '@fortawesome/free-solid-svg-icons'


    library.add(faCaretLeft, faCaretRight)
    export default {
        name: "MonthSelect",
        props: [
            'year',
            'month',
            'selectWidth'
        ],
        data() {
            return {
                years: [2020, 2019, 2018],
                months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                selectYear: this.year,
                selectMonth: this.month,
                currentYear: null,
                currentMonth: null
            }
        },
        created() {
            this.initDate()
        },
        methods: {
            initDate: function () {
                let date = new Date()
                this.currentYear = date.getFullYear()
                this.currentMonth = date.getMonth() + 1
            },
            getLastYear: function () {
                if (this.selectYear > 2000) {
                    this.selectYear--
                    this.$emit('update:year', this.selectYear)
                } else {
                    alert('已经是' + this.selectYear + '年啦,没有更早了')
                }
            },
            getNextYear: function () {
                if (this.selectYear < this.currentYear) {
                    this.selectYear++
                    this.$emit('update:year', this.selectYear)
                } else {
                    alert('已经是' + this.selectYear + '年啦')
                }
            },
            getLastMonth: function () {
                if (this.selectMonth > 1) {
                    this.selectMonth--
                    this.$emit('update:month', this.selectMonth)
                }
            },
            getNextMonth: function () {
                if (this.selectMonth < 12 & (this.selectYear < this.currentYear | this.selectMonth < this.currentMonth)) {
                    this.selectMonth++
                    this.$emit('update:month', this.selectMonth)
                }
            },
        },
    }
</script>

<style scoped>
    #dateSelect {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        width: 500px;
    }
</style>
