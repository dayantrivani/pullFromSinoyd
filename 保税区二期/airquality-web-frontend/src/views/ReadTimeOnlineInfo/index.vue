<!-- 实时在线信息 -->
<template>
  <el-card>
    <el-form inline slot="header">
      <div class="flex-1 fn-no-wrap">
        <el-form-item label="测点：">
          <tree-select
            ref="treeselectport"
            :defaultExpandAll="true"
            v-model="queryForm.monitoringPointUid"
            :options="select.monitoringPointUidList"
            :props="{ value: 'id', label: 'name', children: 'children' }"
          ></tree-select>
        </el-form-item>
        <el-form-item label="测点因子：">
          <tree-select
            ref="treeselectfactor"
            v-model="queryForm.pollutantCode"
            :options="select.pollutantCodeList"
            :props="{ value: 'factorCode', label: 'name', children: 'children' }"
          ></tree-select>
        </el-form-item>
        <el-form-item label="联网状态：">
          <el-select v-cloak v-model="queryForm.isOnline">
            <el-option label="全部" :value="''"></el-option>
            <el-option
              v-for="item in select.lineList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-form inline class="mar-t-xs mar-x-sm fn-flex" v-loading="infoloading">
      <el-form-item class="flex-1 fn-no-wrap">
        <span class="text-warning mar-r-lg">在线率：{{ itemInfo.onlineRate || '' }} </span>
        <span class="text-info mar-r-lg">联网总数 {{ itemInfo.sum || '' }} 个 </span>
        <span class="text-success mar-r-lg"> <i class="fas fa-laptop"></i> 在线：{{ itemInfo.online }} 个 </span>
        <span class="text-danger mar-r-lg"> <i class="fas fa-laptop"></i> 离线：{{ itemInfo.offline }} 个 </span>
      </el-form-item>
      <!-- <el-form-item class="text-right">
        <span>未检测（{{ '--' }}）</span>&nbsp;<span>数据缺失（{{''}}/{{''}}）</span>
      </el-form-item> -->
    </el-form>

    <el-table
      border
      v-loading="loading"
      highlight-current-row
      height="calc(100% - 71px)"
      :data="itemList"
      @select="onChangeCheck">
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed property="monitoringPointName" label="测点" min-width="200"></el-table-column>
      <el-table-column fixed align="center" property="isOnline" label="联网状态" width="80" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <i class="fas fa-laptop" :style="{ color: row.isOnline ? 'green' : 'red' }"></i>
        </template>
      </el-table-column>
      <el-table-column fixed align property="isOnlineText" label="联网信息" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="tstamp" label="最新数据时间" width="155" show-overflow-tooltip></el-table-column>
      <el-table-column
        v-for="item in getFactorData(pollutantCodeCopy)"
        :key="item.factorCode"
        :property="item.factorCode"
        align="center"
        :min-width="getLabelLen(item.name, item.factorCode)"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.name }}</p>
          <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
          <span style="display: none">{{ row }}</span>
        </template>
        <template slot-scope="{ row }">
          <span :class="{ 'text-danger': isRed(row[item.factorCode]) }">
            {{ isOut(row[item.factorCode]) }}
          </span>
        </template>
        <!-- <template slot="header" slot-scope="scope">
          <span v-html="getFactorName(item, scope)"></span>
        </template> -->
      </el-table-column>
    </el-table>
    <paging-query :refresh-time="300" :pager="pager" @query="getItemList"/>
  </el-card>
</template>

<script>
import _ from 'lodash';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import TreeSelect from '@/components/select-tree';
import { tableTitleLen } from '@/global/libs/tools';

export default {
  name: 'ReadTimeOnlineInfo',
  mixins: [
    queryList,
  ],
  components: {
    TreeSelect,
  },
  data() {
    return {
      isAuto: false,
      infoloading: false,
      itemModel: {},
      select: {
        // 联网状态列表
        lineList: [
          { label: '在线', value: 1 },
          { label: '离线', value: 0 },
        ],
        pollutantCodeList: [],
        monitoringPointUidList: [],
      },
      // 记录此次查询的因子列code集合
      pollutantCodeCopy: [],
      queryForm: {
        pollutantCode: [],          // 测点因子
        monitoringPointUid: [],     // 测点
        isOnline: '',               // 联网状态
      },
      itemList: [],
      // 在线率、离线数、在线数、联网总数信息
      itemInfo: {},
    };
  },
  created() {
    this.$nextTick(() => {
      this.loading = true;
      Promise.all([this.getSelectList('userFactor', 'pollutantCodeList', true),
        this.getSelectList('userPort', 'monitoringPointUidList', false)])
        .then(() => { this.getItemList(); }).catch(() => {
          this.loading = false;
        });
    });
    // this.getItemInfoData();
  },
  methods: {
    getItemList() {
      this.getItemInfoData();
      const { page, rows } = this.pager;
      this.itemList = [];
      this.pollutantCodeCopy = _.cloneDeep(this.queryForm.pollutantCode);
      this.$http.post('airquality/portInfo/real', this.queryForm, {
        params: { page, rows, sort: 'monitoringPointUid' },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 查询条件选择框选项列表获取
    getSelectList(url, params, bool) {
      // userFactor 是因子, userPort 是排口
      return new Promise((resolve, reject) => {
        // if (bool) this.loading = true;
        this.$http.get(`airquality/${url}/getAuthorityTree`)
          .then((response) => {
            if (response.status === 200) {
              this.$set(this.select, params, response.data.data);
              if (bool) {
                (response.data.data || []).forEach((item) => {
                  if (item.name !== '气象参数') {
                    this.$refs.treeselectfactor.onClickNode(item || []);
                  }
                });
              } else {
                (response.data.data || []).forEach((item, index) => {
                  this.$refs.treeselectport.onClickNode(response.data.data[index] || []);
                });
              }
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
            }
            resolve();
          }, ({ response }) => {
            reject();
            analyzeResp(response);
          });
      });
    },
    // 在线率、离线数、在线数、联网总数信息
    getItemInfoData() {
      this.infoloading = true;
      this.$http.get('airquality/portInfo/home')
        .then((response) => {
          if (response.status === 200) {
            this.itemInfo = response.data.data || {};
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
          this.infoloading = false;
        });
    },
    // 因子名称
    // getFactorName(code) {
    //   const factorArr = [];
    //   this.select.pollutantCodeList.forEach((item) => {
    //     if (item.children && ((typeof item.children) === 'object')) {
    //       factorArr.push(...item.children);
    //     }
    //   });
    //   const onOff = factorArr.filter(item => item.factorCode === code)[0];
    //   return onOff ? `${onOff.name}<br/>${onOff.unit ? `(${onOff.unit})` : ''}` : '';
    // },
    // 获取因子列表
    getFactorData(codeArr) {
      const factorArr = [];
      this.select.pollutantCodeList.forEach((item) => {
        if (item.children && ((typeof item.children) === 'object')) {
          factorArr.push(...item.children);
        }
      });
      return factorArr.filter(item => codeArr.includes(item.factorCode));
    },

    /** 特殊方法 */
    isRed(val) {                   // 因子是否显示为红色
      return typeof val === 'string' ? val.includes('red') : false;
    },
    isOut(val) {                   // 因子显示的值
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    getLabelLen(label, unit) {   // 计算动态列宽度
      const labelLen = tableTitleLen(label);
      const unitLen = tableTitleLen(unit ? `(${unit})` : '');
      return labelLen >= unitLen ? labelLen : unitLen;
    },
  },
};
</script>
