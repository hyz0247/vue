<template>
  <div>
    <!--    学生信息表-->
    <el-form v-if="user.roleId === 1" :model="studentInfoForm"
             :rules="studentInfoRules" ref="studentInfoForm" label-width="150px">
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
      <el-select v-model="studentInfoForm.universityId" placeholder="请选择您所在的学校" filterable style="width: 200px">
        <el-option
            v-for="item in universityData"
            :key="item.userId"
            :label="item.name"
            :value="item.userId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="专业" prop="major">
      <el-input v-model="studentInfoForm.major" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="出生日期" required>
        <el-form-item prop="birthday">
          <el-date-picker value-format='yyyy-MM-dd' type="date" placeholder="选择日期" v-model="studentInfoForm.birthday" style="width: 300px"></el-date-picker>
        </el-form-item>
    </el-form-item>
    <el-form-item label="毕业年份" required>
        <el-form-item prop="graduationYear">
          <el-date-picker value-format='yyyy' type="year" placeholder="选择日期" v-model="studentInfoForm.graduationYear" style="width: 300px"></el-date-picker>
        </el-form-item>
    </el-form-item>
    <el-form-item label="学历" prop="level">
      <el-select v-model="studentInfoForm.level" placeholder="请选择学历">
        <el-option label="专科" value="0"></el-option>
        <el-option label="本科" value="1"></el-option>
        <el-option label="硕士及以上" value="2"></el-option>
      </el-select>
    </el-form-item>
      <el-form-item label="工作意向">
        <el-row>
          <el-cascader
              style="width: 150px"
              v-model="studentInfoForm.job1Id"
              :options="jobTypeoptions"
              :show-all-levels="false"
              placeholder="工作意向1"
              clearable
              filterable
              :props="{ expandTrigger: 'hover',emitPath: false }">
          </el-cascader>
          <el-cascader
              style="width: 150px;margin-left: 5px"
              v-model="studentInfoForm.job2Id"
              :options="jobTypeoptions"
              :show-all-levels="false"
              placeholder="工作意向2"
              clearable
              filterable
              :props="{ expandTrigger: 'hover',emitPath: false }">
          </el-cascader>
          <el-cascader
              style="width: 150px;margin-left: 5px"
              v-model="studentInfoForm.job3Id"
              :options="jobTypeoptions"
              :show-all-levels="false"
              placeholder="工作意向3"
              clearable
              filterable
              :props="{ expandTrigger: 'hover',emitPath: false }">
          </el-cascader>
        </el-row>
      </el-form-item>
      <el-form-item label="个人简历" prop="resume">
        <el-upload
            :limit="1"
            :on-change="handleChangeFile"
            :on-success="handleSuccess"
            accept=".doc,.docx"
            action="http://localhost:8082/user/toUploadFile"
            v-model="studentInfoForm.resume">
          <div><i class="el-icon-upload" /> 添加文件</div>
          <div slot="tip" class="el-upload__tip">可上传文件不超过10M</div>
        </el-upload>
