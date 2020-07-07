<template>
  <div>
    <div class="mar-y-xs mar-l-sm">
      <!-- 新增 -->
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <!-- 删除 -->
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()"
      >删 除</el-button>
      <!-- 批量保存 -->
      <el-button type="primary" icon="fas fa-save" :loading="saveLoad" :disabled="!dataOrigin.length"
      @click="onSaveChecks">批量保存</el-button>
    </div>
    <el-table
      border
      highlight-current-row
      height="calc(89vh - 98px)"
      v-loading="loading"
      :data="itemList"
      :header-cell-style="tableHeaderColor"
      :row-class-name="rowClassName"
      @cell-click="onCellClick"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="70">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="flag" label="标记位" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="description" label="说明" min-width="400" show-overflow-tooltip></el-table-column>
      <el-table-column property="dataIsValid" label="是否有效" min-width="90">
        <template slot-scope="{ row, $index }">
          <el-switch
            v-show="showInput($index, 'dataIsValid')"
            v-model.trim="row.dataIsValid"
            @change="changeSwitch(row)"
          ></el-switch>
          <span v-show="!showInput($index, 'dataIsValid') && row.dataIsValid === true">
            <i class="fas fa-check text-success"></i>
          </span>
          <span v-show="!showInput($index, 'dataIsValid') && row.dataIsValid === false">
            <i class="fas fa-times text-danger"></i>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框内容 -->
    <dialog-modal
      ref="dialog"
      size="mini"
      :title="`${isEdit ? '编辑' : '新增'}${names}标记位规则`"
      @close="closeDialog"
    >
      <el-form
        class="item-space mar-t-sm pad-x-sm"
        ref="form"
        label-position="right"
        label-width="113px"
        v-loading="formLoading"
        :model="itemModel"
        :rules="rules"
      >
        <el-form-item label="标记位：" prop="flag" hint-down>
          <el-input v-model="itemModel.flag" autofocus></el-input>
        </el-form-item>
        <el-form-item label="标记说明：" prop="description">
          <el-input
            type="textarea"
            v-model="itemModel.description"
            :autosize="{ minRows: 2, maxRows: 2}"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否有效：" prop="dataIsValid">
          <el-tooltip :content="itemModel.dataIsValid ? '是' : '否'" placement="top">
            <el-switch
              v-model="itemModel.dataIsValid"
              :active-value="true"
              :inactive-value="false">
            </el-switch>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          icon="fas fa-save"
          :loading="saveLoading"
          @click="onSave"
        >保 存</el-button>
        <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
      </div>
    </dialog-modal>
  </div>
</template>

<script>
// import DialogForm from './DialogForm';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { getType } from '@/global/libs/tools';

