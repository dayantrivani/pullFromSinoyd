<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关键字：" prop="name" hint-down>
          <el-input placeholder="受限空间名称" v-model="queryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="易导致事故类型：" prop="typeCode" hint-down>
          <el-select v-model="queryForm.typeCode" autofocus style="width:150px;" clearable>
            <el-option v-for="item in dict.AccidentProneOccurType" :key="item.rowGuid" :label="item.dictName"
              :value="item.rowGuid"></el-option>
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
      <el-table-column property="name" label="名称" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="mainHazardous" label="主要危险有害物质" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="quantity" label="数量" min-width="60" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="location" label="位置" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="accidentTypeNames" label="易导致事故类型" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="safetyFacility" label="安全设施（预防/应急）" min-width="150" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()" />
    <form-dialog @query="getItemList" ref="formDialog" :accident-prone-occur-type="dict.AccidentProneOccurType">
    </form-dialog>
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
      url: 'wholeprocess/confinedSpace',
      isAuto: false,
      queryForm: {
        psId: '',
        name: '',
        typeCode: '',
        sort: 'name+',
      },
      exportStatus: false,
      dict: {
        AccidentProneOccurType: [],
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
      this.$http.post('wholeprocess/confinedSpace/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `受限空间${new Date().toLocaleDateString()}.xls`;
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
