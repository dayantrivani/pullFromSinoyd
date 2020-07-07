<!-- 企业报备 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="企业名称：" v-show="!['ent', 'Ent'].includes(this.userType)">
          <el-input
            v-model="queryForm.psName"
            placeholder="企业名称"
            clearable
            style="width:160px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="报备类型：">
          <el-select v-model="queryForm.reportType" clearable style="width: 150px;">
            <el-option label="故障申报" :value="1"></el-option>
            <el-option label="企业整改申报" :value="2"></el-option>
            <el-option label="企业停工申报" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前状态：">
          <el-select v-model="queryForm.status" clearable style="width: 150px;">
            <el-option label="处置中" :value="0"></el-option>
            <el-option label="已完成" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报备时间：">
          <el-date-picker
            style="width: 140px;"
            v-model="queryForm.fromTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
            @change="onQueryList"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width: 140px;"
            v-model="queryForm.toTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
            @change="onQueryList"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" v-if="['ent', 'Ent'].includes(userType)">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      :height="['ent', 'Ent'].includes(userType) ? 'calc(100% - 70px)' : 'calc(100% - 33px)'"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37" v-if="['ent', 'Ent'].includes(userType)"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="70">
        <template slot-scope="scope">
          <el-button
            type="primary"
            :icon="`fas fa-${ ['ent', 'Ent'].includes(userType) ? 'pencil-alt' : 'eye' }`"
            @click="onClickEdit(scope.row)"
          >
            {{['ent', 'Ent'].includes(userType) ? '编辑' : '查看'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column property="createDate" label="报备时间" min-width="110" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{row.createDate ? row.createDate.split(' ')[0] : ''}}
        </template>
      </el-table-column>
      <el-table-column property="reportTypeName" label="报备类型" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column property="beginTime" label="开始时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="endTime" label="预计结束时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="statusName" label="当前状态" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
    <dialog-modal
      ref="checkDialog"
      type="title"
      size="mini"
      title="新增报备类型"
      @close="closeDialog"
    >
      <el-form
        ref="checkForm"
        label-width="90px"
        :model="checkModel"
        class="mar-t-xs pad-x-sm pad-b-xs item-space el-box"
      >
        <el-form-item label="报备类型：" prop="type" :rules="[{ required: true, message: '请选择报备类型', trigger: ['blur', 'change'] }]">
          <el-select v-model="checkModel.type" value-key="value">
            <el-option
              v-for="item in dialogType"
              :key="item.value"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" @click="onClickCheck">确 定</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
    </dialog-modal>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDay } from '@/libs/tools';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';

export default {
  name: 'EntReported',
  mixins: [                   // 混合
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      url: 'enterprise/reporting',
      isAuto: false,
      // 查询表单绑定变量
      queryForm: {
        psName: '',
        reportType: '',
        status: '',
        fromTime: getDay(-29, false, false),
        toTime: getDay(0, false, false),
        sort: 'createDate-,psName+',
      },
      dialogType: [
        {
          label: '企业故障申报',
          value: 1,
        },
        {
          label: '企业整改申报',
          value: 2,
        },
        {
          label: '企业停产报备',
          value: 3,
        },
      ],
      checkModel: {
        type: { label: '企业故障申报', value: 1 },
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    if (['ent', 'Ent'].includes(this.userType)) this.queryForm.psId = this.orgGuid;
    this.onQueryList();
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.checkModel.type = { label: '企业故障申报', value: 1 };
      this.$refs.checkDialog.openDialog();
    },
    // 关闭选择新增报备类型弹窗
    closeDialog() {
      this.$refs.checkDialog.closeDialog();
    },
    onClickCheck() {
      this.$refs.checkForm.validate((valid) => {
        if (!valid) return;
        this.closeDialog();
        this.$refs.dialog.openDialog(this.checkModel.type);
      });
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog({ label: row.reportTypeName, value: row.reportType }, row);
    },
  },
};
</script>
