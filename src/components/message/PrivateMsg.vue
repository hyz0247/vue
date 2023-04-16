<template>
  <div style="padding: 10px; margin-bottom: 50px">
    <el-row>
      <el-col :span="6">
        <el-card style="width: 100%; min-height: 300px; color: #333">
          <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">
            用户列表<span style="font-size: 12px">（点击聊天气泡开始聊天）</span></div>
          <div v-if="this.user.username != chatUser" style="max-height: 600px;overflow-y: scroll;">
          <div style="padding: 10px 0;" v-for="user in users" :key="user.username">
            <span>{{ user.userList.roleId === 0? '管理员:':(user.userList.roleId === 1? '学生:':user.userList.roleId === 2? '学校:':'单位:') }}</span>
            <span>{{ user.username }}</span>
            <i class="el-icon-chat-dot-round"
               style="margin-left: 10px; font-size: 16px; cursor: pointer"
               @click="chat(user.username,user)">
<!--               @click="chatUser = user.username"-->
               </i>
            <el-badge :value="user.size" :max="99" class="item" v-if="user.size != 0">
              <span style="font-size: 12px;color: limegreen; margin-left: 5px" v-if="user.username === chatUser">聊天中...</span>
            </el-badge>

          </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <div style="width: 800px; margin: 0 auto; background-color: white;
                    border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <div style="text-align: center; line-height: 50px;">
            聊天框（{{ chatUser }}）
          </div>
          <div id="middle"
               class="middle"
               style="height: 400px;overflow-y:scroll;
               scroll-behavior: smooth;
               border-top: 1px solid #ccc" v-html="content"></div>
          <div style="height: 22vh;width: 100%">
            <textarea class="messageText"
                      v-model="text"
                      @keydown.enter="send($event)"></textarea>
            <div style="text-align: right; padding-right: 10px;margin-top: 3px">
              <el-button type="primary" size="mini" @click="send">发送</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

