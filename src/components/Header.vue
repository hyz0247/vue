<template>
  <div style="display: flex;line-height: 60px;width: 100%;" >
  <div style="margin-top: 8px;padding-left: 10px">
    <i :class="icon" style="font-size: 20px;cursor: pointer" @click="collapse"></i>
  </div>
  <div style="flex: 1;text-align: center;font-size: 40px;color: #333333;font-family: 华文中宋;height: 40px;margin-left: 260px;">
    <span >欢迎来到后台管理系统</span>
  </div>
    <div style="margin-right: 30px">

      <el-dropdown style="cursor: pointer">
        <span>我的消息</span>
        <el-dropdown-menu slot="dropdown" style="width: 105px;margin-top: -10px">
          <el-dropdown-item style="display: flex" @click.native="toComment" v-if="user.roleId === 3">我的评论
            <el-badge :value="commentMsg" :max="99" class="item"  v-if="commentMsg != 0"></el-badge>
          </el-dropdown-item>
            <el-dropdown-item style="display: flex" @click.native="toInfo">我的通知
              <el-badge :value="infoMsg" :max="99" class="item"  v-if="infoMsg != 0"></el-badge>
            </el-dropdown-item>
            <el-dropdown-item style="display: flex;margin-left: 1px" @click.native="toMyMsg">我的私信
              <el-badge :value="myMsg=myMsg-read" :max="99" class="item"  v-if="myMsg != 0"></el-badge>
            </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-badge :value="msg=msg-read" :max="99" class="myMessage" v-if="msg != 0"></el-badge>

    </div>
    <el-dropdown style="cursor: pointer">
      <span style="margin-right: 5px;color: #333333">{{(user.roleId === 0?'管理员：':(user.roleId === 1?'学生：':(user.roleId === 2?'学校：':'单位：')))+userData.name}}
      <i class="el-icon-arrow-down" style="margin-left: 0px"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="cai" style="margin-top: -10px">
        <el-dropdown-item @click.native="toUser">个人信息</el-dropdown-item>
        <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  data(){
    return{
      msg:0,
      infoMsg:0,
      myMsg:0,
      commentMsg:0,
      msgList:[],
      infoMsgList:[],
      updateId:[],
      myMsgList:[],
      commentList:[],
      imgUrl:'',
      userData:JSON.parse(sessionStorage.getItem('userData')),
      user:JSON.parse(sessionStorage.getItem('user')),
    }

  },
  created() {

    //this.$router.push("/Personal")
  },
  mounted() {
    this.loadMessages()
  },
  methods:{

    //登陆后弹出消息提醒几条未读
    info(){
      if (this.msg != 0){
        if (this.infoMsg != 0 && this.myMsg != 0 && this.commentMsg != 0){
          this.$alert('您有'+this.infoMsg+'条通知,'+this.myMsg+'条私信,'+this.commentMsg+'条评论未读', '消息通知', {
            confirmButtonText: '确定',
            type:"info"
          });
        }else if (this.infoMsg != 0 && this.myMsg != 0){
          this.$alert('您有'+this.infoMsg+'条通知,'+this.myMsg+'条私信未读', '消息通知', {
            confirmButtonText: '确定',
            type:"info"
          });
        }else if (this.infoMsg != 0 && this.commentMsg != 0){
          this.$alert('您有'+this.infoMsg+'条通知,'+this.commentMsg+'条评论未读', '消息通知', {
            confirmButtonText: '确定',
            type:"info"
          });
        }else if (this.myMsg != 0 && this.commentMsg != 0){
          this.$alert('您有'+this.myMsg+'条私信,'+this.commentMsg+'条评论未读', '消息通知', {
            confirmButtonText: '确定',
            type:"info"
          });
        }else if (this.myMsg != 0){
          this.$alert('您有'+this.myMsg+'条私信未读', '消息通知', {
            confirmButtonText: '确定',
            type:"info"
          });
        }else if (this.infoMsg != 0){
          this.$alert('您有'+this.infoMsg+'条通知未读', '消息通知', {
            confirmButtonText: '确定',
            type:"info"
          });
        }
        else if (this.commentMsg != 0){
          this.$alert('您有'+this.commentMsg+'条评论未读', '消息通知', {
            confirmButtonText: '确定',
            type:"info"
          });
        }

      }
    },

    loadMessages(){
      this.$axios({
        method:'GET',
        url:this.$httpUrl+'/messages/unread?userId='+this.user.id,
      }).then(res=>res.data).then(res=>{
        if(res.code == 200){
          //console.log(res.data.comments.length)
          if (res.data.msg){
            this.msg = res.data.msg.length
          }
          if (res.data.infoMsg){
            this.infoMsgList = res.data.infoMsg
            this.infoMsg = res.data.infoMsg.length
          }
          if (res.data.myMsg){
            this.myMsgList = res.data.myMsg
            this.myMsg = res.data.myMsg.length
            console.log(this.myMsg)
          }
          if (res.data.comments){
            this.commentList = res.data.comments
            this.commentMsg = res.data.comments.length
          }
          this.msg += this.commentMsg
          //console.log(this.msg)
          this.info()
        }
      })
    },
    toUser(){
      this.$router.push("/personal/PersonInformation")
    },
    logOut(){
      this.$confirm('是否退出您的账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //用户点击确认按钮
        this.$router.push("/")
        sessionStorage.clear()
        //localStorage.clear()
        this.$message({
          message:'退出成功',
          type:'success'
        })

      })

    },

    toComment(){
      if(this.commentList){
        for (let i=0; i<this.commentList.length; i++){
          this.updateId[i] = this.commentList[i].id
        }
        //console.log(this.updateId)
        this.$axios({
          method:'GET',
          url:this.$httpUrl+'/comment/read?userId='+this.user.id,
        }).then(res=>res.data).then(res=>{
          if(res.code == 200){
            //console.log(res.data)
            //this.loadMessages()
            this.$emit('reFresh')

            //location.reload()

          }
        })
      }
      this.$router.push("/message/CommentManage")

    },
    toInfo(){
      if (this.infoMsgList){
        for (let i=0; i<this.infoMsgList.length; i++){
          this.updateId[i] = this.infoMsgList[i].id
        }
        //console.log(this.updateId)
        this.$axios({
          method:'GET',
          url:this.$httpUrl+'/messages/readMsg?idList='+this.updateId,
        }).then(res=>res.data).then(res=>{
          if(res.code == 200){
            //console.log(res.data)
            //this.loadMessages()
            this.$emit('reFresh')

            //location.reload()

          }
        })
      }
      this.$router.push("/message/MyInfo")
    },
    toMyMsg(){
      if (this.myMsgList){
        for (let i=0; i<this.myMsgList.length; i++){
          this.updateId[i] = this.myMsgList[i].id
        }
        //console.log(this.updateId)
        this.$axios({
          method:'GET',
          url:this.$httpUrl+'/messages/readMsg?idList='+this.updateId,
        }).then(res=>res.data).then(res=>{
          if(res.code == 200){
            //console.log(res.data)
            //this.loadMessages()
            this.$emit('reFresh')

            //location.reload()

          }
        })
      }
      this.$router.push("/message/PrivateMsg")
    },
    collapse(){
      this.$emit('doCollapse')
    }
  },
  props:{
    icon:String,
    read:Number
  }
}
</script>

<style scoped>

</style>