<template>
  <!-- 主体内容 -->
  <div class="main-box">
    <!-- 按钮组 -->
    <el-form inline class="mar-x-sm mar-t-xs">
      <el-form-item label="关键字：">
        <el-input
          v-model="queryForm.key"
          clearable
          placeholder="请输入企业名称、站点名称"
          style="width:220px"
          @keyup.enter.native="onQueryList()">
        </el-input>
      </el-form-item>

      <el-form-item v-if="isShow">
        <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="openTransfer">配置站点</el-button>
      </el-form-item>

      <!-- <el-form-item>
        <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      border
      highlight-current-row
      height="calc(86vh - 161px)"
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="150" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />

    <Transfer-port ref="port" @getQueryData="getPortIdsList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import TransferPort from '@/components/widgets/transfer-port';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  mixins: [queryList, deleteItem],
  components: {
    TransferPort,
  },
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: '',
      isAuto: false,                // 告诉混合不要在created时调取查询接口
      loading: false,               // 列表加载状态
      isShow: true,
      queryForm: {                  // 查询条件
        psId: '',                   // 企业名称
        schemeId: '',               // 许可证id
        key: '',                    // 企业名称、站点名称
        sort: 'psName+,portName',
      },
      select: {
        portList: [],
      },
      itemList: [],                 // 选中站点数据
      portIds: [],                  // 选中站点ids
      bindPortIds: [],              // 已绑定方案的站点ids
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    if (this.userType === 'ent') {
      this.isShow = false;
      this.$set(this.queryForm, 'psId', this.orgGuid);
    }
  },
  methods: {
    openDialog() {                  // 打开弹框
      this.queryForm.schemeId = this.mainrow.id;
      this.getPortList();
    },
    onClickAdd() {                  // 新增按钮
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {              // 编辑按钮
      this.$refs.dialog.openDialog(row);
    },
    openTransfer() {                // 打开穿梭框
      this.$refs.port.openDialog(this.portIds);
    },
    getPortIdsList(ids) {           // 关闭穿梭框时触发
      // 1. 通过ids列表站点返回对应列表数据
      const portList = this.select.portList.map(item => ({
        regionCodeId: item.regionCodeId,
        regionName: item.regionName,
        psId: item.psId,
        psName: item.psName,
        portId: item.id,
        portName: item.portName,
        schemeId: this.mainrow.id,
        isSend: 0,
      })).filter(f => ids.includes(f.portId));
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // }).then(() => {
      this.isBindThreshold(portList);
      // });
    },

    /** 请求层 */
    getItemList() {                // 1. 方案已经配置的排口
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('tpeci/valveScheme2Port', {
        params: {
          page,
          rows,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data || [];
          this.portIds = this.itemList.map(item => item.portId);
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
    getPortList() {                // 2. 获取所有排口列表
      this.loading = true;
      this.select.portList = [];
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 1000000,
          childPortType: 5,
          portType: 1,
          sort: 'psName-,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data || [];
          this.onQueryList();
        } else {
          this.loading = false;
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        this.loading = false;
        analyzeResp(response);
      });
    },
    isBindThreshold(list) {        // 3. 判断是否存在绑定方案的站点
      this.$http.post('tpeci/valveScheme2Port/1', {
        schemeId: this.mainrow.id,
        valveScheme2PortList: list,
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.bindPortIds = response.data.data || [];
          const msg = this.bindPortIds.map(item => item.portName).join(',');
          if (this.bindPortIds.length) {
            this.$confirm(`站点${msg}已经绑定了其他方案,是否更换此新方案?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.updateBindPort(list);
            });
          } else {
            this.updateBindPort(list);
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
      });
    },
    updateBindPort(list) {         // 4. 进行站点的绑定
      this.$http.post('tpeci/valveScheme2Port/0', {
        schemeId: this.mainrow.id,
        valveScheme2PortList: list,
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.getItemList();
        } else {
          this.loading = false;
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

    /** 特殊方法 */
    closeDialog() {                // 标签页对话框关闭时调取此方法
      this.selectedIds = [];
      this.itemList = [];
      this.portIds = [];
      this.select = {
        portList: [],
      };
      this.queryForm = {
        schemeId: '',               // 许可证id
        key: '',                    // 企业名称、站点名称
        sort: 'psName+,portName',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
