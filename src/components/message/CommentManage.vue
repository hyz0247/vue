<template>
  <div>
    <div style="background: white;padding: 5px;border-radius: 10px;border: 1px solid black;box-sizing: border-box">
      <!--搜索栏-->
      <div style="margin-bottom: 5px;">
        <el-input v-model="title"
                  placeholder="请输入岗位名称"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="loadPost"
                  style="width: 150px"></el-input>
        <el-button type="primary"
                   style="margin-left: 5px;margin-top: 10px;width: 100px;"
                   @click="loadPost">查询</el-button>
        <el-button type="success" @click="reset" style="margin-left: 5px;width: 100px;">重置</el-button>
      </div>
      <!--数据表格-->
      <el-table :data="tableData"
                style="width: 100%;font-size: 15px;border-radius: 5px;margin-top: 10px"
                :header-cell-style="{background: 'lightblue' ,color: '#555555' }">
        <el-table-column
            type="index"
            label="编号"
            width="70">
        </el-table-column>
        <el-table-column prop="userId" label="评论者" align="center" :formatter="formatUser">
        </el-table-column>
        <el-table-column prop="content" label="评论内容" align="center">
        </el-table-column>
        <el-table-column prop="jobId" label="岗位" align="center" :formatter="formatJob">
        </el-table-column>
        <el-table-column prop="createTime" label="评论时间" align="center">
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center" >
          <template slot-scope="scope">
            <el-button style="width: 80px;height: 32px;cursor: default"
                       v-if="user.id === scope.row.userId" type="text">我的回复</el-button>
            <el-button type="success" v-if="(user.roleId ===3 || user.roleId === 0) && user.id != scope.row.userId"
                       @click="replyComment(scope.row)">回复评论</el-button>
            <el-button title="删除" type="danger" icon="el-icon-delete" @click="deleteById(scope.row.id)"
                       v-if="user.roleId ===3 || user.roleId === 0 || user.id === scope.row.userId" circle></el-button>
            <el-button type="primary" @click="lookInfo(scope.row)" style="width: 54px;height: 30px;align-items: center">查看</el-button>
          </template>
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

      <!--回复对话框  -->
      <el-dialog
          title="回复"
          :visible.sync="replyDialogVisible"
          width="50%"
          center>
        <el-form ref="replyForm"
                 :model="replyForm"
                 :rules="addRules"
                 label-width="80px">
          <el-form-item label="回复内容" prop="content">
            <quill-editor class="editor"
                          style="height: 50%"
                          ref="myQuillEditor"
                          v-model="replyForm.content"
                          :options="editorOption">
            </quill-editor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {quillEditor} from "vue-quill-editor";

export default {
  name: "CommentManage",
  components: {
    quillEditor
  },
  beforeMount() {
    //this.loadUser()]
    this.loadJob()
    this.loadPost()
    this.loadUnit()
    this.loadUniv()
    this.loadStu()
    this.loadAdmin()
  },
  methods:{


    formatJob(row){
      let temp = this.jobData.find(item=>{
        return item.id == row.jobId
      })

      return temp && temp.title
    },
    //查看学生信息
    lookInfo(row){

      this.questionInfo = row
      const parser = new DOMParser()
      const dom = parser.parseFromString(this.questionInfo.description, 'text/html')
      const text = dom.body.textContent
      //console.log(text)
      this.questionInfo.description = text
      this.questionDialogVisible = true

    },
    //加载工作数据
    loadJob(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.jobData = res.data
        }
      })
    },

    cancel(){
      this.replyDialogVisible = false
      this.$nextTick(()=>{
        this.resetreplyForm()
      })
    },
    replyComment(row){
      this.replyForm.content = ''
      this.replyForm.userId = this.user.id
      this.replyForm.jobId = row.jobId
      this.replyForm.replyUerId = row.userId
      this.replyForm.parentId = row.id
      this.replyForm.jobId = row.jobId
      // if (this.formatUser(row) != null){
      //   this.editorOption.placeholder = '回复 @'+this.formatUser(row)+'：'
      //   //console.log(this.editorOption.placeholder)
      // }else {
      //   this.editorOption.placeholder = '回复 @未知名用户：'
      // }

      //console.log(this.replyForm)
      this.replyDialogVisible = true

    },
    //单个删除
    deleteById(id){
      this.$confirm('是否永久删除该评论, 是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //用户点击确认按钮
        //发送ajax请求，添加数据
        this.$axios({
          method:"GET",
          url:this.$httpUrl+"/comment/deleteById?id="+id
        }).then(resp =>{
          if(resp.data.code == 200){
            this.loadPost();
            //弹出消息提示
            this.$message({
              message:'恭喜你，删除成功',
              type:'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    save(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/comment/save',
        data: this.replyForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.$message({
            message: '回复成功',
            type: 'success'
          });
          this.replyDialogVisible = false
          this.loadPost()
          this.resetAddForm()
        }else{
          this.$message({
            message: '回复失败',
            type: 'error'
          });
        }
      })
    },

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


    formatUnit(row){
      let temp = this.unitData.find(item=>{
        return item.userId == row.companyId
      })
      return temp && temp.name
    },
    formatUser(row){
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
            return item.userId == row.userId
          })
          return temp && temp.name
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
        url:this.$httpUrl+'/comment/listPage',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            title:this.title,
            userId:this.user.id+'',
            roleId:this.user.roleId+''
          }
        }
      }).then(res=>res.data).then(res=>{

        if(res.code == 200){
          this.tableData = res.data
          for (let i = 0;i<this.tableData.length; i++){
            const parser = new DOMParser()
            const dom = parser.parseFromString(this.tableData[i].content, 'text/html')
            const text = dom.body.textContent
            this.tableData[i].content = text
          }

          this.total = res.total
          //console.log(this.tableData)

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
      replyDialogVisible:false,
      replyForm:{
        id:'',
        userId:'',
        content:'',
        jobId:'',
        createTime: '',
        replyUerId:'',
        parentId:'',
        status:0
      },
      addRules: {
        content: [
          {required: true, message: '请输入回复内容', trigger: 'blur'},
        ],
      },


    }

  }
}
</script>

<style scoped>

</style>