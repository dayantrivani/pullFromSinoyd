<template>
  <dialog-modal ref="dialog"
                title="盲板抽堵作业详情"
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
          <el-form-item label="作业证编号：">
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
          <el-form-item label="申请人：">
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
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实施时间(抽)：">
            <el-date-picker v-model="itemModel.pullingDate"
                            type="date"
                            value-format="yyyy-MM-dd"
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
                          :is-update="isUpdate[0]"
                          :isRequest="isRequest[0]"
                          :size-limilt="0"
                          :btn="readOnly? 'down remove' : 'add down remove'" />
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
                          :is-update="isUpdate[1]"
                          :isRequest="isRequest[1]"
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
                          :is-update="isUpdate[2]"
                          :isRequest="isRequest[2]"
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
                          :is-update="isUpdate[3]"
                          :isRequest="isRequest[3]"
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
  name: 'BlindBoardWorkDetail',
  mixins: [
    queryList,
    saveItem,
  ],
  components: {
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/blindBoardWork',
      itemModel: {},
      specialWork: [],
      measureList: [],
      analysisList: [],
      // 附件相关
      objectId: '',
      isUpdate: [false, false, false, false],  // 是否调用上传附件的接口
      isRequest: [false, false, false, false], // 是否调用获取附件列表的接口
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
    // 是否编辑
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 打开对话框
    openDialog(row) {
      if (!row) return;
      this.itemModel = row;
      // 特殊作业
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
      // 附件信息
      this.objectId = this.itemModel.id;
      this.isRequest = [true, true, true, true];
      this.getMeasureList();
      this.getAnalysisList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.isUpdate = [false, false, false, false];
      this.isRequest = [false, false, false, false];
      this.$refs.dialog.closeDialog();
    },
    // 获取安全措施
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
    // 获取安全分析
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
  },
};
</script>
