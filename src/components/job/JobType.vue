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
        <el-table-column
            type="index"
            label="编号"
            width="70">
        </el-table-column>
        <el-table-column prop="name" label="岗位类型名称" align="center">
        </el-table-column>
        <el-table-column prop="jobParent" label="上级岗位" align="center" :formatter="formatType">
        </el-table-column>
        <el-table-column prop="description" label="岗位类型描述" align="center">
        </el-table-column>
<!--        <el-table-column prop="gender" label="性别" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-tag :type="scope.row.gender === '1' ? 'primary' : 'danger'">-->
<!--              <i :class="scope.row.gender === '1'?'el-icon-male':(scope.row.gender === '1' ?'el-icon-female':'')">-->
<!--              </i>{{scope.row.gender === '1'?"男":(scope.row.gender === '1' ?"女":'')}}</el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="operate" label="操作" align="center" >
          <template slot-scope="scope">
            <el-button  type="success" title="编辑"  icon="el-icon-edit" @click="modify(scope.row)"
                        v-if="(user.roleId ===0) || (user.roleId ===2)" circle ></el-button>
            <el-button title="删除" type="danger" icon="el-icon-delete" @click="deleteById(scope.row.id)"
                       v-if="(user.roleId ===0) || (user.roleId ===2)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页条    -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 15, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

      <!--修改对话框  -->
      <el-dialog
          title="修改"
          :visible.sync="modDialogVisible"
          width="30%"
          center>
        <el-form ref="modForm"
                 :model="modForm"
                 :rules="modRules"
                 label-width="80px">
          <el-form-item label="上级岗位" prop="jobParent" v-if="modForm.jobParent != null">
            <el-select v-model="modForm.jobParent"
                       style="margin-left: 5px;width: 150px">
              <el-option
                  v-for="item in typeParent"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位名称" prop="name">
            <el-col :span="20"><el-input v-model="modForm.name"></el-input></el-col>
          </el-form-item>
          <el-form-item label="岗位描述" prop="description">
            <el-col :span="20"><el-input v-model="modForm.description"></el-input></el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="modDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doMod">确 定</el-button>
        </span>
      </el-dialog>

      <!--新增对话框  -->
      <el-dialog
          title="新增"
          :visible.sync="addDialogVisible"
          width="30%"
          center>
        <el-form ref="addForm"
                 :model="addForm"
                 :rules="addRules"
                 label-width="80px">
          <el-form-item label="上级岗位" prop="jobParent">
            <el-select v-model="addForm.jobParent"
                       style="margin-left: 5px;width: 150px">
              <el-option
                  v-for="item in typeParent"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位名称" prop="name">
            <el-col :span="20"><el-input v-model="addForm.name"></el-input></el-col>
          </el-form-item>
          <el-form-item label="岗位描述" prop="description">
            <el-col :span="20"><el-input v-model="addForm.description"></el-input></el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: "JobType",
  beforeMount() {
    this.loadTypeParent()
    this.loadPost()
    this.loadType()
  },
  methods:{

    loadTypeParent(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job-type/listTypeParent',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          //console.log(res.data)
          this.typeParent = res.data
          //console.log(this.typeParent)
        }else{
          alert('获取数据失败')
        }
      })
    },

    formatType(row){
      if (row.jobParent != null){
        let temp = this.typeData.find(item=>{
          return item.id == row.jobParent
        })

        return temp && temp.name
      } else return '无'

    },

    //点击添加
    add(){
      this.addDialogVisible = true
      // this.$nextTick(()=>{
      //   this.resetmodForm()
      // })


    },
    //点击修改
    modify(row){
      this.modDialogVisible = true
      this.modForm = row
      this.$nextTick(()=>{
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
          url:this.$httpUrl+"/job-type/deleteById?id="+id
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
        url:this.$httpUrl+'/job-type/update',
        data: this.modForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.$message({
            message: '修改成功',
            type: 'success'
          });

          this.modDialogVisible = false
          this.loadPost()
          this.resetModForm()

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
        url:this.$httpUrl+'/job-type/save',
        data: this.addForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.$message({
            message: '添加成功',
            type: 'success'
          });

          this.addDialogVisible = false
          this.resetAddForm()
          this.loadPost()

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

    handleChange(){
    },

    //加载获取岗位类型名
    loadType(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job-type/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.typeData = res.data

        }else{
          alert('获取数据失败')
        }
      })
    },

    loadPost(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/job-type/listPage',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            name:this.name,
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
      this.loadPost()
    },
    //重置添加或修改的表单
    resetModForm() {
      this.$refs.modForm.resetFields();
      this.loadPost()
    },
    resetAddForm() {
      this.$refs.addForm.resetFields();
      this.loadPost()
    },


  },
  data() {

    return {
      user: JSON.parse(sessionStorage.getItem('user')),
      userData: JSON.parse(sessionStorage.getItem('userData')),

      typeParent:[],
      univInfo:'',
      resume:'',
      job:'',
      typeData:[],
      studentInfo:[],
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,
      name:'',
      addDialogVisible:false,
      modDialogVisible:false,
      modForm:{
        id:'',
        name:'',
        jobParent:'',
        description: '',
      },
      addForm:{
        id:'',
        name:'',
        jobParent:'',
        description: '',
      },
      modRules: {
        name: [
          {required: true, message: '请输入岗位名称', trigger: 'blur'},
        ],
        description: [
          {required: true, message: '请输入岗位描述', trigger: 'blur'},
        ],
      },
      addRules: {
        name: [
          {required: true, message: '请输入岗位名称', trigger: 'blur'},
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