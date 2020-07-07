<template>
  <el-row :gutter="$config.space" class="fill-h">
    <el-col :span="24">
      <el-card type="title">
        <template slot="header">安全生产许可信息</template>
        <!-- 按钮栏 -->
        <div class="mar-l-sm mar-y-xs">
          <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
          <el-button
            type="danger"
            icon="fas fa-trash-alt"
            :disabled="!selectedIds.length"
            @click="onDeleteItem(getItemList)"
          >删 除
          </el-button>
        </div>
        <!-- 列表内容 -->
        <el-table
          border
          highlight-current-row
          height="calc(100% - 70px)"
          v-loading="loading"
          :data="itemList"
          @selection-change="onChangeSelected"
        >
          <el-table-column align="center" type="selection" width="37"></el-table-column>
          <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
          <el-table-column align="center" label="操作" width="67">
            <template slot-scope="scope">
              <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column
            property="licenseNumber"
            label="许可证编号"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column property="licenseScope" label="许可范围" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column
            property="licenseTypeName"
            label="证照类型"
            min-width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            property="issuingAuthority"
            label="发证机关"
            min-width="180"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column property="startDate" label="起始时间" min-width="80" show-overflow-tooltip>
              <template slot-scope="{ row }">
                {{ row.startDate === '1900-01-01 00:00:00' ? '' : row.startDate | date}}
              </template>
            </el-table-column>
          <el-table-column property="endDate" label="结束时间" min-width="80" show-overflow-tooltip>
            <template slot-scope="{ row }">
                {{ row.endDate === '1900-01-01 00:00:00' ? '' : row.endDate | date}}
              </template>
          </el-table-column>
          <el-table-column property="remark" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 列表分页 -->
        <paging-query :pager="pager" @query="getItemList"/>
        <!-- 弹出框内容 -->
        <dialog-form ref="dialog"  @query="getItemList" :psid="this.psInfo.id"/>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';
import DialogForm from './components/DialogForm';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'SafetyProductLicenseInfo',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/safetyProductLicenseInfo',
      selectedIds: [],
      loading: false,                             // 列表加载状态
      itemList: [],                               // 列表数据源
      pager: {
        rows: 15,
        page: 1,
        count: 0,
      },
      selectedIndexs: [],
    };
  },
  computed: {
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 返回企业列表
    onClickBack() {
      this.$router.push({ name: 'home' });
    },
    onChangeSelected(rows) {
      this.selectedIds = rows.map(row => row.id);
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, psId: this.psInfo.id },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
