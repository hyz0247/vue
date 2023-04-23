<template>
  <el-form :model="ModPassForm"
           status-icon
           :rules="ModRules"
           ref="ModPassForm"
           label-width="100px"
           class="demo-ruleForm">
    <el-form-item label="旧密码" prop="oldPass">
      <el-input style="width: 200px" type="password" show-password v-model="ModPassForm.oldPass"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input style="width: 200px" type="password" show-password v-model="ModPassForm.pass"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input style="width: 200px" type="password" show-password v-model="ModPassForm.checkPass"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">确认</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "ModPassword",
  mounted() {
  },
  data() {
    let checkDuplicate =(rule,value,callback)=>{
      this.$axios.get(this.$httpUrl+"/user/findPwd?username="+this.user.username+"&pwd="+this.ModPassForm.oldPass).then(res=>{
        if(res.data.code == 200){
          callback()
        }else{

          callback(new Error('旧密码不正确'));
        }
      })
    };

    return {
      user:JSON.parse(sessionStorage.getItem('user')),
      ModPassForm: {
        oldPass: '',
        pass:'',
        checkPass: '',

      },
      ModRules: {
        oldPass: [
          { required: true, message:"请输入旧密码", trigger: 'blur' },
          {validator:checkDuplicate,trigger: 'blur'}
        ],
        pass: [
          { required: true, message:"请输入密码", trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message:"请输入确认密码", trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    //提交修改密码
    submitForm() {
      this.$refs.ModPassForm.validate(valid => {
        if (valid) {
          if (this.ModPassForm.pass != this.ModPassForm.checkPass) {
            this.$message({
              message: '两次输入的密码不相同',
              type: 'warning'
            })
          } else {
            this.$axios({
              method: "POST",
              url: this.$httpUrl+'/user/modifyPwd',
              data: {
                id:this.user.id,
                password:this.ModPassForm.pass+''
              }
            }).then(res=>res.data).then(res => {
              if (res.code == 200) {

                this.$nextTick(()=>{
                  this.resetForm()
                })
                this.$message({
                  message: '恭喜你，修改成功',
                  type: 'success'
                })

              } else {
                this.$message({
                  message: '修改失败',
                  type: 'error'
                })
              }

            })
          }
        }
      })
    },
    //重置
    resetForm() {
      this.$refs.ModPassForm.resetFields();
    }
  }
}
</script>

<style scoped>

</style>