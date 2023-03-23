<template>
  <div>
    <!--    学生信息表-->
    <el-form v-if="user.roleId === 1" :model="studentInfoForm" :rules="studentInfoRules" ref="studentInfoForm" label-width="150px">
    <el-form-item label="身份" prop="role">
      <el-tag type="success" disable-transitions>学生</el-tag>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="studentInfoForm.username" disabled style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="studentInfoForm.name" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="studentInfoForm.phone" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="studentInfoForm.email" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="studentInfoForm.gender" >
        <el-radio  label="1">男</el-radio>
        <el-radio label="0">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="所在学校" prop="university">
      <el-input v-model="studentInfoForm.university" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="专业" prop="major">
      <el-input v-model="studentInfoForm.major" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="出生日期" required>
      <el-col :span="11">
        <el-form-item prop="birthday">
          <el-date-picker type="date" placeholder="选择日期" v-model="studentInfoForm.birthday" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="毕业年份" required>
      <el-col :span="11">
        <el-form-item prop="graduationYear">
          <el-date-picker type="year" placeholder="选择日期" v-model="studentInfoForm.graduationYear" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="学历" prop="level">
      <el-select v-model="studentInfoForm.level" placeholder="请选择学历">
        <el-option label="专科" value="0"></el-option>
        <el-option label="本科" value="1"></el-option>
        <el-option label="硕士及以上" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="个人经历/个人简介" prop="introduce">
      <el-input type="textarea" v-model="studentInfoForm.introduce"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(1)">修改</el-button>
    </el-form-item>
  </el-form>

    <!--    管理员信息表-->
    <el-form v-if="user.roleId === 0" :model="adminInfoForm" :rules="adminInfoRules" ref="studentInfoForm" label-width="150px">
    <el-form-item label="身份" prop="role">
      <el-tag type="success" disable-transitions>管理员</el-tag>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="adminInfoForm.username" disabled style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="adminInfoForm.name" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="adminInfoForm.phone" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="adminInfoForm.email" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(0)">修改</el-button>
    </el-form-item>
  </el-form>

    <!--    学校信息表-->
    <el-form v-if="user.roleId === 2" :model="universityInfoForm" :rules="universityRules" ref="studentInfoForm" label-width="150px">
      <el-form-item label="身份" prop="role">
        <el-tag type="success" disable-transitions>学校/学院</el-tag>
      </el-form-item>
      <el-form-item label="logo" prop="upload">
        <el-upload
            style="width: 85px;height: 85px;border-radius: 50%; margin:0px 80px;box-sizing: border-box;background-size:cover"
            class="avatar-uploader"
            action="http://localhost:8082/user/toUploadAvatar"
            :show-file-list="false"
            accept=".jpg,.png,.gif"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="universityInfoForm.logo" :src="universityInfoForm.logo" class="avatar" title="更换头像" style="width: 80px;height: 80px">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="universityInfoForm.username" disabled style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="universityInfoForm.name" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-row>
        <el-cascader
            style="width: 300px"
            size="large"
            placeholder="请选择省/市/县 + 详细地址------>"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
        </el-cascader>
        <el-input placeholder="详细地址" v-model="universityInfoForm.address" style="width:400px; margin-left: 10px" clearable></el-input>
        </el-row>
      </el-form-item>
      <el-form-item label="电话" prop="contactName">
        <el-input v-model="universityInfoForm.contactName" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="contactPhone">
        <el-input v-model="universityInfoForm.contactPhone" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="universityInfoForm.email" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="学校描述" prop="description">
        <el-input type="textarea" v-model="universityInfoForm.description" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="学校网站地址" prop="website">
        <el-input v-model="universityInfoForm.website" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(2)">修改</el-button>
      </el-form-item>
    </el-form>

    <!--    单位信息表-->
    <el-form v-if="user.roleId === 3" :model="unitInfoForm" :rules="unitRules" ref="studentInfoForm" label-width="150px">
      <el-form-item label="身份" prop="role">
        <el-tag type="success" disable-transitions>单位</el-tag>
      </el-form-item>
      <el-form-item label="logo">
        <el-upload
            style="width: 85px;height: 85px;border-radius: 50%; margin:0px 80px;box-sizing: border-box;background-size:cover"
            class="avatar-uploader"
            action="http://localhost:8082/user/toUploadAvatar"
            :show-file-list="false"
            accept=".jpg,.png,.gif"
            :on-success="handleAvatarSuccessUnit"
            :before-upload="beforeAvatarUpload">
          <img v-if="unitInfoForm.logo" :src="unitInfoForm.logo" class="avatar" title="更换头像" style="width: 80px;height: 80px">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="unitInfoForm.username" disabled style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="单位名称" prop="name">
        <el-input v-model="unitInfoForm.name" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="联系人名字" prop="contactName">
        <el-input v-model="unitInfoForm.contactName"  style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactPhone">
        <el-input v-model="unitInfoForm.contactPhone" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="unitInfoForm.email" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-row>
          <el-cascader
              style="width: 300px"
              size="large"
              placeholder="请选择省/市/县 + 详细地址------>"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange">
          </el-cascader>
          <el-input placeholder="详细地址" v-model="unitInfoForm.address" style="width:400px; margin-left: 10px" clearable></el-input>
        </el-row>
      </el-form-item>
      <el-form-item label="单位描述" prop="description">
        <el-input type="textarea" v-model="unitInfoForm.description"></el-input>
      </el-form-item>
      <el-form-item label="单位网站地址" prop="website">
        <el-input v-model="unitInfoForm.website" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(3)">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
