import vue from 'vue'
import Vuex from 'vuex'
import router,{resetRouter} from "@/router";
vue.use(Vuex)

function addNewRoute(menuList){

    let routes = router.options.routes

    routes.forEach(routeItem=>{
        if(routeItem.path == '/Index'){
            menuList.forEach(menu=>{
                if(menu.parentId == null){
                let childRoute = {
                        path:'/'+menu.url,
                        name:menu.name,
                        meta:{
                            title:menu.name
                        },
                        component:()=>import('../components/'+menu.url),
                        children:[]
                    }
                    routeItem.children.push(childRoute)
                }else {
                    let childRoute = {
                        path:'/'+menu.url,
                        name:menu.name,
                        meta:{
                            title:menu.name
                        },
                        component:()=>import('../components/'+menu.url),
                    }
                    menu.children.push(childRoute)
                }
            })
        }
    })

    resetRouter()
    router.addRoutes(routes)

}



export default new Vuex.Store({
    state:{
        menu:[]
    },
    mutations:{
        setMenu(state,menuList) {
            state.menu = menuList
            addNewRoute(menuList)

        },

    },
    getters:{
        getMenu(state){
            return state.menu
        }
    }
})
