<template>
    <div>
        <!--        跳转去设置页面-->
            <wired-button id="setBtn" v-on:click="$router.push('/set')">资料设置</wired-button>
        <!--        跳转去设置页面结束-->

      
        <div>
            <router-link to="/sendDiary">
                <wired-fab class="CreateDiaryButton">
                    <font-awesome-icon icon="pencil-alt"/>
                </wired-fab>
            </router-link>
            <router-link to="/showDiary" class="btnShowDiary"> <wired-fab>
                <font-awesome-icon icon="shower"/>
            </wired-fab>
            </router-link>
        </div>
        <div class="box">
            <!--        网页的边框-->
            <wired-card class="frame" elevation="5"/>
            <index-diary id="indexDiary"></index-diary>
            <router-link to="/signIn">
                <index-avatar></index-avatar>
            <!--            跳转到登录/登出/注册/注销页面-->

            <!--            日历-->
            <!--            <index-calendar></index-calendar>-->
            <!--            选择心情的列表-->
            <index-spirit></index-spirit>
        </div>

    </div>
</template>

<script>
    import DiaryList from "./IndexComponents/DiaryList"
    import Avatar from "./IndexComponents/Avatar"
    import SpiritList from "./IndexComponents/SpiritList"
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {faPencilAlt,faShower} from '@fortawesome/free-solid-svg-icons'

    library.add(faPencilAlt,faShower)


    export default {
        name: 'Index',
        components: {
            'index-diary': DiaryList,
            'index-avatar': Avatar,
            'index-spirit': SpiritList
        }

    }
</script>

<style scoped>

    .box {
        position: absolute;
        height: 80%;
        width: 90%;
        padding: 0;
        margin-top: 5%;
        margin-left: 5%;
        border: 0;
    }

    .CreateDiaryButton {
        position: absolute;
        height: 90px;
        width: 90px;
        margin-left: 7%;
        margin-top: 1%;
        --wired-fab-bg-color: pink;
    }

    #setBtn {
        position: absolute;
        margin-left: 200px;

    .btnShowDiary{
        position: absolute;
        margin-left: 15%;
        margin-top: 1%;
    }

    .frame {
        position: absolute;
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        z-index: 0;
    }

    #indexDiary {
        width: 65%;
    }
</style>
