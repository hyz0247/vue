<template>
    <el-container class="body" style="width: 100%;height: 100vh">
      <el-header style="background-color: lightskyblue;">
        <Header></Header>
      </el-header>

      <el-container style="width: 100%">
        <el-aside width="12%"  style="background-color: rgba(151,196,253,0.8); height: 100%">
          <Aside></Aside>
        </el-aside>
<div style="width: 100%">
      <el-main >
        <router-view/>
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
      user:JSON.parse(sessionStorage.getItem('user')),
      userData:JSON.parse(sessionStorage.getItem('userData')),
    }
  },
  methods:{

  }

}
</script>

<style scoped>

</style>