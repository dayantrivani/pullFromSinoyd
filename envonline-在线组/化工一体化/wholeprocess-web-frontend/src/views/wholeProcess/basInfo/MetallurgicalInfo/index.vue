<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item hint-down label="类别名称：">
          <el-select v-model="queryForm.categoryCodeId" autofocus clearable>
            <el-option v-for="item in dict.MetallurgicalCategory" :key="item.rowGuid" :label="item.dictName"
              :value="item.rowGuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="熔炼场所建筑物结构：">
          <el-select v-model="queryForm.structureCodeId" autofocus clearable>
            <el-option v-for="item in dict.MetallurgicalStructure" :key="item.rowGuid" :label="item.dictName"
              :value="item.rowGuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金属液体转运方式：">
          <el-select v-model="queryForm.transportModeCodeId" autofocus clearable>
            <el-option v-for="item in dict.MetallurgicalTransportMode" :key="item.rowGuid" :label="item.dictName"
              :value="item.rowGuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为移动式：">
          <el-select v-model="queryForm.isMobile" autofocus clearable>
            <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加热方式：">
          <el-select v-model="queryForm.heatingModeCodeId" autofocus clearable>
            <el-option v-for="item in dict.MetallurgicalHeatingMode" :key="item.rowGuid" :label="item.dictName"
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
      <el-table-column property="categoryName" label="类别名称" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="mainProducts" label="主要产品" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isMobileName" label="载体是否为移动式" min-width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="heatingModeName" label="加热方式" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="annualYield" label="年产量" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="onSitePeopleNum" label="现场人数" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="structureName" label="熔炼场所建筑物结构" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="transportModeName" label="金属液体转运方式" min-width="140" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()" />
    <form-dialog @query="getItemList" ref="formDialog" :category="dict.MetallurgicalCategory"
      :structure="dict.MetallurgicalStructure" :transportMode="dict.MetallurgicalTransportMode"
      :heatingMode="dict.MetallurgicalHeatingMode"></form-dialog>
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
      url: 'wholeprocess/metallurgicalInfo',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        categoryCodeId: '', // 类别名称
        name: '',
        sort: 'categoryCodeId+',
      },
      dict: {
        MetallurgicalCategory: [],
        MetallurgicalStructure: [],
        MetallurgicalTransportMode: [],
        MetallurgicalHeatingMode: [],
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
      this.$http.post('wholeprocess/metallurgicalInfo/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `冶金信息${new Date().toLocaleDateString()}.xls`;
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
