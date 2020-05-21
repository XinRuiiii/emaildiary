<template>
    <wired-card elevation="3" class="alert">
        <div align="center">
            <h3>订阅</h3>
        </div>
        <wired-listbox horizontal selection="weeklyReport" class="listBox" style="--wired-item-selected-bg: grey;">
            <wired-item value="weeklyReport">订阅周报</wired-item>
            <wired-item value="monthlyReport">订阅月报</wired-item>
            <wired-item value="yearlyReport">订阅年报</wired-item>
        </wired-listbox>
    </wired-card>
</template>

<script>

    export default {
        name: "Subscribe.vue",
        data() {
            return {
                weeklyReport: false,
                monthlyReport: false,
                yearlyReport: false
            }
        }
    }
</script>

<style scoped>
    .alert {
        display: inline-block;
    }

    .listBox {
        display: inline-block;
    }
</style>
