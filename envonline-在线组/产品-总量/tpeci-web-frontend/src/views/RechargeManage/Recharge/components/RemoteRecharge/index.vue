<template>
  <!-- 主体内容 -->
  <div class="fill-h" style="overflow: hidden; background-color: #F5F7FA;">
    <el-row :gutter="10" class="fill-h fn-flex mar-t-xs" v-resize>
      <el-col style="width: 225px;margin-right: 10px;background-color: #FFF;" v-loading="ploading">
        <el-form inline class="mar-l-xs mar-t-sm" style="overflow: hidden;">
          <el-form-item>
            <el-input
              v-model="queryForm.key"
              placeholder="请输入企业/站点名称"
              style="width: 210px;"
              clearable
              @keyup.enter.native="getPortList()"></el-input>
          </el-form-item>
          <el-form-item>
            <select-tree
              style="width: 130px"
              v-model="queryForm.regionCodeId"
              lazy
              joint
              rootKey="0"
              url="sys/area"
              placeholder="请选择区域"
              :props="{ label: 'areaName' }"
            ></select-tree>
          </el-form-item>
          <el-form-item style="margin-right: 0px;">
            <el-button type="primary" icon="fas fa-search" @click="getPortList">查 询</el-button>
          </el-form-item>
        </el-form>
        <hr />
        <div style="width: 100%; height: calc(100% - 90px); overflow: auto;">
          <tree-port-single
            v-model="itemModel.portId"
            filterable
            :options="select.portList"
            :highlightCurrent="true"
            :field="[
              { name: 'regionName', key: 'regionCodeId' },
              { name: 'psName', key: 'psId' },
              { name: 'portName', key: 'id' }
            ]">
          </tree-port-single>
        </div>
      </el-col>
      <el-col class="flex-1" style="background-color: #FFF;">

        <div class="title-info mar-y-xs mar-l-sm">输入本次充值信息</div>
        <div class="mar-y-xs mar-l-xs">
          <el-button
            :disabled="disabled"
            type="success"
            icon="fas fa-cart-plus"
            :loading="payloading"
            @click="onClickPayFactors">充 值
          </el-button>
        </div>

        <!-- 表格 -->
        <el-table
          border
          height="calc(50% - 63px)"
          v-loading="loading"
          :data="itemList"
        >
          <el-table-column label="因子" prop="factorName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="单位" prop="unit" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="核定量" prop="approvedEmissions" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="已充值" prop="depositEmissions" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="剩余量" prop="remainingEmissions" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="本次充值" prop="thisTimeDeposit" min-width="100" class-name="nopadding">
            <template slot-scope="{ row }">
              <div class="box">
                <input type="text" v-model="row.thisTimeDeposit" @change="onChangeValue(row, $event)">
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页内容 -->
        <!-- <paging-query :pager="pager" @query="getEditItemList"></paging-query> -->

        <hr class="mar-x-sm block">

        <div class="title-info mar-y-xs mar-l-sm">本年度已充值</div>
        <el-form inline class="mar-x-sm mar-t-xs">

          <el-form-item label="因子：">
            <el-select style="width: 180px;"
              v-loading="floading"
              v-model="dItemModel.factorList"
              :disabled="disabled"
              filterable
              multiple
              collapse-tags
            >
              <el-option
                v-for="(item, index) in select.factorList"
                :key="index"
                :label="item.factorName"
                :value="item.factorCode">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="充值方式：">
            <el-select style="width: 150px;"
              :disabled="disabled"
              v-model="dItemModel.depositType"
            >
              <el-option label="全部" :value="''"></el-option>
              <el-option
                v-for="(item, index) in $enum.get('RECHARGE_TYPE')"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button :disabled="disabled" type="primary" icon="fas fa-search" @click="onDetailQueryList">查 询</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table
          border
          height="calc(50% - 99px)"
          v-loading="dloading"
          :data="dItemList"
        >
          <el-table-column label="时间" prop="depositDate" min-width="154" show-overflow-tooltip></el-table-column>
          <el-table-column label="因子" prop="factorName" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="单位" prop="unit" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="核定量" prop="approvedEmissions" min-width="90" show-overflow-tooltip></el-table-column>
          <el-table-column label="充值量" prop="thisTimeDeposit" min-width="90" show-overflow-tooltip></el-table-column>
          <el-table-column label="已充值量" prop="paidEmissions" min-width="90" show-overflow-tooltip></el-table-column>
          <el-table-column label="剩余核定量" prop="surplusEmissions" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="充值方式" prop="depositTypeName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="充值状态" prop="depositStatusName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="96">
            <template slot-scope="{ row }">
              <template v-if="row.depositStatusName === '充值失败' && row.depositTypeName === '远程充值'">
                <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickPay(row, 3)">充 值</el-button>
              </template>
              <template v-else-if="row.depositStatusName === '充值中'">
                <el-dropdown split-button type="primary">更多
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-button type="primary" icon="fas fa-pencil-alt" title="修改充值状态为成功"
                        @click="onClickPay(row, row.depositTypeName === '远程充值' ? 1 : 4, '充值成功')">充值成功</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="warning" icon="fas fa-pencil-alt" title="修改充值状态为失败"
                        @click="onClickPay(row, row.depositTypeName === '远程充值' ? 2 : 5, '充值失败')">充值失败</el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-else-if="row.depositStatusName === '充值成功' || row.depositTypeName === 'IC卡充值'">
                <i class="fas fa-ban"></i>
              </template>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页内容 -->
        <paging-query :pager="dpager" @query="getDetailsItemList"></paging-query>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import _ from 'lodash';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import TreePortSingle from './components/tree-port-single';

