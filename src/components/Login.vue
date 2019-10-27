<template>
  <div class="login">
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img class="logo" src="../assets/logo.png" alt />
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login" class="loginBtn" type="primary">登陆</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 12,
            message: '用户名长度必须是3-12位',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 12,
            message: '密码长度必须是3-12位',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        const { data, meta } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          // console.log(meta.msg)
          localStorage.setItem('token', data.token)

          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          })

          // this.$router.push('/index')
          this.$router.push({ name: 'index' })
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // this.$refs.form.validate(isValid => {
      //   // 校验失败, 直接return
      //   if (!isValid) return
      //   console.log('发送ajax请求')

      //   this.$axios
      //     .post('login', this.form)
      //     .then(res => {
      //       const { meta, data } = res
      //       if (meta.status === 200) {
      //         // console.log(meta.msg)
      //         localStorage.setItem('token', data.token)

      //         this.$message({
      //           type: 'success',
      //           message: meta.msg,
      //           duration: 1000
      //         })

      //         // this.$router.push('/index')
      //         this.$router.push({ name: 'index' })
      //       } else {
      //         this.$message.error(meta.msg)
      //       }
      //     })
    }

  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    background-color: #fff;
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    border-radius: 20px;
    margin: 0 auto;
    margin-top: 200px;
    position: relative;

    .logo {
      width: 120px;
      height: 120px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -75px;
      border-radius: 50%;
      border: 5px solid #fff;
    }

    .loginBtn {
      margin-right: 70px;
    }
  }
}
</style>
