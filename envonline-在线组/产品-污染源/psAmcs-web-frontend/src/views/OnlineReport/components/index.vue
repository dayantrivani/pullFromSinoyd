<template>
  <!-- 网上报备与报备审核共用页面 -->
  <el-card class="online-report">
    <!-- 查询条件 -->
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="报备时间：">
        <el-date-picker
          style="width:160px"
          v-model="queryForm.fromTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:160px"
          v-model="queryForm.toTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态：">
        <el-select
          v-model="queryForm.auditStatus"
          multiple
          collapse-tags
          style="width: 150px"
          clearable
        >
          <el-option
            v-for="(item, key) in auditStatusList"
            :key="key"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运行状态类别：">
        <el-select
          v-model="queryForm.runStatusTypeCode"
          style="width: 150px"
          clearable
          @change="getRunStatus(1, true)"
        >
          <el-option
            v-for="(item, key) in runStatusTypeList"
            :key="key"
            :value="item.dictCode"
            :label="item.dictName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运行状态：">
        <el-select v-model="queryForm.runStatus" style="width: 150px" clearable>
          <el-option
            v-for="(item, key) in runStatusList"
            :key="key"
            :value="item.dictCode"
            :label="item.dictName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="站点：">
        <select-port
          v-model="queryForm.portIds"
          filterable
          :options="stationList"
          :field="[
              { name: 'psName', key: 'psId' },
              { name: 'portName', key: 'id' }
            ]"
          @query="getStation()"
        ></select-port>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input placeholder="污染源名称、站点名称" style="width:240px" v-model="queryForm.key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="fas fa-download"
          :loading="downloading"
          @click="onDownload"
        >导 出</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <div class="pad-t-xs pad-l-sm pad-b-xs" style="border-top: 1px solid #EBEEF5" v-show="isEnt">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onClickRemove()"
      >删 除</el-button>
    </div>
    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      :height="isEnt?'calc(100% - 105px)':'calc(100% - 65px)'"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="38" v-if="isEnt"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-file-invoice" @click="onClickEdit(scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="区域" prop="regionName" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="运行状态" prop="runStatusName" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="报备因子" prop="reportFactorNames" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="开始时间" prop="dealBeginTime" min-width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="结束时间" prop="dealEndTime" min-width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="填报时间" prop="createDate" min-width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag
            :type="auditStatusList.find(p => p.value === scope.row.auditStatus).tagType"
          >{{scope.row.auditStatusName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" prop="auditDesc" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList" />
    <!-- 表单 -->
    <dialog-modal ref="dialog" size="small" title="报备信息" minWidth="950px" @close="onCloseDialog">
      <!-- 使用菜单组件 防止tab的bug -->
      <el-menu :default-active="activeIndex" mode="horizontal" @select="changeTab">
        <el-menu-item index="1">报备信息</el-menu-item>
        <el-menu-item index="2">审核记录</el-menu-item>
      </el-menu>
      <div
        class="mar-t-sm pad-b-sm"
        v-show="!showAuditRecord"
        style="border-bottom:1px solid #EBEEF5"
      >
        <el-button
          type="success"
          icon="fa fa-check"
          v-show="buttonAuth & 4"
          @click="onAudit(true)"
        >审核通过</el-button>
        <el-button
          type="danger"
          icon="fa fa-times"
          v-show="buttonAuth & 4"
          @click="onBackClick()"
        >审核不通过</el-button>
        <el-button
          type="primary"
          icon="fa fa-save"
          v-show="buttonAuth & 1"
          @click="onSaveItem()"
        >保 存</el-button>
        <el-button
          type="success"
          icon="fa fa-clipboard-check"
          v-show="buttonAuth & 2"
          @click="onSubmit()"
        >提 交</el-button>
        <el-button icon="fa fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </div>
      <el-form
        ref="form"
        label-position="right"
        label-width="120px"
        :model="itemModel"
        :rules="rules"
        class="mar-t-sm"
        v-show="(!showAuditRecord)&&!(buttonAuth%4===0)"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="站点：" prop="portId">
              <!-- 自定义的单选站点树 -->
              <el-select v-model="itemModel.portId" placeholder="请选择" @change="changePort">
                <el-option-group v-for="group in treeList" :key="group.name" :label="group.name">
                  <el-option
                    v-for="item in group.children"
                    :key="item.id"
                    :label="item.portName"
                    :value="item.id"
                  ></el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理时间：" prop="dealBeginTime">
              <el-date-picker
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:00:00"
                format="yyyy-MM-dd HH"
                v-model="formTimeRange"
                :clearable="false"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="运行状态类别：" prop="runStatusTypeCode">
              <el-select v-model="itemModel.runStatusTypeCode" @change="getRunStatus(2, true)">
                <el-option
                  v-for="(item, key) in runStatusTypeList"
                  :key="key"
                  :value="item.dictCode"
                  :label="item.dictName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运行状态：" prop="runStatusCode">
              <el-select
                v-model="itemModel.runStatusCode"
                @change="changeRunStatusCode(true)"
                placeholder="选择运行状态类别后再选择此项"
              >
                <el-option
                  v-for="(item, key) in runStatusListForForm"
                  :key="key"
                  :value="item.dictCode"
                  :label="item.dictName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="isShowFactor">
          <el-col :span="12">
            <el-form-item label="报备因子：" prop="reportFactors">
              <span slot="label">
                <span style="color:red">*</span> 报备因子：
              </span>
              <el-select v-model="itemModel.reportFactors" multiple placeholder="选择站点和运行状态后再选择此项">
                <el-option
                  v-for="(item, key) in reportFactorsList"
                  :key="key"
                  :value="item.factorsCode"
                  :label="item.factorsName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="运行情况：">
              <el-input
                v-model="itemModel.situationDesc"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="凭证名称：" prop="certificateName">
              <el-input v-model="itemModel.certificateName" placeholder="站点名称+运行状态报告(开始时间-结束时间)">
                <el-button slot="append" @click="onCreateFileName()">自动生成</el-button>
              </el-input>
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
              <upload-file-all btn="add down remove" ref="upload" :id="itemModel.certificateId" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 查看权限 -->
      <table class="detail-table" style="width:100%;" v-show="(!showAuditRecord)&&buttonAuth%4===0">
        <tr>
          <td class="detail-title">站点：</td>
          <td class="detail-content">{{ itemModel.portName }}</td>
        </tr>
        <tr>
          <td class="detail-title">处理时间：</td>
          <td class="detail-content">{{ `${itemModel.dealBeginTime} ~ ${itemModel.dealEndTime}` }}</td>
        </tr>
        <tr>
          <td class="detail-title">运行状态类别：</td>
          <td class="detail-content">{{ itemModel.runStatusTypeName }}</td>
        </tr>
        <tr>
          <td class="detail-title">运行状态：</td>
          <td class="detail-content">{{ itemModel.runStatusName }}</td>
        </tr>
        <tr v-show="isShowFactor">
          <td class="detail-title">报备因子：</td>
          <td class="detail-content">{{ itemModel.reportFactorNames }}</td>
        </tr>
        <tr>
          <td class="detail-title">运行情况：</td>
          <td class="detail-content">{{ itemModel.situationDesc }}</td>
        </tr>
        <tr>
          <td class="detail-title">凭证名称：</td>
          <td class="detail-content">{{ itemModel.certificateName }}</td>
        </tr>
        <tr>
          <td class="detail-title">凭证附件：</td>
          <td class="detail-content">
            <!-- 公共附件组件 -->
            <upload-file-all btn="down" ref="upload2" :id="itemModel.certificateId" />
          </td>
        </tr>
      </table>
      <!-- 审核记录 -->
      <el-table
        border
        highlight-current-row
        height="100%"
        v-loading="auditRecordloading"
        :data="auditRecordList"
        :row-class-name="rowClassName"
        v-show="showAuditRecord"
        class="mar-t-sm mar-b-sm"
      >
        <el-table-column label="操作人" prop="creatorName" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作时间" prop="createDate" width="155" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作描述" prop="comment" width="500" show-overflow-tooltip></el-table-column>
        <el-table-column label="意见" prop="opinion" show-overflow-tooltip></el-table-column>
      </el-table>
      <div style="height: 50px"></div>
      <!-- 意见框 -->
      <dialog-modal ref="dialog2" size="mini" title="审核意见" minWidth="500px" append-to-body>
        <el-form
          ref="form2"
          label-position="right"
          label-width="100px"
          :model="reasonForm"
          :rules="rules2"
          class="mar-t-sm"
        >
          <el-row :gutter="10">
            <el-form-item label="审核意见：" prop="reason">
              <el-input v-model="reasonForm.reason" type="textarea" :rows="5" placeholder="意见必填"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onBeforeBack()">
            <i class="fa fa-check" aria-hidden="true"></i> 确 认
          </el-button>
          <el-button @click="$refs.dialog2.closeDialog()">
            <i class="fa fa-times" aria-hidden="true"></i> 关 闭
          </el-button>
        </div>
      </dialog-modal>
    </dialog-modal>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { getDay } from '@/libs/tools';
import { analyzeResp } from '@/global/libs/util';
import SelectPort from '@/components/widget/select-port';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'OnlineReport',
  mixins: [queryList, deleteItem],
  components: { SelectPort },
  props: {
    isEnt: Boolean, // 是否企业端（控制按钮操作权限）
  },
  data() {
    return {
      showAuditRecord: false, // 是否显示审核记录
      auditRecordloading: false,
      isShowFactor: false, // 是否显示报备因子
      queryForm: {
        portIds: [],
        isAll: true,
        fromTime: getDay(-7, true, false),
        toTime: getDay(0, true, false),
        auditStatus: [],
        key: '',
        runStatus: '',
        runStatusTypeCode: '',
        portType: '',
        isManagement: false, // 是否管理端
      },
      reasonForm: {
        reason: '',
      },
      auditStatusList: [
        { label: '新建', value: 1, tagType: 'info' },
        { label: '审核中', value: 2, tagType: '' },
        { label: '审核未通过', value: 3, tagType: 'danger' },
        { label: '审核通过', value: 4, tagType: 'success' },
      ],
      // 需要报备因子的运行状态(标定、故障、校准、维修)
      reportRunStatusCode: ['CalibrateFactor', 'BreakFactor', 'CalibrateFactor', 'RepairFactor'],
      stationList: [],
      itemList: [],
      runStatusTypeList: [],
      runStatusList: [],
      runStatusListForForm: [],
      downloading: false,
      url: 'audit/onlineReported', // 删除地址
      activeIndex: '1', // 当前激活的选项卡
      auditRecordList: [], // 审核记录
      reportFactorsList: [], // 报备因子
      treeList: [], // form排口树
      itemModel: {
        id: undefined, // 控制按钮权限和判断新增修改用
        psId: '',
        psName: '',
        regionCodeId: '',
        regionName: '',
        portName: '',
        portId: '',
        dealBeginTime: '',
        dealEndTime: '',
        certificateId: '',
        certificateName: '',
        runStatusTypeCode: '',
        runStatusTypeName: '',
        runStatusCode: '',
        runStatusName: '',
        reportFactors: [],
        reportFlag: '',
        situationDesc: '',
        dealStatus: 0, // 0处理中1已处理
        auditDesc: '',
        auditStatus: 1, // 默认新建状态
      },
      rules: {
        portId: [
          { required: true, message: '此项不能为空', trigger: ['blur', 'change'] },
        ],
        runStatusTypeCode: [
          { required: true, message: '此项不能为空', trigger: ['blur', 'change'] },
        ],
        runStatusCode: [
          { required: true, message: '此项不能为空', trigger: ['blur', 'change'] },
        ],
        dealBeginTime: [
          { required: true, message: '此项不能为空', trigger: ['blur', 'change'] },
        ],
        certificateName: [
          { required: true, message: '此项不能为空', trigger: ['blur', 'change'] },
        ],
      },
      rules2: {
        reason: [
          { required: true, message: '此项不能为空', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  created() {
    this.getStation();
    this.getRunStatusType();
    // 管理端看不到新建状态
    if (!this.isEnt) {
      this.auditStatusList = this.auditStatusList.filter(p => p.label !== '新建');
    }
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType, // 1 废水 2 废气
    }),
    // 按钮操作权限 0 查看 1 保存 2 提交 4 审核
    buttonAuth() {
      let temp = 0;
      if (this.isEnt) { // 企业端
        if (this.itemModel.auditStatus % 2 === 1) { // 新建和审核不通过
          temp += 1;
          if (this.itemModel.id) { // 必须存在id
            temp += 2;
          }
        }
      } else if (this.itemModel.auditStatus === 2) { // 管理端
        temp += 4;
      }
      return temp;
    },
    formTimeRange: {
      get() {
        return (!this.itemModel.dealBeginTime && !this.itemModel.dealEndTime)
          ? ''
          : [this.itemModel.dealBeginTime, this.itemModel.dealEndTime];
      },
      set(val) {
        [this.itemModel.dealBeginTime, this.itemModel.dealEndTime] = val || ['', ''];
      },
    },
  },
  watch: {},
  methods: {
    // 获取站点
    getStation() {
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES', this.amcsType),
          portType: this.amcsType,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.stationList = response.data.data;
          // 构造站点树
          const psNameArr = [];
          this.stationList.forEach((item) => {
            if (!psNameArr.includes(item.psName)) {
              psNameArr.push(item.psName);
            }
          });
          psNameArr.forEach((item) => {
            const temp = {
              name: item,
              children: this.stationList.filter(p => p.psName === item),
            };
            this.treeList.push(temp);
          });
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      const url = 'audit/onlineReported/query';
      const sort = 'createDate-';
      const queryForm = { ...this.queryForm };
      queryForm.isAll = queryForm.portIds.length === 0;
      queryForm.portType = this.amcsType;
      queryForm.isManagement = !this.isEnt;
      this.$http.post(url, queryForm, {
        params: { page, rows, sort },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
    // 下载数据
    onDownload() {
      this.downloading = true;
      const url = 'audit/onlineReported/export';
      const sort = 'regionName+,psName+,portName+,dealBeginTime-';
      const queryForm = { ...this.queryForm };
      queryForm.isAll = queryForm.portIds.length === 0;
      queryForm.portType = this.amcsType;
      queryForm.isManagement = !this.isEnt;
      this.$http.post(url, queryForm, {
        'responseType': 'blob',
        params: { sort },
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}网上报备${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 获取运行状态类别
    getRunStatusType() {
      this.$http.get(`sys/enumCode/${this.$enum.getLabel('LABEL_CODE', this.amcsType)}RunStatus/0`, {
        params: {},
      }).then((response) => {
        // 不考虑报错
        this.runStatusTypeList = response.data;
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取运行状态(类型，是否清空选中值)
    getRunStatus(type, isClear) {
      let temp = '';
      if (type === 1) { // 1查询条件2form表单
        temp = this.queryForm.runStatusTypeCode;
        this.queryForm.runStatus = '';
        this.runStatusList = [];
        if (!this.queryForm.runStatusTypeCode) {
          return;
        }
      } else {
        temp = this.itemModel.runStatusTypeCode;
        if (isClear) {
          this.itemModel.runStatusCode = '';
        }
        this.runStatusListForForm = [];
        if (!this.itemModel.runStatusTypeCode) {
          return;
        }
      }
      const url = `sys/enumCode/child/${this.$enum.getLabel('LABEL_CODE', this.amcsType)}RunStatus/${temp}`;
      this.$http.get(url, {
        params: {},
      }).then((response) => {
        // 不考虑报错
        if (type === 1) { // 1查询条件2form表单
          this.runStatusList = response.data;
        } else {
          this.runStatusListForForm = response.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 删除
    onClickRemove() {
      // 需要判断状态
      const temp = this.selected.filter(p => p.auditStatus % 2 === 0);
      if (temp.length) {
        this.$message({
          type: 'warning',
          message: '无法删除状态为 审核中 和 审核通过 的记录',
          showClose: true,
        });
        return;
      }
      this.onDeleteItem(); // 混入的方法
    },
    // 保存数据项
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        // 额外的验证
        // 验证报备因子是否必填
        if (this.isShowFactor && !this.itemModel.reportFactors.length) {
          this.$message.warning({
            message: '报备因子必选',
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
        // 获取id字段对应中文
        const portInfo = this.stationList.find(p => p.id === this.itemModel.portId);
        itemModelCopy.psId = portInfo.psId;
        itemModelCopy.psName = portInfo.psName;
        itemModelCopy.regionCodeId = portInfo.regionCodeId;
        itemModelCopy.regionName = portInfo.regionName;
        itemModelCopy.portName = portInfo.portName;
        // 因子数组转字符串
        itemModelCopy.reportFactors = this.itemModel.reportFactors.join(',');
        // 停运类型和停运状态
        const typeModel = this.runStatusTypeList.find(p => p.dictCode === this.itemModel.runStatusTypeCode);
        itemModelCopy.runStatusTypeName = typeModel.dictName;
        const statusModel = this.runStatusListForForm.find(p => p.dictCode === this.itemModel.runStatusCode);
        itemModelCopy.runStatusName = statusModel.dictName;
        itemModelCopy.reportFlag = statusModel.dictValue;
        this.saveLoading = true;
        const { id } = this.itemModel;
        const url = 'audit/onlineReported';
        this.$http[id ? 'put' : 'post'](url, itemModelCopy)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '修改' : '新增'}成功`,
                duration: 1500,
                showClose: true,
              });
              this.getItemList();
              // 调附件组件上传方法
              this.$refs.upload.sendUpload();
              // 更新表单id和审核状态，显示提交按钮
              this.itemModel.id = response.data.data.id;
              this.itemModel.auditStatus = response.data.data.auditStatus;
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
    // 单击新增回调
    onClickAdd() {
      this.getFileId();
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      // 报备因子特殊处理
      const temp = { ...row };
      temp.reportFactors = row.reportFactors.split(',');
      this.itemModel = temp;
      // 手动触发change事件
      this.getRunStatus(2, false);
      this.changeRunStatusCode(false);
      this.$refs.dialog.openDialog();
      // 手动触发附件刷新
      this.$nextTick(() => {
        this.$refs[this.buttonAuth % 4 !== 0 ? 'upload' : 'upload2'].getList();
      });
    },
    // 切换选项卡
    changeTab(index) {
      this.showAuditRecord = index === '2';
      if (this.showAuditRecord) {
        // 刷新数据
        this.auditRecordList = [];
        if (this.itemModel.id) {
          this.auditRecordloading = true;
          this.$http.get('audit/onlineReportedLog', {
            params: {
              onlineReportedId: this.itemModel.id,
              page: 1,
              rows: 100,
              sort: 'createDate-',
            },
          }).then((response) => {
            if (response.data.success) {
              this.auditRecordList = response.data.data;
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
            this.auditRecordloading = false;
          });
        }
      }
    },
    // 弹窗关闭前触发
    onCloseDialog() {
      // 初始化表单
      this.itemModel = {
        id: undefined, // 控制按钮权限和判断新增修改用
        psId: '',
        psName: '',
        regionCodeId: '',
        regionName: '',
        portName: '',
        portId: '',
        dealBeginTime: '',
        dealEndTime: '',
        certificateId: '',
        certificateName: '',
        runStatusTypeCode: '',
        runStatusTypeName: '',
        runStatusCode: '',
        runStatusName: '',
        reportFactors: [],
        reportFlag: '',
        situationDesc: '',
        dealStatus: 0, // 0处理中1已处理
        auditDesc: '',
        auditStatus: 1, // 默认新建状态
      };
      // 查看状态无需清空
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.isShowFactor = false;
      this.showAuditRecord = false;
    },
    // 提交
    onSubmit() {
      if (!this.itemModel.id) {
        return;
      }
      this.$confirm('确认提交?（若修改数据，请先保存再提交）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.post('audit/onlineReported/submit', [this.itemModel.id], {
          params: {},
        })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          this.$refs.dialog.closeDialog();
          this.getItemList();
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
    // 审核
    onAudit(pass) {
      if (!this.itemModel.id) {
        return;
      }
      const temp = {
        ids: [this.itemModel.id],
        reason: this.reasonForm.reason,
        isPass: pass,
      };
      this.$confirm(`确认审核${pass ? '通过' : '不通过'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.post('audit/onlineReported/audit', temp, {
          params: {},
        })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          if (!pass) {
            // 需要关闭意见框
            this.$refs.dialog2.closeDialog();
          }
          this.$refs.dialog.closeDialog();
          this.getItemList();
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
    // 获取站点的报备因子
    getPortFactors() {
      if (!this.itemModel.portId) {
        return;
      }
      this.reportFactorsList = [];
      this.$http.get('bas/portInfoFactors', {
        params: {
          page: 1,
          rows: 1000,
          sort: 'factorsName+',
          portId: this.itemModel.portId,
        },
      }).then((response) => {
        // 不考虑报错
        this.reportFactorsList = response.data.data || [];
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 修改运行状态
    changeRunStatusCode(isClear) {
      this.checkShowFactor(isClear);
    },
    // 修改站点
    changePort() {
      this.checkShowFactor(true);
    },
    // 判断是否显示报备因子的公共方法
    checkShowFactor(isClear) {
      if (this.itemModel.runStatusCode && this.itemModel.portId
        && this.reportRunStatusCode.includes(this.itemModel.runStatusCode)) {
        this.isShowFactor = true;
        if (isClear) {
          this.itemModel.reportFactors = [];
        }
        this.getPortFactors();
      } else {
        // 初始化
        this.isShowFactor = false;
        this.itemModel.reportFactors = [];
        this.reportFactorsList = [];
      }
    },
    // 自动生成文件名称
    onCreateFileName() {
      let temp = '';
      if (this.itemModel.portId) {
        temp += this.stationList.find(p => p.id === this.itemModel.portId).portName;
      }
      if (this.itemModel.runStatusCode) {
        temp += this.runStatusListForForm.find(p => p.dictCode === this.itemModel.runStatusCode).dictName;
      }
      temp += '报告';
      if (this.itemModel.dealBeginTime && this.itemModel.dealEndTime) {
        temp += `(${this.itemModel.dealBeginTime}~${this.itemModel.dealEndTime})`;
      }
      this.itemModel.certificateName = temp;
    },
    // 新增获取附件id
    getFileId() {
      this.$http.get('sys/guid/new', {
        params: {},
      }).then((response) => {
        // 不考虑报错
        this.itemModel.certificateId = response.data.data;
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 审核不通过
    onBackClick() {
      this.reasonForm.reason = '';
      this.$refs.dialog2.openDialog();
    },
    // 意见框确认
    onBeforeBack() {
      this.$refs.form2.validate((valid) => {
        if (!valid) return;
        this.onAudit(false);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.online-report {
  .el-menu-item {
    line-height: 40px;
    height: 40px;
  }
  .text-color {
    color: #409eff;
  }
  .detail-table {
    border: solid #dae4f3;
    border-width: 1px 0px 0px 1px;
    .detail-title {
      width: 150px;
      background-color: #dce6f1;
      line-height: 30px;
      text-align: right;
    }
    .detail-content {
      padding-left: 5px;
    }
    td {
      border: solid #dae4f3;
      border-width: 0px 1px 1px 0px;
    }
  }
}
</style>
