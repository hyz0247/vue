<template>
  <div ref="word"></div>
</template>

<script>
let docx = require('docx-preview');
export default {
  name: "DocxPreview",
  mounted() {
    let resume = this.$route.query.resume
    this.load(resume)
  },
  methods:{
    load(resume){
      this.$axios ({
        method: 'get',
        responseType: 'blob',
        url: resume,
      }).then(({data}) => {
        docx.renderAsync(data,this.$refs.word) // 渲染到页面
      })
    }
  }
}
</script>

<style scoped>

</style>