export default {
  name: 'WasteWater',
  // 使用混合
  mixins: [
    queryList,
    deleteItem,
  ],
  // components: {
  //   DialogForm,
  // },
  props: {
    ids: { String },
    code: { String },
    names: { String },
  },
  data() {
    return {
      url: 'alarm/alarmRuleForFlag',
      loading: false,                                  // 列表加载状态
      isEdit: false,          // 表单展开状态
      cellEdit: [],
      selectedIds: [],                                    // 删除选中项
      itemList: [],                                      // 列表数据内容,
      tabList: [],
      formLoading: false,                               // 表单加载状态
      saveLoading: false,                               // 按钮加载状态
      itemModel: {            // 表单对象
        flag: '',
        flagName: '正常',
        dataIsValid: false,
        description: '',
      },
      nav: [],
      dataOrigin: [],        // 用于批量保存的数据源
      saveLoad: false,
      // 表单验证
      rules: {
        flag: [
          { required: true, message: '请输入标记位', trigger: ['blur', 'change'] },
        ],
        description: [
          { required: true, message: '请输入标记说明', trigger: ['blur', 'change'] },
        ],
        dataIsValid: [
          { required: true, message: '请输入是否有效', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    alarmType() {
      const [alarmType] = this.$store.state.sample.alarmType.filter(n => n.alarmTypeCode === this.$route.name);
      return alarmType;
    },
  },
  created() {
    this.getPortTypeList();
  },
  methods: {
    // 可编辑表头设置
    tableHeaderColor(tableData) {
      if (tableData.columnIndex >= 5) {
        return 'color: #409EFF !important';
      }
      return '';
    },
    // 设置单元格index值
    rowClassName({ row, rowIndex }) {
      this.$set(row, 'index', rowIndex);
    },
    // 用来判断
    changeSwitch(row) {
      const cav = this.dataOrigin.findIndex(el => row.id === el.id);
      if (cav === -1) {
        this.dataOrigin.push(row);
      } else {
        this.dataOrigin.splice(row, 1);
      }
    },
    // 点击列表某列的方法
    onCellClick(row, column) {
      this.cellEdit = [row.index, column.property];
    },
    // 设置显示的判断条件
    showInput(index, property) {
      return this.cellEdit[0] === index && this.cellEdit[1] === property;
    },

    // 单击新增回调
    onClickAdd() {
      this.isEdit = false;
      this.$refs.dialog.openDialog();
      this.itemModel = this.getEmptyItem();
    },
    onClickEdit(row) {
      this.isEdit = true;
      this.$refs.dialog.openDialog();
      this.getItemOne(row);
    },
    // 新增排口弹窗
    getPortTypeList() {
      this.$http.get('sys/enumCode/PortType/0').then((response) => {
        this.tabList = response.data;
      }, (response) => {
        analyzeResp(response);
      });
    },

    // 获取记录列表
    getItemList(row) {
      this.loading = true;
      this.itemList = [];
      if (row) this.keyId = row;
      this.$http.get(this.url, {
        params: {
          page: 1,
          rows: 100000,
          systemTypeId: `${this.keyId ? this.keyId : 'fb2fd1a9abac4402ad96586febfc0edb'}`,
          alarmTypeId: this.alarmType.id,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
          this.dataOrigin = [];
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
        this.loading = false;
      });
    },

    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
      this.$refs.form.resetFields();
    },
    // 获取空对象
    getEmptyItem() {
      return {
        flag: '',                               // 标记位
        flagName: '正常',
        description: '',                        // 标记说明
        dataIsValid: false,                     // 是否有效
      };
    },
    getItemOne(row) {
      if (!row) return;
      const id = getType(row) === 'object' ? row.id : row;
      this.formLoading = true;
      this.$http.get(`${this.url}/${id}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemModel = Object.assign(this.getEmptyItem(), response.data.data);
        } else {
          this.$message.warning({
            message: response.body.msg,
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
    // 保存按钮
    onSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.itemModel.alarmTypeId = this.alarmType.id;
        this.itemModel.systemTypeCode = this.code;
        this.itemModel.systemTypeId = this.ids;
        this.formLoading = true;
        this.$http[this.isEdit ? 'put' : 'post']('alarm/alarmRuleForFlag', this.itemModel).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.closeDialog();
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
        }).finally(() => {
          this.saveLoading = false;
          this.formLoading = false;
        });
      });
    },
    // 保存
    onSaveChecks() {
      if (this.dataOrigin.length === 0) {
        this.$message('请选择需要删除的数据');
      } else {
        this.saveLoad = true;
        this.$http.put('alarm/alarmRuleForFlag/batch', this.dataOrigin).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            // this.closeDialog();
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
        }).finally(() => {
          this.saveLoad = false;
        });
      }
    },
    // 获取记录列表
    // getItem(row) {
    //   this.itemList = [];
    //   this.loading = true;
    //   this.$http.get(this.url, {
    //     params: {
    //       page: 1,
    //       rows: 100000,
    //       systemTypeId: row,
    //       alarmTypeId: this.alarmType.id,
    //     },
    //   }).then((response) => {
    //     if (response.status === 200 && response.data.success) {
    //       this.itemList = response.data.data;
    //       this.pager.count = response.data.count;
    //     } else {
    //       this.$message.warning({
    //         message: response.data.msg,
    //         duration: 3000,
    //         showClose: true,
    //       });
    //     }
    //   }, ({ response }) => {
    //     analyzeResp(response);
    //   }).finally(() => {
    //     this.loading = false;
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>

</style>
