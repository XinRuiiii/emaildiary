<template>
    <div class="index">
        <wired-card class="frame" fill="#fef6e4">
            <div class="frameContent">
                <!--        跳转标签-->
                <div class="header">
                    <!--        设置页面-->
                    <router-link to="/set">
                        <wired-fab class="btnFab">
                            <font-awesome-icon icon="cog"/>
                        </wired-fab>
                    </router-link>
                    <!--     日记编辑界面-->
                    <router-link to="/sendDiary">
                        <wired-fab class="btnFab btnFabMarginLeft">
                            <font-awesome-icon icon="pencil-alt"/>
                        </wired-fab>
                    </router-link>
                    <!--       日记本界面-->
                    <router-link to="/showDiary">
                        <wired-fab class="btnFab btnFabMarginLeft">
                            <font-awesome-icon icon="book"/>
                        </wired-fab>
                    </router-link>
                    <!--登录注册界面-->
                    <router-link to="/signIn">
                        <img src="../../assets/images/logo.png" class="logo">
                    </router-link>
                    <!--            退出登录界面-->
                    <index-avatar class="btnLogin"></index-avatar>
                </div>
                <div class="box">
                    <!--                    日记列表-->
                    <index-diary id="indexDiary"/>
                    <div class="indexRight">
                        <index-calendar></index-calendar>
                        <index-spirit class="emotionBox"></index-spirit>
                    </div>
                </div>
            </div>
        </wired-card>
    </div>
</template>

<script>
    import DiaryList from "./IndexComponents/DiaryList"
    import Avatar from "./IndexComponents/Avatar"
    import SpiritList from "./IndexComponents/SpiritList"
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {faPencilAlt, faBook, faCog, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
    import Calendar from "./IndexComponents/Calendar";

    library.add(faPencilAlt, faBook, faCog, faSignOutAlt)


    export default {
        name: 'Index',
        components: {
            'index-diary': DiaryList,
            'index-avatar': Avatar,
            'index-spirit': SpiritList,
            'index-calendar': Calendar
        }
    }
</script>

<style scoped>

    .index {
        padding: 0 5% 0 5%;
        border: 0;
    }

    .frame {
        height: 100%;
        width: 100%;
        margin: 0;
        z-index: 0;
        padding: 2% 2% 2% 2%;
    }

    .btnFab {
        --wired-fab-bg-color: #f582ae;
    }

    .btnFabMarginLeft {
        margin-left: 3%;
    }

    .logo {
        height: 50px;
        margin-left: 50%;
    }

    #indexDiary {
        width: 65%;
        display: inline-block;
    }

    .indexRight {
        display: inline-block;
        width: 30%;
        height: 50%;
    }

    .btnLogin {
        display: inline-block;
        float: right;
    }

</style>
