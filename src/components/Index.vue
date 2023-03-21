<template>
    <el-container class="body" style="height: 100%;width: 100%;overflow: clip">
      <el-header style="background-color: #f8c9c9;">
        <Header></Header>
      </el-header>

      <el-container>
        <el-aside width="200px"  style="background-color: #f8c9c9; height: 100vh">
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

    }
  },
  methods:{

  }

}
</script>

<style scoped>

</style>