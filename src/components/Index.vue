<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/1.png" alt />
      </div>
      <div class="xt">电商管理系统</div>
      <div class="logn">
        欢迎光临~
        <a href="javascript:;" @click='logn' >退出</a>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="users">
              <i class="el-icon-location"></i>
              <span>用户列表</span>
            </el-menu-item>

          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="roles">
              <i class="el-icon-location"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
             <i class="el-icon-location"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
       <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logn () {
      this.$confirm('退出系统，是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.index {
  height: 100%;
  .el-header {
    height: 60px;
    background-color: skyblue;
    display: flex;
    .logo {
      width: 200px;
      img {
        height: 40px;
        padding: 10px;
      }
    }
    .xt {
      flex: 1;
      text-align: center;
      font-size: 24px;
      height: 60px;
      line-height: 60px;
      font-weight: 700;
    }
    .logn {
      width: 180px;
      text-align: right;
      height: 60px;
      line-height: 60px;
    }
  }
  .el-aside {
    background-color: rgb(84, 92, 100);
  }
}
</style>
