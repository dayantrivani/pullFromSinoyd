<template>
  <!-- 站点因子修约及转换配置 -->
  <div>
    <dialog-modal ref="dialog" title="站点因子修约及转换配置" size="large">
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
        height="calc(100% - 79px)"
        class="mar-t-sm"
        :data="itemList"
        @selection-change="onSaveSelected">
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
        <el-table-column label="操作" align="center" width="67">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column property="factorName" label="因子名称" show-overflow-tooltip></el-table-column>
        <el-table-column property="factorCode" label="因子编号" show-overflow-tooltip></el-table-column>
        <el-table-column property="valueTypeName" label="值类型" show-overflow-tooltip></el-table-column>
        <el-table-column property="roundNum" label="修约位数" show-overflow-tooltip></el-table-column>
        <el-table-column property="convertNum" label="单位转换" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="是否启用修约">
          <template slot-scope="scope">
            {{ scope.row.isEnabledRound ? '启用' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否启用转换">
          <template slot-scope="scope">
            {{ scope.row.isEnabledConvert ? '启用' : '停用' }}
          </template>
        </el-table-column>
      </el-table>
      <paging-query :pager="pager" @query="getItemList"/>
    </dialog-modal>

    <!-- 修改设置污染物 -->
    <dialog-modal ref="editDialog" :title="`${this.itemModel.id ? '编辑' : '新增'}设置污染物`" size="mini">
      <el-form
        ref="form"
        label-width="120px"
        :model="itemModel"
        :rules="rules"
      >
        <el-form-item label="因子名称：" :rules="[
          {required: true, message: '请选择污染物因子', trigger: 'change'},
        ]">
          <el-input v-model="factorsName" disabled></el-input>
        </el-form-item>
        <el-form-item label="值类型：" prop="valueType">
          <el-select v-model="itemModel.valueType" @change="onChangeValueType" style="width: 100%">
            <el-option
              v-for="(item,index) in dict[Object.keys(dict)[this.portType - 1]]"
              :key="index"
              :label="item.dictName" :value="item.rowGuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修约位数：">
          <el-input-number
            v-model="itemModel.roundNum"
            controls-position="right"
            :min="0"
            :max="2147483647"
            :precision="0"
            style="width: 100%;"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="修约是否启用：" prop="isEnabledRound">
          <el-select v-model="itemModel.isEnabledRound" style="width: 100%">
            <el-option label="停用" :value="false"></el-option>
            <el-option label="启用" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位转换：">
          <el-input-number
            v-model="itemModel.convertNum"
            controls-position="right"
            :min="0"
            :max="2147483647"
            style="width: 100%;"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="转换是否启用：" prop="isEnabledConvert">
          <el-select v-model="itemModel.isEnabledConvert" style="width: 100%">
            <el-option label="停用" :value="false"></el-option>
            <el-option label="启用" :value="true"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem()">保 存</el-button>
        <el-button icon="fa fa-times" @click="$refs.editDialog.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
  </div>
</template>

<script>
import { queryList } from '@/plugins/mixins';

export default {
  mixins: [queryList],
  name: 'FactoryConfigDialog',
  data() {
    return {
      loading: false,
      saveLoading: false,
      selectedIds: [],
      itemList: [], // 修约及配置列表
      factorsName: '',
      itemModel: {
        portFactorId: '', // 排口相关的因子id
        portId: '', // 站点id
        factorId: '', // 因子id
        factorCode: '', // 因子编号,
        valueType: '', // 值类型,
        valueTypeName: '', // 值类型名称,
        roundNum: '', // 修约位数,
        convertNum: '', // 单位转换,
        isEnabledRound: '', // 是否启用,
        isEnabledConvert: '', // 是否启用,
      }, // 修约及配置参数
      portType: 1,
      dict: {
        FactorValueTypeWater: [], // 废水值类型
        FactorValueTypeAir: [], // 废气值类型
        FactorValueTypeNoise: [], // 噪声值类型
        FactorValueTypeSoild: [], // 固废值类型
      },
      pager: {
        page: 1,
        rows: 15,
        total: 0,
      },
      rules: {                // 编辑表单验证规则
        valueType: [
          { required: true, trigger: 'change', message: '请选择值类型' },
        ],
        isEnabledRound: [
          { required: true, trigger: 'change', message: '请选择是否启用修约' },
        ],
        isEnabledConvert: [
          { required: true, trigger: 'change', message: '请选择是否启用转换' },
        ],
      },
      factorsList: [],
    };
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 保存选中项 id
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    openDialog(row) { // 打开弹窗
      this.portType = row.portType; // 站点类型
      this.factorsName = row.factorsName; // 因子名称
      this.itemModel.portFactorId = row.id; // 排口相关因子id
      this.itemModel.portId = row.portId; // 站点id
      this.itemModel.factorId = row.factorsId; // 因子id
      this.itemModel.factorCode = row.factorsCode; // 因子编号
      this.getDictItem();
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() { // 关闭弹窗
      this.$refs.dialog.closeDialog();
    },
    onClickAdd() {
      const emptyItem = {
        valueType: '',
        valueTypeName: '',
        roundNum: '',
        convertNum: '',
        isEnabledRound: '',
        isEnabledConvert: '',
      };
      this.itemModel = Object.assign(this.itemModel, emptyItem);
      if (this.itemModel.id) {
        delete this.itemModel.id;
      }
      this.$refs.editDialog.openDialog();
    },
    onClickEdit(row) {
      this.itemModel = row ? Object.assign(this.itemModel, row) : this.itemModel;
      this.$refs.editDialog.openDialog();
    },
    beforeCloseDialog() {
      this.$emit('close');
    },
    // 新增/编辑  修约 转换 配置
    getDictItem() { // 获取值类型下拉框数据
      Object.keys(this.dict).forEach(((key) => {
        if (this.dict[key].length === 0) {
          this.$http.get('sys/enumCode', {
            params: { codeValue: key },
          }).then((response) => {
            this.dict[key] = [...response.data];
          });
        }
      }));
    },
    onChangeValueType(val) {
      const name = this.dict[Object.keys(this.dict)[this.portType - 1]].filter(n => n.rowGuid === val)[0].dictName;
      this.itemModel.valueTypeName = name;
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/portInfo2FactorsValueType/', {
        params: { page, rows, portFactorId: this.itemModel.portFactorId },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.total = response.data.count;
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
    // 删除数据项
    onDeleteItem() { // 删除因子修约及转换
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/portInfo2FactorsValueType', { data: this.selectedIds })
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
    // 保存数据项
    onSaveItem() { // 保存因子修约及转换
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http[this.itemModel.id ? 'put' : 'post']('bas/portInfo2FactorsValueType', { ...this.itemModel })
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
  },
};
</script>

<style lang="scss" scoped>
</style>
