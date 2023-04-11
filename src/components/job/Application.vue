<template>
  <div>
    <div style="background: white;padding: 5px;border-radius: 10px;border: 1px solid black;box-sizing: border-box">
      <!--搜索栏-->
      <div style="margin-bottom: 5px;">
        <el-input v-model="name"
                  placeholder="请输入岗位名称"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="loadPost"
                  style="width: 150px"></el-input>
        <el-select v-model="status"
                   style="width: 100px;margin-left: 5px"
                   placeholder="状态">
          <el-option label="等待审批" value="0"></el-option>
          <el-option label="通过" value="1"></el-option>
          <el-option label="未通过" value="2"></el-option>
        </el-select>
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
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column prop="title" label="岗位名称" align="center" >
        </el-table-column>
        <el-table-column prop="companyId" label="单位名称" align="center" :formatter="formatUnit">
        </el-table-column>
        <el-table-column prop="studentId" label="学生名字" align="center" :formatter="formatStudent">
        </el-table-column>
        <el-table-column prop="resume" label="简历" align="center" v-if="user.roleId === 3">
          <template slot-scope="scope">
          <a style="cursor: pointer;text-decoration: underline;color: blue;" @click="previewDocx(scope.row)">预览</a>
          <a :href="scope.row.resume" style="margin-left: 2px">下载</a>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate" label="申请时间" align="center">
        </el-table-column>
        <el-table-column prop="status" label="审批状态" align="center">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.status === 2 ? 'danger' : (scope.row.status === 1 ? 'success' : 'primary')"
                disable-transitions>{{scope.row.status === 0 ? '等待审批' :
                (scope.row.status === 1 ? '通过,等待通知面试' : '未通过')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center" v-if="user.roleId === 3">
          <template slot-scope="scope">
            <el-button type="success" @click="apply(scope.row)" v-if="scope.row.status===0">审核</el-button>
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

      <!--简历预览对话框  -->
      <el-dialog
          title="新增或修改"
          :visible.sync="previewDialogVisible"
          width="50%"
          center>
        <div ref="word"></div>
<!--        <iframe :src="previewUrl" width="100%" height="600px">预览</iframe>-->
      </el-dialog>

      <!--审批对话框    -->
      <el-dialog
          title="提示"
          :visible.sync="applyDialogVisible"
          width="30%"
          center>
        <el-form ref="applyForm"
                 :model="applyForm"
                 label-width="80px">
          <el-form-item label="操作">
            <el-radio-group v-model="applyForm.status">
              <el-radio label="0">等待审批</el-radio>
              <el-radio label="1">通过</el-radio>
              <el-radio label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因" prop="reason">
            <el-col :span="20">
              <el-input type="textarea" v-model="applyForm.reason"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="applyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import {CodeToText, regionDataPlus} from "element-china-area-data";
let docx = require('docx-preview');
export default {
  name: "Application",
  beforeMount() {
    this.loadPost()
    this.loadUnit()
    this.loadStudent()
  },
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem('user')),
      userData: JSON.parse(sessionStorage.getItem('userData')),
      options: regionDataPlus ,
      previewUrl:'',
      selectedOptions: [],
      StudentData:[],
      UnitData:[],
      area:'',
      unitInfo:'',
      resume:'',
      job:'',
      studentInfo:[],
      tableData: [],
      pageNum:1,
      pageSize:20,
      total:0,
      name:'',
      status:'',
      previewDialogVisible:false,
      applyDialogVisible:false,
      univeInfoDialogVisible:false,
      applyForm:{
        id:'',
        status:'',
        reply:'',
        operatorId: '',
        applicationId:'',
        reason:''
      },
      msgForm:{
        id:'',
        senderId:'',
        receiverId:'',
        type: '',
        status:0,
        content:'',
        sendTime:''
      },


    }

  },
  methods:{

    previewDocx(row){
      //console.log(row.resume)
      // this.previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${row.resume}`
      this.$axios ({
        method: 'get',
        responseType: 'blob',
        url: row.resume,
      }).then(({data}) => {
        docx.renderAsync(data,this.$refs.word) // 渲染到页面
      })
      this.previewDialogVisible = true
    },

    saveMsg(){
      this.msgForm.content = this.applyForm.reason
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/messages/save',
        data: this.msgForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.$message({
            message: '审批成功,并发送通知给该学生',
            type: 'success'
          });

        }
      })
    },

    modStatus(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/application/update?status='+this.applyForm.status+'&applicationId='+this.applyForm.applicationId,
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.loadPost()
          this.resetApplyForm()
        }else{
          this.$message({
            message: '修改状态失败',
            type: 'error'
          });
        }
      })
    },
    submit(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/approval-record/save',
        data: this.applyForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.applyDialogVisible = false
          this.modStatus()
          this.saveMsg()

        }else{
          this.$message({
            message: '审批失败',
            type: 'error'
          });
        }
      })
    },
    apply(row){
      //console.log(row)
      this.applyForm.status = row.status+''
      this.applyForm.applicationId = row.id
      this.applyForm.operatorId = row.companyId
      //console.log(this.applyForm)
      this.msgForm.senderId = this.user.id
      this.msgForm.receiverId = row.studentId
      this.msgForm.type = '通知'
      this.applyDialogVisible = true

    },

    //加载单位数据
    loadUnit(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/unit-information/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.UnitData = res.data
        }
      })
    },
    loadStudent(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/student-information/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.StudentData = res.data

        }
      })
    },
    formatStudent(row){
      let temp = this.StudentData.find(item=>{
        return item.studentId == row.studentId
      })

      return temp && temp.name
    },
    formatUnit(row){
      let temp = this.UnitData.find(item=>{
        return item.userId == row.companyId
      })

      return temp && temp.name
    },


    //单个删除
    deleteById(id){
      this.$confirm('此操作将永久删除该数据, 是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //用户点击确认按钮
        //发送ajax请求，添加数据
        this.$axios({
          method:"GET",
          url:this.$httpUrl+"/user/deleteById?id="+id
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

    loadPost(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/application/PageApplication',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            name:this.name,
            status:this.status,
            roleId:this.user.roleId+'',
            userId:this.user.id+''
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

    handleChange () {
      var loc = "";
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]];
      }
      this.area = loc
      if(loc == "全部"){
        this.area = ''
      }
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
    //搜索重置
    reset(){
      this.name = ''
      this.status = ''
      this.loadPost()
    },
    //重置添加或修改的表单
    resetAddForm() {
      this.$refs.addForm.resetFields();
      this.loadPost()
    },
    resetApplyForm(){
      this.$refs.applyForm.resetFields();
      this.loadPost()
    },
  }
}
</script>

<style scoped>

</style>