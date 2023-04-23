<template>
  <div class="jobBox">
  <div>
    <div class="leftBox">
      <span style="font-size: 30px;font-weight: bold">战略运营经理(J10660)</span>
      <span style="position: relative;margin: auto;">10-15k</span>
    </div>
    <div style="margin-top: 10px;">
      <span>广州</span>
      <span style="margin-left: 10px">本科</span>
    </div>
  </div>
  <div>
    <div class="rightBox">
      <el-button type="primary">投简历</el-button>
      <el-button type="primary">聊一聊</el-button>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "UnitDetails"
}
</script>

<style scoped>
.jobBox{
  display: flex;
  align-content: center;
  margin-left: 35%;

}
.leftBox{
  /*margin: auto;*/
  flex: 1;
}
.rightBox{
  margin-left: 50px;
  width: 300px;
  position: relative;
  float: right;
}
</style>