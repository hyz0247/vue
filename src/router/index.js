
import VueRouter from "vue-router";

const routes = [
    // {
    //     path:'/',
    //     name:'first',
    //     component:()=>import('../components/First')
    // },
    {
        path:'/',
        name:'login',
        component:()=>import('../components/Login')
    },
    {
        path:'/Register',
        name:'register',
        component:()=>import('../components/Register')
    },
    {
        path:'/Index',
        name:'index',
        component:()=>import('../components/Index'),
        children:[

        ]
    }
]


const router = new VueRouter({
    mode:'history',
    routes
})
export function resetRouter() {
    router.matcher = new VueRouter({
        mode:'history',
        routes: []
    }).matcher
}
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
router.beforeEach(((to, from, next) => {
    let tmp = sessionStorage.getItem('user')
    const user = tmp && JSON.parse(tmp)
    if (to.path !== '/' && !user) {
        alert("您还没登陆,请先登陆后再访问")
        next('/')
    }
    next()
}))
export default router;