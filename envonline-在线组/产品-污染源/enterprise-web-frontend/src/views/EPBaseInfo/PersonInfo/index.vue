<template>
  <!-- 班组管理 -->
  <el-card>
    <el-form class="mar-x-sm mar-t-xs" inline>
      <el-form-item label="姓名：">
        <el-input v-model="queryForm.name" clearable style="width:180px" placeholder="请输入人员名称"
          @keyup.enter.native="onQueryList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
      </el-form-item>
    </el-form>
    <hr />
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <el-table border highlight-current-row :height="`calc(100% - 71px)`" v-loading="loading" :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button v-if="!scope.row.userId" type="primary" icon="fas fa-pencil-alt" @click="onClickUser(scope.row)">
            开通账号
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="name" label="姓名" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="mobilePhone" label="手机号码" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="jobLevel" label="职级职位" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="statusName" label="状态" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="emergentLinkMan" label="紧急联络人" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="emergentPhone" label="紧急联络人电话" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />
    <dialog-form ref="dialogform" @query="getItemList" />
    <user-form ref="userForm" @saveUserId='saveUserId' @query="getItemList" />
  </el-card>
</template>

<script>
import { queryListEnt, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import UserForm from './components/UserForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'PSTeamManage',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,
    UserForm,
  },
  data() {
    return {
      url: 'bas/personInfo',
      isAuto: false,              // 是否自动调取查询接口 -- 来自queryList混合的created
      loading: false,             // 列表加载状态
      downloading: false,         // 下载按钮加载状态
      queryForm: {                // 查询条件
        name: '',           // 负责人姓名
        orgId: '',
        sort: 'name+',
      },
      itemModel: {},
      itemList: [],               // 表格列表
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    onClickAdd() {           // 单击新增回调
      this.$refs.dialogform.openDialog();
    },
    onClickEdit(row) {       // 单击编辑回调
      this.$refs.dialogform.openDialog(row);
    },
    onClickUser(row) {       // 单击编辑回调
      this.itemModel = row;
      this.$refs.userForm.openDialog(row);
    },
    /** 接口层 */
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export`, this.queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `人员管理${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    saveUserId(userId) {
      this.$set(this.itemModel, 'userId', userId);
      this.$http.put(this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
  },
};
</script>
