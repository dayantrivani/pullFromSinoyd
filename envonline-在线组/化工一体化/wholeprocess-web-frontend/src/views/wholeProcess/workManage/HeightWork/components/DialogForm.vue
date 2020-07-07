<template>
  <dialog-modal ref="dialog"
                :title="`${isEdit ? '编辑' : '新增'}高处作业`"
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
        <el-col :span="24">
          <el-form-item label="申请人：" prop="applicantName">
            <el-input v-model="itemModel.applicantName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="作业时间起：" prop="beginDate">
            <el-date-picker v-model="itemModel.beginDate"
                            type="date"
                            value-format="yyyy-MM-dd 00:00:00"
                            :picker-options="pickStart"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业时间止：" prop="endDate">
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
          <el-form-item label="作业地点：">
            <el-input v-model="itemModel.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="作业内容：">
            <el-input v-model="itemModel.workContent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="作业单位：">
            <el-input v-model="itemModel.workCompany"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="特殊情况：">
            <el-select v-model="selectedCases"
                       value-key="id"
                       autofocus
                       multiple
                       clearable>
              <el-option v-for="item in $enum.SPECIALCASES"
                         :key="item.id"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="作业高度(m)：">
            <el-input-number v-model="itemModel.workHeight"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业等级：">
            <el-select v-model="itemModel.workLevel"
                       style="width:250px;"
                       clearable>
              <el-option v-for="(item,index) in $enum.HEIGHTWORKLEVEL"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="监护人：">
            <el-input v-model="itemModel.safetyGuardian"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实施安全教育人：">
            <el-input v-model="itemModel.safetyEducation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="作业人：">
            <el-input v-model="itemModel.operatorName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="涉及的其他特殊作业：">
            <el-checkbox-group v-model="specialWork">
              <span v-for="(item, index) in $enum.WORKTYPE" :key="index">
                <el-col :span="6">
                  <!--4高处作业 -->
                  <el-checkbox v-if="item.value !== 4"
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
          <el-form-item label="危害辨识：">
            <el-checkbox-group v-model="selectHazards">
              <span v-for="item in dict.HeightHazardIdentification" :key="item.rowGuid">
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
  name: 'HeightWorkDialog',
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
      url: 'wholeprocess/heightWork',
      specialWork: [],    // 特殊作业
      selectedCases: [],
      selectHazards: [],
      itemModel: this.getEmptyItem(),
      dict: {
        HeightHazardIdentification: [], // 危险辨识
      },
      // 表单验证
      rules: {
        deptId: [
          { required: true, message: '请选择申请部门', trigger: ['blur', 'change'] },
        ],
        applicantName: [
          { required: true, message: '请输入申请人', trigger: ['blur', 'change'] },
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
  watch: {
    'itemModel.specialCases': {
      handler(val) {
        if (val) {
          const arr = [];
          this.$enum.SPECIALCASES.forEach((item) => {
            // eslint-disable-next-line no-bitwise
            if (val & item.value) {
              arr.push(item.value);
            }
          });
          this.selectedCases = arr;
        } else {
          this.selectedCases = [];
        }
      },
    },
  },
  methods: {
    // 获取初始对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : '',
        makerId: '',
        permitCode: `GCZY-${this.$tools.formatDate(new Date(), 'YmdHi')}${Math.floor(Math.random() * 1000)}`,
        workStatus: 0,
        deptId: '',
        applicantName: '',
        beginDate: '',
        endDate: '',
        address: '',
        workContent: '',
        workCompany: '',
        specialCases: 0,
        workHeight: 0,
        workLevel: 1,
        safetyGuardian: '',
        safetyEducation: '',
        operatorName: '',
        otherWork: [],
        otherSpecialWork: '',
        hazard: [],
        otherHazard: '',
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
        // 特殊情况
        let count = 0;
        this.selectedCases.forEach((value) => {
          count += value;
        });
        this.itemModel.specialCases = count;
        // 危害辨识
        const hazards = [];
        this.selectHazards.forEach((id) => {
          const item = {
            hazardId: id,
            hazardName: this.dict.HeightHazardIdentification.find(e => e.rowGuid === id)
              && this.dict.HeightHazardIdentification.find(e => e.rowGuid === id).dictName,
          };
          hazards.push(item);
        });
        this.itemModel.hazard = hazards;

        this.saveLoading = true;
        this.$http[this.isEdit ? 'put' : 'post'](this.url, this.itemModel).then((response) => {
          if (response.data.success) {
            this.$message.success({
              showClose: true,
              message: '操作成功',
            });
            this.$emit('query');
            this.saveLoading = false;
            this.closeDialog();
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
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
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
      this.saveLoading = false;
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
