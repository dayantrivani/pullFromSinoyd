<template>
  <div class="fill-h">
    <div class="title-info mar-y-xs mar-l-sm">基本信息</div>
    <div class="mar-b-xs mar-l-sm">
      <el-button type="primary" icon="fas fa-save" @click="onClickSave">保 存</el-button>
      <!-- <el-button icon="fas fa-times">关 闭</el-button> -->
    </div>
    <hr class="mar-x-sm">
    <el-form
      ref="form"
      label-width="85px"
      class="mar-t-sm item-space mar-x-sm"
      v-loading="formLoad"
      :rules="rules"
      :model="formModel"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="报警名称：" prop="alarmTypeName">
            <el-input v-model="formModel.alarmTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报警编号：" prop="alarmTypeCode">
            <el-input v-model="formModel.alarmTypeCode" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="是否启用：" prop="isEnabled">
            <el-tooltip :content="formModel.isEnabled ? '是' : '否'" placement="top">
              <el-switch
                v-model="formModel.isEnabled"
                :active-value="true"
                :inactive-value="false">
              </el-switch>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序号：" prop="orderNum">
            <!-- 正整数 -->
            <el-input-number
              v-model="formModel.orderNum"
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
            <el-input
              type="textarea"
              v-model="formModel.remark"
              :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template v-if="!['AlarmCouWarn', 'AlarmCou'].includes(alarmType.alarmTypeCode)">
      <hr class="mar-x-sm block">
      <!-- <fieldset-flex title="条件" class="mar-x-sm"> -->
        <div class="mar-y-xs mar-l-sm">
          <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
          <el-button
            type="danger"
            icon="fas fa-trash-alt"
            @click="onDeleteItem(getItemList)"
            :disabled="!selectedIds.length"
          >删 除</el-button>
        </div>
        <el-table
          border
          highlight-current-row
          height="calc(100% - 253px)"
          v-loading="loading"
          :data="itemList"
          @selection-change="onChangeSelected"
        >
          <el-table-column align="center" type="selection" width="37"></el-table-column>
          <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
          <el-table-column align="center" label="操作" width="116">
            <template slot-scope="scope">
              <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column label="报警级别" prop="alarmLevel" show-overflow-tooltip></el-table-column>
          <el-table-column label="超标率下限(%)" prop="rateLow" show-overflow-tooltip></el-table-column>
          <el-table-column label="超标率上限(%)" prop="rateUpper" show-overflow-tooltip></el-table-column>
        </el-table>
      <!-- </fieldset-flex> -->
    </template>
    <dialog-form ref="dialog" @query="getItemList"></dialog-form>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'ExcessiveAlarm',
  mixins: [queryList, deleteItem],
  components: { DialogForm },
  data() {
    return {
      url: 'alarm/alarmRuleForOverProof',
      isAuto: false,
      formLoad: false,
      formModel: {
        alarmTypeName: '',
        isEnabled: false,
        orderNum: '',
        alarmTypeCode: '',
        remark: '',
      },
      queryForm: {
        page: 1,
        rows: 100000,
        alarmTypeId: '',
        sort: 'alarmLevel+',
      },
      loading: false,
      itemModel: {
        shang: '',
        xia: '',
        level: '',
      },
      rules: {
        alarmTypeName: [
          { required: true, message: '请输入报警名称', trigger: 'blur' },
        ],
        alarmTypeCode: [
          { required: true, message: '请输入报警编号', trigger: 'blur' },
        ],
        isEnabled: [
          { required: true, message: '请输入排序值', trigger: 'blur' },
        ],
        orderNum: [
          { required: true, message: '请输入排序值', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getBaseInfo();
  },
  watch: {
    alarmTypeCode(val) {
      if (val) {
        this.getBaseInfo();
      }
    },
  },
  computed: {
    alarmType() {
      const [alarmType] = this.$store.state.sample.alarmType.filter(n => n.alarmTypeCode === this.$route.name);
      return alarmType;
    },
  },
  methods: {
    onSave() {},
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    onClickAdd() {
      this.$refs.dialog.openDialog({ alarmTypeId: this.formModel.id });
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 保存基本信息
    onClickSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.formLoad = true;
        this.formModel.parentId = this.alarmType.parentId;
        this.$http.put('alarm/alarmType', this.formModel)
          .then((response) => {
            if (response.data.code === 200 && response.data.success) {
              this.formModel = response.data.data || {};
            }
            this.$message({
              type: response.data.success ? 'success' : 'warning',
              showClose: true,
              message: response.data.msg,
            });
          }, ({ response }) => {
            analyzeResp(response);
          }).finally(() => {
            this.formLoad = false;
          });
      });
    },
    // 获取基本信息
    getBaseInfo() {
      this.formLoad = true;
      this.$http.get(`alarm/alarmType/${this.alarmType.id}`)
        .then((response) => {
          if (response.data.success) {
            this.formModel = response.data.data;
            this.queryForm.alarmTypeId = this.formModel.id;
            this.getItemList();
          } else {
            this.$message({
              type: 'warning',
              showClose: true,
              message: response.data.msg,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.formLoad = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
