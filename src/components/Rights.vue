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

    <el-table
      :data="rightsList"
      >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
       >
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        >
      </el-table-column>
      <el-table-column
        prop="address"
        label="层级">
        <template v-slot:default="{row}">
          <p v-if="row.level==='0'">一级</p>
          <p v-if="row.level==='1'">二级</p>
          <p v-if="row.level==='2'">三级</p>
        </template>

      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('rights/list')
    console.log(data, meta)

    if (meta.status === 200) {
      this.rightsList = data
    } else {
      this.$message.error(meta.msg)
    }
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
