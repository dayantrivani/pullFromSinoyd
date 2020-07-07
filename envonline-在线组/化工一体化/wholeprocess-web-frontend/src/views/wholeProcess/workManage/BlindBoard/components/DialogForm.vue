<template>
  <dialog-modal ref="dialog"
                :title="`${isEdit ? '编辑' : '新增'}盲板抽堵作业`"
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
          <el-form-item label="编制人：">
            <person-single @selected="selectEditor"
                           :label="itemModel.makerName"
                           title="选择编制人">
            </person-single>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业证编号：">
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
        <el-col :span="24">
          <el-form-item label="申请人：" prop="applicantName">
            <el-input v-model="itemModel.applicantName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备管道名称：">
            <el-input v-model="itemModel.equipmentPipelineName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="介质：">
            <el-input v-model="itemModel.medium"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="温度：">
            <el-input v-model="itemModel.temperature"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="压力：">
            <el-input v-model="itemModel.pressure"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盲板材质：">
            <el-input v-model="itemModel.material"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="盲板规格：">
            <el-input v-model="itemModel.specifications"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盲板编号：">
            <el-input v-model="itemModel.blindPlateNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="实施时间(堵)：">
            <el-date-picker v-model="itemModel.blockingDate"
                            type="date"
                            value-format="yyyy-MM-dd 00:00:00"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实施时间(抽)：">
            <el-date-picker v-model="itemModel.pullingDate"
                            type="date"
                            value-format="yyyy-MM-dd 00:00:00"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="作业人(堵)：">
            <el-input v-model="itemModel.blockingOperatorName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业人(抽)：">
            <el-input v-model="itemModel.pullingOperatorName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="监护人(堵)：">
            <el-input v-model="itemModel.blockingGuardian"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监护人(抽)：">
            <el-input v-model="itemModel.pullingGuardian"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="生产单位作业指挥：">
            <el-input v-model="itemModel.commander"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="作业单位负责人：">
            <el-input v-model="itemModel.headName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安全监护人：" prop="safetyGuardian">
            <el-input v-model="itemModel.safetyGuardian"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实施安全教育人：" prop="safetyEducation">
            <el-input v-model="itemModel.safetyEducation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="涉及的其他特殊作业：">
            <el-checkbox-group v-model="specialWork">
              <span v-for="(item, index) in $enum.WORKTYPE" :key="index">
                <el-col :span="6">
                  <!-- 16盲板抽堵作业 -->
                  <el-checkbox v-if="item.value !== 16"
                              :label="item.value">{{item.label}}</el-checkbox>
                </el-col>
              </span>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="其他特殊作业：">
            <el-input v-model="itemModel.otherSpecialWork"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="盲板位置图：">
              <upload-file :id="objectId"
                          docTypeId="address"
                          :is-update="isUpdate"
                          :isRequest="isRequest"
                          :size-limilt="0"
                          :btn="readOnly? 'down remove' : 'add down remove'" />
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
  name: 'BlindBoardWorkDialog',
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
      url: 'wholeprocess/blindBoardWork',
      specialWork: [],    // 特殊作业
      itemModel: this.getEmptyItem(),
      // 附件相关
      objectId: '',
      isUpdate: false,
      isRequest: false,
      readOnly: false,
      // 表单验证
      rules: {
        deptId: [
          { required: true, message: '请选择申请单位', trigger: ['blur', 'change'] },
        ],
        applicantName: [
          { required: true, message: '请输入申请人', trigger: ['blur', 'change'] },
        ],
        safetyGuardian: [
          { required: true, message: '请输入安全负责人', trigger: ['blur', 'change'] },
        ],
        safetyEducation: [
          { required: true, message: '请输入实施安全教育人', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
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
        permitCode: `MBZY-${this.$tools.formatDate(new Date(), 'YmdHi')}${Math.floor(Math.random() * 1000)}`,
        workStatus: 0,
        deptId: '',
        applicantName: '',
        equipmentPipelineName: '',
        medium: '',
        temperature: '',
        pressure: '',
        material: '',
        specifications: '',
        blindPlateNo: '',
        blockingDate: '',
        pullingDate: '',
        blockingOperatorName: '',
        pullingOperatorName: '',
        blockingGuardian: '',
        pullingGuardian: '',
        commander: '',
        headName: '',
        safetyGuardian: '',
        safetyEducation: '',
        otherWork: [],
        otherSpecialWork: '',
      };
    },
    // 保存
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        // 其他特殊作业
        let sum = 0;
        this.specialWork.forEach((value) => {
          sum += value;
        });
        this.itemModel.otherWork = sum;

        this.saveLoading = true;
        this.$http[this.isEdit ? 'put' : 'post'](this.url, this.itemModel).then((response) => {
          if (response.data.success) {
            this.itemModel = response.data.data;
            // 上传附件
            this.objectId = this.itemModel.id;
            this.isUpdate = true;
            this.$emit('query');
            this.saveLoading = false;
            this.$nextTick(() => {
              this.$message.success({
                showClose: true,
                message: '操作成功',
              });
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
      // 位与运算
      if (this.itemModel && this.itemModel.otherWork) {
        const arr = [];
        this.$enum.WORKTYPE.forEach((item) => {
          // eslint-disable-next-line no-bitwise
          if (this.itemModel.otherWork & item.value) {
            arr.push(item.value);
          }
          this.specialWork = arr; // 赋值运算
        });
      } else {
        this.specialWork = [];
      }
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
  },
};
</script>
