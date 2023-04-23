<template>
  <div >
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
            :options="searchOptions"
            v-model="searchSelectedOptions"
            @change="handleChange">
        </el-cascader>
        <el-button type="primary"
                   style="margin-left: 5px;width: 100px;height: 32px"
                   @click="loadPost">查询</el-button>
        <el-button type="success" @click="reset" style="margin-left: 5px;width: 100px;height: 32px">重置</el-button>
        <el-button v-if="this.user.roleId ===3" type="primary" @click="add" style="margin-left: 5px;width: 100px;height: 32px">新增</el-button>
      </div>
      <!--数据表格-->
      <el-table :data="tableData"
                style="width: 100%;font-size: 15px;border-radius: 5px;margin-top: 10px"
                :header-cell-style="{background: 'lightblue' ,color: '#555555' }">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column prop="favorite" label="收藏" align="center" width="55" v-if="user.roleId === 1">
          <template slot-scope="scope">
            <el-button :icon="scope.row.favorite?'el-icon-star-on':'el-icon-star-off'"
                       type="text" @click="collect(scope.row)"
                        style="align-items: center" v-if="user.roleId===1"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="岗位名称" align="center">
        </el-table-column>
        <el-table-column prop="typeId" label="类型" align="center" :formatter="formatAllType">
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
        <el-table-column prop="publishDate" label="发布时间" width="200px" align="center">
        </el-table-column>
        <el-table-column prop="isFull" label="是否招满" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isFull === 1 ? 'primary' : 'danger'">
              {{scope.row.isFull === 0 ? '招满' : '未招满'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button  type="success" title="编辑"  icon="el-icon-edit" @click="modify(scope.row)"
                        v-if="user.roleId ===3" circle ></el-button>
            <el-button title="删除" type="danger" icon="el-icon-delete" @click="deleteById(scope.row.id)"
                       v-if="user.roleId ===3" circle></el-button>
            <el-button  type="primary" @click="lookInfo(scope.row)" style="width: 54px;height: 30px;align-items: center">查看</el-button>
            <el-button  type="primary" @click="apply(scope.row)"
                        style="width: 54px;height: 30px;align-items: center" v-if="user.roleId===1 && scope.row.isFull ==1">应聘</el-button>
            <el-button  type="primary" @click="comment(scope.row)"
                        style="width: 54px;height: 30px;align-items: center" v-if="user.roleId===1">评论</el-button>
            <el-button  type="primary" @click="consult(scope.row)"
                        style="width: 54px;height: 30px;align-items: center" v-if="user.roleId===1">咨询</el-button>

          </template>
        </el-table-column>
      </el-table>

      <!--分页条    -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 12, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

      <!--新增或修改对话框  -->
      <el-dialog
          title="新增或修改"
          :visible.sync="addDialogVisible"
          width="40%"
          center>
        <el-form ref="addForm"
                 :model="addForm"
                 :rules="addRules"
                 label-width="80px">
          <el-form-item label="岗位名称" prop="title">
            <el-col :span="20"><el-input v-model="addForm.title" style="width: 200px"></el-input></el-col>
          </el-form-item>
          <el-form-item label="岗位类型" prop="typeId">
            <el-select v-model="addForm.typeId" filterable placeholder="请选择岗位类型" style="width: 150px">
              <el-option
                  v-for="item in TypeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="薪资" prop="salaryMin">
            <el-col :span="20">
              <el-input v-model="addForm.salaryMin" style="width: 50px"></el-input>
              <span>--</span>
              <el-input v-model="addForm.salaryMax" style="width: 50px"></el-input>
              <span style="margin-left: 5px">k</span>
            </el-col>
          </el-form-item>
          <el-form-item label="性别要求" prop="genderRequirement">
          <el-radio-group v-model="addForm.genderRequirement" >
            <el-radio  label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
            <el-radio :label=null>无</el-radio>
          </el-radio-group>
          </el-form-item>
          <el-form-item label="学历" prop="eduRequirement">
            <el-select v-model="addForm.eduRequirement" placeholder="请选择学历">
              <el-option label="专科" value="0"></el-option>
              <el-option label="本科" value="1"></el-option>
              <el-option label="硕士及以上" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="招聘人数" prop="number">
            <el-input v-model="addForm.number" style="width: 50px"></el-input>
          </el-form-item>
          <el-form-item label="工作地点" prop="location">
            <el-row>
              <el-cascader
                  style="width: 300px"
                  size="large"
                  filterable
                  :props="{ expandTrigger: 'hover' }"
                  placeholder="请选择省/市/县 + 详细地址------>"
                  :options="options"
                  v-model="selectedOptions"
                  @change="handleAddChange">
              </el-cascader>
              <el-input placeholder="详细地址" v-model="addForm.location" style="width:500px;" clearable></el-input>
            </el-row>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="addForm.status"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="岗位描述" prop="description">
            <el-input type="textarea" v-model="addForm.description" style="width: 400px"></el-input>
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
        <label style="margin-left: 385px;font-size: 30px">学生信息</label>
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

      <!--评论对话框  -->
      <el-dialog
          title="发表评论"
          :visible.sync="commentDialogVisible"
          width="40%"
          center>
        <el-form ref="commentForm"
                 :model="commentForm"
                 :rules="commentRules"
                 label-width="80px">
          <el-form-item label="评论内容" prop="content">
            <quill-editor class="editor"
                          ref="myQuillEditor"
                          v-model="commentForm.content"
                          :options="editorOption">
            </quill-editor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="subComment">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {CodeToText, regionDataPlus} from "element-china-area-data";
import {quillEditor} from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "Position",
  components: {
    quillEditor
  },
  // beforeMount() {
  //   this.loadPost()
  //   this.loadType()
  //   this.loadUnit()
  // },
  mounted() {
    this.loadPost()
    this.loadType()
    this.loadUnit()
    this.loadAllType()
  },
  methods:{

    subComment(){
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/comment/save',
        data: this.commentForm
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.$message({
            message: '评论成功',
            type: 'success'
          });

          this.commentDialogVisible = false
          this.loadPost()
          this.$refs.commentForm.resetFields();

        }else{
          this.$message({
            message: '评论失败',
            type: 'error'
          });
        }
      })
    },

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
    //咨询聊天
    consult(row){
      this.$axios.get(this.$httpUrl+'/user/listById?userId='+row.companyId).then(res=>res.data).then(res=>{
        this.$router.push({
          name:'我的私信',
          params:{
            username:res.data.username
          }
        })
      })

    },

    //评论岗位
    comment(row){
      this.commentForm.userId = this.user.id
      this.commentForm.jobId = row.id
      this.commentDialogVisible = true
      //console.log(this.commentForm)

    },
    //应聘岗位
    apply(row){
      if(this.userData.resume == null){
        this.$message({
          message:'请先完善个人信息及个人简历',
          type:'info'
        })
      }else{
        this.$confirm('是否应聘该岗位?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          //用户点击确认按钮
          //发送ajax请求，添加数据
          this.$axios({
            method:"get",
            url:this.$httpUrl+"/application/saveOrUpdate?studentId="+this.user.id+"&jobId="+row.id
          }).then(resp =>{
            if(resp.data.code == 200){
              this.loadPost();
              //弹出消息提示
              this.$message({
                message:'操作成功,请在记录表中查看状态',
                type:'success'
              })
            }else{
              this.$message({
                message:'你已应聘过该岗位,请勿再点击',
                type:'info'
              })
            }
          })
        })
      }

    },
    handleAddChange(){
      var loc = "";
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]];
      }
      this.addArea = loc
      let i = this.addArea.indexOf('全部',0)
      if (i>0){
        this.addArea = this.addArea.substring(0,i)
      }
      if(loc == "全部"){
        this.addArea = ''
      }
    },
    handleChange () {
      var loc = "";
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]];
      }
      this.area = loc
      let i = this.area.indexOf('全部',0)
      if (i>0){
        this.area = this.area.substring(0,i)
      }
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
    formatAllType(row){
      let temp = this.allTypeData.find(item=>{
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
      //console.log(row)
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
          url:this.$httpUrl+"/job/deleteById?id="+id
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
      this.addForm.companyId = this.user.id
      this.addForm.location = this.addArea + this.addForm.location
      this.addForm.isFull = 1
      //console.log(this.addForm)
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
        url:this.$httpUrl+'/job/listPage',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            name:this.name,
            location:this.area,
            unit:this.unit+'',
            salaryMin:this.salaryMin,
            salaryMax:this.salaryMax,
            roleId: this.user.roleId+'',
            userId:this.user.id+''

          }
        }
      }).then(res=>res.data).then(res=>{

        if(res.code == 200){

          this.tableData = res.data
          //console.log(this.tableData)
          this.total = res.total

        }else{
          alert('获取数据失败')
        }
      })
    },
    //加载获取岗位类型名
    loadAllType(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job-type/list',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){

          this.allTypeData = res.data

        }else{
          alert('获取数据失败')
        }
      })
    },
    loadType(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job-type/listTypeParent',
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
        placeholder: '评论一下吧~~'
      },
      user: JSON.parse(sessionStorage.getItem('user')),
      userData: JSON.parse(sessionStorage.getItem('userData')),

      icon:false,

      options: regionDataPlus ,
      searchOptions:regionDataPlus,
      selectedOptions: [],
      searchSelectedOptions:[],
      jobDialogVisible:false,
      area:'',
      addArea:'',
      unitInfo:'',
      jobInfo:'',
      jobTypeInfo:'',
      resume:'',
      job:'',
      tableData: [],
      TypeData:[],
      allTypeData:[],
      pageNum:1,
      pageSize:12,
      total:0,
      name:'',
      salaryMin:'',
      salaryMax:'',
      unit:'',
      unitData:[],
      gender:'',
      status:'',
      addDialogVisible:false,
      commentDialogVisible:false,
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
        collectNumber:0,
        isFull:1,
        status: '',
      },
      commentForm:{
        id:"",
        userId:'',
        content:'',
        jobId:'',
        createTime:''
      },
      commentRules:{
        content: [
          {required: true, message: '请输入评论内容', trigger: 'blur'},
        ],
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