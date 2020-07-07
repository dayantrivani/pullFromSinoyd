<template>
  <dialog-modal ref="dialog" size="small" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}粉尘信息`" @close="closeDialog">
    <el-form ref="form" label-position="right" label-width="160px" :rules="rules" :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="粉尘种类：" prop="dustTypeCodeId">
            <el-select v-model="itemModel.dustTypeCodeId" autofocus clearable filterable>
              <el-option v-for="item in dustType" :key="item.rowGuid" :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="涉粉作业人数：" prop="workerNum">
            <el-input :maxlength="20" v-model="itemModel.workerNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="涉粉单班作业人数：" prop="singleShiftNum">
            <el-input :maxlength="20" v-model="itemModel.singleShiftNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否有除尘器：" prop="isDuster">
            <el-select v-model="itemModel.isDuster" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="除尘器种类：" prop="dusterType">
            <el-select v-model="itemModel.dusterType" autofocus clearable>
              <el-option v-for="item in $enum.DUSTERTYPE" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否建立粉尘清扫制度：" prop="isDustClear">
            <el-select v-model="itemModel.isDustClear" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否安装监控：" prop="isMonitor">
            <el-select v-model="itemModel.isMonitor" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否通过验收：" prop="isAcceptanceCheck">
            <el-select v-model="itemModel.isAcceptanceCheck" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="除尘器数量：" prop="dusterNum">
            <el-input :maxlength="20" v-model="itemModel.dusterNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否涉爆：" prop="isExplosion">
            <el-select v-model="itemModel.isExplosion" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="是否职业病危害因素：" prop="isOccupHazards">
            <el-select v-model="itemModel.isOccupHazards" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input :maxlength="500" type="textarea" v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
// import { validateNum, validateTel } from '@/libs/tools';

export default {
  data() {
    return {
      url: 'wholeprocess/dustInfo',
      itemModel: this.getEmptyItem(),
      rules: {
        dustTypeCodeId: [
          { required: true, message: '请选择粉尘种类', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  props: {
    dustType: {
      type: Array,
    },
  },
  mixins: [saveItem],
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  created() {
    this.getDictList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        dustTypeCodeId: '', // 粉尘种类
        workerNum: '', // 涉粉作业人数
        singleShiftNum: '', // 涉粉单班作业人数
        isDuster: '', // 是否有除尘器
        dusterType: '', // 除尘器种类
        isDustClear: '', // 是否建立粉尘清扫制度
        isMonitor: '', // 是否安装监控
        isAcceptanceCheck: '', // 是否通过验收
        dusterNum: '', // 除尘器数量
        isExplosion: '', // 是否涉爆
        isOccupHazards: '', // 是否职业病危害因素
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
