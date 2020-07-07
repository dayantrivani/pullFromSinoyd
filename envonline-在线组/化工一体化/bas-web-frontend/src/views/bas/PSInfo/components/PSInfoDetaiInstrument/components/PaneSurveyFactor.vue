<template>
  <!-- 监测因子 -->
  <div class="PaneSurveyFactor">

    <!-- 查询条件 -->
    <el-form class="mar-x-sm mar-t-xs" inline>
      <el-form-item label="关键字：">
        <el-input v-model="queryForm.key" style="width: 220px;"
          placeholder="监测因子、因子编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div class="mar-b-xs mar-l-sm">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(86vh - 192px)"
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
      <el-table-column property="factorsName" label="监测因子" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorsCode" label="因子编号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="status" label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.status ? '启用' : '停用' }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>


    <!-- 新增编辑表单 -->
    <dialog-modal
      ref="editDialog"
      title="编辑监测因子"
      size="mini"
      append-to-body
      @close="closeDialogBody"
    >
      <el-form ref="form" label-position="right" label-width="75px"
        v-loading="formLoading" :model="itemForm" :rules="rules"
      >
        <el-form-item label="污染物：" prop="factorsId">
          <el-select v-cloak v-model="itemForm.factorsId" filterable>
            <el-option v-for="(item,index) in select.factorsList" :key="index"
              :label="item.factorName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-cloak v-model="itemForm.status">
            <el-option label="停用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fas fa-save" v-loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button icon="fa fa-times" @click="$refs.editDialog.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>

    <!-- 新增因子 -- 污染物批量配置 -->
    <survey-dialog ref="surveyDialog" @add="addItemList"/>
  </div>
</template>

<script>
// 引入混合 - 保存记录方法
import { queryList } from '@/global/libs/mixins';
import SurveyDialog from '@/components/widgets/SurveyDialog.vue';
import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  mixins: [queryList],
  components: {
    SurveyDialog,
  },
  props: {
    row: {
      type: Object,
      defatul() {
        return {};
      },
    },
  },
  data() {
    return {
      url: 'bas/instrumentFactors/',   // 必须, 接口地址
      isAuto: false,
      queryForm: {
        key: '',
        instrumentId: '',
      },
      loading: false,
      itemList: [],
      /* 弹框 */
      saveLoading: false,
      formLoading: false,
      itemForm: {
        factorsId: '',
        factorsName: '',
        status: '',
      },
      rules: {
        factorsId: [
          { required: true, trigger: 'change', message: '请选择污染物' },
        ],
        status: [
          { required: true, trigger: 'change', message: '请选择状态' },
        ],
      },
      // 下拉框数据
      select: {
        factorsList: [],
      },
    };
  },
  computed: {
  },
  methods: {
    onPaneQuery() {
      this.$set(this.queryForm, 'instrumentId', this.row.id);
      this.getItemList();
    },
    onClickAdd() {
      this.$refs.surveyDialog.openDialog();
    },
    onDeleteItem() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/instrumentFactors/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
          this.selectedIds = [];
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
    onClickEdit(row) {
      this.$refs.editDialog.openDialog();
      this.getPollutionList();
      this.itemForm = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /* 弹框 */
    onSaveItem() {
      // 获取污染物名称
      this.select.factorsList.forEach((item) => {
        if (item.id === this.itemForm.factorsId) {
          this.$set(this.itemForm, 'factorsName', item.factorName);
        }
      });
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        // const data = this.factorData;
        this.$http.put('bas/instrumentFactors/', {
          // id: data.id,
          // instrumentId: data.instrumentId,
          // factorsId: data.factorsId,
          id: this.itemForm.id,
          instrumentId: this.itemForm.instrumentId,
          factorsId: this.itemForm.factorsId,
          status: this.itemForm.status,
          factorsName: this.itemForm.factorsName,
          factorsCode: this.itemForm.factorsCode,
        }).then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.getItemList();
            this.$refs.editDialog.closeDialog();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.saveLoading = false;
        });
      });
    },
    closeDialogBody() {
      this.formLoading = false;
      this.itemForm = this.getEmptyItem();
      this.$refs.form.clearValidate();
    },

    /* 特殊 */
    getEmptyItem() {
      return {
        factorsName: '',
        factorsId: '',
        status: '',
      };
    },
    // 获取污染物数据列表
    getPollutionList() {
      this.formLoading = true;
      this.$http.get('cfg/factors/', {
        params: {
          page: 1,
          rows: 1000000,
          factorCode: '',
          factorsType: '',
          oldFactorCode: '',
          factorsname: '',
        },
      }).then((response) => {
        if (response.data.success) {
          this.select.factorsList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.formLoading = false;
      });
    },
    // 批量新增因子
    addItemList(val) {
      const dataList = [];
      val.selectedIds.forEach((item) => {
        const data = {
          instrumentId: this.row.id,           // 主页的id
          factorsId: item.id,                  // 检测项目id
          status: 0,                           // 状态
          factorsName: item.factorName,        // 因子名称
          factorsCode: item.factorCode,        // 因子编码
        };
        dataList.push(data);
      });
      this.$http.post('bas/instrumentFactors/', dataList)
        .then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.getItemList();
            this.$refs.surveyDialog.closeDialog();
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
    assign(target, o) {
      Object.keys(target).forEach((key) => { this.$set(target, key, o[key]); });
    },
    // tabs 关闭时, 该页需要重置的值
    onPaneClose() {
      this.queryForm = {
        key: '',
        instrumentId: '',
      };
      this.select.factorsList = [];
      this.itemList = [];
    },
  },
};
</script>
