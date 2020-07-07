<template>
  <dialog-modal ref="dialog"
                size="middle"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}事故档案`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="150px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="事故发生时间：" prop="occurrenceTime">
            <el-date-picker v-model="itemModel.occurrenceTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故编码："
                        prop="accidentNo">
            <el-input v-model="itemModel.accidentNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="事故名称："
                        prop="accidentName">
            <el-input v-model="itemModel.accidentName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门：" prop="deptId">
            <dept-table @selected="selectDept"
                        :label="itemModel.deptName"
                        title="选择部门">
            </dept-table>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生地点：" prop="occurrenceAddress">
            <el-input v-model="itemModel.occurrenceAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="事故类型：" prop="accidentType">
            <el-select v-model="itemModel.accidentType"
                       style="width:250px;"
                       clearable>
              <el-option v-for="(item,index) in $enum.ACCIDENTTYPE"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故等级：" prop="accidentLevel">
            <el-select v-model="itemModel.accidentLevel"
                       style="width:250px;"
                       clearable>
              <el-option v-for="(item,index) in $enum.ACCIDENTLEVEL"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="经济损失(万元)：" prop="economicLoss">
            <el-input v-model.number="itemModel.economicLoss"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故性质：" prop="accidentNature">
            <el-select v-model="itemModel.accidentNature"
                       style="width:250px;"
                       clearable>
              <el-option v-for="(item,index) in $enum.ACCIDENTNATURE"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="事故经过：" prop="accidentProcess">
            <el-input type="textarea" v-model="itemModel.accidentProcess"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="救援情况：" prop="rescueSituation">
            <el-input type="textarea" v-model="itemModel.rescueSituation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="事故教训：" prop="accidentLesson">
            <el-input type="textarea" v-model="itemModel.accidentLesson"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="事故原因分析：" prop="accidentCause">
            <el-input type="textarea" v-model="itemModel.accidentCause"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="事故预防措施：" prop="accidentPrevention">
            <el-input type="textarea" v-model="itemModel.accidentPrevention"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="事故责任人处理：" prop="personLiableHandling">
            <el-input type="textarea" v-model="itemModel.personLiableHandling"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="相关人员教育情况：" prop="relevantEducation">
            <el-input type="textarea" v-model="itemModel.relevantEducation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="事故现场照片/视频">
            <upload-file :id="objectId"
                        docTypeId="annex"
                        :is-update="isUpdate[0]"
                        :isRequest="isRequest[0]"
                        :size-limilt="0"
                        :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="事故调查报告：">
            <upload-file :id="objectId"
                        docTypeId="plann"
                        :is-update="isUpdate[1]"
                        :isRequest="isRequest[1]"
                        :size-limilt="0"
                        :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import deptTable from '@/components/select-table-deptSingle';

export default {
  data() {
    return {
      url: 'wholeprocess/accidentArchive',
      itemModel: this.getEmptyItem(),
      // 附件相关
      objectId: '',
      isUpdate: [false, false],  // 是否调用上传附件的接口
      isRequest: [false, false], // 是否调用获取附件列表的接口
      readOnly: false,
      rules: {
        occurrenceTime: [
          { required: true, message: '请选择事故时间', trigger: ['blur', 'change'] },
        ],
        accidentName: [
          { required: true, message: '请输入事故名称', trigger: ['blur', 'change'] },
        ],
        deptId: [
          { required: true, message: '请选择所属部门', trigger: ['blur', 'change'] },
        ],
        accidentType: [
          { required: true, message: '请选择事故类型', trigger: ['blur', 'change'] },
        ],
        accidentLevel: [
          { required: true, message: '请选择事故等级', trigger: ['blur', 'change'] },
        ],
        accidentNature: [
          { required: true, message: '请选择事故性质', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
  components: {
    deptTable,
  },
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
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
        occurrenceTime: '',
        accidentNo: '',
        accidentName: '',
        deptId: '',
        occurrenceAddress: '',
        accidentType: '',
        accidentLevel: '',
        economicLoss: '',
        accidentNature: '',
        accidentProcess: '',
        rescueSituation: '',
        accidentLesson: '',
        accidentCause: '',
        accidentPrevention: '',
        personLiableHandling: '',
        relevantEducation: '',
        remark: '', // 备注
      };
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = row.id;
        this.isRequest = [true, true];
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.$refs.dialog.openDialog();
    },
    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.objectId = this.itemModel.id;
      this.isUpdate = [true, true];
      this.closeDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.isUpdate = [false, false];
      this.isRequest = [false, false];
      this.$refs.dialog.closeDialog();
    },
    selectDept(row) {
      this.itemModel.deptId = row.id;
      this.itemModel.deptName = row.departmentName;
    },
  },
};
</script>
