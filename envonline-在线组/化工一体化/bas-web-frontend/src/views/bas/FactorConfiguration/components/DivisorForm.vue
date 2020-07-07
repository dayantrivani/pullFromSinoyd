<template>
  <dialog-modal
    ref="divisor"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}监控因子`"
    append-to-body
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="90px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <el-form-item label="所属类型：" prop="factorType">
        <el-select v-model="itemModel.factorType" @change="typeChange" @blur="$refs.form.validateField('factorType')">
          <el-option :value="1" label="易燃易爆"></el-option>
          <el-option :value="2" label="有毒有害"></el-option>
          <el-option :value="3" label="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="因子：" prop="factorCode">
        <el-select v-model="itemModel.factorCode" @blur="$refs.form.validateField('factorCode')">
          <el-option
            v-for="item in portList"
            :key="item.factorCode"
            :label="item.factorName"
            :value="item.factorCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-tooltip :content="itemModel.isDefaultShow ? '显示' : '不显示'" placement="top">
          <el-switch v-model="itemModel.isDefaultShow"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-tooltip :content="itemModel.status === 1 ? '启用' : '停用'" placement="top">
          <el-switch v-model="itemModel.status"></el-switch>
          <el-switch
            v-model="itemModel.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="排序号：">
        <el-input-number
          v-model="itemModel.sortNum"
          controls-position="right"
          style="width:100%"
          :min="0"
          :precision="0">
        </el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
// import { formatDate, getType } from '@/global/libs/tools';
// import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  props: ['keys'],
  data() {
    return {
      url: 'keypoints/factorDisplayItem',                  // 必须, 接口地址
      itemModel: this.getEmptyItem(),
      // 字典数据
      dict: {},
      portList: [],
      watchType: '',
      rules: {
        factorType: [
          { required: true, message: '请选择所属类型', trigger: ['blur', 'change'] },
        ],
        factorCode: [
          { required: true, message: '请选择因子', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  created() {
    // this.getDictList();
  },
  watch: {
    // eslint-disable-next-line
    'itemModel.factorCode': function (val) {
      if (val) {
        this.portList.forEach((res) => {
          if (res.factorCode === this.itemModel.factorCode) {
            this.itemModel.factorName = res.factorName;
          }
        });
      }
    },
    'itemModel.factorType': {
      handler(newData) {
        this.watchType = newData;
      },
    },
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 类型下拉框_改变时调用获取因子的方法
    typeChange(val) {
      if (this.watchType !== val && this.watchType !== undefined) {
        this.itemModel.factorCode = '';
      }
      this.getFactorName(this.itemModel.factorType);
    },
    // 获取空对象
    getEmptyItem() {
      return {
        mainId: this.keys,
        factorType: '',                   // 所属类型
        factorCode: '',
        factorName: '',                   // 因子名称
        isDefaultShow: false,             // 是否默认显示
        valueType: '',
        status: '0',                      // 单位
        sortNum: '0',                     // 排序值
      };
    },
    openDialog(row) {
      // console.log(row);
      // 合并表单内容
      // this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      // 判断是否有数据来进行下一步操作
      // if (this.itemModel.factorType) {
      //   this.getFactorName(this.itemModel.factorType);
      // }
      if (row) {
        this.getFactorName(row.factorType);
        this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      } else {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
        this.getFactorName();
        this.itemModel = this.getEmptyItem();
      }
      // 是否需要获取字典表
      this.getDictList();
      // 显示编辑表单
      this.$refs.divisor.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.divisor.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
    // 获取因子的方法
    getFactorName(row) {
      const nav = {};
      nav.factorType = row;
      this.$http.post('keypoints/majorHazardsFactors/all', nav).then((response) => {
        if (response.data.success) {
          this.portList = response.data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