let socket;
export default {
  name: "PrivateMsg",
  data() {

    return {
      circleUrl: 'el-icon-user',
      user: {},
      jobUsername: '',
      userData: {},
      isCollapse: false,
      users: [],
      chatUser: '',
      chatUserId:0,
      text: "",
      messages: [],
      content: '',

    }
  },
  created() {

    this.init()
  },
  mounted() {

  },
  // 聊天滑动始终在最底下
  updated : function(){
    this.$nextTick(function(){
      const div = document.getElementById('middle');
      div.scrollTop = div.scrollHeight;
    })

  },

    methods: {

      //点击聊天小图标
      chat(username,user) {
        this.chatUser = username
        this.chatUserId = user.userList.id
        this.content = ''
        let message = {from: this.user.username, to: this.chatUser, text: '获取历史记录'}
        socket.send(JSON.stringify(message));
        //console.log(user.size)
        if (user.size>0){
          this.read(user)
        }

        //let _this = this;
        //  浏览器端收消息，获得从服务端发送过来的文本消息
        // socket.onmessage = function (msg) {
        //   console.log(2)
        //   let data = JSON.parse(msg.data)
        //
        //   if (data.textList){
        //   for (let i = 0;i<data.textList.length;i++){
        //
        //   if (data.textList[i].senderId === _this.chatUser) {
        //     _this.messages.push(data.textList[i].content)
        //     // 构建消息内容(接收的消息)
        //     if (data.textList[i].content) {
        //       _this.createContent(data.from, null, data.textList[i].content)
        //     }
        //   } else {
        //     _this.messages.push(data.textList[i].content)
        //     // 构建消息内容(发送的消息)
        //     if (data.textList[i].content) {
        //       _this.createContent(null, _this.user.username, data.textList[i].content)
        //     }
        //   }
        //   }
        //   }
        // };

      },

      //读取信息
      read(user){
        this.$axios({
          method:'GET',
          url:this.$httpUrl+'/messages/readPrivate?userId='+this.user.id+'&&id='+user.userList.id,
        }).then(res=>res.data).then(res=>{
          if(res.code == 200){
            //console.log(res.data)
            //this.loadMessages()
            this.$emit('read',user.size)
            user.size = 0


          }
        })
      },
      //发送消息
      send() {
        if (!this.chatUser) {
          this.$message({type: 'warning', message: "请选择聊天对象"})
          return;
        }
        if (!this.text) {
          this.$message({type: 'warning', message: "请输入内容"})
        } else {
          if (typeof (WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
          } else {
            //console.log("您的浏览器支持WebSocket");
            // 组装待发送的消息 json
            // {"from": "zhang", "to": "admin", "text": "聊天文本"}
            let message = {from: this.user.username, to: this.chatUser, text: this.text}
            socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
            this.messages.push({user: this.user.username, text: this.text})
            // 构建消息内容，本人消息
            this.createContent(null, this.user.username, this.text)
            this.text = '';
          }
        }
      },
      createContent(remoteUser, nowUser, text) {  // 这个方法是用来将 json的聊天消息数据转换成 html的。
        let html
        // 当前用户消息
        if (nowUser) { // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
          html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
              "  <div class=\"el-col el-col-22\" style=\"text-align: right; padding-right: 10px\">\n" +
              "    <div class=\"tip left\">" + text + "</div>\n" +
              "  </div>\n" +
              "  <div class=\"el-col el-col-2\">\n" +
              "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
              "    <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"object-fit: cover;\">\n" +
              "  </span>\n" +
              "  </div>\n" +
              "</div>";
        } else if (remoteUser) {   // remoteUser表示远程用户聊天消息，蓝色的气泡
          html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
              "  <div class=\"el-col el-col-2\" style=\"text-align: right\">\n" +
              "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
              "    <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"object-fit: cover;\">\n" +
              "  </span>\n" +
              "  </div>\n" +
              "  <div class=\"el-col el-col-22\" style=\"text-align: left; padding-left: 10px\">\n" +
              "    <div class=\"tip right\">" + text + "</div>\n" +
              "  </div>\n" +
              "</div>";
        }
        //console.log(html)
        this.content += html;
      },
      init() {
        //岗位页面跳转带过来的数据（用户名）
        this.jobUsername = this.$route.params.username

        this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
        this.userData = sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("user")) : {}
        let username = this.user.username;
        let username1 = this.jobUsername
        let _this = this;
        if (typeof (WebSocket) == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          //console.log("您的浏览器支持WebSocket");
          let socketUrl = "ws://localhost:8082/chatServer/" + username;
          if (socket != null) {
            //console.log(1)
            socket.close();
            socket = null;
          }
          // 开启一个websocket服务
          socket = new WebSocket(socketUrl);
          //打开事件
          socket.onopen = function () {

            //console.log("websocket已打开");
          };

          //  浏览器端收消息，获得从服务端发送过来的文本消息
          socket.onmessage = function (msg) {
            //console.log("收到数据====" + msg.data)
            // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
            let data = JSON.parse(msg.data)
            // 如果服务器端发送过来的json数据 包含 users 这个key，那么发送过来的就是所有用户信息
            if (data.users) {
              // 获取人员信息
              // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
              _this.users = data.users.filter(user => user.username !== username)
              if (username1) {
                for (let i = 0;i<data.users.length; i++){
                  if (data.users[i].username == username1){
                    _this.chat(username1,data.users[i])
                  }
                }

              }
            }else if (data.textList){
              // 如果服务器端发送过来的json数据 包含 textList 这个key，那么发送过来的就是聊天记录
              for (let i = 0;i<data.textList.length;i++){
                if (data.textList[i].senderId === _this.chatUserId) {
                  _this.messages.push(data.textList[i].content)
                  // 构建消息内容(接收的消息)
                  if (data.textList[i].content) {
                    _this.createContent(data.from, null, data.textList[i].content)
                  }
                } else {
                  _this.messages.push(data.textList[i].content)
                  // 构建消息内容(发送的消息)
                  if (data.textList[i].content) {
                    _this.createContent(null, _this.user.username, data.textList[i].content)
                  }
                }
              }
            } else {
              // 如果服务器端发送过来的json数据 不包含 users和textList 这两个key，那么发送过来的就是聊天文本json数据
              if (data.from === _this.chatUser) {
                _this.messages.push(data)
                // 构建消息内容
                _this.createContent(data.from, null, data.text)
              }
            }
          };
          //关闭事件
          socket.onclose = function () {
            //console.log("websocket已关闭");
          };
          //发生了错误事件
          socket.onerror = function () {
            //console.log("websocket发生了错误");
          }
        }
      },


    }
}

</script>

<style scoped>
.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width:auto;
  display:inline-block !important;
  display:inline;
}
.right {
  background-color: deepskyblue;
}
.left {
  background-color: forestgreen;
}
.messageText{
  height: 140px;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
  border: 0 none;
  resize: none;
  overflow-y: auto;

  vertical-align: middle;
  display: inline-block;
  border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;
  vertical-align: middle;

}
</style>