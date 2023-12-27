<template>
  <div>
    <p>
      <button v-on:click="list(1)" class="btn btn-white btn-default btn-round">
        <i class="ace-icon fa fa-refresh"></i>
        刷新
      </button>
      <button class="btn btn-white btn-default btn-round" @click="addMember">新增会员</button>
    </p>

    <el-dialog
      title="新增会员"
      :visible.sync="dialogVisible"
      width="30%">

      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <pagination ref="pagination" v-bind:list="list" v-bind:itemCount="8"></pagination>

    <table id="simple-table" class="table  table-bordered table-hover">
      <thead>
      <tr>
        <th>id</th>
        <th>手机号</th>
        <th>密码</th>
        <th>昵称</th>
        <th>头像url</th>
        <th>注册时间</th>
        <th>操作</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="member in members">
        <td>{{member.id}}</td>
        <td>{{member.mobile}}</td>
        <td>{{member.password}}</td>
        <td>{{member.name}}</td>
        <td>{{member.photo}}</td>
        <td>{{member.registerTime}}</td>
        <td>
          <div class="hidden-sm hidden-xs btn-group">
            <button v-on:click="toCheckDevice(member)" class="btn btn-white btn-xs btn-info btn-round">
              查看设备
            </button>&nbsp;
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <el-dialog
      title="登录设备信息"
      :visible.sync="deviceDialogVisible"
      width="45%">
      <el-table :data="deviceContent" style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="memberId" label="会员ID"></el-table-column>
        <el-table-column prop="deviceId" label="设备ID" width="300"></el-table-column>
        <el-table-column prop="loginTime" label="首次登陆时间" width="160"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deviceDialogVisible = false;">取 消</el-button>
        <el-button type="primary" @click="deviceDialogVisible = false;">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import Pagination from "../../components/pagination";
  export default {
    components: {Pagination},
    name: "business-member",
    data: function() {
      return {
        member: {},
        members: [],
        dialogVisible: false,
        form: {
          name: "",
          mobile: "",
          password: "",
          photo: "",
        },
        rules: {
          mobile: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
        deviceContent: [],
        deviceDialogVisible: false,
      }
    },
    mounted: function() {
      let _this = this;
      _this.$refs.pagination.size = 15;
      _this.list(1);
      // sidebar激活样式方法一
      // this.$parent.activeSidebar("business-member-sidebar");

    },
    methods: {
      /**
       * 列表查询
       */
      list(page) {
        let _this = this;
        Loading.show();
        _this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/member/list', {
          page: page,
          size: _this.$refs.pagination.size,
        }).then((response)=>{
          Loading.hide();
          let resp = response.data;
          _this.members = resp.content.list;
          _this.$refs.pagination.render(page, resp.content.total);

        })
      },
      addMember() {
        this.dialogVisible = true
      },
      onCancel() {
        this.dialogVisible = false;
        this.$refs['form'].resetFields();
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const params = this.form;
            this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/member/save', params).then((response)=>{
              this.list(1);
              this.onCancel();
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      toCheckDevice(data) {
        const { id } = data;
        let that = this;
        that.deviceContent = [];
        this.$ajax.get(process.env.VUE_APP_SERVER + '/business/admin/member/device-list/' + id).then((response)=>{
          const { data } = response;
          const { content } = data;
          that.deviceContent = content;
          this.deviceDialogVisible = true;
        })
      },
      handleDelete(data) {
        const { id } = data;
        this.deviceContent = this.deviceContent.filter(item => item.id !== id)
        this.$ajax.delete(process.env.VUE_APP_SERVER + '/business/admin/member/device-delete/' + id);
      }
    }
  }
</script>
