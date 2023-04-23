<template>
  <div style="height: 100%;">
    <el-menu background-color="#ffffff"
             text-color="#000000"
             active-text-color="#ffd04b"
             class="el-menu-vertical-demo"
             router>
      <template>
      <el-submenu :index="item.url" v-for="item in menuList" :key="item.name ">
        <template  slot="title"><i :class="item.icon"></i><span>{{item.name}}</span></template>
        <div v-for="child in menu" :key="child.name">
        <el-menu-item @click="click(child.menuClick)" v-if="item.id === child.parentId" :index="'/'+child.url"  :key="child.name">
          <i :class="child.icon"></i>{{child.name}}
        </el-menu-item>
        </div>
      </el-submenu>
      </template>
    </el-menu>
  </div>


</template>

<script>
export default {
  name: "Aside",

  methods:{

    click(menuClick){
      //console.log(menuClick)
      if (menuClick == 'comment'){
        //console.log(1)
        this.comment()
      }
      if (menuClick == 'myInfo'){
        //console.log(2)
        this.myInfo()
      }
      if (menuClick == 'privateMsg'){
        //console.log(3)
        this.privateMsg()
      }
    },
    comment(){
        //console.log(this.updateId)
        this.$axios({
          method:'GET',
          url:this.$httpUrl+'/comment/read?userId='+this.user.id,
        }).then(res=>res.data).then(res=>{
          if(res.code == 200){
            //console.log(res.data)
            this.$emit('reFresh')
          }
        })
    },
    myInfo(){
        //console.log(this.updateId)
        this.$axios({
          method:'GET',
          url:this.$httpUrl+'/messages/readInfo?userId='+this.user.id,
        }).then(res=>res.data).then(res=>{
          if(res.code == 200){
            //console.log(res.data)
            //this.loadMessages()
            this.$emit('reFresh')

          }
        })
    },

    privateMsg(){
      // setTimeout(()=>{
      //   //console.log(this.updateId)
      //   this.$axios({
      //     method:'GET',
      //     url:this.$httpUrl+'/messages/readPrivate?userId='+this.user.id,
      //   }).then(res=>res.data).then(res=>{
      //     if(res.code == 200){
      //       //console.log(res.data)
      //       //this.loadMessages()
      //       this.$emit('reFresh')
      //
      //     }
      //   })
      // },1000)

    },


  },
  computed:{
    "menu":{
      get(){
         return this.$store.state.menu
        //return JSON.parse(sessionStorage.getItem('myMenu'))
      }
    },
    menuList: function () {
      return this.menu.filter(function (list) {
        return !list.parentId
      })
    }




  },
  mounted() {
    //console.log(this.menu)
  },
  data(){
    return {
      user:JSON.parse(sessionStorage.getItem('user')),
      infoMsgList:[],
      updateId:[],
      myMsgList:[],
      commentList:[],

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