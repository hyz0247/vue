<template>
  <div>
    <div style="background: white;padding: 5px;border-radius: 10px;border: 1px solid black;box-sizing: border-box">
        <!--搜索栏-->
      <div style="margin-bottom: 5px;">
        <el-input v-model="name"
                  placeholder="请输入名字"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="loadPost"
                  style="width: 150px"></el-input>
        <el-select v-model="university" filterable placeholder="请选择学校" style="margin-left: 5px;width: 150px">
          <el-option
              v-for="item in universityData"
              :key="item.userId"
              :label="item.name"
              :value="item.userId">
          </el-option>
        </el-select>
        <el-select v-model="gender"
                   style="width: 100px;margin-left: 5px"
                   filterable placeholder="性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
        <el-select v-model="status"
                   v-if="(this.user.roleId ===0) || (this.user.roleId ===2)"
                   style="width: 100px;margin-left: 5px"
                   placeholder="状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
        <el-button type="primary"
                   style="margin-left: 5px;margin-top: 10px;width: 100px;"
                   @click="loadPost">查询</el-button>
        <el-button type="success" @click="reset" style="margin-left: 5px;width: 100px;">重置</el-button>
        <el-button v-if="(this.user.roleId ===0) || (this.user.roleId ===2)" type="primary" @click="add" style="margin-left: 5px;width: 100px;">新增</el-button>
      </div>
      <!--数据表格-->
      <el-table :data="tableData"
                style="width: 100%;font-size: 15px;border-radius: 5px;margin-top: 10px"
                :header-cell-style="{background: 'lightblue' ,color: '#555555' }">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            type="index"
            label="编号"
            width="70">
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="password" label="密码" align="center" v-if="(this.user.roleId ===0) || (this.user.roleId ===2)">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.gender === '1' ? 'primary' : 'danger'">
              <i :class="scope.row.gender === '1'?'el-icon-male':(scope.row.gender === '1' ?'el-icon-female':'')">
              </i>{{scope.row.gender === '1'?"男":(scope.row.gender === '1' ?"女":'')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="roleId" label="角色" align="center">
          <el-tag type="danger">
            {{"学生"}}
          </el-tag>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" v-if="(this.user.roleId ===0) || (this.user.roleId ===2)">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'primary' : 'danger'">
            {{scope.row.status === '1' ? '启用' : '禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center" >
          <template slot-scope="scope">
            <el-button  type="success" title="编辑"  icon="el-icon-edit" @click="modify(scope.row)"
                        v-if="(user.roleId ===0) || (user.roleId ===2)" circle ></el-button>
            <el-button title="删除" type="danger" icon="el-icon-delete" @click="deleteById(scope.row.id)"
                       v-if="(user.roleId ===0) || (user.roleId ===2)" circle></el-button>
            <el-button  type="primary" @click="lookInfo(scope.row)" style="width: 54px;height: 30px;align-items: center">查看</el-button>
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

      <!--新增或修改对话框  -->
      <el-dialog
          title="新增或修改"
          :visible.sync="addDialogVisible"
          width="30%"
          center>
        <el-form ref="addForm"
                 :model="addForm"
                 :rules="addRules"
                 label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-col :span="20"><el-input v-model="addForm.username"></el-input></el-col>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-col :span="20"><el-input v-model="addForm.password"></el-input></el-col>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="addForm.status"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </el-dialog>

<!--      学生详细信息-->
      <el-dialog
          :visible.sync="personDialogVisible"
          width="50%"
          center>
        <label style="margin-left: 385px;font-size: 30px">学生信息</label>
        <div style="width: 100%;height: 65vh">
        <el-descriptions :column="1" size="50" border style="width: 35%;float: left">
          <el-descriptions-item >
            <template slot="label" ><i class="el-icon-s-custom"></i>姓名</template>
            {{this.studentInfo.name}}
          </el-descriptions-item>
          <el-descriptions-item >
            <template slot="label"><i class="el-icon-s-custom"></i>电话</template>
            {{this.studentInfo.phone}}
          </el-descriptions-item>
          <el-descriptions-item >
            <template slot="label"><i class="el-icon-s-custom"></i>邮箱</template>
            {{this.studentInfo.email}}
          </el-descriptions-item>
          <el-descriptions-item >
            <template slot="label"><i class="el-icon-s-custom"></i>性别</template>
            {{this.studentInfo.gender == 1?"男":(this.studentInfo.gender == 0?"女":"")}}
          </el-descriptions-item>
          <el-descriptions-item >
            <template slot="label"><i class="el-icon-s-custom"></i>出生日期</template>
            {{this.studentInfo.birthday}}
          </el-descriptions-item>
          <el-descriptions-item >
            <template slot="label"><i class="el-icon-s-custom"></i>个人经历</template>
            {{this.studentInfo.introduce}}
          </el-descriptions-item>

        </el-descriptions>
          <el-descriptions :column="1" size="50" border style="width: 35%;float: right;margin-right: 130px">

            <el-descriptions-item style="width: 180px">
              <template slot="label" ><i class="el-icon-s-custom"></i>所在学校</template>
              {{this.univInfo}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>专业</template>
              {{this.studentInfo.major}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>毕业年份</template>
              {{this.studentInfo.graduationYear}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>学历</template>
              {{this.studentInfo.level == 0?"专科":(this.studentInfo.level == 1?"本科":(this.studentInfo.level == 1?"硕士及以上":""))}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>个人简历</template>
              <a v-if="this.resume !=null" :href="this.studentInfo.resume">下载</a>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"><i class="el-icon-s-custom"></i>工作意向</template>
              {{this.job}}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentManage",
  beforeMount() {
    this.loadUniversity()
    this.loadPost()
  },
  methods:{

    //查看学生信息
    lookInfo(row){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/student-information/listById?student_id='+row.id,
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.studentInfo = res.data.stuInfo
          this.univInfo = res.data.univInfo.name
          this.job = res.data.job
        }else{
          this.studentInfo = ''
          this.univInfo = ''
          this.job = ''
        }
      })

      this.personDialogVisible = true

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
      console.log(this.addForm)
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


    loadPost(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/user/listPageStu',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            name:this.name,
            gender:this.gender,
            status:this.status,
            university:this.university+'',
            roleId:'1'
          }
        }
      }).then(res=>res.data).then(res=>{

        if(res.code == 200){

          this.tableData = res.data
          this.total = res.total

        }else{
          alert('获取数据失败')
        }
      })

    },
    //搜索重置
    reset(){
      this.name = ''
      this.gender = ''
      this.university = ''
      this.loadPost()
    },
    //重置添加或修改的表单
    resetAddForm() {
      this.$refs.addForm.resetFields();
      this.loadPost()
    },




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

      univInfo:'',
      resume:'',
      job:'',
      studentInfo:[],
      tableData: [],
      pageNum:1,
      pageSize:20,
      total:0,
      name:'',
      university:'',
      universityData:[],
      gender:'',
      status:'',
      personDialogVisible:false,
      addDialogVisible:false,
      addForm:{
        id:'',
        username:'',
        password:'',
        status: '',
        roleId:'1'
      },
      //学生信息表
      studentInfoForm: {
        id:'',
        role:'',
        username: "",
        name: '',
        phone: '',
        email: '',
        gender: '',
        studentId:'',
        universityId: '',
        major: '',
        birthday: '',
        graduationYear:'',
        level:'',
        introduce:'',
        job1Id:'',
        job2Id:'',
        job3Id:''
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

  }
}
</script>

<style scoped>

</style>