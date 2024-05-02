<template>
  <div>
    <p>
      <el-input style="width: 200px; margin-right: 10px;" v-model="mobile" placeholder="请输入内容"></el-input>
      <button v-on:click="list(1)" class="btn btn-white btn-default btn-round" style="margin-right: 10px;">
        检索
      </button>
      <button class="btn btn-white btn-default btn-round" @click="addMember" style="margin-right: 10px;">新增会员</button>
      <button class="btn btn-white btn-default btn-round" @click="exportMember" style="margin-right: 10px;">导出会员</button>
      <span>超级用户不受单点登录的限制、不受习题的限制</span>
    </p>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="mobile">
          <el-input v-model="form.mobile" size="small"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="form.role" size="small">
            <el-radio :label="1">普通用户</el-radio>
            <el-radio :label="2">超级用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否支付" prop="payStatus">
          <el-radio-group v-model="form.payStatus" size="mini">
            <el-radio :label="0">未支付</el-radio>
            <el-radio :label="1">已支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否答题" prop="doQuestion">
          <el-radio-group v-model="form.doQuestion" size="mini">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备限制数量" prop="deviceLimitNum">
          <el-input-number
            size="small"
            v-model="form.deviceLimitNum"
            :min="1" :max="10"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <table id="simple-table" class="table  table-bordered table-hover">
      <thead>
      <tr>
        <th>id</th>
        <th>用户名</th>
        <th>昵称</th>
        <th>角色</th>
        <th>支付状态</th>
        <th>是否需要答题</th>
        <th>设备限制</th>
        <th>注册时间</th>
        <th>操作</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="member in members">
        <td>{{member.id}}</td>
        <td>{{member.mobile}}</td>
        <td>{{member.name}}</td>
        <td>{{member.role === 1 ? '普通用户' : '超级用户'}}</td>
        <td>{{member.payStatus && member.payStatus === 1 ? "已支付" : "未支付"}}</td>
        <td>
          <el-tag size="mini" :type="member.doQuestion === 1 ? 'unset' : 'info'">{{member.doQuestion === 1 ? '是' : '否'}}</el-tag>
        </td>
        <td>{{member.deviceLimitNum}}</td>
        <td>{{member.registerTime}}</td>
        <td>
          <div class="hidden-sm hidden-xs btn-group">
            <button v-on:click="toCheckDevice(member)" class="btn btn-white btn-xs btn-info btn-round">
              查看设备
            </button>&nbsp;
          </div>
          <div class="hidden-sm hidden-xs btn-group">
            <button v-on:click="toDeleteUser(member)" class="btn btn-white btn-xs btn-info btn-round">
              删除
            </button>&nbsp;
          </div>
          <div class="hidden-sm hidden-xs btn-group">
            <button v-on:click="toEditUser(member)" class="btn btn-white btn-xs btn-info btn-round">
              编辑
            </button>&nbsp;
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <pagination ref="pagination" v-bind:list="list" v-bind:itemCount="8"></pagination>

    <el-dialog
      title="登录设备信息"
      :visible.sync="deviceDialogVisible"
      width="800px">
      <el-table :data="deviceContent" style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="memberId" label="会员ID"></el-table-column>
        <el-table-column prop="deviceId" label="设备ID" width="300"></el-table-column>
        <el-table-column prop="loginTime" label="首次登陆时间" width="160"></el-table-column>
        <el-table-column label="设备系统" width="160">
          <template slot-scope="scope">
            <span>{{ deviceTypeOption[scope.row.deviceType] }}</span>
          </template>
        </el-table-column>
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
        mobile: '',  //用户查询
        member: {},
        members: [], //列表tableData
        dialogVisible: false,
        dialogTitle: "",
        form: {
          id: "",
          mobile: "",        //用户名
          name: "",          //昵称
          password: "",      //密码
          role: 1,           //角色
          payStatus: 0,      //支付状态
          doQuestion: 1,     //是否需要答题
          deviceLimitNum: 2  //设备限制数量
        },
        rules: {
          mobile: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
        deviceContent: [],
        deviceTypeOption: {
          "1": 'android',
          "2": 'ios',
          "3": 'windows',
        },
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
          mobile: this.mobile,
        }).then((response)=>{
          Loading.hide();
          let resp = response.data;
          _this.members = resp.content.list;
          _this.$refs.pagination.render(page, resp.content.total);

        })
      },
      exportMember() {
        this.$ajax.post(process.env.VUE_APP_SERVER + '/business/admin/member/export', {}, {
          headers: {
            'Content-Type': 'application/json; application/octet-stream'
          },
          responseType: 'arraybuffer'
        }).then((res)=>{
          const aLink = document.createElement('a')
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel;charset=UTF-8" })
          var fileName = "会员信息"
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', fileName) // 设置下载文件名称
          document.body.appendChild(aLink)
          aLink.click()
          document.body.appendChild(aLink)
        })
      },
      addMember() {
        this.form = {
          id: "",
          mobile: "",   //用户名
          name: "",     //昵称
          password: "", //密码
          role: 1,       //角色
          payStatus: 0,  //支付状态
          doQuestion: 1,     //是否需要答题
          deviceLimitNum: 2  //设备限制数量
        }
        this.dialogVisible = true
        this.dialogTitle = "新增会员"
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
              const {success, message} = response.data;
              if(success) {
                this.list(1);
                this.onCancel();
                this.$message({
                  type: 'success',
                  message: '新增成功'
                });
              }else {
                this.$message({
                  type: 'error',
                  message: message
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      toEditUser(data) {
        const {id, mobile, name, password, role, payStatus, doQuestion, deviceLimitNum } = data;
        this.form = {id, mobile, name, password, role, payStatus, doQuestion, deviceLimitNum };
        this.dialogVisible = true;
        this.dialogTitle = "编辑会员"
      },
      toDeleteUser(data) {
        this.$confirm('确定删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const { id } = data;
          this.$ajax.delete(process.env.VUE_APP_SERVER + '/business/admin/member/delete/' + id).then((response) => {
            this.$refs.pagination.size = 15;
            this.list(1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      toCheckDevice(data) {
        const { id } = data;
        this.deviceContent = [];
        this.$ajax.get(process.env.VUE_APP_SERVER + '/business/admin/member/device-list/' + id).then((response)=>{
          const { data } = response;
          const { content } = data;
          this.deviceContent = content;
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
