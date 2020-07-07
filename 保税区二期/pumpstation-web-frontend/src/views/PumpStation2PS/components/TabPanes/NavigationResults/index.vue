<template>
  <!-- 基本信息 -->
  <div style="width: 100%; height: 100%;">
    <div class="mar-y-xs mar-l-sm fill-auto">
      <el-button type="primary" icon="fas fa-save" @click="onSaveItem">保 存</el-button>
    </div>
    <div class="title-info mar-t-xs mar-l-sm">走航结论填写</div>
    <hr class="mar-x-sm">
    <el-form label-width="100px" ref="form" :rules="formRules" v-loading="formLoading"
      class="item-space mar-x-sm mar-t-xs" :model="itemModel">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="走航结果：" prop="voyageresult">
            <el-select v-model="itemModel.voyageResult">
              <el-option
                v-for="(item,index) in $enum.get('TASK_RESULT')"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="总体结论：" prop="voyageConclusion">
            <el-input
              type="textarea"
              v-model="itemModel.voyageConclusion"
              :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr class="mar-x-sm block">
    <div class="title-info mar-t-xs mar-l-sm">走航结果</div>

    <!-- 按钮组 -->
    <div class="mar-y-xs mar-l-xs fn-flex">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
      <div class="pad-r-lg pad-t-xs flex-1 text-right">
        参考《江苏省化学工业 VOCs 排放标准（DB32/3151-2016）》限值
      </div>
    </div>

    <el-table
      border
      highlight-current-row
      class="border-cell"
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="117">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编 辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorName" label="超标特征污染物" min-width="125" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" property="factorValue" min-width="130" show-overflow-tooltip>
        <template slot="header">
          <p>污染物浓度</p>
          <p>(ug/m3)</p>
        </template>
      </el-table-column>
      <el-table-column align="center" property="alertUpper" min-width="110" show-overflow-tooltip>
        <template slot="header">
          <p>标准限值</p>
          <p>(ug/m3)</p>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-form ref="dialog" @query="getItemList" :mainrow="mainrow"/>
  </div>
</template>

<script>
import _ from 'lodash';
import { queryList, deleteItem, saveItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'NavigationResults',
  mixins: [queryList, deleteItem, saveItem],
  components: {
    DialogForm,
  },
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: 'voyage/resultDetail',
      isAuto: false,
      itemModel: {
        voyageResult: 0,         // 走航结果
        voyageConclusion: '',    // 走航结论
      },
      queryForm: {               // 查询条件
        voyageId: '',
        sort: 'psName+,factorName+',
      },
      formRules: {
        voyageResult: [
          { required: true, message: '请选择走航结果', trigger: ['blur', 'change'] },
        ],
        // voyageConclusion: [
        //   { required: true, message: '请输入走航结论', trigger: ['blur', 'change'] },
        // ],
      },
      itemList: [],              // 列表数据
    };
  },
  computed: {
  },
  methods: {
    openDialog() {
      this.itemModel = _.cloneDeep(this.mainrow);
      this.queryForm.voyageId = this.mainrow.id;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
      this.onQueryList();
    },
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },

    /* 请求接口 */
    onSaveItem() {
      this.saveLoading = true;
      this.formLoading = false;
      this.$http.put('voyage/taskInfo', this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data || {};
            this.$emit('query', true);
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
          this.formLoading = false;
        });
    },

    /* 特殊方法 */
    closeDialog() {       // 关闭窗口
      this.itemModel = {
        voyageResult: 0,         // 走航结果
        voyageConclusion: '',    // 走航结论
      };
      this.itemList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
