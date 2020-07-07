<template>
  <a-modal
    class="enter-dialog"
    width="550px"
    title="大队确认信息"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
  <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item label="大队反馈信息：" :labelCol="{span:5}" :wrapperCol="{span:19}">
              <a-input type='textarea' v-decorator="[
                'verifyRemark',
                {
                  rules: [
                    {required: true, message: '请输入大队反馈信息！',}
                  ],
                }]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="上传附件：" :labelCol="{span:5}" :wrapperCol="{span:19}">
              <uploadTest
                ref="uploadTest"
                @onChangeList="onChangeList"
                :id="itemModel2.id"
                :doc-type-id="docTypeId[1]"
                :is-update="isUpdate[1]"
                :isRequest="isRequest[1]"
                :col="2"
                :size-limilt="20"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <div slot="footer">
      <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import { emptyForm, save } from '@/api/modules/real-stand-manage.js';
import uploadTest from '@/components/locally/upload-test';

export default {
  name: 'confirmDialog',
  components: {
    uploadTest,
  },
  data() {
    return {
      isVisible: false,           // 弹框显示隐藏
      spinning: false,            // 表单加载状态
      form: this.$form.createForm(this),
      itemModel2: { id: 1 },
      isUpdate: [false, false],  // 是否调用上传附件的接口
      isRequest: [false, false], // 是否调用获取附件列表的接口
      docTypeId: ['', ''],       // 上传文档类型
      itemModel: emptyForm(),
      row: {}, // 记录当前选中数据
    };
  },
  methods: {
    openDialog(row) {
      this.row = row;
      this.isVisible = true;
      this.$nextTick(() => {
        this.$refs.uploadTest.fileList = [];
      });
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.form.resetFields();
    },
    // 保存点击事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.itemModel.verifyRemark = fieldsValue.verifyRemark;
        save(this.itemModel, this.row).then((res) => {
          if (res.data.code === 200 && res.data.success) {
            this.$message.success('操作成功', 1.5);
            this.closeDialog();
            this.$emit('getItemList');
          }
        });
      });
    },
    // 修改附件列表
    onChangeList(list) {
      this.itemModel.attachIds = list;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
