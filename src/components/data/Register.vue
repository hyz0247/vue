<template>
  <div>
    <div>
      <div style="display: flex">
        <div id="barChart"  :style="{width: '600px', height: '500px'}"></div>
        <div id="pieChart" style="margin-left: 250px" :style="{width: '600px', height: '500px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
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
    loadPost(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/user/listRegister',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          console.log(res.data)
          // 基于准备好的dom，初始化echarts实例
          let barChart = this.$echarts.init(document.getElementById('barChart'))
          let pieChart = this.$echarts.init(document.getElementById('pieChart'))
          //绘制饼状图
          pieChart.setOption({
            backgroundColor: '#666d75',
            title: {
              text: '饼状图:用户注册数量',
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
                data: res.data.pieVOList
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
              text: '柱状图:用户注册数量',
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
  },
  mounted(){
    this.loadPost()

  }
}
</script>

<style scoped>

</style>