<template>
  <span style=" font-size: 30px;text-align: center;width: 100%">欢迎来到后台系统</span>
</template>

<script>
export default {
  name: "Personal",
  mounted() {
    // this.loadMessages()
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
  },
  data(){
    return{
      msgList:[],
      infoMsgList:[],
      myMsgList:[],
      commentList:[],
    }
  }
}
</script>

<style scoped>

</style>