<template>
  <div>
    <div style="background: white;padding: 5px;border-radius: 10px;border: 1px solid black;box-sizing: border-box">
      <!--搜索栏-->
      <div style="margin-top: 10px;display: flex">
        <el-input v-model="name"
                  placeholder="请输入名称"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="loadPost"
                  style="width: 150px"></el-input>
        <el-select v-if="this.user.roleId != 3" v-model="unit" filterable placeholder="请选择单位" style="margin-left: 5px;width: 150px">
          <el-option
              v-for="item in unitData"
              :key="item.userId"
              :label="item.name"
              :value="item.userId">
          </el-option>
        </el-select>
        <div style="margin-left: 10px">
          <el-input v-model="salaryMin"
                    placeholder="最低薪水"
                    style="width: 100px"></el-input>
          <span>-</span>
          <el-input v-model="salaryMax"
                    placeholder="最高薪水"
                    style="width: 100px;margin-left: 3px"></el-input>
        </div>
        <el-cascader
            style="width: 200px;margin-left: 5px;margin-top: -4px"
            size="large"
            filterable
            placeholder="请选择省/市/县"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
        </el-cascader>
        <el-button type="primary"
                   style="margin-left: 5px;width: 100px;height: 32px"
                   @click="loadPost">查询</el-button>
        <el-button type="success" @click="reset" style="margin-left: 5px;width: 100px;height: 32px">重置</el-button>
      </div>
      <!--数据表格-->
      <el-table :data="tableData"
                style="width: 100%;font-size: 15px;border-radius: 5px;margin-top: 10px"
                :header-cell-style="{background: 'lightblue' ,color: '#555555' }">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column prop="title" label="岗位名称" align="center">
        </el-table-column>
        <el-table-column prop="typeId" label="类型" align="center" :formatter="formatType">
        </el-table-column>
        <el-table-column prop="salary" label="薪资" align="center">
          <template slot-scope="scope">
            {{scope.row.salaryMin+'-'+scope.row.salaryMax+'k'}}
          </template>
        </el-table-column>
        <el-table-column prop="eduRequirement" label="学历要求" align="center">
          <template slot-scope="scope">
            {{scope.row.eduRequirement === '0'?'专科':(scope.row.eduRequirement === '1'?'本科':'硕士及以上')}}
          </template>
        </el-table-column>
        <el-table-column prop="genderRequirement" label="性别要求" align="center">
          <template slot-scope="scope">
            {{scope.row.genderRequirement === '0'?'女':(scope.row.genderRequirement === '1'?'男':'无')}}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="需求人数" align="center">
        </el-table-column>
        <el-table-column prop="isFull" label="是否招满" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isFull === 1 ? 'primary' : 'danger'">
              {{scope.row.isFull === 0 ? '招满' : '未招满'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteById(scope.row.collectId)"
                       v-if="user.roleId ===1">取消收藏</el-button>
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

      <!--岗位详细信息-->
      <el-dialog
          :visible.sync="jobDialogVisible"
          width="50%"
          center>
        <label style="margin-left: 385px;font-size: 30px">岗位信息</label>
        <div style="width: 100%;height: 65vh">
          <el-descriptions :column="1" size="50" border style="width: 35%;float: left">
            <el-descriptions-item >
              <template slot="label" ><i class="el-icon-s-custom"></i>企业</template>
              {{this.unitInfo}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>岗位名称</template>
              {{this.jobInfo.title}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>岗位类型</template>
              {{this.jobTypeInfo}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>岗位描述</template>
              {{this.jobInfo.description}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>薪资</template>
              {{this.jobInfo.salaryMin+'-'+this.jobInfo.salaryMax}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>学历要求</template>
              {{this.jobInfo.eduRequirement ==='0'?'专科':(this.jobInfo.eduRequirement === '1'?'本科':'硕士及以上')}}
            </el-descriptions-item>

          </el-descriptions>
          <el-descriptions :column="1" size="50" border style="width: 35%;float: right;margin-right: 130px">

            <el-descriptions-item style="width: 180px">
              <template slot="label" ><i class="el-icon-s-custom"></i>性别要求</template>
              {{this.jobInfo.genderRequirement==='0'?'女':'男'}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>招聘人数</template>
              {{this.jobInfo.number}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>工作地点</template>
              {{this.jobInfo.location}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>发布时间</template>
              {{this.jobInfo.publishDate}}
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label"><i class="el-icon-s-custom"></i>收藏次数</template>
              {{this.jobInfo.collectNumber}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"><i class="el-icon-s-custom"></i>是否招满</template>
              {{this.jobInfo.isFull === 0 ? '招满' : '未招满'}}
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
  name: "Collect",
  beforeMount() {
    this.loadType()
    this.loadUnit()
    this.loadPost()
  },
  methods:{

    //收藏岗位
    collect(row){
      this.$axios({
        method:"get",
        url:this.$httpUrl+"/collect/saveOrMove?studentId="+this.user.id+"&jobId="+row.id
      }).then(resp =>{
        if(resp.data.code == 200){
          this.loadPost();
          if (row.favorite){
            this.$message({
              message:'取消收藏',
              type:'info'
            })
          }else{
            this.$message({
              message:'收藏成功',
              type:'success'
            })
          }
        }else{
          this.$message({
            message:'请求失败',
            type:'info'
          })
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
    formatType(row){
      let temp = this.TypeData.find(item=>{
        return item.id == row.typeId
      })

      return temp && temp.name
    },
    //查看岗位信息
    lookInfo(row){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job/listById?id='+row.id,
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.jobInfo = res.data.jobInfo
          this.jobTypeInfo = res.data.jobTypeInfo.name
          this.unitInfo = res.data.unitInfo.name
        }else{
          this.jobInfo = ''
          this.jobTypeInfo =''
          this.unitInfo =''
        }
      })

      this.jobDialogVisible = true

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
      this.addForm.salaryMax = ''
      this.$nextTick(()=>{
        this.resetAddForm()
      })


    },
    //点击修改
    modify(row){
      console.log(row)
      this.addDialogVisible = true
      this.$nextTick(()=>{
        this.addForm = row
      })

    },
    //单个删除
    deleteById(id){
      this.$confirm('是否取消收藏?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //用户点击确认按钮
        //发送ajax请求，添加数据
        this.$axios({
          method:"GET",
          url:this.$httpUrl+"/collect/deleteById?id="+id
        }).then(resp =>{
          if(resp.data.code == 200){
            this.loadPost();
            //弹出消息提示
            this.$message({
              message:'已取消收藏',
              type:'info'
            })
          }else {
            this.$message({
              message:'操作失败',
              type:'error'
            })
          }
        })
      })
    },
    //做修改
    doMod(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/job/update',
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
        url:this.$httpUrl+'/job/save',
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


    loadPost(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/collect/listCollect',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            name:this.name,
            location:this.area,
            unit:this.unit,
            salaryMin:this.salaryMin,
            salaryMax:this.salaryMax,
            userId:this.user.id+''

          }
        }
      }).then(res=>res.data).then(res=>{

        if(res.code == 200){

          this.tableData = res.data
          console.log(this.tableData)
          this.total = res.total

        }else{
          alert('获取数据失败')
        }
      })
    },
    //加载获取岗位类型名
    loadType(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job-type/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.TypeData = res.data

        }else{
          alert('获取数据失败')
        }
      })
    },
    //加载单位数据
    loadUnit(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/unit-information/listUnit',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.unitData = res.data
        }
      })
    },
    //搜索重置
    reset(){
      this.name = ''
      this.unit = ''
      this.gender = ''
      this.salaryMin = ''
      this.salaryMax = ''
      this.loadPost()
    },
    //重置添加或修改的表单
    resetAddForm() {
      this.$refs.addForm.resetFields();
      this.loadPost()
    },




  },
  data() {

    return {
      user: JSON.parse(sessionStorage.getItem('user')),
      userData: JSON.parse(sessionStorage.getItem('userData')),

      icon:false,

      options: regionDataPlus ,
      selectedOptions: [],
      jobDialogVisible:false,
      area:'',
      unitInfo:'',
      jobInfo:'',
      jobTypeInfo:'',
      resume:'',
      job:'',
      tableData: [],
      TypeData:[],
      pageNum:1,
      pageSize:20,
      total:0,
      name:'',
      salaryMin:'',
      salaryMax:'',
      unit:'',
      unitData:[],
      gender:'',
      status:'',
      addDialogVisible:false,
      addForm:{
        id:'',
        companyId:'',
        title:'',
        typeId:'',
        salaryMin:'',
        salaryMax:'',
        eduRequirement:'',
        genderRequirement:'',
        number:'',
        location:'',
        description:'',
        publishDate:'',
        collectNumber:'',
        isFull:'',
        status: '',
      },
      addRules: {
        title: [
          {required: true, message: '请输入岗位名称', trigger: 'blur'},
        ],
        typeId: [
          {required: true, message: '请输入岗位类型', trigger: 'blur'},
        ],
        eduRequirement: [
          {required: true, message: '请选择学历要求', trigger: 'blur'},
        ],
        number: [
          {required: true, message: '请输入招聘人数', trigger: 'blur'},
        ],
        description: [
          {required: true, message: '请输入岗位描述', trigger: 'blur'},
        ],

      },


    }

  }
}
</script>

<style scoped>

</style>