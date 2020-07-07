<template>
  <!-- 站点方案配置查看 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>
        <el-form-item label="关键字：">
          <el-input
            v-model="queryForm.key"
            clearable
            placeholder="请输入企业名称、站点名称"
            style="width:220px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item label="配置方案名称：">
          <el-input
            v-model="queryForm.schemeName"
            placeholder="配置方案名称"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item label="浓度下发状态：">
          <el-select style="width:90px;" v-model="queryForm.isAvgSend">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $enum.get('PORT_ISAVGSEND')"
              :key="key"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="总量下发状态：">
          <el-select style="width:90px;" v-model="queryForm.isCouSend">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $enum.get('PORT_ISCOUSEND')"
              :key="key"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>


    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="77">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" v-if="isShow">更多
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-sync-alt" @click="onClickSendDialog(scope.row, 1)">总量下发</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-tint" @click="onClickSend(scope.row, 2)">浓度下发</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-redo" @click="onClickSendDialog(scope.row, 3)">总量取消下发</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-tint-slash" @click="onClickSend(scope.row, 4)">浓度取消下发</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-file-invoice" @click="onClickConfig(scope.row)">配 置</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-eye" @click="onClickView(scope.row)">查 看</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-if="!isShow" type="primary" icon="fas fa-eye" @click="onClickView(scope.row)">查 看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="配置方案名称" prop="schemeName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="浓度下发状态" prop="isAvgSendName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="总量下发状态" prop="isCouSendName" min-width="140" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-item ref="dialog" @query="getItemList"/>
    <dialog-view ref="dialogView"></dialog-view>
    <dialog-send ref="dialogSend" @query="getItemList"></dialog-send>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import DialogItem from './components/DialogItem';
import DialogSend from './components/DialogSend';
import DialogView from '@/components/widgets/ViewPortConfigScheme/DialogView';

export default {
  name: 'ViewPortConfigScheme',
  mixins: [queryList],
  components: {
    DialogItem,
    DialogSend,
    DialogView,
  },
  data() {
    return {
      url: 'tpeci/valveScheme2Port',
      isAuto: false,
      isShow: true,
      loading: false,
      queryForm: {                  // 检索表单项
        psId: '',                   // 企业id
        key: '',                    // 企业名称、站点名称
        schemeName: '',             // 方案名称
        isAvgSend: '',              // 浓度下发状态
        isCouSend: '',              // 总量下发状态
        sort: 'psName+,portName',
      },
      itemList: [],                 // 列表数据
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
    this.onQueryList();
  },
  methods: {
    onClickConfig(row) {            // 配置按钮
      this.$refs.dialog.openDialog(row);
    },
    onClickView(row) {
      this.$refs.dialogView.openDialog(row);
    },
    onClickSendDialog(row, n) {
      this.$refs.dialogSend.openDialog(row, n);
    },

    /** 请求层 */
    onClickSend(row, n) {              // 下发请求
      this.$http.get(`${this.url}/issued`, {
        params: {
          portId: row.portId,
          issuedType: n,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.getItemList();
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

<style lang="scss" scoped>
</style>
