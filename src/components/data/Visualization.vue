<template>
  <div>
    <div>
      <div>
        <label style="margin-left: 30px">数据年份:</label>
        <el-select v-model="year"
                   @change="loadPost"
                   style="width: 100px;margin-left: 10px"
                   placeholder="年份">
          <el-option label="2023年" value="2023"></el-option>
          <el-option label="2022年" value="2022"></el-option>
          <el-option label="2021年" value="2021"></el-option>
          <el-option label="2020年" value="2020"></el-option>
          <el-option label="2019年" value="2019"></el-option>
        </el-select>
        <label v-if="this.user.roleId != 3" style="margin-left: 30px">单位:</label>
        <el-select v-if="this.user.roleId != 3"
                   v-model="unit" filterable
                   @change="loadPost"
                   placeholder="请选择单位" style="margin-left: 10px;width: 150px">
          <el-option
              v-for="item in unitData"
              :key="item.userId"
              :label="item.name"
              :value="item.userId">
          </el-option>
        </el-select>
        <label style="margin-left: 30px">岗位类型:</label>
        <el-select v-model="type"
                   filterable
                   @change="loadPost"
                   style="width: 100px;margin-left: 10px"
                   placeholder="岗位类型">
          <el-option
              v-for="item in jobTypeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-button style="margin-left: 50px" type="success" @click="reset">重置</el-button>
      </div>
      <div style="display: flex">
        <div id="barChart"  :style="{width: '600px', height: '500px'}"></div>
        <div id="pieChart" style="margin-left: 250px" :style="{width: '600px', height: '500px'}"></div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: "Visualization",
  data(){
    return{
      user: JSON.parse(sessionStorage.getItem('user')),
      userData: JSON.parse(sessionStorage.getItem('userData')),
      year:'2023',
      type:'',
      unit:'',
      quarter:'',
      jobTypeData:[],
      unitData:[],
    }
  },
  methods:{
    loadUnit(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/unit-information/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.unitData = res.data
        }
      })
    },
    reset(){
      this.type = ''
      this.year = '2023'
      this.loadPost()
    },
    loadPost(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/job/quarterList',
        data: {
          roleId:this.user.roleId+'',
          companyId:this.user.id+'',
          year:this.year,
          unit:this.unit+'',
          type:this.type+''
        }
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          console.log(res.data.pieVOS)
          console.log(res.data.barVO)

          //this.type = ''
          // 基于准备好的dom，初始化echarts实例
          let barChart = this.$echarts.init(document.getElementById('barChart'))
          let pieChart = this.$echarts.init(document.getElementById('pieChart'))
          //绘制饼状图
          pieChart.setOption({
            backgroundColor: '#666d75',
            title: {
              text: '饼状图:岗位发布统计',
              left: 'center',
              top: 20,
              textStyle: {
                color: '#ccc'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            series: [
              {
                name: '数量',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: res.data.pieVOS
                    .sort(function (a, b) {
                  return a.value - b.value;
                })
                ,
                roseType: 'radius',
                label: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                labelLine: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                },
                itemStyle: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
              }
            ]
          });
          // 绘制柱状图表
          barChart.setOption({
            title: {
              text: '柱状图:岗位发布统计',
              left: 'center',
              top: 20,
              textStyle: {
                color: '#ccc'
              }
            },
            tooltip: {},
            xAxis: {
              data:res.data.barVO.names
            },
            yAxis: {},
            series: [{
              name: '数量',
              type: 'bar',
              data: res.data.barVO.values
            }]
          });


        }else{
          alert('获取数据失败')
        }
      })
    },
    loadJobType(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job-type/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.jobTypeData = res.data
        }
      })
    },
  },
  mounted(){
    this.loadPost()
    this.loadJobType()
    this.loadUnit()

  }
}
</script>

<style scoped>

</style>