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
                (scope.row.status === 1 ? '通过,等待通知面试' : (scope.row.status === 2 ? '未通过' : (scope.row.status === 3 ? '已通知面试' : '已录取')))}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button type="success" @click="apply(scope.row)" v-if="scope.row.status===0">审核</el-button>
            <el-button type="success" @click="info(scope.row)" v-if="scope.row.status === 1">通知面试</el-button>
            <el-button type="success" @click="admitted(scope.row)" v-if="scope.row.status === 3">录取</el-button>
            <el-button type="success" @click="look(scope.row)">流程</el-button>
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

      <!--查看状态对话框  -->
      <el-dialog
          title="审批状态"
          :visible.sync="previewDialogVisible"
          width="50%"
          center>
        <el-steps :active="active" :finish-status="'success'" v-if="this.appStatus !== 2">
          <el-step title="等待审批"></el-step>
          <el-step title="是否通过" :status="appStatus"></el-step>
          <el-step title="已通知面试"></el-step>
          <el-step title="已录取"></el-step>
        </el-steps>
<!--        <div ref="word"></div>-->
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

      <!--通知对话框对话框    -->
      <el-dialog
          title="通知"
          :visible.sync="infoDialogVisible"
          width="30%"
          center>
        <el-form ref="msgForm"
                 :model="msgForm"
                 label-width="80px">
          <el-form-item label="通知消息" prop="content">
            <el-col :span="20">
              <el-input type="textarea" v-model="msgForm.content"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="infoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendInfo">确 定</el-button>
      </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import {CodeToText, regionDataPlus} from "element-china-area-data";
// let docx = require('docx-preview');
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
      success:'success',
      error:'error',
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
      jobId:0,
      status:'',
      active:0,
      applicationStatus:10,
      appStatus:'success',
      applicationId:'',
      previewDialogVisible:false,
      applyDialogVisible:false,
      infoDialogVisible:false,
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
    // 点击录取
    admitted(row){
      // id:'',
      //     senderId:'',
      //     receiverId:'',
      //     type: '',
      //     status:0,
      //     content:'',
      //     sendTime:''
      this.jobId = row.jobId
      this.applicationId = row.id
      this.msgForm.senderId = this.user.id
      this.msgForm.receiverId = row.studentId
      this.msgForm.type = '通知'
      this.applicationStatus = row.status
      this.infoRecord(row)
      this.infoDialogVisible = true


    },
    //点击流程
    look(row){

      if (row.status === 0){
        this.appStatus = ''
        this.active = 0
      }else if (row.status === 1){
        this.appStatus = 'success'
        this.active = 2
      }
      else if (row.status === 2){
        this.appStatus = 'error'
        this.active = 2
      }else if (row.status === 3){
        this.appStatus = 'success'
        this.active = 3
      }else if (row.status === 4){
        this.appStatus = 'success'
        this.active = 4
      }
      this.previewDialogVisible = true

    },
    //点击通知面试
    info(row){
      this.msgForm.senderId = this.user.id
      this.msgForm.receiverId = row.studentId
      this.applicationId = row.id
      this.msgForm.type = '通知'
      this.applicationStatus = row.status
      this.infoRecord(row)
      this.infoDialogVisible = true

    },
    reduceJobNum(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job/reduce?jobId='+this.jobId,
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          //console.log(1)
        }
      })
    },
    // 发送通知
    sendInfo(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/messages/save',
        data: this.msgForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.infoDialogVisible = false

          if (this.applicationStatus === 3){
            //console.log(1)
            this.modStatus("4")
            this.infoSubmit()
            this.reduceJobNum()
            this.msgForm.content = ''
          }else{
            //console.log(2)
            this.modStatus("3")
            this.infoSubmit()

          }

          this.loadPost()
          this.$message({
            message: '已发送通知给该学生',
            type: 'success'
          });

        }
      })
    },

    //预览简历
    previewDocx(row){
      let routeUrl = this.$router.resolve({
        path: "/DocxPreview",
        query: {resume:row.resume}
      });
      window.open(routeUrl.href, '_blank');

      //console.log(row.resume)
      // this.previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${row.resume}`
      // this.$axios ({
      //   method: 'get',
      //   responseType: 'blob',
      //   url: row.resume,
      // }).then(({data}) => {
      //   docx.renderAsync(data,this.$refs.word) // 渲染到页面
      // })
      //this.previewDialogVisible = true
    },

    //修改状态
    modStatus(status){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/application/update?status='+status+'&applicationId='+this.applicationId,
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
    infoRecord(row){
      if (this.applicationStatus === 3){
        this.applyForm.status = '4'
      }else this.applyForm.status = '3'

      this.applyForm.applicationId = row.id
      this.applicationId = row.id
      this.applyForm.operatorId = row.companyId
    },
    // 添加通知记录
    infoSubmit(){
      this.applyForm.reason = this.msgForm.content
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/approval-record/save',
        data: this.applyForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          //this.saveMsg()

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
          this.modStatus(this.applyForm.status)
          //this.saveMsg()

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
      this.applicationId = row.id
      this.applyForm.operatorId = row.companyId
      //console.log(this.applyForm)
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
          //console.log(this.tableData)

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