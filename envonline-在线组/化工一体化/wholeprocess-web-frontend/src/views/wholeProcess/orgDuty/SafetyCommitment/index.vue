<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="岗位名称："
                      prop="jobName">
          <el-input v-model="queryForm.jobName"></el-input>
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
          <el-button type="primary"
                     icon="fas fa-cloud-download-alt"
                     @click="onQueryDocId(scope.row)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column property="belongYear"
                       label="所属年份"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="jobName"
                       label="岗位名称"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="contactName"
                       label="姓名"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="contactPhone"
                       label="联系方式"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="remark"
                       label="备注"
                       min-width="100"
                       show-overflow-tooltip>
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
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [queryList, deleteItem],
  components: { formDialog },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      url: 'wholeprocess/safetyCommitment',
      isAuto: false,
      queryForm: {
        psId: '',
        jobName: '',
        sort: 'jobName',
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
    // 调取文件id接口
    onQueryDocId(row) {
      this.$http.get('res/document', {
        params: {
          objectId: row.id,
        },
      }).then((response) => {
        if (response.status === 200) {
          const [first] = response.data.data;
          if (first) {
            this.onDownloadClick(first);
          } else {
            this.$message.warning({
              message: '文件为空',
              duration: 1500,
              showClose: true,
            });
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 下载文件
    onDownloadClick(row) {
      this.$http.get(`res/document/download?id=${row.id}`, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const fileName = row.docName;
          const blob = new Blob([response.data], { type: 'application/x-xls' });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }
      }, (response) => {
        analyzeResp(response);
      });
    },
  },
};
</script>
