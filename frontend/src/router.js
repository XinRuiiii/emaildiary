import Router from 'vue-router'
import Index from './components/pages/Index'
import Vue from 'vue'
import sendDiaryView from './components/pages/SendDiaryView'
import showDiaryView from './components/pages/ShowDiaryView'
import SignInOrUp from "./components/pages/SignInOrUp"
import DiaryView from "./components/pages/DiaryView"
import SettingView from "./components/pages/SettingView"

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
            path: '/signIn',
            name: 'signIn',
            component: SignInOrUp
        },
        {
            path: '/set',
            name: 'set',
            component: SettingView
        },
        {
            path: '/diary',
            name: 'diary',
            component: DiaryView
        }
    ]
})
