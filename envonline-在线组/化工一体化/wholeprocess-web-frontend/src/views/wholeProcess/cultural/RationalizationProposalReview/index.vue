<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="主题："
                      prop="subject">
          <el-input v-model="queryForm.subject"></el-input>
        </el-form-item>
        <el-form-item label="建议类别："
                      prop="type">
          <el-select v-model="queryForm.type"
                     autofocus
                     clearable>
            <el-option v-for="item in $enum.AGREEMENTTYPE"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态："
                      prop="dealStatus">
          <el-select v-model="queryForm.dealStatus"
                     autofocus
                     clearable>
            <el-option v-for="item in $enum.REVIEWSTATUS"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建言人："
                      prop="propounderUserName">
          <el-input v-model="queryForm.propounderUserName"></el-input>
        </el-form-item>
        <el-form-item label="审核人："
                      prop="dealUserName">
          <el-input v-model="queryForm.dealUserName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <el-table border
              highlight-current-row
              height="calc(100% - 71px)"
              v-loading="loading"
              :data="itemList"
              :row-class-name="rowClassName"
              @select="onChangeCheck"
              @select-all="onChangeCheckAll"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                       label="No."
                       width="50"
                       type="index"
                       :index="index"></el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="120"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-pencil-alt"
                     @click="onOpenDialog(scope.row)">详细</el-button>
        </template>
      </el-table-column>
      <el-table-column property="subject"
                       label="主题"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="propounderUserName"
                       label="建言人"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="type"
                       label="类别"
                       min-width="150"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{$enum.getLabel('AGREEMENTTYPE',scope.row.type)}}</template>
      </el-table-column>
      <el-table-column property="dealStatus"
                       label="审核状态"
                       min-width="150"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{$enum.getLabel('REVIEWSTATUS',scope.row.dealStatus)}}</template>
      </el-table-column>
      <el-table-column property="dealUserName"
                       label="审核人"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="dealDate"
                       label="审核时间"
                       min-width="100"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.dealDate === '1753-01-01 00:00:00' ? '' : scope.row.dealDate | date}}</template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />
    <form-dialog @query="getItemList"
                 ref="formDialog"></form-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import formDialog from './components/formDialog';

export default {
  mixins: [queryList, deleteItem],
  components: { formDialog },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      url: 'wholeprocess/rationalizationProposal',
      isAuto: false,
      queryForm: {
        psId: '',
        subject: '',
        type: '',
        propounderUserName: '',
        dealUserName: '',
        dealStatus: '',
        sort: 'subject',
      },
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
  },
  methods: {
    // 新增编辑窗口
    onOpenDialog(row) {
      this.$refs.formDialog.openDialog(row);
    },
  },
};
</script>
