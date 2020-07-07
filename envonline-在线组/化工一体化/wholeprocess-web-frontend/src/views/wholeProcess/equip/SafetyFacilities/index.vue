<!-- 设备管理-安全设施 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="类别：">
          <el-tooltip effect="dark" placement="top-start" :disabled="((dict.safetyFacilities
              .filter((n) => n.rowGuid === queryForm.categoryCodeId)[0] || {}).dictName || '').length < 5"
            :content="(dict.safetyFacilities.filter((n) => n.rowGuid === queryForm.categoryCodeId)[0] || {}).dictName">
            <el-select v-model="queryForm.categoryCodeId" clearable>
              <el-option v-for="(item, index) in dict.safetyFacilities.filter(n => +n.parentId === 0)" :key="index" :label="item.dictName"
                :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="安全设施名称：">
          <el-input v-model="queryForm.facilitiesName" placeholder="安全设施名称" clearable style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" clearable>
            <el-option label="损坏" :value="0"></el-option>
            <el-option label="正常" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
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
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table border highlight-current-row height="calc(100% - 70px)" v-loading="loading" :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="categoryName" label="大类" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="subcategoryName" label="小类" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="facilitiesName" label="安全设施名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="involveProcess" label="涉及工艺设施" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="quantity" label="数量" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="inspectionDate" label="检测时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="expiryDate" label="到期时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="statusName" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList" />

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
  name: 'SafetyFacilities',
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
      url: 'wholeprocess/safetyFacilities',
      // 查询表单绑定变量
      queryForm: {
        status: 1, // 状态（0损坏，1正常，2停用）
        categoryCodeId: '',   // 类别
        facilitiesName: '', // 安全设施具体名称
        sort: 'categoryCodeId+,subcategoryCodeId+,facilitiesNameCodeId',
      },
      dict: { // 字典表数据
        safetyFacilities: [],
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
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export`, { ...this.queryForm }, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `安全设施${new Date().toLocaleDateString()}.xls`;
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
.posion {
    position: absolute;
    right: 0;
    width: 300px;
    bottom: 2px;
}
</style>
