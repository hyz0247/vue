<template>
  <div>
    <div style="background: white;padding: 5px;border-radius: 10px;border: 1px solid black;box-sizing: border-box">
      <!--数据表格-->
      <el-table :data="tableData"
                style="width: 100%;font-size: 15px;border-radius: 5px;margin-top: 10px"
                :header-cell-style="{background: 'lightblue' ,color: '#555555' }">
        <el-table-column prop="senderId" label="发送人" align="center" :formatter="formatUser">
        </el-table-column>
        <el-table-column prop="content" label="通知" align="center" >
        </el-table-column>
        <el-table-column prop="sendTime" label="时间" align="center">
        </el-table-column>
      </el-table>

      <!--分页条    -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </div>
  </div>
</template>

<script>

export default {
  name: "MyInfo",
  beforeMount() {
    this.loadPost()
    this.loadUnit()
    this.loadUniv()
    this.loadStu()
    this.loadAdmin()
  },
  methods:{



    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pageNum = 1
      this.pageSize = val
      this.loadPost();
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.pageNum = val
      this.loadPost();
    },

    formatUser(row){
      //console.log(row.roleId)
      let temp
      switch (row.roleId){
        case 0:
          temp = this.adminData.find(item=>{
            return item.userId == row.userId
          })
          return temp && temp.name
        case 1:
          temp = this.stuData.find(item=>{
            return item.studentId == row.userId
          })
          return temp && temp.name
        case 2:
          temp = this.univData.find(item=>{
            return item.userId == row.userId
          })
          return temp && temp.name
        case 3:
          temp = this.unitData.find(item=>{
            return item.userId == row.senderId
          })
          return temp && temp.contactName
      }
    },

    loadUniv(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/university-information/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.univData = res.data
        }
      })
    },
    loadAdmin(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/admin-information/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.adminData = res.data
        }
      })
    },

    loadStu(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/student-information/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.stuData = res.data

        }
      })
    },
    //加载单位数据
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

    loadPost(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/messages/listPage',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            userId:this.user.id+'',
          }
        }
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.tableData = res.data
          this.total = res.total
          console.log(this.tableData)

        }else{
          alert('获取数据失败')
        }
      })

    },
    //搜索重置
    reset(){
      this.title = ''
      this.loadPost()
    },
    //重置添加或修改的表单
    resetreplyForm() {
      this.$refs.replyForm.resetFields();
      this.loadPost()
    },



  },
  data() {

    return {
      //富文本配置
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ['blockquote', 'code-block'], // 引用  代码块
            [{ header: 1 }, { header: 2 }], // 1、2 级标题
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ direction: 'rtl' }], // 文本方向
            [{ size: ['12px', false, '16px', '18px', '20px', '30px'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [{ font: [false, 'SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial'] }], // 字体种类
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除文本格式
            ['link', 'image', 'video']
          ]// 链接、图片、视频
        },
        placeholder: '回复评论'
      },

      user: JSON.parse(sessionStorage.getItem('user')),
      userData: JSON.parse(sessionStorage.getItem('userData')),

      univInfo:'',
      resume:'',
      job:'',
      jobData:[],
      questionInfo:[],
      tableData: [],
      pageNum:1,
      pageSize:20,
      total:0,
      title:'',
      unit:'',
      unitData:[],
      univData:[],
      adminData:[],
      stuData:[],
      status:'',
      answer:'',
      answerDialogVisible:false,
      questionDialogVisible:false,

    }

  }
}
</script>

<style scoped>

</style>