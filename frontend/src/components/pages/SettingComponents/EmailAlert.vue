<template>
    <wired-card elevation="3" class="alert" >
        <div align="center">
            <h3>邮件提醒</h3>
        </div>
        <wired-listbox horizontal selected="day" class="listbox" style="--wired-item-selected-bg: grey;">
            <wired-item value="day">每天提醒</wired-item>
            <wired-item value="week">每周提醒</wired-item>
            <wired-item value="month">每月提醒</wired-item>
            <wired-item value="year">每年提醒</wired-item>
        </wired-listbox>
    </wired-card>
</template>

<script>
    export default {
        name: "EmailAlert.vue"
    }
</script>

<style scoped>
    .alert{
        display: inline-block;
    }

    .listbox{
        display: inline-block;
    }
</style>
