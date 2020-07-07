<template>
  <!-- 突变或负值报警 -->

  <!-- 主体内容 -->
  <div class="main-box">
    <div class="title-info mar-t-xs mar-l-sm">报警信息</div>

    <!-- 按钮组 -->
    <div class="mar-y-xs mar-l-sm fill-auto">
      <el-button type="primary" icon="fas fa-save" @click="onSaveItem">保 存</el-button>
    </div>
    <hr class="mar-x-sm">

    <!-- 表单 -->
    <el-form ref="form" label-width="90px" :model="itemForm" :rules="rules"
      class="item-space mar-x-sm mar-t-xs" v-loading="fLoading"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="报警名称：" prop="alarmTypeName">
            <el-input v-model="itemForm.alarmTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报警编号：" prop="alarmTypeCode">
            <el-input v-model="itemForm.alarmTypeCode" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="是否启用：" prop="isEnabled">
            <el-tooltip :content="itemForm.isEnabled ? '是' : '否'" placement="top">
              <!-- :active-value="1" :inactive-value="0" -->
              <el-switch v-model="itemForm.isEnabled"></el-switch>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序号：" prop="orderNum">
            <!-- 正整数 -->
            <el-input-number
              v-model="itemForm.orderNum"
              controls-position="right"
              :min="0"
              :max="2147483647"
              :precision="0"
              style="width: 100%;"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="itemForm.remark" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <hr class="mar-x-sm block"> -->

    <!-- 按钮组 -->
    <div class="title-info mar-t-xs mar-l-sm">参数配置</div>
    <div class="mar-y-xs mar-l-sm fill-auto">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem"
      >删 除</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 305px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="标识" prop="code" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{
            $enum.alarmCode.filter(n => n.value === row.code).length !== 0
            ? $enum.alarmCode.filter(n => n.value === row.code)[0].label : ''
          }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="220" show-overflow-tooltip></el-table-column>
      <el-table-column label="校验规则" prop="verification" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="排序值" prop="orderNum" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />
    <form-config-param ref="dialog" :alarmType="alarmType"  @query="getItemList"/>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import FormConfigParam from './components/FormConfigParam.vue';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  mixins: [queryList, deleteItem],
  components: { FormConfigParam },
  props: {
    alarmType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: 'alarm/alarmRuleParams',
      fLoading: false,
      isAuto: false,
      queryForm: {
        alarmTypeId: '',
      },
      itemForm: {
        id: '',                   // id
        alarmTypeName: '',        // 报警名称
        alarmTypeCode: '',        // 报警编号
        isEnabled: false,         // 是否启用
        orderNum: '',             // 排序号
        remark: '',               // 备注
      },
      rules: {
        alarmTypeName: [
          { required: true, message: '请输入报警名称', trigger: ['blur', 'change'] },
        ],
        alarmTypeCode: [
          { required: true, message: '请输入报警编号', trigger: ['blur', 'change'] },
        ],
        isEnabled: [
          { required: true, message: '必填', trigger: ['blur', 'change'] },
        ],
        orderNum: [
          { required: true, message: '必填', trigger: ['blur', 'change'] },
        ],
      },
      itemList: [],
    };
  },
  created() {
  },
  methods: {
    onPaneQuery() {
      if (!this.alarmType.id) {
        this.$message.warning({
          message: '右侧树结构存在问题,获取不到对应id值',
          duration: 3000,
          showClose: true,
        });
        return;
      }
      this.$set(this.queryForm, 'alarmTypeId', this.alarmType.id || {});
      this.getItemList();
      this.getFormData();
    },
    getFormData() {
      this.fLoading = true;
      this.$http.get(`alarm/alarmType/${this.alarmType.id}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.assign(this.itemForm, response.data.data);
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          });
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
        this.fLoading = false;
      });
    },
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    onClickEdit(item) {
      this.$refs.dialog.openDialog(item);
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
    onSaveItem() {
      // 保存代码
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http.put('alarm/alarmType', this.itemForm)
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.$message.success({
                message: '操作成功',
                duration: 3000,
                showClose: true,
              });
              this.getFormData();
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
    onPaneClose() {
      this.itemList = [];
      this.selectedIds = [];
      this.itemForm = this.getItemEmpty();
    },

    /** 特殊方法 */
    getItemEmpty() {
      return {
        id: '',                   // id
        alarmTypeName: '',        // 报警名称
        alarmTypeCode: '',        // 报警编号
        isEnabled: false,         // 是否启用
        orderNum: '',             // 排序号
        remark: '',               // 备注
      };
    },
    // 将target对象属性值替换成o对象属性值,但不增删target的属性
    assign(target, o) {
      // const options = JSON.parse(JSON.stringify(o));
      Object.keys(target).forEach((key) => { this.$set(target, key, o[key]); });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-box{
  height: 100%;
  overflow-y: auto;
}
</style>
