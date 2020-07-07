<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="粉尘种类：" prop="dustTypeCodeId">
          <el-select v-model="queryForm.dustTypeCodeId" autofocus clearable filterable>
            <el-option v-for="item in dict.DustType" :key="item.rowGuid" :label="item.dictName" :value="item.rowGuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
          <el-button type="primary" icon="fas fa-upload" :disabled="!itemList.length" :loading="exportStatus"
            @click="onClickExport()">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary" icon="fas fa-plus" @click="onOpenDialog()">新 增</el-button>
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table border highlight-current-row height="calc(100% - 71px)" v-loading="loading" :data="itemList"
      :row-class-name="rowClassName" @select="onChangeCheck" @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="40"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onOpenDialog(scope.row)">详细</el-button>
        </template>
      </el-table-column>
      <el-table-column property="dustTypeName" label="粉尘种类" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="workerNum" label="涉粉作业人数" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="singleShiftNum" label="涉粉单班作业人数" min-width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isDusterName" label="是否有除尘器" min-width="130" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="dusterTypeName" label="除尘器种类" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isDustClearName" label="建立粉尘清扫制度" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isMonitorName" label="安装监控" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isAcceptanceCheckName" label="通过验收" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="dusterNum" label="除尘器数量" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isExplosionName" label="是否涉爆" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isOccupHazardsName" label="是否职业病危害" min-width="130" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()" />
    <form-dialog @query="getItemList" ref="formDialog" :dustType="dict.DustType"></form-dialog>
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
      url: 'wholeprocess/dustInfo',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        dustTypeCodeId: '',
        sort: 'dustTypeCodeId+',
      },
      dict: {
        DustType: [],
      },
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
    this.getDictList();
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
    // 导出
    onClickExport() {
      this.exportStatus = true;
      this.$http.post('wholeprocess/dustInfo/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `粉尘信息${new Date().toLocaleDateString()}.xls`;
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
