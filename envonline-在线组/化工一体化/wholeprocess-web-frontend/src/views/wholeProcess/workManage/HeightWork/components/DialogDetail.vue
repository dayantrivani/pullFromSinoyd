<template>
  <dialog-modal ref="dialog"
                title="高处作业详情"
                maxScrollbar
                size="middle"
                @close="closeDialog">
    <el-form ref="form"
             :model="itemModel"
             v-loading="formLoading"
             disabled
             label-position="right"
             label-width="145px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编制人：">
            <el-input v-model="itemModel.makerName"></el-input>
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
          <el-form-item label="申请部门：">
            <el-input v-model="itemModel.deptName"></el-input>
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
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业时间止：" prop="endDate">
            <el-date-picker v-model="itemModel.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
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
    <el-card type="title" class="fill-h mar-b-sm">
        <template slot="header">
          <span class="el-card__title">安全措施</span>
        </template>
        <el-table
              v-loading="loading"
              border
              height="150px"
              highlight-current-row
              :data="measureList"
              :row-class-name="rowClassName">
          <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
          <el-table-column prop="measuresContent" label="安全措施" show-overflow-tooltip/>
        </el-table>
      </el-card>
      <el-card type="title" class="fill-h mar-b-sm">
        <template slot="header">
          <span class="el-card__title">安全分析</span>
        </template>
        <el-table
              v-loading="loading"
              border
              height="150px"
              highlight-current-row
              :data="analysisList"
              :row-class-name="rowClassName">
          <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
          <el-table-column prop="analysisContent" label="安全分析" show-overflow-tooltip/>
        </el-table>
      </el-card>
      <el-card type="title" class="fill-h mar-b-sm">
        <template slot="header">
          <span class="el-card__title">附件信息</span>
        </template>
        <el-form ref="form"
                  class="mar-t-sm"
                  label-width="100px"
                  disabled
                  label-position="right">
          <el-row>
            <el-col :span="24">
              <el-form-item label="安全交底：">
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
              <el-form-item label="施工方案：">
                <upload-file :id="objectId"
                            docTypeId="plann"
                            :is-update="isUpdate[1]"
                            :isRequest="isRequest[1]"
                            :size-limilt="0"
                            :btn="readOnly? 'down remove' : 'add down remove'" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="其他附件：">
                <upload-file :id="objectId"
                            docTypeId="other"
                            :is-update="isUpdate[2]"
                            :isRequest="isRequest[2]"
                            :size-limilt="0"
                            :btn="readOnly? 'down remove' : 'add down remove'" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { queryList, saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'HeightWorkDetail',
  mixins: [
    queryList,
    saveItem,
  ],
  components: {
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/heightWork',
      specialWork: [],
      itemModel: {},
      measureList: [],
      analysisList: [],
      selectedCases: [],
      selectHazards: [],
      // 附件相关
      objectId: '',
      isUpdate: [false, false, false],  // 是否调用上传附件的接口
      isRequest: [false, false, false], // 是否调用获取附件列表的接口
      readOnly: false,
      dict: {
        HeightHazardIdentification: [], // 危险辨识
      },
    };
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
    // 保存回调
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 打开对话框
    openDialog(row) {
      if (!row) return;
      this.itemModel = row;
      //  附件信息
      this.objectId = this.itemModel.id;
      this.isRequest = [true, true, true];
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
      this.getMeasureList();
      this.getAnalysisList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.isUpdate = [false, false, false];
      this.isRequest = [false, false, false];
      this.$refs.dialog.closeDialog();
    },
    getMeasureList() {
      this.$http.get('wholeprocess/workMeasures', {
        params: {
          workId: this.itemModel.id,
          page: 0,
          rows: 9999,
          sort: 'orderNum-,',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.measureList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getAnalysisList() {
      this.$http.get('wholeprocess/workAnalysis', {
        params: {
          workId: this.itemModel.id,
          page: 0,
          rows: 9999,
          sort: 'orderNum-,',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.analysisList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
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
