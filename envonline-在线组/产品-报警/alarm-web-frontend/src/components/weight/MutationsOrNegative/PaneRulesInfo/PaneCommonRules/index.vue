<template>
  <!-- 通用规则 -->
  <el-card>

    <!-- 按钮组 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-cog" @click="onClickConfig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
      <el-table-column property="systemTypeName" min-width="100" label="系统类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="systemTypeCode" min-width="100" label="系统编码" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />

    <!-- 新增或编辑对话框 -->
    <dialog-modal ref="dialog" size="mini" title="新增通用规则" @close="closeDialog">
      <el-form :model="itemForm" :rules="rules" ref="form" v-loading="fLoading" label-width="110px" class="pad-x-sm">
        <el-form-item label="系统类型：" prop="systemTypeId">
          <el-select v-model="itemForm.systemTypeId" @change="onInputChange">
            <el-option :label="item.dictName" :value="item.rowGuid"
              v-for="item in systemTypeList" :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统编码：" prop="systemTypeCode">
          <template slot="label">系统编码：
            <span>
              <el-tooltip effect="dark" :content="tooltip" placement="top">
                <i class="el-tooltip el-icon-info"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="itemForm.systemTypeCode" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fas fa-save" v-loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button @click="$refs.dialog.closeDialog()" icon="fa fa-times">关 闭</el-button>
      </div>
    </dialog-modal>

    <!-- 配置按钮对话框 -->
    <rules-edit-no-param ref="configdialog" v-if="!onOff"
      :systemTypeList="systemTypeList" :alarmType="alarmType" @query="getItemList"/>
    <rules-edit-param ref="configdialog" v-else :alarmType="alarmType" @query="getItemList"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import RulesEditNoParam from '../components/RulesEditNoParam.vue';
import RulesEditParam from '../components/RulesEditParam.vue';

export default {
  mixins: [queryList],
  components: {
    RulesEditNoParam,
    RulesEditParam,
  },
  props: {
    systemTypeList: {
      type: Array,
      required: true,
    },
    alarmType: {
      type: Object,
      required: true,
    },
    onOff: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      url: 'alarm/alarmRuleForAbnormal',
      isAuto: false,
      saveLoading: false,
      queryForm: {
        alarmTypeId: '',
      },
      itemList: [],
      itemForm: {
        alarmTypeId: '',   // id
        systemTypeId: '',  // 系统类型
        systemTypeCode: '',  // 系统编码
      },
      fLoading: false,
      tooltip: '选择系统类型后会自动匹配系统编码！',
      rules: {
        systemTypeId: [
          { required: true, message: '请选择系统类型', trigger: ['change', 'blur'] },
        ],
        systemTypeCode: [
          { required: true, message: ' ', trigger: ['change', 'blur'] },
        ],
      },
    };
  },
  methods: {
    onPaneQuery() {
      this.$set(this.queryForm, 'alarmTypeId', this.alarmType.id);
      this.$set(this.itemForm, 'alarmTypeId', this.alarmType.id);
      this.getItemList();
    },
    onClickAdd() {
      this.$set(this.itemForm, 'alarmTypeId', this.alarmType.id);
      this.$refs.dialog.openDialog();
    },
    onClickConfig(row) {
      this.$refs.configdialog.openDialog(row);
    },
    onDeleteItem() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(`${this.url}`, { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
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

    /* 表单 */
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http.post(this.url, this.itemForm)
          .then((response) => {
            if (response.status === 200
            && (response.data.success
              || response.data.msg.includes('未查询到符合条件的数据'))) {
              this.$message.success({
                message: '操作成功',
                duration: 3000,
                showClose: true,
              });
              this.getItemList();
              this.$refs.dialog.closeDialog();
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
    closeDialog() {
      this.itemForm = this.getItemEmpty();
      this.$refs.form.clearValidate();
    },
    // 但系统类型下拉框失去焦点时,
    onInputChange(id) {
      const { dictCode } = this.systemTypeList.filter(item => item.rowGuid === id)[0];
      this.$set(this.itemForm, 'systemTypeCode', dictCode);
    },

    /** 特殊方法 */
    getItemEmpty() {
      return {
        alarmTypeId: '',
        systemTypeId: '',  // 系统类型
        systemTypeCode: '',  // 系统编码
      };
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