export default {
  mixins: [queryList, deleteItem],
  components: {
    TreePortSingle,
  },
  data() {
    return {
      url: 'tpeci/iCCardDepositRecord/factorAndData',
      loading: false,               // 列表加载状态
      ploading: false,              // 站点名称
      floading: false,              // 因子名称
      dloading: false,              // 本年度已充值列表状态
      payloading: false,            // 充值
      isError: false,               // 列表input框样式
      isAuto: false,                // 告诉混合不要在created时调取查询接口
      queryForm: {
        key: '',           // 企业/站点名称
        regionCodeId: '',  // 行政区域
      },
      itemModel: {                  // 输入本次充值信息 | 查询条件
        portId: '',                 // 站点id
        factorList: [],             // 因子
        depositYear: '',            // 年份
      },
      dItemModel: {                 // 本年度已充值 | 查询条件
        portId: '',                 // 站点
        depositType: '',            // 1 网络充值 2 IC卡充值
        factorList: [],             // 因子
        depositYear: '',            // 年份
      },
      newItemModel: {               // 当前查询条件
      },
      select: {                     // 选中站点数据
        portList: [],
        factorList: [],
      },
      // pager: {                     // 输入本次充值信息 | 分页
      //   page: 1,
      //   rows: 15,
      //   count: 0,
      // },
      dpager: {                     // 本年度已充值 | 分页
        page: 1,
        rows: 15,
        count: 0,
      },
      itemList: [],                 // 因子充值列表
      dItemList: [],                // 因子已充值列表
    };
  },
  computed: {
    disabled() {
      return this.itemModel.portId === '';
    },
  },
  watch: {
    'itemModel.portId': {
      handler(val) {
        this.itemList = [];
        this.dItemList = [];
        // if (val === '') {
        //   this.dItemModel.portId = '';
        //   return;
        // }
        // this.pager.page = 1;
        // this.pager.rows = 15;
        this.dItemModel.portId = val;
        this.dItemModel.depositType = '';
        this.getFactorList(val);
      },
      deep: true,
    },
  },
  mounted() {
    this.itemModel.depositYear = new Date().getFullYear().toString();
    this.dItemModel.depositYear = new Date().getFullYear().toString();
    this.getPortList();
  },
  methods: {
    openDialog() {                  // 打开弹框
    },
    onDetailQueryList() {
      this.dpager.page = 1;
      this.dpager.rows = 15;
      this.getDetailsItemList();
    },

    /** 请求层 */
    getEditItemList() {                // 1. 方案已经配置的排口
      this.newItemModel = {};
      this.loading = true;
      this.$http.post(this.url, this.itemModel).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data.dtoDepositDateList || [];
          // this.pager.count = response.data.count;
          this.newItemModel = _.cloneDeep(this.itemModel);
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
    getDetailsItemList() {
      this.dloading = true;
      const { page, rows } = this.dpager;
      this.$http.post('tpeci/iCCardDepositRecord/findDepositInfo', this.dItemModel, {
        params: {
          page,
          rows,
          sort: 'createDate-',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.dItemList = response.data.data || [];
          this.dpager.count = response.data.count;
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
        this.dloading = false;
      });
    },
    getPortList() {                    // 2. 获取所有排口列表
      this.itemModel.portId = '';
      this.ploading = true;
      this.select.portList = [];
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 1000000,
          childPortType: 5,
          portType: 1,
          sort: 'psName+,portName',
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data || [];
          // if (this.select.portList[0]) {
          //   this.itemModel.portId = this.select.portList[0].id;
          // }
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
        this.ploading = false;
      });
    },
    getFactorList(id) {                  // 获取因子列表
      this.select.factorList = [];
      this.itemModel.factorList = [];
      this.dItemModel.factorList = [];
      if (!id && id !== 0) {
        return;
      }
      this.floading = true;
      this.$http.post(this.url, {
        portId: this.itemModel.portId,
        depositYear: this.itemModel.depositYear,
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.factorList = response.data.data.factorList || [];
          this.itemModel.factorList = this.select.factorList.map(v => v.factorCode);
          this.getEditItemList();
          this.getDetailsItemList();
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
        this.floading = false;
      });
    },
    onClickPayFactors() {              // 充值
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const depositList = this.itemList.filter(item => item.thisTimeDeposit
          && item.thisTimeDeposit !== '0').map(item => ({
          factorId: item.factorId,
          factorCode: item.factorCode,
          factorName: item.factorName,
          unit: item.unit,
          thisTimeDeposit: item.thisTimeDeposit,
        }));
        if (!depositList.length) {
          this.$message.warning({
            message: '请为需要充值的因子填入本次充值的数值，且值不可为0',
            showClose: true,
            duration: 3000,
          });
          return;
        }
        this.payloading = true;
        this.$http.post('tpeci/iCCardDepositRecord', {
          type: 1,
          portId: this.newItemModel.portId,
          depositYear: +(this.newItemModel.depositYear),
          depositList,
        }).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
            this.getEditItemList();
            this.getDetailsItemList();
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
          this.payloading = false;
        });
      });
    },
    onClickPay(row, n, v) {               // 充值
      let label = '';
      if (v === '充值成功') {
        label = '您确定要置状态为充值成功吗？这将会把本批次充值的所有因子的充值状态全部置为充值成功！';
      } else if (v === '充值失败') {
        label = '您确定要置状态为充值失败吗？这将会把本批次充值的所有因子的充值状态全部置为充值失败！';
      }
      this.$confirm(`${label} 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.dloading = true;
        this.$http.get('tpeci/iCCardDepositRecord/depositManage', {
          params: {
            id: row.id,    // 因为有ic卡充值和远程充值，后统一改为传主键id
            depositManage: n,
          },
        }).then((response) => {
          if (response.data.success) {
            this.getDetailsItemList();
          } else {
            this.dloading = false;
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          this.dloading = false;
          analyzeResp(response);
        });
      });
    },
    onChangeValue(row) {               // 值改变的时候
      this.isError = false;
      if (!/(^[0-9][0-9]*(.[0-9]+)?)$/.test(row.thisTimeDeposit)) {
        this.$message.warning({
          message: '请输入数字，且不能为负数',
          showClose: true,
          duration: 3000,
        });
        this.$set(row, 'thisTimeDeposit', 0);
        return;
      }
      if (row.thisTimeDeposit) {
        if (+row.thisTimeDeposit > +row.remainingEmissions) {
          this.$set(row, 'thisTimeDeposit', +row.remainingEmissions);
          this.$message.warning({
            message: '充值量不能大于剩余量',
            showClose: true,
            duration: 3000,
          });
        }
      }
    },

    /** 特殊方法 */
  },
};
</script>

<style lang="scss" scoped>
.box{
  width: 100%;
  height: 100%;
  position: relative;
  > input {
    box-sizing: border-box;
    width: calc(100% + 19px);
    height: 36px;
    position: absolute;
    top: 0px;
    left: -10px;
    border: 0;
    outline: none;
    background-color: #ffffff;
    &:hover{
      border: 1px solid #1B89CD;
    }
    &.errorInput {
      border: 1px solid rgb(205, 39, 27);
    }
  }
}
</style>
