<template>
    <div class ="time">
        <wired-card fill="#c3f0ca">{{date}}</wired-card>
    </div>
</template>

<script>
    export default {
        data:function(){
            return{
                date: new Date(),
            };
        },
        created(){
        },
        mounted(){
            let _this = this;
            this.timer = setInterval(function(){
                _this.date = new Date().toLocaleString();
            });
        },
        beforeDestroy:function(){
            if(this.timer){
                clearInterval(this.timer);
            }
        },
        methods:{
        }
    }

</script>

<style scoped>

</style>
