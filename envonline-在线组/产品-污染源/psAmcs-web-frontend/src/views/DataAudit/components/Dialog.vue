<template>
  <!-- 审核详情页面所有弹窗 -->
  <div class="data-audit-detail-dialog">
    <!-- 审核日志 -->
    <dialog-modal ref="auditLog" size="small" title="审核日志" minWidth="950px" @close="onCloseDialog">
      <!-- 列表 -->
      <el-table border highlight-current-row v-loading="loading" :data="itemList" height="500">
        <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
        <el-table-column label="审核时间" prop="tstamp" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="审核因子" prop="factorName" min-width="140" show-overflow-tooltip>
          <template
            slot-scope="scope"
          >{{ (scope.row.factorName?scope.row.factorName:"") + getFactorVaueTypeName(scope.row.valueType) }}</template>
        </el-table-column>
        <el-table-column label="审核操作" prop="checkAction" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="原始值" prop="oldData" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="更正值" prop="checkData" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="修约原因" prop="checkReason" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="审核人员" prop="auditName" min-width="155" show-overflow-tooltip></el-table-column>
      </el-table>
      <div style="height:10px"></div>
    </dialog-modal>
    <!-- 凭证上传 -->
    <dialog-modal ref="fileLog" size="small" title="凭证上传" minWidth="950px" @close="onCloseDialog">
      <!-- 使用菜单组件 防止tab的bug -->
      <el-menu :default-active="activeIndex" mode="horizontal" @select="changeTab">
        <el-menu-item index="1">上传凭证</el-menu-item>
        <el-menu-item index="2">历史凭证</el-menu-item>
      </el-menu>
      <div class="mar-t-sm pad-b-sm" v-show="!showList" style="border-bottom:1px solid #EBEEF5">
        <el-button
          type="primary"
          icon="fa fa-save"
          @click="onSaveItem()"
          v-loading="saveLoading"
        >保 存</el-button>
        <el-button icon="fa fa-times" @click="$refs.fileLog.closeDialog()">关 闭</el-button>
      </div>
      <el-form
        ref="form"
        label-position="right"
        label-width="100px"
        :model="itemModel"
        :rules="rules"
        class="mar-t-sm"
        v-show="!showList"
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="凭证名称：" prop="certificateName">
              <el-input v-model="itemModel.certificateName" placeholder></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="数据时间：" prop="beginTime">
              <el-date-picker
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:00:00"
                format="yyyy-MM-dd HH:00"
                v-model="formTimeRange"
                :clearable="false"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修约因子：">
              <span slot="label">
                <span style="color:red">*</span> 修约因子：
              </span>
              <el-select
                v-model="itemModel.factorCodes"
                multiple
                collapse-tags
                style="width: calc(100% - 50px) !important"
                clearable
              >
                <el-option-group
                  v-for="group in factorTreeList"
                  :key="group.name"
                  :label="group.name"
                >
                  <el-option
                    v-for="item in group.children"
                    :key="item.factorShowCode"
                    :label="item.factorShowName"
                    :value="item.factorShowCode"
                  ></el-option>
                </el-option-group>
              </el-select>
              <el-button plain @click="selectAllFactor()">全 选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="凭证说明：">
              <el-input
                v-model="itemModel.reason"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="凭证附件：">
              <span slot="label">
                <span style="color:red">*</span> 凭证附件：
              </span>
              <!-- 公共附件组件 -->
              <upload-file-all btn="add down remove" ref="upload" :id="itemModel.id" />
              <div style="height: 50px" v-show="!showList"></div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top:10px" v-if="showList">
        <!-- 历史凭证 -->
        <certificate :portId="itemModel.portId" :dtBegin="beginTime" :dtEnd="endTime"></certificate>
      </div>
    </dialog-modal>
    <!-- 人工批量修改 -->
    <dialog-modal
      ref="changeValue"
      size="mini"
      title="批量修改"
      minWidth="300px"
      @close="onCloseDialog"
    >
      <el-form
        ref="form2"
        label-position="right"
        label-width="100px"
        :model="changeModel"
        class="mar-t-sm"
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="修改值：">
              <el-input v-model="changeModel.value"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="mar-t-sm pad-b-sm" style="border-bottom:1px solid #EBEEF5;text-align:right">
        <el-button type="primary" icon="fa fa-save" @click="changeSave()">保 存</el-button>
      </div>
    </dialog-modal>
  </div>
