<template>
    <el-container class="body" style="width: 100%;height: 100vh;">
      <el-header style="background-color: lightskyblue;">
        <Header :key="timer" @reFresh="doFresh" :read="msgNum"></Header>
      </el-header>

      <el-container style="width: 100%;">
        <el-aside width="12%"  style="background-color: rgba(151,196,253,0.8); height: 100%">
          <Aside @reFresh="doFresh"></Aside>
        </el-aside>
<div style="width: 100%;overflow: auto">
      <el-main >
        <router-view  @doFresh="doFresh" @read="read"/>
      </el-main>
</div>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "@/components/Aside";
import Header from "@/components/Header";
export default {
  name: "Index",
  components: { Header, Aside},
  data(){
    return{
      timer:'',
      msgNum:0,
      user:JSON.parse(sessionStorage.getItem('user')),
      userData:JSON.parse(sessionStorage.getItem('userData')),
    }
  },
  methods:{
    doFresh(){
      this.timer = new Date().getTime()
    },
    read(number){
      this.msgNum = number
    }
  }

}
</script>

<style scoped>

</style>