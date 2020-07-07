<template>
  <!-- 排污许可证 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>
        <el-form-item label="企业名称：">
          <el-input
            v-model="queryForm.psName"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item label="许可证编号：">
          <el-input
            v-model="queryForm.permitCode"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select style="width:90px;" v-model="queryForm.status">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $enum.get('LICENCE_STATUS')"
              :key="key"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" v-if="isShow">
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
      :height="isShow ? 'calc(100% - 69px)' : 'calc(100% - 31px)'"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column v-if="isShow" align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" :width="isShow ? 165 : 116">
        <template slot-scope="scope">
          <el-button v-if="isShow" type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-link" @click="onClickDoc(scope.row)">附件</el-button>
          <el-button type="primary" icon="fas fa-file-invoice" @click="onClickConfig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="许可证编号" prop="permitCode" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="许可时间（有效期）" min-width="307" show-overflow-tooltip>
        <!-- <el-table-column label="开始时间" prop="permitStartDate" min-width="145" show-overflow-tooltip></el-table-column>
        <el-table-column label="结束时间" prop="permitEndDate" min-width="145" show-overflow-tooltip></el-table-column> -->
        <template slot-scope="{ row }">
          <span>{{ `${row.permitStartDate.split(' ')[0]} ~ ${row.permitEndDate.split(' ')[0]}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签发日期" prop="permitSignDate" min-width="152" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="审批单位" prop="signDepartment" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <upload-dialog ref="upload" :isShow="isShow"/>
    <dialog-form ref="dialog" @query="getItemList"/>
    <sewage-factor ref="config"/>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import UploadDialog from '@/components/UploadDialog';
import DialogForm from './components/DialogForm';
import SewageFactor from '@/components/widgets/SewageLicenseConfig/SewageFactor';

export default {
  name: 'SewageLicense',
  mixins: [queryList, deleteItem],
  components: {
    UploadDialog,
    DialogForm,
    SewageFactor,
  },
  data() {
    return {
      url: 'bas/pollutantDischargePermit',
      isAuto: false,
      isShow: true,
      loading: false,
      queryForm: {                  // 检索表单项
        psId: '',                   // 企业id
        psName: '',                 // 企业名称
        permitCode: '',             // 许可证编码
        status: '',                 // 状态 1 有效 0 过期
        sort: 'psName+,permitCode+',
      },
      itemList: [],
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    if (this.userType === 'ent') {
      this.isShow = false;
      this.$set(this.queryForm, 'psId', this.orgGuid);
    }
    this.onQueryList();
  },
  methods: {
    onClickAdd() {                  // 新增按钮
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {              // 编辑按钮
      this.$refs.dialog.openDialog(row);
    },
    onClickDoc(row) {               // 附件上传
      this.$refs.upload.openDialog(row);
    },
    onClickConfig(row) {            // 配置
      this.$refs.config.openDialog(row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
