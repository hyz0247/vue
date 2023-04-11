<template>
  <div>
    <div style="background: white;padding: 5px;border-radius: 10px;border: 1px solid black;box-sizing: border-box">
      <!--搜索栏-->
      <div style="margin-bottom: 5px;">
        <el-input v-model="title"
                  placeholder="请输入名字"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="loadPost"
                  style="width: 150px"></el-input>
        <el-select v-model="unit" filterable placeholder="请选择单位" style="margin-left: 5px;width: 150px">
          <el-option
              v-for="item in unitData"
              :key="item.userId"
              :label="item.name"
              :value="item.userId">
          </el-option>
        </el-select>
        <el-button type="primary"
                   style="margin-left: 5px;margin-top: 10px;width: 100px;"
                   @click="loadPost">查询</el-button>
        <el-button type="success" @click="reset" style="margin-left: 5px;width: 100px;">重置</el-button>
        <el-button v-if="this.user.roleId ===3" type="primary" @click="add" style="margin-left: 5px;width: 100px;">新增</el-button>
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
        <el-table-column prop="companyId" label="单位" align="center" :formatter="formatUnit">
        </el-table-column>
        <el-table-column prop="title" label="题目" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="answer" label="答案" align="center">
          <template slot-scope="scope">
            <el-button @click="lookAnswer(scope.row)">查看答案</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center" >
          <template slot-scope="scope">
            <el-button  type="success" title="编辑"  icon="el-icon-edit" @click="modify(scope.row)"
                        v-if="user.roleId ===3 && scope.row.companyId === user.id " circle ></el-button>
            <el-button title="删除" type="danger" icon="el-icon-delete" @click="deleteById(scope.row.id)"
                       v-if="user.roleId ===3" circle></el-button>
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
          width="50%"
          center>
        <el-form ref="addForm"
                 :model="addForm"
                 :rules="addRules"
                 label-width="80px">
          <el-form-item label="题目" prop="title" style="width: 350px">
            <el-col :span="20"><el-input v-model="addForm.title" placeholder="请输入题目"></el-input></el-col>
          </el-form-item>
          <el-form-item label="内容" prop="description">
            <quill-editor class="editor"
                          style="height: 50%"
                          ref="myQuillEditor"
                          v-model="addForm.description"
                          :options="editorOption">
<!--                          @change="onEditorChange($event)"-->
<!--                          @blur="onEditorBlur($event)"-->
<!--                          @focus="onEditorFocus($event)"-->
<!--                          @ready="onEditorReady($event)"-->

            </quill-editor>
          </el-form-item>
          <el-form-item label="答案" prop="answer">
            <quill-editor class="editor"
                          style="height: 50%"
                          ref="myQuillEditor"
                          v-model="addForm.answer"
                          :options="editorOption">
              <!--                          @change="onEditorChange($event)"-->
              <!--                          @blur="onEditorBlur($event)"-->
              <!--                          @focus="onEditorFocus($event)"-->
              <!--                          @ready="onEditorReady($event)"-->
            </quill-editor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </el-dialog>

      <!--     题目详细信息-->
      <el-dialog
          title="题目"
          :visible.sync="questionDialogVisible"
          width="50%"
          center>
        <el-form ref="addForm"
                 :model="addForm"
                 :rules="addRules"
                 label-width="80px">
          <el-form-item label="内容" prop="title" style="width: 350px">
            <el-col :span="20"><el-input disabled v-model="addForm.title" placeholder="请输入内容"></el-input></el-col>
          </el-form-item>
          <el-form-item label="内容" prop="description">
            <quill-editor class="editor"
                          disabled
                          style="height: 50%"
                          ref="myQuillEditor"
                          v-model="addForm.description"
                          :options="editorOption">
              <!--                          @change="onEditorChange($event)"-->
              <!--                          @blur="onEditorBlur($event)"-->
              <!--                          @focus="onEditorFocus($event)"-->
              <!--                          @ready="onEditorReady($event)"-->

            </quill-editor>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--     查看详细答案-->
      <el-dialog
          title="参考答案"
          :visible.sync="answerDialogVisible"
          width="50%"
          center>
        <quill-editor class="editor"
                      style="height: 50%"
                      disabled
                      ref="myQuillEditor"
                      v-model="addForm.answer"
                      :options="editorOption">
        </quill-editor>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "QuestionList",
  components: {
    quillEditor
  },
  beforeMount() {
    this.loadUnit()
    this.loadPost()
  },
  methods:{


    lookAnswer(row){
      this.addForm.answer = row.answer
      //console.log(row.answer)
      // const parser = new DOMParser()
      // const dom = parser.parseFromString(row.answer, 'text/html')
      // const text = dom.body.textContent
      // this.answer = text
      // console.log(this.answer)
      this.answerDialogVisible = true
    },
    //查看学生信息
    lookInfo(row){

      this.addForm = row
      // this.questionInfo = row
      // const parser = new DOMParser()
      // const dom = parser.parseFromString(this.questionInfo.description, 'text/html')
      // const text = dom.body.textContent
      // //console.log(text)
      // this.questionInfo.description = text
      this.questionDialogVisible = true

    },
    save(){
      //console.log(this.addForm.description)
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
      //console.log(this.addForm)
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
          url:this.$httpUrl+"/company-written-tests/deleteById?id="+id
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
        url:this.$httpUrl+'/company-written-tests/update',
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
      this.$axios({
        method:'POST',
        url:this.$httpUrl+'/company-written-tests/save',
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


    formatUnit(row){
      let temp = this.unitData.find(item=>{
        return item.userId == row.companyId
      })

      return temp && temp.name
    },

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
        url:this.$httpUrl+'/company-written-tests/listQuestion',
        data: {
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:{
            title:this.title,
            unit:this.unit,
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
      this.title = ''
      this.unit = ''
      this.loadPost()
    },
    //重置添加或修改的表单
    resetAddForm() {
      this.$refs.addForm.resetFields();
      this.loadPost()
    },

    // // 失去焦点事件
    // onEditorBlur(quill) {
    //   console.log('editor blur!', quill)
    // },
    // // 获得焦点事件
    // onEditorFocus(quill) {
    //   console.log('editor focus!', quill)
    // },
    // // 准备富文本编辑器
    // onEditorReady(quill) {
    //   console.log('editor ready!', quill)
    // },
    // 内容改变事件
    // onEditorChange({ quill, html, text }) {
    //   //console.log('editor change!', quill, html, text)
    //   //this.addForm.description = html
    //   //console.log(html)
    // },



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
        placeholder: '请输入正文'
      },


      user: JSON.parse(sessionStorage.getItem('user')),
      userData: JSON.parse(sessionStorage.getItem('userData')),

      univInfo:'',
      resume:'',
      job:'',
      questionInfo:[],
      tableData: [],
      pageNum:1,
      pageSize:20,
      total:0,
      title:'',
      unit:'',
      unitData:[],
      status:'',
      answer:'',
      answerDialogVisible:false,
      questionDialogVisible:false,
      addDialogVisible:false,
      addForm:{
        id:'',
        companyId:'',
        title:'',
        description:'',
        createTime: '',
        answer:''
      },
      addRules: {
        title: [
          {required: true, message: '请输入题目', trigger: 'blur'},
        ],
        description: [
          {required: true, message: '请输入内容', trigger: 'blur'},
        ],
        answer: [
          {required: true, message: '请输入答案', trigger: 'blur'},
        ],
      },


    }

  }
}
</script>

<style scoped>

</style>