<template>
  <el-card type="title">
    <template slot="header">
      危险化学品及高危工艺管理
    </template>
    <div class="mar-x-sm mar-y-xs">
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
      height="calc(100% - 71px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="76">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <!-- <el-button type="primary" icon="fas fa-file-invoice" @click="onClickEdit(scope.row)">详情</el-button> -->
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column
        property="keyChemicalsNames"
        label="首批60种重点监管危险化学品名称"
        min-width="240"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="keyTechnologiesNames"
        label="首批15种重点监管危险工艺"
        min-width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        property="industryTypeNames"
        label="危险化学品从业单位类型"
        width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column property="licenseNumber" label="许可证编号" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="licenseValidityDate" label="许可证有效日期" width="120">
        <template slot-scope="scope">
          {{ scope.row.licenseValidityDate === '1900-01-01 00:00:00' ? '' : scope.row.licenseValidityDate | date }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()"/>

    <!-- 编辑弹框 -->
    <dialog-form ref="dialog" @query="getItemList()" />
  </el-card>
</template>


<script>
import { mapGetters } from 'vuex';
import DialogForm from './components/DialogForm';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'DangChemManage',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  computed: mapGetters('auth', ['userType']),
  data() {
    return {
      url: 'bas/dangChemInfo',
      // 字典数据
      dict: {
        SixtyKeyHazardousChemicals: [],   // 首批60种重点监管危险化学品名称
        FifteenKeyHazardousProcesses: [], // 首批15种重点监管危险工艺
      },
      // 查询表单绑定变量
      queryForm: {
        psName: '',                 // 企业名称
        keyChemicalsNameCodeId: '', // 危化品id 请做成下拉单选
        keyTechnologiesCodeId: '',  // 危险工艺id 请做成下拉单选
        psId: JSON.parse(sessionStorage.getItem('psInfo')).id,                   // 一企一档才需要传psid
      },
    };
  },
  created() {
    this.getDictList();
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
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
  },
};
</script>
