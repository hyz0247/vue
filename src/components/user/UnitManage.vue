<template>
  <div>
    <div style="background: white;padding: 5px;border-radius: 10px;border: 1px solid black;box-sizing: border-box">
      <!--搜索栏-->
      <div style="margin-bottom: 5px;">
        <el-input v-model="name"
                  placeholder="请输入单位名称"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="loadPost"
                  style="width: 150px"></el-input>
        <el-select v-model="status"
                   style="width: 100px;margin-left: 5px"
                   placeholder="状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
        <el-cascader
            style="width: 200px;margin-left: 5px"
            size="large"
            filterable
            placeholder="请选择省/市/县"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
        </el-cascader>
        <el-button type="primary"
                   style="margin-left: 5px;margin-top: 10px;width: 100px;"
                   @click="loadPost">查询</el-button>
        <el-button type="success" @click="reset" style="margin-left: 5px;width: 100px;">重置</el-button>
        <el-button type="primary" @click="add" style="margin-left: 5px;width: 100px;">新增</el-button>
      </div>
      <!--数据表格-->
      <el-table :data="tableData"
                style="width: 100%;font-size: 15px;border-radius: 5px;margin-top: 10px"
                :header-cell-style="{background: 'lightblue' ,color: '#555555' }">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="password" label="密码" align="center">
        </el-table-column>
        <el-table-column prop="name" label="单位名称" align="center">
        </el-table-column>
        <el-table-column prop="contactPhone" label="联系电话" align="center">
        </el-table-column>
        <el-table-column prop="logo" label="logo" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.logo" width="60" height="60"/>
          </template>
        </el-table-column>
        <el-table-column prop="roleId" label="角色" align="center">
          <el-tag type="danger">
            {{"单位"}}
          </el-tag>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'primary' : 'danger'">
              {{scope.row.status === '1' ? '启用' : '禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" title="编辑"  icon="el-icon-edit" @click="modify(scope.row)" circle></el-button>
            <el-button title="删除" type="danger" icon="el-icon-delete" @click="deleteById(scope.row.id)" circle></el-button>
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
      <!--      单位详细信息-->
      <el-dialog
          :visible.sync="univeInfoDialogVisible"
          width="50%"
          center>
        <label style="margin-left: 385px;font-size: 30px">学生信息</label>
        <div style="width: 100%;height: 65vh">
          <el-descriptions :column="1" size="50" border style="width: 35%;float: left">
            <el-descriptions-item >
              <template slot="label" ><i class="el-icon-s-custom"></i>联系人姓名</template>
              {{this.unitInfo.contactName}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>联系人电话</template>
              {{this.unitInfo.contactPhone}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"><i class="el-icon-s-custom"></i>学校logo</template>
              <img :src="this.unitInfo.logo" width="80" height="80">
            </el-descriptions-item>
          </el-descriptions>

          <el-descriptions :column="1" size="50" border style="width: 35%;float: right;margin-right: 130px">

            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>地址</template>
              {{this.unitInfo.address}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>电子邮箱</template>
              {{this.unitInfo.email}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>单位简介</template>
              {{this.unitInfo.description}}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import {CodeToText, regionDataPlus} from "element-china-area-data";

export default {
  name: "UnitManage",
  beforeMount() {
    this.loadPost();
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
      univeInfoDialogVisible:false,
      addDialogVisible:false,
      addForm:{
        id:'',
        username:'',
        password:'',
        status: '',
        roleId:'2'
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

    //查看学校信息
    lookInfo(row){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/unit-information/listById?user_id='+row.id,
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.unitInfo = res.data.unitInfo
        }else{
          this.unitInfo = ''
        }
      })

      this.univeInfoDialogVisible = true

    },
    loadPost(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/user/listPageUnit',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            name:this.name,
            status:this.status,
            address:this.area,
            roleId:'3'
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

    handleChange () {
      //console.log(this.selectedOptions)
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
  }
}
</script>

<style scoped>

</style>