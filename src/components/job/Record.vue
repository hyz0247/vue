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
        <el-table-column prop="operatorId" label="单位名称" align="center" :formatter="formatUnit">
        </el-table-column>
        <el-table-column prop="studentId" label="学生名字" align="center" :formatter="formatStudent">
        </el-table-column>
        <el-table-column prop="operatorId" label="操作人" align="center" :formatter="formatUnitContactName">
        </el-table-column>
        <el-table-column prop="updateTime" label="审批时间" align="center">
        </el-table-column>
        <el-table-column prop="status" label="审批状态" align="center">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.status === 2 ? 'danger' : (scope.row.status === 1 ? 'success' : 'primary')"
                disable-transitions>{{scope.row.status === 0 ? '等待审批' :
                (scope.row.status === 1 ? '通过,等待通知面试' : '未通过')}}</el-tag>
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

    </div>
  </div>
</template>

<script>
import {CodeToText, regionDataPlus} from "element-china-area-data";

export default {
  name: "Record",
  beforeMount() {
    this.loadPost()
    this.loadUnit()
    this.loadStudent()
  },
  data() {
    //添加学生用户的账号是否存在
    let checkDuplicate =(rule,value,callback)=>{
      if(this.addForm.id){
        return callback();
      }
      this.$axios.get(this.$httpUrl+"/user/findByUsername?username="+this.addForm.username).then(res=>{
        if(res.data.code != 200){
          callback()
        }else{

          callback(new Error('账号已经存在'));
        }
      })
    };
    return {
      user: JSON.parse(sessionStorage.getItem('user')),
      userData: JSON.parse(sessionStorage.getItem('userData')),
      options: regionDataPlus ,
      selectedOptions: [],
      StudentData:[],
      UnitData:[],
      universityData:[],
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
      applyDialogVisible:false,
      univeInfoDialogVisible:false,
      addDialogVisible:false,
      addForm:{
        id:'',
        username:'',
        password:'',
        status: '',
        roleId:'2'
      },
      applyForm:{
        id:'',
        status:'',
        reply:'',
        operatorId: '',
        applicationId:''
      },
      addRules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'},
          {validator:checkDuplicate,trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
        ],
      },


    }

  },
  methods:{

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

          this.$message({
            message: '审批成功,请在审批记录中查看',
            type: 'success'
          });

          this.applyDialogVisible = false
          this.modStatus()

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
      this.applyDialogVisible = true

    },

    //加载大学数据
    loadUniversity(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/university-information/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.universityData = res.data
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
    formatUniversity(row){
      let temp = this.universityData.find(item=>{
        return item.userId == row.operatorId
      })

      return temp && temp.name
    },
    formatStudent(row){
      let temp = this.StudentData.find(item=>{
        return item.studentId == row.studentId
      })

      return temp && temp.name
    },
    formatUnitContactName(row){
      let temp = this.UnitData.find(item=>{
        return item.userId == row.operatorId
      })

      return temp && temp.contactName
    },
    formatUnit(row){
      let temp = this.UnitData.find(item=>{
        return item.userId == row.operatorId
      })

      return temp && temp.name
    },

    save(){
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if(this.addForm.id){
            this.doMod()
          }else{
            this.doSave()
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    cancel(){
      this.addDialogVisible = false
      this.$nextTick(()=>{
        this.resetAddForm()
      })
      this.loadPost();
    },

    //点击添加
    add(){
      this.addDialogVisible = true
      this.addForm.id = ''
      this.$nextTick(()=>{
        this.resetAddForm()
      })


    },
    //点击修改
    modify(row){
      this.addDialogVisible = true
      this.$nextTick(()=>{
        this.addForm = row
      })

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
    //做修改
    doMod(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/user/update',
        data: this.addForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.$message({
            message: '修改成功',
            type: 'success'
          });

          this.addDialogVisible = false
          this.loadPost()
          this.resetAddForm()

        }else{
          this.$message({
            message: '修改失败',
            type: 'error'
          });
        }
      })
    },
    //做添加
    doSave(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/user/save',
        data: this.addForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.$message({
            message: '添加成功',
            type: 'success'
          });

          this.addDialogVisible = false
          this.loadPost()
          this.resetAddForm()

        }else{
          this.$message({
            message: '添加失败',
            type: 'error'
          });
        }
      })


    },

    loadPost(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/approval-record/pageRecord',
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