<template>
  <el-card>
    <el-row>
      <el-col :span="4">
        <el-col :span="12"
                class="title-info mar-t-xs mar-b-xs">管理网络</el-col>
        <el-col :span="12">
          <el-button icon="fas fa-plus"
                     type="primary"
                     size="mini"
                     style="float:right;margin-left:15px;padding:3px;"
                     :disabled="itemList.length!==0"
                     @click="append(data)">新增
          </el-button>
        </el-col>
        <hr class="block mar-y-0 mar-t-xs mar-b-xs" />
      </el-col>
      <el-col :span="20">
        <el-col class="title-info mar-t-xs mar-b-xs">管理网络信息</el-col>
        <hr class="block mar-y-0 mar-t-xs mar-b-xs" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="network-tree">
          <el-scrollbar>
            <el-tree :data="treeData"
                     :expand-on-click-node="false"
                     :default-expand-all="true"
                     @node-click="onNodeClick">
              <div class="network-tree-node"
                   slot-scope="{ node, data }">
                <span>{{ data.name }}</span>
                <span class="network-tree-node-button">
                  <el-button icon="fas fa-plus"
                             type="primary"
                             size="mini"
                             @click="append(data)">
                  </el-button>
                  <el-button icon="fas fa-trash-alt"
                             type="danger"
                             size="mini"
                             @click="remove(node, data)">
                  </el-button>
                </span>
              </div>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="20">
        <el-table highlight-current-row
                  max-height="750"
                  v-loading="loading"
                  :data="itemList"
                  :row-class-name="rowClassName">
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
          <el-table-column property="name"
                           label="名称"
                           min-width="100"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="contactName"
                           label="负责人姓名"
                           min-width="100"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="contactPhone"
                           label="负责人联系方式"
                           min-width="100"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="safetyDuty"
                           label="安全职责"
                           min-width="150"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="remark"
                           label="备注"
                           min-width="150"
                           show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <form-dialog @query="getItemList"
                 ref="formDialog"></form-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import formDialog from './components/formDialog';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [queryList, deleteItem],
  data() {
    return {
      treeData: [],
      auto: false,
      url: 'wholeprocess/managNetwork',
      pager: {            // 分页
        page: 1,
        rows: 10000,
        count: 0,
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    this.getItemList(true);
  },
  components: { formDialog },
  methods: {
    onNodeClick(val) {
      this.queryForm.id = val.id;
      this.getItemList(false);
    },
    convert() {
      this.treeData = [];
      this.itemList.forEach((item) => {
        this.$set(item, 'children', []);
        if (item.parentId === '0') {
          this.treeData.push(item);
          this.convertChild(this.itemList, item, item.id);
        }
      });
    },
    convertChild(arr, parentItem, parentId) {
      parentItem.children = parentItem.children ? parentItem.children : [];
      arr.forEach((item) => {
        if (item.parentId === parentId) {
          parentItem.children.push(item);
          this.convertChild(arr, item, item.id);
        }
      });
    },
    append(data) {
      this.$refs.formDialog.openDialog(data, false);
    },
    onOpenDialog(data) {
      this.$refs.formDialog.openDialog(data, true);
    },
    remove(node, data) {
      this.$confirm('此操作将删除该数据与子目录数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(`${this.url}/${data.id}`)
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList(true);
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList(bol) {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      if (bol) {
        this.queryForm.id = '';
      }
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          if (bol) {
            this.convert();
          }
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

<style>
.network-tree {
  height: 750px;
  border: 1px solid #e2e2e2;
}
.network-tree-node {
  width: 100% !important;
}
.network-tree-node-button {
  float: right;
  display: none;
}
.network-tree-node:hover .network-tree-node-button {
  display: inline;
}
.network-tree .el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
