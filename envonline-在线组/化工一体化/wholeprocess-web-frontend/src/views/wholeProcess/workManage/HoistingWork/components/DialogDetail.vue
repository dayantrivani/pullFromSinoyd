<template>
  <dialog-modal ref="dialog"
                title="吊装作业详情"
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
          <el-form-item label="编制人：" prop="makerId">
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
          <el-form-item label="申请部门：" prop="deptId">
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
          <el-form-item label="吊装地点：" prop="address">
            <el-input v-model="itemModel.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="吊装工具名称：" prop="hoistingToolName">
            <el-input v-model="itemModel.hoistingToolName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="吊装人员：" prop="operatorName">
            <el-input v-model="itemModel.operatorName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特种作业证号：" prop="operatorCertificate">
            <el-input v-model="itemModel.operatorCertificate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="吊装指挥：" prop="hoistingCommander">
            <el-input v-model="itemModel.hoistingCommander"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特种作业证号：" prop="commanderCertificate">
            <el-input v-model="itemModel.commanderCertificate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="起吊重物重量(t)：">
            <el-input-number v-model="itemModel.weight" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业级别：">
            <el-select v-model="itemModel.workLevel"
                       style="width:250px;"
                       clearable>
              <el-option v-for="(item,index) in $enum.HOISTINGWORKLEVEL"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
            </el-select>
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
          <el-form-item label="吊装内容：">
            <el-input v-model="itemModel.workContent"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="危害辨识：">
            <el-checkbox-group v-model="selectHazards">
              <span v-for="item in dict.HoistingHazardIdentification" :key="item.rowGuid">
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
  name: 'HoistingWorkDetail',
  mixins: [
    queryList,
    saveItem,
  ],
  components: {
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/hoistingWork',
      itemModel: {},
      measureList: [],
      analysisList: [],
      selectHazards: [],
      // 附件相关
      objectId: '',
      isUpdate: [false, false, false],  // 是否调用上传附件的接口
      isRequest: [false, false, false], // 是否调用获取附件列表的接口
      readOnly: false,
      dict: {
        HoistingHazardIdentification: [], // 危险辨识
      },
    };
  },
  methods: {
    // 打开对话框
    openDialog(row) {
      if (!row) return;
      this.itemModel = row;
      //  附件信息
      this.objectId = this.itemModel.id;
      this.isRequest = [true, true, true];
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
