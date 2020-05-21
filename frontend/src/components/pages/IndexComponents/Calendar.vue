<template>
    <div class="calendar-box">
        <wired-calendar :selected="date" class="calendar"></wired-calendar>
    </div>
</template>

<script>
    export default {
        name: "Calendar",
        data() {
            return {
                date: null,
                month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
            }
        },
        created() {
            let d = new Date()
            this.date = this.month[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()
        }
    }
</script>

<style scoped>
    wired-calendar.calendar {
        --wired-calendar-bg: #fef6e4;
    }
</style>
