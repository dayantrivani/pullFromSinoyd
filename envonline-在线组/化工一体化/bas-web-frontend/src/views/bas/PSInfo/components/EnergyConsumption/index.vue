<!-- 详细--能耗表信息 -->
<template>
  <el-card type="title">
    <!-- 标题内容 -->
    <template slot="header">能耗表信息</template>

    <!-- 检索条件 -->
    <div class="mar-t-xs mar-l-sm">
      <el-form :model="queryForm" inline>
        <el-form-item label="能耗表名称：">
          <el-select v-model="queryForm.type" style="width: 150px">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="电表"></el-option>
            <el-option :value="2" label="水表"></el-option>
            <el-option :value="3" label="汽表"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <hr>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 109px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="type" label="所属类型" width="130" show-overflow-tooltip
      :formatter="changeOne"></el-table-column>
      <el-table-column property="name" label="名称" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="code" label="编码" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否总进线" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.isIncomingLine ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column property="longitude" label="经度" width="120"></el-table-column>
      <el-table-column property="latitude" label="纬度" width="164"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialogform" @query="getItemList" />
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';

export default {
  name: 'EnergyConsumption',
  mixins: [
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'energy/equipmentInfo',
      // 检索表单项数据源
      queryForm: {
        type: 0,
      },
      // 列表数据源
      itemList: [],
      loading: false,     // 数据列表加载状态
      // 企业数据源
      psInfoList: [],
      selected: [],       // 已选择的数据对象
      selectedIds: [],    // 已选择的数据 id 数组
      selectedIndexs: [], // 已选择的数据的索引
      pager: {            // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  created() {
    this.onQueryList();
  },
  computed: {
    psInfo() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo || JSON.parse(window.sessionStorage.getItem('psInfo'));
    },
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  watch: {
    itemList() {
      this.selectedIndexs = [];
    },
  },
  methods: {
    // 当选择项发生变化时会触发该事件
    onChangeSelected(option) {
      this.selected = option;
      this.selectedIds = option.map(val => val.id);
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    onChangeCheck(selection, row) {
      const rowindex = this.itemList.findIndex(v => v === row);
      const index = this.selectedIndexs.findIndex(v => v === rowindex);
      if (index !== -1) {
        this.selectedIndexs.splice(index, 1);
      } else {
        this.selectedIndexs.push(rowindex);
      }
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    onChangeCheckAll(selection) {
      const len = selection.length;
      const all = [];
      if (len) {
        for (let i = 0; i < len; i++) { all.push(i); }
      }
      this.selected = selection;
      this.selectedIndexs = all;
    },
    rowClassName({ rowIndex }) {
      const className = 'selected-row';
      return this.selectedIndexs.includes(rowIndex) ? className : '';
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },

    // 新增按钮
    onClickAdd() {
      this.$refs.dialogform.openDialog();
    },
    // 编辑
    onClickEdit(row) {
      this.$refs.dialogform.openDialog(row);
    },
    // 改变状态值
    changeOne(row) {
      if (row.type === 1) {
        return '电表';
      }
      if (row.type === 2) {
        return '水表';
      }
      if (row.type === 3) {
        return '汽表';
      }
      return '';
    },
    // 获取列表内容
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('energy/equipmentInfo', {
        params: {
          page,
          rows,
          psId: `${this.userType === 'gov' ? this.psInfo.id : this.orgGuid}`,
          type: this.queryForm.type,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
