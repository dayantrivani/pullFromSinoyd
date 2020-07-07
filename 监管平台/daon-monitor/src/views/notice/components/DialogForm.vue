<template>
  <a-modal
    width="80%"
    :title="`${row.id ? '编辑' : '新增'}公告`"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog">
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-row :gutter="10">
          <a-col :span="12">
            <a-form-item label="公告标题：" :labelCol="{span:4}" :wrapperCol="{span:20}">
              <a-input placeholder="请输入公告标题" v-decorator="[
                'title',
                {
                  rules: [
                    {required: true, message: '请输入公告标题！',}
                  ],
                }
              ]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否发布：" :labelCol="{span:12}" :wrapperCol="{span:12}">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{form.getFieldValue('status')===undefined ? '是' : form.getFieldValue('status') ? '是' : '否'}}</span>
                </template>
                <a-switch v-decorator="[
                  'status',
                  { valuePropName: 'checked',
                    initialValue: true, }
                ]"></a-switch>
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否置顶：" :labelCol="{span:12}" :wrapperCol="{span:12}">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{form.getFieldValue('isTop')===undefined ? '是' : form.getFieldValue('isTop') ? '是' : '否'}}</span>
                </template>
                <a-switch v-decorator="[
                  'isTop',
                  { valuePropName: 'checked',
                    initialValue: false, }
                ]"></a-switch>
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="公告标签：" :labelCol="{span:2}" :wrapperCol="{span:22}">
              <a-select
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                placeholder="输入逗号，分号可快速生成标签"
                :tokenSeparators="['，', ',', ';', '；']"
                mode="tags"
                @change="handleChange"
                v-decorator="['tagList', {
                rules: [
                  {required: true, message: '请输入标签',}
                ],
              }]">
                <a-select-option v-for="(item,index) in option" :key="index" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item class="brief-class" label="公告内容：" :labelCol="{span:2}" :wrapperCol="{span:22}">
              <span>*</span>
              <wang-editor ref="editor" v-model="itemModel.content"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="上传附件：" :labelCol="{span:2}" :wrapperCol="{span:22}">
              <uploadTest
                ref="upload"
                @onChangeList="onChangeList"
                :id="itemModel2.id"
                :doc-type-id="docTypeId[1]"
                :is-update="isUpdate[1]"
                :isRequest="isRequest[1]"
                :size-limilt="20"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <div slot="footer">
      <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
      <a-button icon="eye" style="background:#67c23a;color:#fff" @click="preview()">预览</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
    <a-modal
      width="1040px"
      title="公告预览"
      :visible="isVisible2"
      :maskClosable="false"
      :centered="true"
      @cancel="closeDialog2">
      <div class="preview-title">{{form.getFieldsValue().title}}</div>
      <div class="preview-content" v-html="itemModel.content"></div>
      <div slot="footer">
        <a-button icon="close" @click="closeDialog2">关 闭</a-button>
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
import {
  emptyForm, getOne, create, update,
} from '@/api/modules/notice.js';
import WangEditor from '@/components/locally/WangEditor';
import uploadTest from '@/components/locally/upload-test';

export default {
  name: '',
  components: {
    WangEditor,
    uploadTest,
  },
  data() {
    return {
      itemModel2: { id: 1 },
      isUpdate: [false, false],  // 是否调用上传附件的接口
      isRequest: [false, false], // 是否调用获取附件列表的接口
      docTypeId: ['', ''],       // 上传文档类型
      row: {},
      isVisible: false,
      spinning: false,
      itemModel: emptyForm(),
      option: [],
      isVisible2: false,
    };
  },
  methods: {
    // 预览事件
    preview() {
      this.isVisible2 = true;
    },
    // 修改附件列表
    onChangeList(list) {
      this.itemModel.attachIds = list;
    },
    // 标签下拉框内容
    handleChange(val) {
      this.option = val;
    },
    // 弹框显示
    openDialog(row) {
      if (row) {
        this.row = row;
        this.spinning = true;
        getOne(row.id).then((response) => {
          this.setOneData(response.data.data);
          this.spinning = false;
        });
      }
      this.isVisible = true;
    },
    // 编辑行表单赋值
    setOneData(data) {
      this.form.setFieldsValue({
        'title': data.title,
        'status': data.status === 1,
        'isTop': data.isTop,
        'tagList': data.tags ? data.tags.split(',') : [],
      });
      this.itemModel.attachIds = data.attachIds;
      this.itemModel.content = data.content;
      this.$refs.editor.toValue(this.itemModel.content);
      this.$refs.upload.attachIds = data.attachIds ? data.attachIds : [];
      this.$refs.upload.fileList = data.attaches ? data.attaches : [];
      // this.$refs.upload.fileList.forEach(el => el.name);
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.onClaerForm();
      this.fileList = [];
      this.$refs.upload.attachIds = [];
      this.$refs.upload.fileList = [];
    },
    // 关闭预览框
    closeDialog2() {
      this.isVisible2 = false;
    },
    // 清空表单
    onClaerForm() {
      this.itemModel = emptyForm();
      this.form.resetFields();
      this.$refs.editor.toValue('');
    },
    // 保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'title': fieldsValue.title,
          'status': fieldsValue.status ? 1 : 0,
          'isTop': fieldsValue.isTop,
          'tagList': fieldsValue.tagList,
        };
        Object.assign(this.itemModel, setValue);
        if (err) {
          return;
        }
        if (this.itemModel.content === '' || this.itemModel.content === '<p><br></p>') {
          this.$message.warning('请填写案例内容！');
          return;
        }
        const saveMethod = this.row ? update : create;
        saveMethod(this.itemModel, this.row).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeDialog();
            this.$emit('refreshList');
          } else {
            this.$message.warning(response.data.msg, 3);
          }
        });
      });
    },
  },
  created() {
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
};
</script>
<style lang="scss" scoped>
.preview-title{
  height: 45px;
  font-weight: 600;
  text-align: center;
  line-height: 45px;
  font-size: 20px;
}
.preview-content{
  // height: 500px;
  min-height: 500px;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #D7DBE0;
  // overflow-y: auto;
}
</style>
