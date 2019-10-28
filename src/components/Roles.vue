<template>
  <div class="roles">
<!-- 面包屑 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<hr>
<!-- biaoge -->
  <template>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
    // rolesList=[]
    }
  },
  created () {

  },
  methods () {

  }
}
</script>

<style lang="scss" scoped>
body {
  background-color: #ecf0f1;
}
.el-breadcrumb {
  height: 40px;
line-height: 40px;
}
</style>
