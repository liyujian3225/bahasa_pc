<template>
  <div>
    <h1>您好，欢迎进入控台</h1>
    <el-button @click="dumpMenberManagement">会员管理</el-button>
  </div>
</template>

<script>
  export default {
    name: "welcome",
    mounted: function() {
      // sidebar激活样式方法一
      // this.$parent.activeSidebar("welcome-sidebar");
    },
    methods: {
      dumpMenberManagement() {
        this.$router.push("business/member")
      }
    }
  }
</script>
