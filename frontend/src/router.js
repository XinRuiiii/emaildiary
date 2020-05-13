import Router from 'vue-router'
import Index from './components/pages/Index'
import Vue from 'vue'
import sendDiaryView from './components/pages/SendDiaryView'
import showDiaryView from './components/pages/ShowDiaryView'

import EditTest from "./components/pages/EditTest"
import SignInOrUp from "./components/pages/SignInOrUp";
import DiaryView from "./components/pages/DiaryView";

Vue.use(Router);


export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
        },
        {
            path: '/sendDiary',
            name: 'sendDiary',
            component: sendDiaryView
        },
        {
            path: '/showDiary',
            name: 'showDiary',
            component: showDiaryView
        },
        {
            path: '/edit',
            name: 'edit',
            component: EditTest
        },
        {
            path: '/signIn',
            name: 'signIn',
            component: SignInOrUp
        },
        {
            path: '/diary',
            name: 'diary',
            component: DiaryView
        }
    ]
})