<!--        <el-button type="primary" @click="upload">确认上传</el-button>-->
      </el-form-item>
    <el-form-item label="个人经历/个人简介" prop="introduce">
      <el-input type="textarea" v-model="studentInfoForm.introduce" style="width: 400px"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(1)">修改</el-button>
    </el-form-item>
  </el-form>

    <!--    管理员信息表-->
    <el-form v-if="user.roleId === 0" :model="adminInfoForm"
             :rules="adminInfoRules" ref="studentInfoForm" label-width="150px">
    <el-form-item label="身份" prop="role">
      <el-tag type="success" disable-transitions>管理员</el-tag>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="adminInfoForm.username" style="width: 300px"></el-input>
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
    <el-form v-if="user.roleId === 2 && !user.affiliation"
             :model="universityInfoForm"
             :rules="universityRules" ref="studentInfoForm" label-width="150px">
      <el-form-item label="身份" prop="role">
        <el-tag type="success" disable-transitions>学校</el-tag>
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
          <img v-if="imgUniv" :src="imgUniv" class="avatar" title="更换头像" style="width: 80px;height: 80px">
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

    <!--    二级学院信息表-->
    <el-form v-if="user.roleId === 2 && user.affiliation"
             :model="universityInfoForm" :rules="universityRules"
             ref="studentInfoForm" label-width="150px">
      <el-form-item label="身份" prop="role">
        <el-tag type="success" disable-transitions>二级学院</el-tag>
      </el-form-item>
      <el-form-item label="logo">
        <el-upload
            style="width: 85px;height: 85px;border-radius: 50%; margin:0px 80px;box-sizing: border-box;background-size:cover"
            class="avatar-uploader"
            action="http://localhost:8082/user/toUploadAvatar"
            :show-file-list="false"
            accept=".jpg,.png,.gif"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="imgUniv" :src="imgUniv" class="avatar" title="更换头像" style="width: 80px;height: 80px">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="universityInfoForm.username" disabled style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="学院名称" prop="name">
        <el-input v-model="universityInfoForm.name" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="联系人名字" prop="contactName">
        <el-input v-model="universityInfoForm.contactName"  style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactPhone">
        <el-input v-model="universityInfoForm.contactPhone" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="universityInfoForm.email" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="学院描述" prop="description">
        <el-input type="textarea" v-model="universityInfoForm.description" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="学院网站地址" prop="website">
        <el-input v-model="universityInfoForm.website" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(2)">提交</el-button>
      </el-form-item>
    </el-form>

    <!--    单位信息表-->
    <el-form v-if="user.roleId === 3 && !user.affiliation"
             :model="unitInfoForm" :rules="unitRules" ref="studentInfoForm" label-width="150px">
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
          <img v-if="imgUnit" :src="imgUnit" class="avatar" title="更换头像" style="width: 80px;height: 80px">
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
          <el-input placeholder="详细地址" v-model="unitInfoForm.address" style="width:500px; margin-left: 10px" clearable></el-input>
        </el-row>
      </el-form-item>
      <el-form-item label="单位描述" prop="description" >
        <el-input type="textarea" v-model="unitInfoForm.description" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="单位网站地址" prop="website">
        <el-input v-model="unitInfoForm.website" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(3)">修改</el-button>
      </el-form-item>
    </el-form>

    <!--    单位附属信息表-->
    <el-form v-if="user.roleId === 3 && user.affiliation"
             :model="unitInfoForm" :rules="unitRules" ref="studentInfoForm" label-width="150px">
      <el-form-item label="身份" prop="role">
        <el-tag type="success" disable-transitions>单位</el-tag>
      </el-form-item>
      <el-form-item label="logo">
        <el-upload
            style="width: 85px;height: 85px;border-radius: 50%; margin:0px 80px;box-sizing: border-box;background-size:cover"
            class="avatar-uploader"
            action="http://localhost:8082/user/toUploadAvatar"
            :show-file-list="false"
            disabled
            accept=".jpg,.png,.gif"
            :on-success="handleAvatarSuccessUnit"
            :before-upload="beforeAvatarUpload">
          <img v-if="imgUnit" :src="imgUnit" class="avatar" title="更换头像" style="width: 80px;height: 80px">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="unitInfoForm.username" disabled style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="单位名称" prop="name">
        <el-input v-model="unitInfoForm.name" disabled style="width: 300px"></el-input>
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
              disabled
              placeholder="请选择省/市/县 + 详细地址------>"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange">
          </el-cascader>
          <el-input placeholder="详细地址" v-model="unitInfoForm.address" style="width:500px; margin-left: 10px" disabled clearable></el-input>
        </el-row>
      </el-form-item>
      <el-form-item label="单位描述" prop="description">
        <el-input disabled type="textarea" v-model="unitInfoForm.description" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="单位网站地址" prop="website">
        <el-input disabled v-model="unitInfoForm.website" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(3)">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data';
