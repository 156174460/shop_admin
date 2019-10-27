<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb class="mbx" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" @click="searchUser" icon="el-icon-search"></el-button>
    </el-input>

    <!-- 添加 -->

    <el-button @click="showAddUser" class="addBtn" plain type="success">添加用户</el-button>

    <!-- 列表 -->

    <el-table :data="list">
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <!-- {{obj.row}} -->
          <el-switch
            @change="changeState(obj.row)"
            v-model="obj.row.mg_state"
            active-color="lime"
            inactive-color="red"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot:default="obj">
          <!-- 修改  -->
          <el-button
            @click="editShowUser(obj.row)"
            plain
            size="small"
            icon="el-icon-edit"
            type="primary"
          ></el-button>

          <!-- 删除 -->
          <el-button
            @click="deluser(obj.row.id)"
            plain
            size="small"
            icon="el-icon-delete"
            type="danger"
          ></el-button>
          <!-- 333 -->
          <el-button plain size="small" icon="el-icon-check" type="success">分配角色1</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加 -->
    <el-dialog title="添加" :visible.sync="dialogVisible" width="30%" @close="closeDialog">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="adduser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button @click="editUser" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import { log } from 'util'
// console.log(666)

export default {
  created () {
    this.getList()
  },
  data () {
    return {
      list: [],
      query: '', // 搜索条件
      pagenum: 1,
      pagesize: 4,
      total: 0,
      dialogVisible: false,
      editVisible: false,

      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },

  methods: {
    async getList () {
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query, // 搜索条件
          pagenum: this.pagenum, // 当前页
          pagesize: this.pagesize // 页数
        }
      })
      if (meta.status === 200) {
        this.total = data.total

        this.list = data.users
      } else {
        this.$message.error(meta.msg)
      }
      // this.$axios
      //   .get('users', {
      //     params: {
      //       query: this.query, // 搜索条件
      //       pagenum: this.pagenum, // 当前页
      //       pagesize: this.pagesize // 页数
      //     }
      //   })
      //   .then(res => {
      //     const { data, meta } = res
      //     if (meta.status === 200) {
      //       this.total = data.total

      //       this.list = data.users
      //     } else {
      //       this.$message.error(meta.msg)
      //     }
      //   })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 修改了每页条数后, 之前有些页码就没有了, 推荐: 从第一页开始展示
      // this.pagenum = 1
      this.getList()
      // console.log(val)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getList()
    },
    async deluser (id) {
      try {
        await this.$confirm('删除，是否继续?', '提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.list.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('删除失败')
      }
      // this.$confirm('删除，是否继续?', '提示', {
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.$axios
      //       .delete(`users/${id}`)
      //       .then(res => {
      //         // console.log(res.data.meta)
      //         const { meta } = res
      //         if (meta.status === 200) {
      //           this.$message.success(meta.msg)
      //           if (this.list.length === 1 && this.pagenum > 1) {
      //             this.pagenum--
      //           }
      //           this.getList()
      //         } else {
      //           this.$message.error(meta.msg)
      //         }
      //       })
      //   })
      // .catch(() => {
      //   this.$message('取消成功')
      // })
    },
    searchUser () {
      this.pagenum = 1
      this.getList()
    },
    async changeState (row) {
      // console.log(row)
      const { meta } = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      // const { meta } = res
      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(meta.msg)
      }
      // this.$axios.put(`users/${row.id}/state/${row.mg_state}`).then(res => {
      //   console.log(res)
      //   console.log(row.mg_state)
      //   const { meta } = res
      //   if (meta.status === 200) {
      //     this.$message.success('修改成功')
      //   } else {
      //     this.$message.error(meta.msg)
      //   }
      // })
    },
    showAddUser () {
      this.dialogVisible = true
      // console.log(5555)
    },
    async adduser () {
      try {
        // 先校验，在axios
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.dialogVisible = false
          this.getList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    editShowUser (row) {
      // console.log('显示修改')
      this.editVisible = true
      this.editForm.id = row.id

      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        // console.log(this.editForm.id)
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success('修改成功')
          this.editVisible = false
          this.getList()
        } else {
          this.$message.erorr('失败')
        }
        console.log(meta)
      } catch (e) {
        console.log(e)
      }
      console.log('修改')
    }
  }
}
// console.log(6666666)
</script>

<style lang="scss" scoped>
.users {
  .mbx {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
  }
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 20px;
  }
}
</style>
