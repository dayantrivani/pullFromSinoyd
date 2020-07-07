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
        <el-form-item label="类别："
                      prop="caseCategoryCodeId">
          <el-select v-model="queryForm.caseCategoryCodeId"
                     style="width: 120px;"
                     clearable>
            <el-option v-for="item in dict.caseCategoryCode"
                       :key="item.rowGuid"
                       :label="item.dictName"
                       :value="item.rowGuid"></el-option>
          </el-select>
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
                 @click="onDeleteItem()">删 除</el-button>
      <el-button type="primary"
                  icon="fas fa-download"
                  :disabled="!itemList.length"
                  :loading="exportStatus"
                  @click="onClickExport()">导 出</el-button>
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
                     @click="onOpenDialog(scope.row)">编辑</el-button>
          <el-button type="primary"
                     icon="fas fa-file-invoice"
                     @click="onClickDetail(scope.row)">详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="caseCategoryName"
                       label="类别"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="title"
                  label="标题"
                  min-width="100"
                  show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="remark"
                       label="备注"
                       min-width="150"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />
    <dialog-form @query="getItemList" ref="formDialog"></dialog-form>
    <dialog-detail ref="detailDialog"></dialog-detail>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';
import DialogDetail from './components/DialogDetail';

export default {
  mixins: [queryList, deleteItem],
  components: { DialogForm, DialogDetail },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      url: 'wholeprocess/accidentCase',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        title: '',
        caseCategoryCodeId: '',
        sort: 'modifyDate-',
      },
      dict: {
        caseCategoryCode: [], // 案例类别
      },
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.getDictList();
    this.onQueryList();
  },
  methods: {
    // 新增编辑窗口
    onOpenDialog(row) {
      this.$refs.formDialog.openDialog(row);
    },
    onClickDetail(row) {
      this.$refs.detailDialog.openDialog(row);
    },
    // 获取数据字典
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
      this.$http.post('wholeprocess/accidentCase/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        const fileName = `事故案例${new Date().getTime()}.xls`;
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
