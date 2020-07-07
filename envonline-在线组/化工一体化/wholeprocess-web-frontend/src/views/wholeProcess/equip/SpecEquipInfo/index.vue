<!-- 设备管理-特种设备信息 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="特种设备名称：">
          <el-input
            v-model="queryForm.departmentName"
            placeholder="特种设备名称"
            clearable
            style="width:220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="特种设备类型：">
          <el-select v-model="queryForm.equipmentTypeCodeId">
            <el-option v-for="(item, index) in dict.EquipmentType" :key="index" :label="item.dictName" :value="item.rowGuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.equipmentStatus" clearable>
            <el-option label="损坏" :value="0"></el-option>
            <el-option label="正常" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
            <el-option label="报废" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          <el-button type="primary" icon="fas fa-download" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" style="position: relative">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
      <hint-text class="posion mar-r-sm mar-t-xs fn-clear">
        <span>特种设备总数：{{generalInfo.all}}个</span> ; <span>审验过期数量：{{generalInfo.isOverdue}}个</span>
      </hint-text>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="equipmentName" label="设备名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="equipmentNumber" label="资产编号" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column property="equipmentTypeName" label="设备类型" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column property="specificationType" label="规格型号" show-overflow-tooltip></el-table-column>
      <el-table-column property="exFactoryDate" label="出厂年月" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="inspectionDate" label="审验日期" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="nextAuditDate" label="下次审验日期" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="deptName" label="使用部门" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="equipmentStatusName" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column property="isOverdue" label="是否过期" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';

export default {
  name: 'SpecEquipInfo',
  mixins: [                   // 混合
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/specEquipInfo',
      // 查询表单绑定变量
      queryForm: {
        psId: '', // 企业id
        equipmentName: '',   // 设备名称
        equipmentTypeCodeId: '', // 设备类型
        equipmentStatus: 1, // 设备状态（0损坏，1正常，2停用，3报废）
        sort: 'equipmentName',
      },
      generalInfo: {
        all: 0,
        isOverdue: 0,
      },
      dict: { // 字典表数据
        EquipmentType: [],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    this.queryForm.psId = this.orgGuid;
    this.getDictList();
    this.$nextTick(() => {
      this.onQueryList();
      this.getGeneraiInfo();
    });
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    getGeneraiInfo() {
      this.$http.get('wholeprocess/specEquipInfo/generalInfo').then((response) => {
        if (response.status === 200 && response.data.success) {
          this.generalInfo = { ...response.data.data } || { all: 0, isOverdue: 0 };
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
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export`, { ...this.queryForm }, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `特种设备管理${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 特殊方法
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.posion{
  position: absolute;
  right: 0;
  width: 300px;
  bottom: 2px;
}
</style>
