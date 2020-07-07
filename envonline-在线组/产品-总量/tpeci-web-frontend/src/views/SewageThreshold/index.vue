<template>
  <!-- 排污阈值 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>
        <el-form-item label="配置方案名称：">
          <el-input
            v-model="queryForm.schemeName"
            placeholder="配置方案名称"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>

      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" v-if="isShow">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
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
      :height="isShow ? 'calc(100% - 69px)' : 'calc(100% - 31px)'"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column v-if="isShow" align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" :width="isShow ? 127 : 76">
        <template slot-scope="scope">
          <el-button v-if="isShow" type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="primary" :icon="`${isShow ? 'fas fa-file-invoice' : 'fas fa-eye'}`" @click="onClickConfig(scope.row)">
            {{ isShow ? '配置' : '查看' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="配置方案名称" prop="schemeName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="备注" prop="remark" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="方案对应站点" prop="portNames" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <dialog-form ref="dialog" @query="getItemList"/>
    <dialog-config ref="config"/>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import DialogConfig from '@/components/widgets/SewageThresholdConfig/DialogConfig';


export default {
  name: 'SewageThreshold',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
    DialogConfig,
  },
  data() {
    return {
      url: 'tpeci/valveScheme',
      isAuto: false,
      isShow: true,
      loading: false,
      queryForm: {                  // 检索表单项
        psId: '',                   // 企业id
        schemeName: '',             // 配置方案名称
        sort: 'schemeName',
      },
      itemList: [],
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    if (this.userType === 'ent') {
      this.isShow = false;
      this.$set(this.queryForm, 'psId', this.orgGuid);
    }
    this.onQueryList();
  },
  methods: {
    onClickAdd() {                  // 新增按钮
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {              // 编辑按钮
      this.$refs.dialog.openDialog(row);
    },
    onClickConfig(row) {            // 配置按钮
      this.$refs.config.openDialog(row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
