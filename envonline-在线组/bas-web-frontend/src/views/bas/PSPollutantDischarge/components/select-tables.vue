<!-- 弹窗表格选择企业 -->
<template>
  <div>
    <el-tooltip effect="dark" placement="top-start" :disabled="labelModel.length < 9" :content="labelModel">
      <el-input v-model="labelModel" readonly class="z-pointer" :size="size">
        <el-button slot="append" :size="size" @click="openDialog()">
          <i class="fas fa-th-list"></i>
        </el-button>
      </el-input>
    </el-tooltip>
    <!-- 弹窗 -->
    <dialog-modal
      ref="dialog"
      :title="title"
      @close="closeDialog"
      append-to-body
      scrollbar>
      <el-form inline :model="queryForm">
        <el-form-item label="企业名称：">
          <el-input
            v-model="queryForm.psName"
            clearable
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="行政区域：">
          <select-tree-lazy v-model="queryForm.regionCodeId" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-check" @click="onClickCheck">确认</el-button>
        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <el-table
        border
        ref="table"
        height="calc(70vh - 115px)"
        highlight-current-row
        v-loading="loading"
        :data="itemList"
        :row-class-name="_rowClassName"
        @selection-change="onSaveSelected">
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column property="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column property="psShortName" label="企业简称" show-overflow-tooltip></el-table-column>
        <el-table-column property="regionName" label="行政区域" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <paging-query :pager="pager" @query="getItemList" :props="{ page: 'page', rows: 'rows', total: 'count' }"/>
    </dialog-modal>
  </div>
</template>

<script>
import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';

export default {
  name: 'SelectTables',
  components: { SelectTreeLazy },
  // mixin: [queryList],
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    // v-model 传参
    value: Array,
    // label
    label: String,
    // API 接口
    url: {
      type: String,
      required: false,
      default: 'bas/psBaseInfo',
    },
    // 组件大小, 可选 large、small、mini
    size: {
      type: String,
      required: false,
      default: 'mini',
    },
    // 标题
    title: {
      type: String,
      required: false,
      default: '选择企业',
    },
  },
  data() {
    return {
      loading: false,
      valueModel: '',        // 实际值
      labelModel: '',        // 显示值
      queryForm: {
        psName: '',
        regionCodeId: '',
        sort: 'psName',
      },
      itemList: [],
      selectedIds: [],
      pager: {            // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  created() {
    this.labelModel = this.value ? this.label : '';
  },
  computed: {},
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    onSaveSelected(selection) { // 表格选中的数据id
      this.selectedIds = selection.map(val => val.id);
    },
    openDialog() {
      this.onQueryList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 单击查询数据项
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取选项数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
          this.itemList.filter(n => this.selectedIds.includes(n.id)).forEach((row) => {
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(row, true);
            });
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    onClickCheck() {
      const psList = this.itemList.filter(n => this.selectedIds.includes(n.id));
      this.$emit('selected', psList.map(n => n.psId));
      this.labelModel = psList.map(n => n.psName).join(',');
      this.$emit('getPsName', this.labelModel);
      this.closeDialog();
    },
  },
};
</script>
