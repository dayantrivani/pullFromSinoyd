<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关键字：" prop="keyWord">
          <el-input v-model="queryForm.keyWord"
                    placeholder="化学品名称、CAS号"
                    style="width: 250px"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="是否剧毒品：" prop="isHypertoxic">
          <el-select v-model="queryForm.isHypertoxic" clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary"
                  icon="fas fa-plus"
                  @click="onClickAdd()">新 增</el-button>
      <el-button type="danger"
                  icon="fas fa-trash-alt"
                  :disabled="!selectedIds.length"
                  @click="onDeleteItem()">删 除</el-button>
      <el-button type="primary"
                  icon="fas fa-download"
                  :disabled="!itemList.length"
                  :loading="exportStatus"
                  @click="onClickExport()">导 出</el-button>
    </div>
    <!-- 列表 -->
    <el-table
        border
        highlight-current-row
        height="calc(100% - 71px)"
        v-loading="loading"
        :data="itemList"
        :row-class-name="rowClassName"
        @select="onChangeCheck"
        @select-all="onChangeCheckAll"
        @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="40"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑
          </el-button>
          <el-button type="primary" icon="fas fa-file-invoice" @click="onClickDetail(scope.row)">详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="commodityName" label="品名" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="anotherName" label="别名" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="enName" label="英文名" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="casNumber" label="CAS号" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="riskCategory" label="危险性类别" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isKeySupervision"
                       label="重点监管"
                       min-width="60"
                       show-overflow-tooltip
                       align="center">
        <template slot-scope="{ row }">
          {{ row.isKeySupervision ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column property="isHypertoxic"
                       label="剧毒"
                       min-width="60"
                       show-overflow-tooltip
                       align="center">
        <template slot-scope="{ row }">
          {{ row.isHypertoxic ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column property="isPrecursorChemicals"
                       label="易制毒"
                       min-width="60"
                       show-overflow-tooltip
                       align="center">
        <template slot-scope="{ row }">
          {{ row.isPrecursorChemicals ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column property="remark" label="备注" min-width="100" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()" />
    <dialog-form ref="formDialog" @query="getItemList"></dialog-form>
    <dialog-detail ref="detailDialog"></dialog-detail>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import DialogDetail from './components/DialogDetail';

export default {
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
    DialogDetail,
  },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      url: 'wholeprocess/hazardousChemicalSafetyInfo',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        keyWord: '',
        isHypertoxic: '',
        sort: '',
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
    onClickAdd() {
      this.$refs.formDialog.openDialog();
    },
    onClickEdit(row) {
      this.$refs.formDialog.openDialog(row);
    },
    onClickDetail(row) {
      this.$refs.detailDialog.openDialog(row);
    },
    // 导出
    onClickExport() {
      this.exportStatus = true;
      this.$http.post('wholeprocess/hazardousChemicalSafetyInfo/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        const fileName = `危化品安全信息${new Date().getTime()}.xls`;
        const fileBlob = new Blob([response.data], { type: 'application/x-xls' });
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(fileBlob, fileName);
        } else {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(fileBlob);
          link.download = fileName;
          document.body.appendChild(link);  // fix: 修复在火狐未触发下载问题
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.exportStatus = false;
      });
    },
  },
};
</script>
