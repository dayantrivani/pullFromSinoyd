<template>
  <!-- 企业管理 -->
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="行政区域：">
          <select-tree-lazy v-model="queryForm.regionCodeId" />
        </el-form-item>
        <el-form-item label="企业名称：">
          <el-input v-model="queryForm.psName" placeholder="企业名称" clearable style="width: 240px"></el-input>
        </el-form-item>
         <el-form-item label="企业种类：">
          <el-select v-model="queryForm.psTypes">
            <el-option v-for="(item, i) in psTypeList" :label="item.name" :value="item.id" :key="i">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
          <el-button type="primary" icon="fas fa-upload" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 评价标准列表 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDelete">删 除
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      height="calc(100% - 76px)"
      border
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="195">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickUpload(scope.row)">附件</el-button>
          <el-button type="primary" icon="fas fa-pencil-alt" @click="viewEditRecord(scope.row)">修改记录</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="psShortName" label="企业简称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="socialCreditCode" label="统一社会信用代码" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="regionName" label="行政区域" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="industrialPark" label="所在园区" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="industryTypeName" label="行业类型" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="psAddress" label="地址" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="passDate" label="成立日期" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业法人/联系电话" min-width="180" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ `${row.corporationName || '--'} / ${row.corporationTelPhone || '--'}` }}
        </template>
      </el-table-column>
      <el-table-column label="安全负责人/联系电话" min-width="180" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{  `${row.securityName || '--'} / ${row.securityTelPhone || '--'}` }}
        </template>
      </el-table-column>
      <el-table-column label="环保负责人/联系电话" min-width="180" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{  `${row.contactMan || '--'} / ${row.contactTelPhone || '--'}` }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 公共弹框 -->
    <PublicBouncedDailog ref="dialog" :dailogData="dailogData" @getData="getItemList"/>

    <edit-record ref="dialogItem" />
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';
import PublicBouncedDailog from '@/views/bas/CommonDialog/PublicBouncedDailog';
import EditRecord from '@/components/widgets/EditRecord';

export default {
  name: 'Enterprise',
  components: {
    SelectTreeLazy,
    PublicBouncedDailog,
    EditRecord,
  },
  data() {
    return {
      psTypeList: [
        {
          name: '全部',
          id: '1, 2, 4, 8, 16, 32, 64, 128',
        },
        {
          name: '污染源',
          id: '1',
        },
        {
          name: '客户',
          id: '2',
        },
        {
          name: '供应商',
          id: '4',
        },
        {
          name: '考核单位',
          id: '8',
        },
        {
          name: '分包商',
          id: '16',
        },
        {
          name: '生产厂商',
          id: '32',
        },
        {
          name: '鉴定机构',
          id: '64',
        },
        {
          name: '运营商',
          id: '128',
        },
      ],
      selectedIds: [],                       // 表格选中的id集合
      width: '200px',                        // 传递给下拉组件
      loading: false,                        // 表格数据加载状态
      dailogData: {                          // 传递给子组件的数据
        regionName: '',                      // 传递行政区域
        dialogtitle: '企业信息',
        type: null,                          // 判断当前企业身份
        editData: {                          // 点击编辑传递给组件数据
          id: '',
        },
      },
      queryForm: {                           // 查询表单绑定变量
        regionCodeId: '',                    // 行政区域
        psName: '',                          // 企业名称
        psTypes: '1, 2, 4, 8, 16, 32, 64, 128', // 企业种类
      },
      pager: {
        page: 1,
        rows: 15,
        total: 0,
      },
      itemList: [], // 表格数据
    };
  },
  computed: {
    ...mapState({
      UploadHistory: state => state.psInfo.UploadHistory,
    }),
  },
  created() {
    // 记录当前列表分页状态
    this.pager = this.UploadHistory || { total: 0, page: 1, rows: 15 };
    this.getItemList();
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    // 获取产品数据列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/psBaseInfo', {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        this.itemList = response.data.data;
        this.pager.total = response.data.count;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 新增
    onClickAdd() {
      this.$refs.dialog.openDialog();   // 修改项
      this.dailogData.regionName = '';
    },
    // 编辑
    onClickEdit(row) {
      this.dailogData.regionName = row.regionName;
      this.dailogData.editData = row;
      this.$refs.dialog.getEditData();
      this.$refs.dialog.openDialog();  // 修改项
    },
    // 修改记录
    viewEditRecord(row) {
      this.$refs.dialogItem.openDialog(row);
    },
    // 附件
    onClickUpload(row) {
      this.itemModel = { ...row };
      sessionStorage.setItem('UPInfo', JSON.stringify(row));
      this.$store.commit('psInfo/setUploadHistory', this.pager);
      this.$router.push({ name: 'UPSecureFourColorMap' });
    },
    onSaveSelected(selection) { // 表格选中的数据id
      this.selectedIds = selection.map(val => val.id);
    },
    // 删除数据项
    onDelete() {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/psBaseInfo/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          // if (this.pager.total <= this.pager.rows * this.pager.page) {
          //   this.pager.page -= 1;
          // }
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post('bas/psBaseInfo/export', { ...this.queryForm, psTypes: [1, 2, 4, 8, 16, 32, 64, 128] }, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `企业基本信息${new Date().toLocaleDateString()}.xls`;
        this.downloadFile(response, filename);
      }).finally(() => {
        this.downloading = false;
      });
    },
    downloadFile(response, fileName) {
      const fileBlob = new Blob([response.data], { type: 'application/x-xls' });
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(fileBlob, fileName);
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(fileBlob);
        link.download = fileName || decodeURI(response.headers['content-disposition']).split('=')[1];
        document.body.appendChild(link);  // fix: 修复在火狐未触发下载问题
        link.click();
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }
    },
  },
};
</script>

<style scoped>
</style>