import {CodeToText} from "element-china-area-data/dist/app";
export default {
  name: "PersonInformation",

  mounted() {
    switch (this.user.roleId){
      case 0: this.adminInfoForm = this.userData
        this.adminInfoForm.username = this.user.username
        this.adminInfoForm.userId = this.user.id
        break;
      case 1:this.studentInfoForm = this.userData
        this.studentInfoForm.username = this.user.username
        this.studentInfoForm.userId = this.user.id
        break;
      case 2:this.universityInfoForm = this.userData
        this.universityInfoForm.username = this.user.username
        this.universityInfoForm.userId = this.user.id
        break;
      case 3:this.unitInfoForm = this.userData
        this.unitInfoForm.username = this.user.username
          this.unitInfoForm.userId = this.user.id
        break;
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'))
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
  },
  data(){
    return{
      options: regionData ,
      selectedOptions: [],
      user:'',
      userData:'',
      area:'',
      //学生信息表
      studentInfoForm: {
        id:'',
        role:'',
        username: "",
        name: '',
        phone: '',
        email: '',
        gender: '',
        university: '',
        major: '',
        birthday: '',
        graduationYear:'',
        level:'',
        introduce:''
      },
      //学生信息表校验
      studentInfoRules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        phone: [
          {required: true, message: '请输入电话', trigger: 'blur' }
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        university: [
          { required: true, message: '请输入您的学校', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请输入您的专业', trigger: 'blur' }
        ],
        birthday: [
          { type:'date', required: true, message: '请选择出生日期', trigger: 'change' }
        ],
        graduationYear: [
          { type:'year', required: true, message: '请选择毕业年份', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请填写个人介绍/个人经历', trigger: 'blur' }
        ]
      },
      //管理员信息表
      adminInfoForm:{
        id:'',
        role:'',
        username:"",
        name:'',
        phone:'',
        email:''
      },
      //管理员信息表校验
      adminInfoRules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          {required: true, message: '请输入电话', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' }
        ],

      },
      //学校信息表
      universityInfoForm:{
        id:'',
        role:'',
        userId:'',
        username:'',
        name:'',
        address:'',
        email:'',
        contactName:'',
        contactPhone:'',
        description:'',
        logo:'',
        website:'',


      },
      //学校信息表校验
      universityRules:{
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        // address: [
        //   {required: true, message: '请输入地址', trigger: 'change' }
        // ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人名字', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        description: [
          {required: true, message: '请输入单位描述', trigger: 'blur' }
        ],
        website: [
          {required: true, message: '请输入单位网站', trigger: 'blur' }
        ],
      },
      //单位信息表
      unitInfoForm:{
        id:'',
        role:'',
        userId:'',
        username:'',
        name:'',
        address:'',
        email:'',
        contactName:'',
        contactPhone:'',
        description:'',
        logo:'',
        website:'',

      },
      //单位信息表校验
      unitRules:{
        name: [
          { required: true, message: '请输入单位名字', trigger: 'blur' }
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人名字', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        description: [
          {required: true, message: '请输入单位描述', trigger: 'blur' }
        ],
        website: [
          {required: true, message: '请输入单位网站', trigger: 'blur' }
        ],
      },

    };
  },
  methods: {
    handleChange () {
      var loc = "";
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]];
      }

      this.area = loc


    },
    //提交修改信息
    submitForm(roleId) {
      switch (roleId){
        //管理员
        case 0:
            this.$axios({
            method:'POST',
            url:this.$httpUrl+'/user/modifyAdmin',
            data: this.adminInfoForm
          }).then(res=>res.data).then(res=>{
            if(res.code == 200){

                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                  sessionStorage.setItem("userData",JSON.stringify(res.data))
            }else{
                this.$message({
                  message: '修改失败',
                  type: 'error'
                });
            }
          })
              break;
          //学生
        case 1:
            this.$axios({
              method:'POST',
              url:this.$httpUrl+'/user/modifyStudent',
              data: this.studentInfoForm
            }).then(res=>res.data).then(res=>{
              if(res.code == 200){

                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                sessionStorage.setItem("userData",JSON.stringify(res.data))
              }else{
                this.$message({
                  message: '修改失败',
                  type: 'error'
                });
              }
            })
            break;
          //学校
        case 2:
          this.universityInfoForm.address = this.area + this.universityInfoForm.address
            this.$axios({
              method:'POST',
              url:this.$httpUrl+'/user/modifyUniversity',
              data: this.universityInfoForm
            }).then(res=>res.data).then(res=>{
              if(res.code == 200){

                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                sessionStorage.setItem("userData",JSON.stringify(res.data))
              }else{
                this.$message({
                  message: '修改失败',
                  type: 'error'
                });
              }
            })
            break;
          //单位
        case 3:
          this.unitInfoForm.address = this.area + this.unitInfoForm.address
          console.log(this.unitInfoForm)
          this.$axios({
            method:'POST',
            url:this.$httpUrl+'/user/modifyUnit',
            data: this.unitInfoForm
          }).then(res=>res.data).then(res=>{
            if(res.code == 200){


              this.$message({
                message: '修改成功',
                type: 'success'
              });
              sessionStorage.setItem("userData",JSON.stringify(res.data))
            }else{
              this.$message({
                message: '修改失败',
                type: 'error'
              });
            }
          })
          break;



      }
    },

    //处理上传头像成功后
    handleAvatarSuccess(res, file) {
      this.universityInfoForm.logo = URL.createObjectURL(file.raw);
      this.universityInfoForm.logo = res.imgUrl
    },
    handleAvatarSuccessUnit(res, file) {
      this.unitInfoForm.logo = URL.createObjectURL(file.raw);
      this.unitInfoForm.logo = res.imgUrl
    },

    beforeAvatarUpload(file) {
      //在头像上传之前需要做的判断，如判断文件格式
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
    },



  }
}
</script>

<style scoped>


</style>