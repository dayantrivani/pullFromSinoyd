<template>
  <div class="mp-form-setting">
    <div class="field">
      <div class="fieldname">
        表单标题 <small class="text-muted">显示在列表中，供方案和报表模板选择</small>
      </div>
      <div class="fieldblock">
        <el-input v-model="form.name"></el-input>
      </div>
    </div>
    <!--<div class="field">
      <div class="fieldname">
        表单标识数 <small class="text-muted">报表的唯一标识数字（仅不同表单中字段名重复时需要使用）</small>
      </div>
      <div class="fieldblock">
        <el-input v-model="form.group_id"></el-input>
      </div>
    </div> -->
    <div class="field">
      <div class="fieldname">
        表单说明
      </div>
      <div class="fieldblock">
        <el-input
          v-model="form.comment"
          :auto-size="{ minRows: 2 }"
          type="textarea"
        >
        </el-input>
      </div>
    </div>
    <div class="field">
      <div class="fieldname">
        报表模版
      </div>
      <div class="fieldblock">
        <!-- <file-uploader
          ref="addFile"
          v-model="form.template_file"
          accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          hint="attachment"
          except="object"
        >
        </file-uploader> -->
        <uploadTest
          ref="upload"
          :btn="'add remove'"
          @onChangeList="onChangeList"
          :col="2"
          :attachList="attachList"
          :id="itemModel2.id"
          :doc-type-id="docTypeId[1]"
          :is-update="isUpdate[1]"
          :isRequest="isRequest[1]"
          :size-limilt="1"/>
      </div>
    </div>
    <div class="field">
      <div class="fieldname">
        是否关联报警
      </div>
      <div class="fieldblock">
        <a-radio-group v-model="form.relatedAlarm">
          <a-radio :value="true">
            是
          </a-radio>
          <a-radio :value="false">
            否
          </a-radio>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import uploadTest from '@/components/locally/upload-test';

export default {
  components: {
    uploadTest,
  },
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    attachList: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      value: '',
      // 原本上传的文件
      beforeFile: this.form.template_file,
      // 当前选择的文件
      chooseFile: '',
      itemModel2: { id: 1 },
      isUpdate: [false, false],  // 是否调用上传附件的接口
      isRequest: [false, false], // 是否调用获取附件列表的接口
      docTypeId: ['', ''],       // 上传文档类型
    };
  },
  watch: {
    form() {
      this.beforeFile = this.decodeURI(this.form.template_file);
    },
  },
  methods: {
    changeAttch() {
      this.$refs.upload.fileList = this.$refs.upload.attachList;
      this.attachIds = [this.$refs.upload.fileList[0].id];
    },
    // 修改附件列表
    onChangeList(list) {
      this.attachIds = list;
      this.form.reportId = this.attachIds[0] ? this.attachIds[0] : 0;
    },
    decodeURI(url) {
      return decodeURI(url);
    },
  },
};
</script>
