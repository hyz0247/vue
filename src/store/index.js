import vue from 'vue'
import Vuex from 'vuex'
import router,{resetRouter} from "@/router";
vue.use(Vuex)

function addNewRoute(menuList){

    let routes = router.options.routes

     // routes.forEach(routeItem=>{
        // if(routeItem.path == '/Index'){
        //     menuList.forEach(menu=>{
        //         if(menu.parentId === null){
        //         let childRoute = {
        //                 path:'/'+menu.url,
        //                 name:menu.name,
        //                 meta:{
        //                     title:menu.name
        //                 },
        //                 component:()=>import('../components/'+menu.url),
        //                 children:[]
        //             }
        //             routeItem.children.push(childRoute)
        //         }
        //         // }else {
        //         //     let childRoute = {
        //         //         path:'/'+menu.url,
        //         //         name:menu.name,
        //         //         meta:{
        //         //             title:menu.name
        //         //         },
        //         //         component:()=>import('../components/'+menu.url),
        //         //     }
        //         //     menu.children.push(childRoute)
        //         // }
        //     })
        // }

         menuList.forEach(menu=>{
             if (menu.parentId === null){
                 let Route = {
                     path:'/'+menu.url,
                     name:menu.name,
                     meta:{
                         title:menu.name
                     },
                     component:()=>import('../components/'+menu.url),
                     children:[]
                 }
                 for(let i=0; i<menuList.length ;i++){
                     if(menu.id === menuList[i].parentId ){
                         let childRoute = {
                             path:'/'+menuList[i].url,
                             name:menuList[i].name,
                             meta:{
                                 title:menuList[i].name
                             },
                             component:()=>import('../components/'+menuList[i].url),
                         }
                         Route.children.push(childRoute)
                     }
                 }

                 routes.push(Route)
             }
         })
     // })


    resetRouter()
    router.addRoutes(routes)

}



export default new Vuex.Store({
    state:{
        menu:[]
    },
    mutations:{
        changeMenu(state,menuList) {

            state.menu = menuList
            addNewRoute(menuList)
        },
    },
    actions:{
        setMenu(context,menuList){
            context.commit("changeMenu",menuList)
        }
    },
    getters:{
        getMenu(state){
            return state.menu
        }
    }
})
