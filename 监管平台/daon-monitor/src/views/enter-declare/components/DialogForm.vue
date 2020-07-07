<template>
  <a-modal
    :visible="isVisible"
    title="申报审核"
    @cancel="closeDialog">
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-form>
        <a-row :gutter="10">
          <a-col :span="12">
            <a-form-item label="企业名称：" :labelCol="{span:8}">{{itemModel.companyName}}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点名称：" :labelCol="{span:8}">{{itemModel.portName}}</a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="12">
            <a-form-item label="开始时间：" :labelCol="{span:8}">{{itemModel.beginAt}}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间：" :labelCol="{span:8}">{{itemModel.endAt}}</a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="12">
            <a-form-item label="申报日期：" :labelCol="{span:8}">{{itemModel.reportedAt}}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运行状态：" :labelCol="{span:8}">
              {{$enum.RUN_STATUS[itemModel.runStatus] || ''}}</a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="申报说明：" :labelCol="{span:4}">{{itemModel.remark || '无'}}</a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="凭证：" :labelCol="{span:4}">
              <uploadTest
                v-if="itemModel.hasAttach"
                :btn="fileOperation"
                ref="upload"
                :id="itemModel2.id"
                :doc-type-id="docTypeId[1]"
                :is-update="isUpdate[1]"
                :isRequest="isRequest[1]"
                :size-limilt="20">
              </uploadTest>
              <span v-if="!itemModel.hasAttach">无</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <div slot="footer">
      <a-button icon="check" @click="onCheck(2)"
        style="background-color:#67c23a;color:#fff" :disabled="itemModel.status !== 1">通 过</a-button>
      <a-button type="danger" icon="close" @click="onCheck(1)" :disabled="itemModel.status !== 1">退 回</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
    <a-modal
      :visible="isVisible2"
      title="审核意见"
      @cancel="closeCheckDialog">
      <span class="required" v-if="auditData.status===1">*</span>
      <a-textarea v-model="auditData.remark" placeholder="请输入审核意见" :rows="4" />
      <div slot="footer">
        <a-button type="primary" @click="onSubmit">确 定</a-button>
        <a-button @click="closeCheckDialog">取 消</a-button>
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
import { getOne, check } from '@/api/modules/enter-declare.js';
import uploadTest from '@/components/locally/upload-test';

export default {
  name: '',
  components: {
    uploadTest,
  },
  data() {
    return {
      itemModel2: { id: 1 },
      isUpdate: [false, false],  // 是否调用上传附件的接口
      isRequest: [false, false], // 是否调用获取附件列表的接口
      docTypeId: ['', ''],       // 上传文档类型
      fileOperation: 'down',     // 只允许下载操作
      isVisible: false,
      isVisible2: false,
      row: {},
      spinning: false,
      itemModel: {},
      auditData: {
        status: '',
        remark: '',
      },
    };
  },
  methods: {
    // 详情弹框显示
    openDialog(row) {
      this.row = row;
      this.spinning = true;
      this.isVisible = true;
      getOne(row.id).then((response) => {
        this.itemModel = response.data.data;
        if (this.itemModel.hasAttach) {
          this.$nextTick(() => {
            this.$refs.upload.fileList = response.data.data.attaches || [];
          });
        }
        this.spinning = false;
      });
    },
    // 详情弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.itemModel = {};
    },
    // 审核意见弹框显示
    openCheckDialog() {
      this.isVisible2 = true;
    },
    // 审核意见弹框隐藏
    closeCheckDialog() {
      this.isVisible2 = false;
      this.auditData.remark = '';
    },
    // 审核事件
    onCheck(num) {
      this.auditData.status = num;
      this.openCheckDialog();
    },
    // 审核确定提交事件
    onSubmit() {
      if (this.auditData.status === 1 && !this.auditData.remark) {
        this.$message.warning('请填写审核意见');
      } else {
        check(this.auditData, this.row).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeCheckDialog();
            this.closeDialog();
            this.$emit('refreshList');
          } else {
            this.$message.warning(response.data.msg, 3);
          }
        });
      }
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
span.required{
  position: absolute;
  top: 80px;
  left: 15px;
  color: red;
}
</style>
