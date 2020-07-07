<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="企业名称：">
          <el-input v-model="queryForm.psName" placeholder="企业名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="openDialog()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()"
      >删 除</el-button>
    </div>
    <el-table
      border
      height="calc(100% - 76px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="onSaveSelected"
    >
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-pencil-alt" @click="openVedioChannel(scope.row)">通道</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="psName" label="企业名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="devCode" label="设备编号" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="devName" label="设备名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="devStatus" label="设备状态" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{devStatus = scope.row.devStatus ===1 ?"正常":"报废"}}</template>
      </el-table-column>
      <el-table-column prop="devIp" label="设备ip" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="devPort" label="设备端口" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="devStreamPort" label="设备流端口" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="devUser" label="设备用户名" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="devPassWord" label="设备密码" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="webSocktIp" label="webSocktIp地址" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="webSockPort"
        label="webSockPort端口号"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="devManufactureName"
        label="生产厂商"
        min-min-width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="devModel" label="生产型号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="devDesc" label="设备描述" min-width="150" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList" />
    <vedio-device-dialog ref="dialog" @query="getItemList" />
    <channel-dialog ref="channelDialog" />
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import VedioDeviceDialog from './components/VedioDeviceDialog';
import channelDialog from './components/channelDialog';

export default {
  mixins: [queryList, deleteItem],
  name: 'VideoDevice',
  components: { VedioDeviceDialog, channelDialog },
  data() {
    return {
      url: 'cfg/videoDevice',
      queryForm: {
        psName: '',
      },
    };
  },
  methods: {
    // 选择
    onSaveSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    // 新增修改弹窗
    openDialog(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 摄像头频道弹窗
    openVedioChannel(row) {
      this.$refs.channelDialog.openDialog(row);
    },
  },
};
</script>