import {CodeToText} from "element-china-area-data/dist/app";
export default {
  name: "PersonInformation",


  beforeMount() {
    this.loadUniversity()
    this.loadJobType()
  },
  mounted() {
    switch (this.user.roleId){
      case 0: this.adminInfoForm = this.userData
        this.adminInfoForm.username = this.user.username
        this.adminInfoForm.userId = this.user.id
        break;
      case 1:this.studentInfoForm = this.userData
        this.studentInfoForm.username = this.user.username
        this.studentInfoForm.studentId = this.user.id
        break;
      case 2:
        if (!this.user.affiliation){
          this.universityInfoForm = this.userData
          this.universityInfoForm.username = this.user.username
          this.universityInfoForm.userId = this.user.id
          this.imgUniv = this.userData.logo
        }else {
          if (!this.userData){
            this.$axios({
              method:'GET',
              url:this.$httpUrl+'/university-information/listById?user_id='+this.user.affiliation,
            }).then(res=>res.data).then(res=>{
              if(res.code == 200){
                this.universityInfoForm = res.data
                this.imgUnit = res.data.unitInfo.logo
                this.universityInfoForm.username = this.user.username
                this.universityInfoForm.userId = this.user.id
                this.universityInfoForm.id = null
                this.universityInfoForm.contactPhone = ''
                this.universityInfoForm.contactName = ''
                this.universityInfoForm.name = ''
              }
            })
          }else {
            this.universityInfoForm = this.userData
            this.universityInfoForm.username = this.user.username
            this.universityInfoForm.userId = this.user.id
            this.imgUniv = this.userData.logo

          }
        }

        break;
      case 3:
        if(!this.user.affiliation){
          this.unitInfoForm = this.userData
          this.unitInfoForm.username = this.user.username
          this.unitInfoForm.userId = this.user.id
          this.imgUnit = this.userData.logo
        }else {
          if (!this.userData){
            this.$axios({
              method:'GET',
              url:this.$httpUrl+'/unit-information/listById?user_id='+this.user.affiliation,
            }).then(res=>res.data).then(res=>{
              if(res.code == 200){
                this.unitInfoForm = res.data
                this.imgUnit = res.data.unitInfo.logo
                this.unitInfoForm.username = this.user.username
                this.unitInfoForm.userId = this.user.id
                this.unitInfoForm.id = null
                this.unitInfoForm.contactPhone = ''
                this.unitInfoForm.contactName = ''
              }
            })
          }else {
            this.unitInfoForm = this.userData
            this.unitInfoForm.username = this.user.username
            this.unitInfoForm.userId = this.user.id
            this.imgUnit = this.userData.logo
          }

        }
        break;
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'))
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
  },
  data(){
    return{
      universityData:[],
      jobData:[],
      jobTypeoptions:[],
      options: regionData ,
      selectedOptions: [],
      user:'',
      userData:'',
      imgUnit:'',
      imgUniv:'',
      area:'',
      resume:{
        id:'',
        studentId:'',
        url:''
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
        resume:'',
        introduce:'',
        job1Id:'',
        job2Id:'',
        job3Id:''
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
          { type:'date', required: true, message: '请选择出生日期', trigger: 'blur' }
        ],
        graduationYear: [
          { type:'date', required: true, message: '请选择毕业年份', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择学历', trigger: 'blur' }
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
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur' }
        ],
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
    // upload(){
    //   this.resume.studentId = this.studentInfoForm.id
    //   this.$axios({
    //     method:'POST',
    //     url:this.$httpUrl+'/resume/uploadResume',
    //     data: this.resume
    //   }).then(res=>res.data).then(res=>{
    //     if(res.code == 200){
    //
    //       this.$message({
    //         message: '上传成功',
    //         type: 'success'
    //       });
    //     }else{
    //       this.$message({
    //         message: '上传失败',
    //         type: 'error'
    //       });
    //     }
    //   })
    // },
    handleSuccess(res){
      this.studentInfoForm.resume = res.imgUrl
    },
    //上传文件让第二次覆盖第一的文件
    handleChangeFile(file,fileList){
      // 限制大小在10MB之内
      let isLt10M = file.size / 1024 / 1024 < 10
      if(!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!")
      }
      if(isLt10M){
        if (fileList.length>0) {
          this.fileList=[fileList[fileList.length-1]]
        }
      }

    },

    //加载工作类型
    loadJobType(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/job-type/typeList',
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          this.jobTypeoptions = res.data
          //console.log(this.options)
        }
      })
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
            url:this.$httpUrl+'/admin-information/modify',
            data: this.adminInfoForm
          }).then(res=>res.data).then(res=>{
            if(res.code == 200){

                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
              this.$emit('doFresh')
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
          //console.log(this.studentInfoForm)
            this.$axios({
              method:'POST',
              url:this.$httpUrl+'/student-information/modify',
              data: this.studentInfoForm
            }).then(res=>res.data).then(res=>{
              if(res.code == 200){

                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$emit('doFresh')
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
              url:this.$httpUrl+'/university-information/modify',
              data: this.universityInfoForm
            }).then(res=>res.data).then(res=>{
              if(res.code == 200){

                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$emit('doFresh')
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
          this.$axios({
            method:'POST',
            url:this.$httpUrl+'/unit-information/modify',
            data: this.unitInfoForm
          }).then(res=>res.data).then(res=>{
            if(res.code == 200){


              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.$emit('doFresh')
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
      this.imgUniv = URL.createObjectURL(file.raw);
      this.universityInfoForm.logo = res.imgUrl
    },
    handleAvatarSuccessUnit(res, file) {
      this.imgUnit = URL.createObjectURL(file.raw);
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