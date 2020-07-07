<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="标题："
                      prop="title">
          <el-input v-model="queryForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary"
                 icon="fas fa-plus"
                 @click="onOpenDialog()">新 增</el-button>
      <el-button type="danger"
                 icon="fas fa-trash-alt"
                 :disabled="!selectedIds.length"
                 @click="onDeleteItem()">删 除
      </el-button>
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
                       type="selection"
                       width="40"></el-table-column>
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
      <el-table-column property="title"
                       label="标题"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="belongYear"
                       label="所属年份"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="responsibleDepName"
                       label="部门"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="jobName"
                       label="签订负责人岗位名称"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="contactName"
                       label="签订负责人姓名"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="signingTime"
                       label="责任书签订时间"
                       min-width="100"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.signingTime === '1753-01-01 00:00:00' ? '' : scope.row.signingTime | date}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />
    <form-dialog @query="getItemList"
                 :docType="dict.DocType"
                 :choseItemList="choseItemList"
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
      url: 'wholeprocess/safetyResponsibilityAgreement',
      isAuto: false,
      choseItemList: [],
      queryForm: {
        psId: '',
        title: '',
        isReceipt: true,
        sort: 'signingTime-,title',
      },
      dict: {
        DocType: [],
      },
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
    this.getDictList();
    this.getChoseItemList();
  },
  methods: {
    // 新增编辑窗口
    onOpenDialog(row) {
      this.$refs.formDialog.openDialog(row);
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    // 获取记录列表
    getChoseItemList() {
      this.$http.get(this.url, {
        params: { page: 1, rows: 100000 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.choseItemList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>
