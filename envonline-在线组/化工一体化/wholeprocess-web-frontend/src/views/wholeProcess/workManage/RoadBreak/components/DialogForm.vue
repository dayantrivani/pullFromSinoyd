<template>
  <dialog-modal ref="dialog"
                :title="`${isEdit ? '编辑' : '新增'}断路作业`"
                maxScrollbar
                size="middle"
                @close="closeDialog">
    <el-form ref="form"
             :rules="rules"
             :model="itemModel"
             v-loading="formLoading"
             label-position="right"
             label-width="145px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编制人：" prop="makerId">
            <person-single @selected="selectEditor"
                           :label="itemModel.makerName"
                           title="选择编制人">
            </person-single>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业证编号：" prop="permitCode">
            <el-input v-model="itemModel.permitCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请部门：" prop="deptId">
            <dept-table @selected="selectDept"
                        :label="itemModel.deptName"
                        title="选择部门">
            </dept-table>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业证状态：">
            <el-radio-group v-model="itemModel.workStatus">
              <el-radio :label="0">未完成</el-radio>
              <el-radio :label="1">已完成</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请人：" prop="applicantName">
            <el-input v-model="itemModel.applicantName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业单位：" prop="workCompany">
            <el-input v-model="itemModel.workCompany"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="作业单位负责人：" prop="headName">
            <el-input v-model="itemModel.headName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全实施教育人：" prop="safetyEducation">
            <el-input v-model="itemModel.safetyEducation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="断路地点：">
            <el-input v-model="itemModel.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="断路原因：">
            <el-input v-model="itemModel.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="断路时间起：" prop="beginDate">
            <el-date-picker v-model="itemModel.beginDate"
                            type="date"
                            value-format="yyyy-MM-dd 00:00:00"
                            :picker-options="pickStart"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="断路时间止：" prop="endDate">
            <el-date-picker v-model="itemModel.endDate"
                            type="date"
                            value-format="yyyy-MM-dd 00:00:00"
                            :picker-options="pickEnd"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="断路相关说明：">
            <el-input type="textarea" v-model="itemModel.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="示意图：">
            <upload-file :id="objectId"
                        docTypeId="img"
                        :is-update="isUpdate"
                        :isRequest="isRequest"
                        :size-limilt="0"
                        :btn="readOnly? 'down remove' : 'add down remove'" />
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="危害辨识：">
            <el-checkbox-group v-model="selectHazards">
              <span v-for="item in dict.RoadBreakHazardIdentification" :key="item.rowGuid">
                <el-col :span="6">
                  <el-checkbox :label="item.rowGuid">{{item.dictName}}</el-checkbox>
                </el-col>
              </span>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="其他危害辨识：">
            <el-input v-model="itemModel.otherHazard"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fa fa-save"
                 :loading="saveLoading"
                 @click="onSaveItem()">保 存</el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import personSingle from '@/components/select-table-personSingle';
import deptTable from '@/components/select-table-deptSingle';

export default {
  name: 'RoadBreakWorkDialog',
  mixins: [
    saveItem,
  ],
  components: {
    personSingle,
    deptTable,
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/roadBreakWork',
      itemModel: this.getEmptyItem(),
      selectHazards: [],
      dict: {
        RoadBreakHazardIdentification: [], // 危险辨识
      },
      // 附件
      objectId: '',
      isRequest: false,
      isUpdate: false,
      readOnly: false,
      // 表单验证
      rules: {
        deptId: [
          { required: true, message: '请选择申请部门', trigger: ['blur', 'change'] },
        ],
        applicantName: [
          { required: true, message: '请输入申请人', trigger: ['blur', 'change'] },
        ],
        workCompany: [
          { required: true, message: '请输入工作单位', trigger: ['blur', 'change'] },
        ],
        headName: [
          { required: true, message: '请输入工作单位负责人', trigger: ['blur', 'change'] },
        ],
        beginDate: [
          { required: true, message: '请选择工作起始时间', trigger: ['blur', 'change'] },
        ],
        endDate: [
          { required: true, message: '请选择工作终止时间', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    pickStart() {
      return {
        disabledDate: (time) => {
          if (this.itemModel.endDate) {
            return time.getTime() > new Date(this.itemModel.endDate).getTime();
          }
          return false;
        },
      };
    },
    pickEnd() {
      return {
        disabledDate: (time) => {
          if (this.itemModel.beginDate) {
            return time.getTime() < new Date(this.itemModel.beginDate).getTime();
          }
          return false;
        },
      };
    },
    // 是否编辑
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 获取初始对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : '',
        makerId: '',
        permitCode: `DLZY-${this.$tools.formatDate(new Date(), 'YmdHi')}${Math.floor(Math.random() * 1000)}`,
        workStatus: 0,
        deptId: '',
        applicantName: '',
        workCompany: '',
        headName: '',
        safetyEducation: '',
        address: '',
        reason: '',
        description: '',
        beginDate: '',
        endDate: '',
        hazard: [],
        otherHazard: '',
      };
    },
    // 保存
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        // 危害辨识
        const hazards = [];
        this.selectHazards.forEach((id) => {
          const item = {
            hazardId: id,
            hazardName: this.dict.RoadBreakHazardIdentification.find(e => e.rowGuid === id)
              && this.dict.RoadBreakHazardIdentification.find(e => e.rowGuid === id).dictName,
          };
          hazards.push(item);
        });
        this.itemModel.hazard = hazards;
        this.saveLoading = true;
        this.$http[this.isEdit ? 'put' : 'post'](this.url, this.itemModel).then((response) => {
          if (response.data.success) {
            this.itemModel = response.data.data;
            this.objectId = this.itemModel.id;
            this.isUpdate = true;
            this.saveLoading = false;
            this.$nextTick(() => {
              this.$message.success({
                showClose: true,
                message: '操作成功',
              });
              this.$emit('query');
              this.closeDialog();
            });
          } else {
            this.closeDialog();
            this.$message({
              showClose: true,
              message: response.data.msg,
            });
          }
        }, ({ response }) => {
          this.saveLoading = false;
          analyzeResp(response);
        });
      });
    },
    // 打开对话框
    openDialog(row) {
      this.isUpdate = false;
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = this.itemModel.id;
        this.isRequest = true;
      } else {
        this.isRequest = false;
        this.itemModel = this.getEmptyItem();
      }
      // 危害辨识
      if (this.itemModel && this.itemModel.hazard) {
        const arr = [];
        this.itemModel.hazard.forEach((item) => {
          arr.push(item.hazardId);
        });
        this.selectHazards = arr;
      } else {
        this.selectHazards = [];
      }
      this.getDictList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.isUpdate = false;
      this.isRequest = false;
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },
    // 获取编辑人
    selectEditor(row) {
      this.itemModel.makerId = row.id;
      this.itemModel.makerName = row.name;
    },
    selectDept(row) {
      this.itemModel.deptId = row.id;
      this.itemModel.deptName = row.departmentName;
    },
    // 获取数据字典
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
  },
};
</script>
