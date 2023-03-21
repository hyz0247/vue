<template>
  <div style="height: 100%;">
    <el-menu background-color="#545c64" text-color="#ffffff"
             active-text-color="#ffd04b" class="el-menu-vertical-demo"
             router>

      <template>
      <el-submenu :index="item.url" v-for="item in menuList" :key="item.name">
        <template  slot="title"><i :class="item.icon"></i><span>{{item.name}}</span></template>
        <div v-for="child in menu" :key="child.name">
        <el-menu-item v-if="item.id === child.parentId" :index="child.url"  :key="child.name">
          <i :class="child.icon"></i>{{child.name}}
        </el-menu-item>
        </div>
      </el-submenu>
      </template>
    </el-menu>
  </div>


</template>

<script>
import router from "@/router";
export default {
  name: "Aside",

  computed:{
    "menu":{
      get(){
        return this.$store.state.menu
      }
    },
    menuList: function () {
      return this.menu.filter(function (list) {
        return !list.parentId
      })
    }




  },
  mounted() {
    console.log(this.$store.state.menu)
    console.log(router.options.routes)
  },
  data(){
    return {

      // menu_data:[
      //   {
      //     name:'一级菜单1',
      //     icon:'el-icon-location',
      //     path:'/user/StudentManage',
      //     child:[
      //       {
      //         name:'二级菜单1-1',
      //         icon:'el-icon-user',
      //         path:'/user/StudentManage'
      //       },
      //       {
      //         name:'二级菜单1-2',
      //         icon:'el-icon-user-solid',
      //         path:'/user/UniversityManage'
      //       }
      //     ]
      //   },
      //   {
      //     name:'一级菜单2',
      //     icon:'el-icon-document',
      //     path:'/user/UnitManage',
      //     child:[
      //       {
      //         name:'二级菜单2-1',
      //         icon:'el-icon-star-on',
      //         path:'/index/menu21'
      //       },
      //       {
      //         name:'二级菜单2-2',
      //         icon:'el-icon-star-off',
      //         path:'/index/menu22'
      //       }
      //     ]
      //   },
      //   {
      //     name:'一级菜单3',
      //     icon:'el-icon-setting',
      //     path:'/index/menu3',
      //     child:[
      //       {
      //         name:'二级菜单3-1',
      //         icon:'el-icon-s-help',
      //         path:'/index/menu31'
      //       },
      //       {
      //         name:'二级菜单3-2',
      //         icon:'el-icon-help',
      //         path:'/index/menu32'
      //       }
      //     ]
      //   }
      // ]
    }
  }
}
</script>

<style scoped>

</style>