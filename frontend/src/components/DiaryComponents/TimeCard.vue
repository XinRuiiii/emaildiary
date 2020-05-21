<template>
    <!--    显示时间的卡片-->
    <div class="time">
        <wired-card fill="#f582ae">{{date}}</wired-card>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                date: new Date(),
            };
        },
        created() {
        },
        mounted() {
            let _this = this;
            this.timer = setInterval(function () {
                _this.date = new Date().toLocaleString();
            });
        },
        beforeDestroy: function () {
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        methods: {}
    }

</script>

<style scoped>
    .time {
        font-size: 40px;
    }
</style>
