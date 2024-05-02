<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style>
.el-form-item {
  margin-bottom: 16px !important;
  .el-form-item__label {
    height: 32px;
    line-height: 32px;
    margin-bottom: 0;
  }
  .el-form-item__content {
    height: 32px;
    line-height: 32px;
    .el-input__inner{
      border-radius: 4px!important;
    }
  }
}

</style>
