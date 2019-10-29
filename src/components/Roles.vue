<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr />
    <!-- 添加角色 -->
    <el-button type="success" plain class="add" @click="showRoles">添加角色</el-button>

    <!-- 内容列表 -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <p v-if="row.children.length===0">暂无权限</p>
          <el-row class="r1" v-for="r1 in row.children" :key="r1.id">
            <el-col :span="4">
              <el-tag @close="delRights(row,r1.id)" closable>{{r1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="r2" v-for="r2 in r1.children" :key="r2.id">
                <el-col :span="4">
                  <el-tag @close="delRights(row,r2.id)" closable type="success">{{r2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- <el-row> -->
                  <el-tag
                    @close="delRights(row,r3.id)"
                    class="r3"
                    v-for="r3 in r2.children"
                    :key="r3.id"
                    closable
                    type="danger"
                  >{{r3.authName}}</el-tag>
                  <!-- </el-row> -->
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index"></el-table-column>

      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <!-- 修改 -->
          <el-button
            @click="showXGRoles(row)"
            plain
            type="primary"
            class="el-icon-edit"
            size="small"
          ></el-button>
          <!-- 删除 -->
          <el-button
            @click="delRole(row.id)"
            plain
            type="danger"
            class="el-icon-delete"
            size="small"
          ></el-button>
          <!-- 分配权限 -->
          <el-button
            @click="showAssignDialog(row)"
            plain
            type="success"
            class="el-icon-check"
            size="small"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="40%" @close="closeDialog">
      <el-form status-icon ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改角色" :visible.sync="XGVisible" width="40%">
      <el-form status-icon ref="XGform" :model="XGform" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="XGform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="XGform.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="XGVisible = false">取 消</el-button>
        <el-button @click="XGRoles" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="assignVisible" width="40%">
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button @click="assignRights" type="primary">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { DESTRUCTION } from 'dns'
export default {
  data () {
    return {
      rolesList: [],
      dialogVisible: false,
      XGVisible: false,
      assignVisible: false,
      data: [],
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      form: {
        roleName: '',
        roleDesc: ''
      },
      XGform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: ['blur', 'change']
          },
          {
            min: 2,
            max: 12,
            message: '长度在 2 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请选择角色描述',
            trigger: ['blur', 'change']
          },
          {
            min: 2,
            max: 12,
            message: '长度在 2 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
        // console.log(data)
      } else {
        this.$message.error('获取失败')
      }
    },
    async delRights (row, rightId) {
      // console.log(roleId, rightId)
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success('成功')
        row.children = data
      } else {
        this.$message.error('失败')
      }
    },
    showRoles () {
      console.log(666)
      this.dialogVisible = true
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    async addRoles () {
      console.log('添加')
      try {
        await this.$refs.form.validate()
        console.log('jiao')
        const { roleName, roleDesc } = this.form
        const { meta } = await this.$axios.post('roles', {
          roleName,
          roleDesc
        })
        console.log(meta)

        if (meta.status === 201) {
          this.dialogVisible = false
          this.getRoleList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async delRole (id) {
      try {
        await this.$confirm('亲, 你确认要删除么?', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.getRoleList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showXGRoles (row) {
      this.XGVisible = true
      console.log(row)
      this.XGform.id = row.id
      this.XGform.roleDesc = row.roleDesc
      this.XGform.roleName = row.roleName
    },
    async XGRoles () {
      try {
        await this.$refs.XGform.validate()
        const { id, roleDesc, roleName } = this.XGform
        console.log(id, roleDesc, roleName)
        const { meta, data } = await this.$axios.put(`roles/${id}`, {
          id,
          roleDesc,
          roleName
        })
        if (meta.status === 200) {
          this.XGVisible = false
          this.getRoleList()
          this.$message.success('修改成功')
          console.log(meta, data)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
        console.log(e)
      }
    },
    async showAssignDialog (row) {
      console.log(row.id)
      this.roleId = row.id
      this.assignVisible = true
      const { data, meta } = await this.$axios.get('rights/tree')
      // console.log(meta, data)
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(r1 => {
          r1.children.forEach(r2 => {
            r2.children.forEach(r3 => {
              // console.log(r3.id)
              ids.push(r3.id)
            })
          })
        })
        // console.log(ids)
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      console.log(meta)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        // 重新渲染
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
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
.add {
  margin: 10px 0px;
}
.r1 {
  padding: 5px 0;
  border-bottom: 2px solid skyblue;
  &:last-child {
    border-bottom: none;
  }
}
.r2 {
  margin-bottom: 5px;
}
.r3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
