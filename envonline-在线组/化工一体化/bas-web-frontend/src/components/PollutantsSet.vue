<template>
  <!-- 污染物设置组件 -->
  <div>
    <dialog-modal ref="dialog" title="污染物设置">
      <div class="mar-y-xs">
        <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
        <el-button
          type="danger"
          icon="fas fa-trash-alt"
          :disabled="!selectedIds.length"
          @click="onDeleteItem">删 除
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        height="55vh"
        class="mar-t-sm"
        :data="itemList"
        @selection-change="onSaveSelected">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column property="factorsName" label="检测因子" show-overflow-tooltip></el-table-column>
        <el-table-column property="factorsCode" label="因子编号" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status ? '启用' : '停用' }}
          </template>
        </el-table-column>
      </el-table>
      <paging-query :pager="pager" @query="getItemList"/>
    </dialog-modal>
  <!-- 修改设置污染物 -->
    <dialog-modal ref="editDialog" title="修改设置污染物" size="mini">
      <el-form ref="form" label-position="right" label-width="110px" :model="itemModel" :rules="rules">
        <el-form-item label="污染物：">
          <el-select v-model="itemModel.factorsId">
            <el-option
              v-for="(item,index) in factorsList"
              :key="index"
              :label="item.factorName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="itemModel.status">
            <el-option label="停用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem()">保 存</el-button>
        <el-button icon="fa fa-times" @click="$refs.editDialog.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
    <survey-dialog ref="surveySecondDialog" @add="fillTableData"/>
  </div>
</template>

<script>
// import { queryList } from '@/global/libs/mixins';
import SurveyDialog from '@/components/widgets/SurveyDialog';

export default {
  components: {
    SurveyDialog,
  },
  // mixins: [queryList],
  name: 'pollutantsSet',
  props: {
    id: {
      type: String,
      required: true,
    },
    listType: {
      type: Number,
      required: false,
    },
  },
  created() {},
  // watch: {
  //   id() {
  //     this.getItemList();
  //   },
  // },
  data() {
    return {
      loading: false,
      saveLoading: false,
      activeUrl: '',
      // dialogVisibleAdd: false,
      selectedIds: [],
      // 文档列表
      itemList: [],
      itemModel: {},
      // 上传文件列表
      fileList: [],
      selected: [],
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
      rules: {                // 编辑表单验证规则
        factorsName: [
          { required: true, trigger: 'change', message: '请选择污染物' },
        ],
        status: [
          { required: true, trigger: 'change', message: '请选择状态' },
        ],
      },
      factorsList: [],
    };
  },
  methods: {
    openDialog(id) { // 打开弹窗
      this.getItemList(id);
      this.$refs.dialog.openDialog();
    },
    closeDialog() { // 关闭弹窗
      this.$refs.dialog.closeDialog();
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 保存选中项 id
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    onClickAdd() {
      // this.dialogVisibleAdd = true;
      this.$refs.surveySecondDialog.openDialog(this.listType || '');
    },
    onClickEdit(row) {
      this.itemModel = { ...row };
      this.getFactorList();
      this.$refs.editDialog.openDialog();
    },
    beforeCloseDialog() {
      this.$emit('close');
    },
    onDialogAddClose() {},
    onDialogEditClose() {},
    // 获取数据项列表
    getItemList(id) {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/portInfoFactors', {
        params: { page, rows, portId: id || this.id },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 获取因子(污染物)项列表
    getFactorList() {
      this.$http.get('cfg/factors', {
        params: { page: 1, rows: 1000000, category: this.listType },
      }).then((response) => {
        if (response.data.success) {
          this.factorsList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    // 保存数据项
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.factorsList.forEach((val) => {
          if (this.itemModel.factorsId === val.id) {
            this.itemModel.factorsCode = val.factorCode;
            this.itemModel.factorsName = val.factorName;
            // this.itemModel.id = this.itemModel.factorsId;
          }
        });
        this.saveLoading = true;
        this.$http.put('bas/portInfoFactors/', this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: '修改成功',
                duration: 1500,
                showClose: true,
              });
              this.getItemList();
              this.$refs.editDialog.closeDialog();
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 1500,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 删除数据项
    onDeleteItem() {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/portInfoFactors', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    fillTableData(data) {
      const tempList = [];
      data.selectedIds.forEach((element) => {
        tempList.push({
          portId: this.id,
          psId: this.$store.state.psInfo.id,
          factorsCode: element.factorCode,
          factorsId: element.id,
          factorsName: element.factorName,
        });
      });
      if (tempList.length !== 0) {
        this.postInstrument(tempList);
      }
    },
    postInstrument(temp) { // 新增数据
      // 现在addData为数组，且未json化
      this.$http.post('bas/portInfoFactors/', temp)
        .then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 1500,
              showClose: true,
            });
            this.getItemList(); // 调用刷新方法
            this.$refs.surveySecondDialog.closeDialog();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        });
    },
  },
};
</script>

<style scoped>

</style>