</template>

<script>
import { dateFormat, addDateTime } from '@/libs/tools';
import { analyzeResp } from '@/global/libs/util';
import certificate from '../../Certificate/index';

export default {
  name: 'DataAuditDetailDialog',
  components: {
    certificate,
  },
  data() {
    return {
      loading: false,
      saveLoading: false,
      itemList: [],
      activeIndex: '1', // 默认tab
      showList: false, // 显示历史凭证
      factorTreeList: [],
      factorList: [],
      beginTime: '', // 历史凭证查询用
      endTime: '',
      itemModel: {
        id: '',
        certificateName: '',
        beginTime: '',
        endTime: '',
        portId: '',
        portName: '',
        psId: '',
        psName: '',
        regionCodeId: '',
        regionName: '',
        reason: '',
        factorCodes: [],
        certificateFactors: [],
      },
      currentData: {}, // 当前人工修改的单元格信息
      changeModel: {
        value: '',
      },
      factorVaueType: [], // 因子值类型
      rules: {
        certificateName: [
          { required: true, message: '此项不能为空', trigger: ['blur', 'change'] },
        ],
        beginTime: [
          { required: true, message: '此项不能为空', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  created() { },
  computed: {
    formTimeRange: {
      get() {
        return (!this.itemModel.beginTime && !this.itemModel.endTime)
          ? ''
          : [this.itemModel.beginTime, this.itemModel.endTime];
      },
      set(val) {
        [this.itemModel.beginTime, this.itemModel.endTime] = val || ['', ''];
      },
    },
  },
  watch: {},
  methods: {
    // 关闭窗口的统一方法
    onCloseDialog() {
      this.itemList = [];
      this.showList = false;
      this.factorTreeList = [];
      this.factorList = [];
      this.beginTime = '';
      this.endTime = '';
      this.currentData = {};
      this.itemModel = {
        id: this.itemModel.id,
        certificateName: '',
        beginTime: '',
        endTime: '',
        portId: '',
        portName: '',
        psId: '',
        psName: '',
        regionCodeId: '',
        regionName: '',
        reason: '',
        factorCodes: [],
        certificateFactors: [],
      };
      this.changeModel = {
        value: '',
      };
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    getItemList(model) {
      this.loading = true;
      this.$http.post('audit/hourLog', model, {
        params: {
          page: 1,
          rows: 1000,
          sort: 'tstamp-',
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 显示日志窗口
    openDialogForLog(model) {
      this.$refs.auditLog.openDialog();
      // 因子值类型是否已缓存
      if (this.factorVaueType.length) {
        this.getItemList(model);
      } else {
        // 调取接口
        this.$http.get('sys/enumCode', {
          params: {
            codeValue: `FactorValueType${this.$enum.getLabel('LABEL_CODE', model.portType)}`,
          },
        }).then((response) => {
          this.factorVaueType = response.data;
          this.getItemList(model);
        }, ({ response }) => {
          analyzeResp(response);
        });
      }
    },
    // 显示凭证窗口
    openDialogForFile(model) {
      this.factorTreeList = model.factorTreeList;
      this.factorList = model.factorList;
      this.itemModel.beginTime = model.beginTime;
      this.itemModel.endTime = model.endTime;
      this.itemModel.portId = model.portId;
      this.itemModel.portName = model.portName;
      this.itemModel.psId = model.psId;
      this.itemModel.psName = model.psName;
      this.itemModel.regionCodeId = model.regionCodeId;
      this.itemModel.regionName = model.regionName;
      this.beginTime = model.beginTime;
      this.endTime = model.endTime;
      // 获取附件id
      this.$http.get('sys/guid/new', {
        params: {},
      }).then((response) => {
        // 不考虑报错
        this.itemModel.id = response.data.data;
        this.$refs.fileLog.openDialog();
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 显示批量修改窗口
    openDialogForChange(data) {
      this.currentData = data;
      this.$refs.changeValue.openDialog();
    },
    // 切换tab
    changeTab(index) {
      this.showList = index === '2';
    },
    // 保存
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        // 额外的验证
        // 验证修约因子是否必填
        if (!this.itemModel.factorCodes.length) {
          this.$message.warning({
            message: '修约因子必选',
            duration: 1500,
          });
          return;
        }
        // 验证附件是否上传
        const fileList = this.$refs.upload.getFileList();
        if (!fileList.length) {
          this.$message.warning({
            message: '附件必传',
            duration: 1500,
          });
          return;
        }
        const itemModelCopy = { ...this.itemModel };
        // 获取时间数组
        const times = [];
        // const dtB = new Date(dateFormat(new Date(this.itemModel.beginTime), 'Y-m-d H:i:s'));
        // const dtE = new Date(dateFormat(new Date(this.itemModel.endTime), 'Y-m-d H:i:s'));
        const dtB = this.itemModel.beginTime;
        const dtE = this.itemModel.endTime;
        const countHour = (new Date(dtE) - new Date(dtB)) / 1000 / 3600 + 1;
        for (let i = 0; i < countHour; i++) {
          const d = addDateTime(new Date(this.itemModel.beginTime), i, 'hour');
          times.push(dateFormat(d, 'Y-m-d H:i:s'));
        }
        const arr = [];
        times.forEach((item) => {
          this.itemModel.factorCodes.forEach((code) => {
            const obj = {
              certificateId: this.itemModel.id,
              dataTime: item,
              factorCode: code.split('-')[0],
              factorName: this.factorList.find(p => p.factorShowCode === code).factorShowName,
              valueType: code.split('-')[1],
            };
            arr.push(obj);
          });
        });
        itemModelCopy.certificateFactors = arr;
        this.saveLoading = true;
        const url = 'audit/certificate/batch';
        this.$http.post(url, [itemModelCopy])
          .then((response) => {
            if (response.data.success) {
              // this.$message.success({
              //   message: '保存成功',
              //   duration: 1500,
              //   showClose: true,
              // });
              // 调附件组件上传方法
              this.$refs.upload.sendUpload();
              this.$refs.fileLog.closeDialog();
            } else {
              this.$message.warning({
                message: response.data.message,
                duration: 1500,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 全选因子
    selectAllFactor() {
      this.itemModel.factorCodes = this.factorList.map(p => p.factorShowCode);
    },
    // 修改保存
    changeSave() {
      // 验证数字
      if (!this.changeModel.value.match(/^[+-]?\d+(\.\d+)?$/)) {
        this.$message('请输入数值');
        return;
      }
      // 构造数据
      this.currentData.dataAuditItems.forEach((item) => {
        item.dataAuditDetails.forEach((item2) => {
          item2.factorValue = this.changeModel.value;
        });
      });
      // 调取接口
      this.$http.post('audit/dataAudit/action', this.currentData, {
        params: {},
      }).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          this.$refs.changeValue.closeDialog();
          this.$emit('refresh');
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
    // 获取值类型中文
    getFactorVaueTypeName(value) {
      let str = '';
      const temp = this.factorVaueType.find(p => p.dictValue === value);
      if (temp) {
        str = temp.dictName;
      }
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.data-audit-detail-dialog {
  .el-menu-item {
    line-height: 40px;
    height: 40px;
  }
}
</style>
