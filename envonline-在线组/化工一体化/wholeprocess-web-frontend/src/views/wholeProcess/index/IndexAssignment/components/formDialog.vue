<template>
  <dialog-modal ref="dialog"
                size="middle"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}指标分配`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="130px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="部门："
                        prop="responsibleDepId"
                        hint-down>
            <dept-single v-model="itemModel.responsibleDepId"
                         :label="itemModel.responsibleName">
            </dept-single>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司级别："
                        prop="responsibleLevel">
            <el-select v-model="itemModel.responsibleLevel"
                       autofocus
                       clearable>
              <el-option v-for="item in $enum.RESPONSIBLE_LEVEL"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="年份："
                        prop="belongYear">
            <el-date-picker v-model="itemModel.belongYear"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="show"
              :gutter="20">
        <el-col :span="24">
          <el-form-item label="目标指标："
                        prop="chooseIndexSettingList">
            <el-button type="primary"
                       icon="fas fa-plus"
                       style="padding:2px;"
                       @click="addIndexSettingList"
                       class="indexAssignmentButton">添加指标</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="!show"
           class="addIndexRow">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="指标名称："
                          prop="indexName">
              <el-input v-model="itemModel.indexName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="指标值："
                          prop="indexValue">
              <el-input v-model="itemModel.indexValue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="预算(万元)："
                          prop="budget">
              <el-input v-model="itemModel.budget"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="责任人："
                          prop="liableUserId">
              <person-single @selected="selectLiableUserData"
                             :label="itemModel.liableUserName">
              </person-single>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预计完成时间："
                          prop="expectedCompletionTime">
              <el-date-picker v-model="itemModel.expectedCompletionTime"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-form label-position="top"
             ref="selectIndexSetting"
             :rules="rules"
             :model="itemModel"
             style="padding-left: 110px;">
      <el-row :gutter="20"
              style="padding-left:100px;"
              v-if="itemModel.chooseIndexSettingList?(itemModel.chooseIndexSettingList.length>0?true:false):false">
        <el-col :span="4">
          <el-form-item label="指标名称">
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="指标值(万元)">
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="预算(万元)">
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="责任人">
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="预计完成时间">
          </el-form-item>
        </el-col>
      </el-row>
      <div v-for="(item,index) in itemModel.chooseIndexSettingList"
           :key="index">
        <el-row :gutter="10">
          <el-col :span="0.5"
                  style="margin-top: 4px;">
            <el-button type="danger"
                       icon="fas fa-trash-alt"
                       style="padding:2px;"
                       @click="deleteIndexSetting(index)"
                       class="indexAssignmentButton"></el-button>
          </el-col>
          <el-col :span="4">
            <el-form-item :prop="`chooseIndexSettingList.${index}.indexName`"
                          :rules="rules.indexName">
              <el-input v-model="item.indexName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :prop="`chooseIndexSettingList.${index}.indexValue`"
                          :rules="rules.indexValue">
              <el-input v-model.number="item.indexValue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :prop="`chooseIndexSettingList.${index}.budget`"
                          :rules="rules.budget">
              <el-input v-model.number="item.budget"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :prop="`chooseIndexSettingList.${index}.liableUserId`"
                          :rules="rules.liableUserId">
              <special-person-single @selectSingleData="selectSpecialLiableUserData"
                                     :label="item.liableUserName"
                                     :indexName="item.indexName">
              </special-person-single>
            </el-form-item>
          </el-col>
          <el-col :span="6.5">
            <el-form-item :prop="`chooseIndexSettingList.${index}.expectedCompletionTime`"
                          :rules="rules.expectedCompletionTime">
              <el-date-picker v-model="item.expectedCompletionTime"
                              type="date"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-form label-position="right"
             label-width="130px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="制定人：">
            <el-input disabled
                      v-model="itemModel.formulateUserName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核人：">
            <person-single @selected="selectDealUserData"
                           :label="itemModel.dealUserName">
            </person-single>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="批准人：">
            <person-single @selected="selectApproverUserData"
                           :label="itemModel.approverUserName">
            </person-single>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批准日期："
                        prop="approvalDate">
            <el-date-picker v-model="itemModel.approvalDate"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注："
                        prop="remark">
            <el-input type="textarea"
                      v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="安全目标责任书：">
            <upload-file :id="objectId"
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
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
    <index-multiple @selectData='selectData'
                    ref="selectTable">
    </index-multiple>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import deptSingle from '@/components/select-table-deptSingle';
import specialPersonSingle from './components/select-table-single';
import personSingle from '@/components/select-table-personSingle';
import indexMultiple from './components/select-index-dialog';

export default {
  data() {
    return {
      url: 'wholeprocess/indexAssignment',
      itemModel: this.getEmptyItem(),
      indexSettingList: [],
      show: true,
      isShowTip: false,
      isUpdate: false,
      isRequest: false,
      objectId: '',
      saveChooseIndexSettingList: [],
      rules: {
        responsibleDepId: [
          { required: true, message: '请选择部门', trigger: ['blur', 'change'] },
        ],
        responsibleLevel: [
          { required: true, message: '请选择公司级别', trigger: ['blur', 'change'] },
        ],
        belongYear: [
          { required: true, message: '请选择年份', trigger: ['blur', 'change'] },
        ],
        indexName: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] },
        ],
        indexValue: [
          { required: true, message: '请输入指标值', trigger: ['blur', 'change'] },
        ],
        budget: [
          { required: true, message: '请输入预算', trigger: ['blur', 'change'] },
        ],
        expectedCompletionTime: [
          { required: true, message: '请选择时间', trigger: ['blur', 'change'] },
        ],
        liableUserId: [
          { required: true, message: '请选择责任人', trigger: ['blur', 'change'] },
        ],
        chooseIndexSettingList: [
          { required: true, message: '请选择目标指标', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  components: {
    deptSingle, specialPersonSingle, personSingle, indexMultiple,
  },
  mixins: [saveItem],
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid', 'userName']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        chooseIndexSettingList: [],
        responsibleDepId: '', // 部门
        responsibleLevel: '', // 级别
        belongYear: '', // 所属年份
        formulateUserId: this.orgGuid, // 制定人
        formulateUserName: this.userName,
        approverUserId: '', // 批准人
        approverUserName: '',
        dealUserId: '', // 审核人
        dealUserName: '',
        approvalDate: '', // 批准日期
        indexName: '', // 指标名称
        indexValue: '', // 指标值
        budget: '', // 预算
        liableUserId: '', // 责任人id
        liableUserName: '', // 责任人
        expectedCompletionTime: '', // 预计完成时间
        isSelfEvaluate: 0, // 是否自评
        isConfirm: 0, // 是否考核
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck(callback) {
      this.$refs.form.validate((formValid) => {
        if (!formValid) return;
        if (this.show) {
          this.$refs.selectIndexSetting.validate((valid) => {
            if (!valid) return;
            this.onSaveItem(callback);
          });
        } else {
          this.onSaveItem(callback);
        }
      });
    },
    addIndexSettingList() {
      this.$refs.selectTable.openDialog();
    },
    deleteIndexSetting(index) {
      this.itemModel.chooseIndexSettingList.splice(index, 1);
    },
    selectData(selected, clearBol) {
      if (clearBol) {
        this.itemModel.chooseIndexSettingList = [];
      }
      selected.forEach((element) => {
        const item = this.itemModel.chooseIndexSettingList.find(indexSetting => indexSetting.indexName === element.indexName);
        if (!item) {
          const indexSetting = {};
          this.$set(indexSetting, 'indexName', element.indexName);
          this.$set(indexSetting, 'indexValue', element.indexValue);
          this.$set(indexSetting, 'budget', '');
          this.$set(indexSetting, 'liableUserId', '');
          this.$set(indexSetting, 'liableUserName', '');
          this.$set(indexSetting, 'expectedCompletionTime', '');
          this.itemModel.chooseIndexSettingList.push(indexSetting);
        }
      });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.saveLoading = true;
      this.saveChooseIndexSettingList = [];
      this.itemModel.chooseIndexSettingList.forEach((val) => {
        const newItemModel = Object.assign({}, this.itemModel);
        newItemModel.indexName = val.indexName;
        newItemModel.indexValue = val.indexValue;
        newItemModel.budget = val.budget;
        newItemModel.liableUserId = val.liableUserId;
        newItemModel.liableUserName = val.liableUserName;
        newItemModel.expectedCompletionTime = val.expectedCompletionTime;
        this.saveChooseIndexSettingList.push(newItemModel);
      });
      const { id } = this.itemModel;
      this.$http[id ? 'put' : 'post'](this.url, id ? this.itemModel : this.saveChooseIndexSettingList)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
            if (callback) {
              callback(response.data.data);
            } else {
              this.$emit('query');
            }
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }).finally(() => {
          this.saveLoading = false;
        });
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.show = false;
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = this.itemModel.id;
        this.isRequest = true;
        this.itemModel.belongYear = this.itemModel.belongYear.toString();
      } else {
        this.getIndexSettingList();
        this.itemModel = this.getEmptyItem();
      }
      this.isUpdate = false;
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.saveChooseIndexSettingList = [];
      this.itemModel = this.getEmptyItem();
      this.show = true;
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.objectId = this.itemModel.id;
      this.isUpdate = true;
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 获取指标
    getIndexSettingList() {
      this.$http.get('wholeprocess/indexSetting', {
        params: { page: 1, rows: 10000 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.indexSettingList = response.data.data;
          this.indexSettingList.forEach((val) => {
            this.$set(val, 'budget', '');
            this.$set(val, 'liableUserId', '');
            this.$set(val, 'liableUserName', '');
            this.$set(val, 'expectedCompletionTime', '');
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    selectChange() {
    },
    // 责任人
    selectLiableUserData(row) {
      this.itemModel.liableUserId = row.id;
      this.itemModel.liableUserName = row.name;
    },
    // 审核人
    selectDealUserData(row) {
      this.itemModel.dealUserId = row.id;
      this.itemModel.dealUserName = row.name;
    },
    // 批准人
    selectApproverUserData(row) {
      this.itemModel.approverUserId = row.id;
      this.itemModel.approverUserName = row.name;
    },
    selectSpecialLiableUserData(row, indexName) {
      const [first] = this.itemModel.chooseIndexSettingList.filter(val => val.indexName === indexName);
      first.liableUserId = row.id;
      first.liableUserName = row.name;
    },
  },
};
</script>

<style>
.indexAssignmentButton i {
  margin-right: 0px;
  margin-left: 1px;
}
</style>
