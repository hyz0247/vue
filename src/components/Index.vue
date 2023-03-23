<template>
    <el-container class="body" style="width: 100%;height: 100vh">
      <el-header style="background-color: #f8c9c9;">
        <Header></Header>
      </el-header>

      <el-container>
        <el-aside width="200px"  style="background-color: #f8c9c9; height: 100%">
          <Aside></Aside>
        </el-aside>
<div>
      <el-main>
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