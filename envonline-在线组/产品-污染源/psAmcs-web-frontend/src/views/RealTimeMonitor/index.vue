<!-- 实时监测 -->
<template>
  <el-card>
    <template slot="header">
      <el-radio-group v-model="tabModel">
        <el-radio-button
          v-for="item in monitorList"
          :key="item.rowGuid"
          :label="+(item.dictValue)">{{item.dictName}}
        </el-radio-button>
      </el-radio-group>
    </template>

    <el-form inline class="mar-t-xs mar-x-sm fn-flex">
      <div class="flex-1 fn-no-wrap">

        <el-form-item label="监管级别：">
          <el-select style="width: 90px" v-model="queryForm.keyPollutant">
            <el-option :value="-1" label="全部"></el-option>
            <el-option
              v-for="item in $enum.get('KEY_POLLUTANT')"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="因子：">
          <el-select
            style="width:180px;"
            v-model="queryForm.factorCodes"
            multiple
            collapse-tags
          >
            <el-option-group
              v-for="group in factorGroup"
              :key="group.name"
              :label="group.name">
              <el-option
                v-for="(item, key) in group.children"
                :key="key"
                :label="item.factorShowName"
                :value="item.factorShowCode">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="关键字：">
          <el-input
            style="width: 180px;"
            v-model="queryForm.key"
            placeholder="企业名称、站点名称"
            @keyup.enter.native="onQueryList()"
            clearable>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
        </el-form-item>

      </div>

      <el-form-item class="text-right fn-no-wrap">
        <el-radio-group v-model="queryForm.online">
          <el-radio :label="-1" class="text-warning">总数：{{ onlineCount.totalCount }}</el-radio>
          <el-radio :label="1" class="text-success">在线：{{ onlineCount.onlineCount }}</el-radio>
          <el-radio :label="2" class="text-info">离线：{{ onlineCount.offlineCount }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-table
      border
      highlight-current-row
      class="border-cell"
      height="calc(100% - 71px)"
      v-loading="loading"
      :data="itemList"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed property="regionName" label="区域" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column fixed property="keyPollutant" label="监管级别" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ $enum.getLabel('KEY_POLLUTANT', +(row.keyPollutant)) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed property="psName" label="污染源名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column fixed property="portName" label="站点名称" min-width="160" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-button type="text" @click="onClickLink(row)">{{ row.portName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed property="tstamp" label="数据时间" width="160">
        <template slot-scope="{ row }">
          {{ row.tstamp }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" class-name="col-status" property="isOnline" width="50" label="状态">
        <template slot-scope="{ row }">
          <div :class="`${row.isOnline ? '' : 'no-'}online`"></div>
        </template>
      </el-table-column>
      <template v-for="(item) in colFactor">
        <el-table-column
          :key="item.id"
          show-overflow-tooltip
          class="fixed2-header-height"
          align="center"
          :min-width="getLabelWidth(item.factorShowName, item.unit)">
          <template slot-scope="{ row }" slot="header">
            <p style="line-height: 20px">{{ item.factorShowName }}</p>
            <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
            <span style="display: none">{{ row }}</span>
          </template>
          <template slot-scope="{ row }">
            <p :class="{ 'text-danger': isRed(row[item.factorShowCode]) }">
              {{ isOut(row[item.factorShowCode]) }}
            </p>
            <p v-if="row[`${item.factorCode}-Standard`] !== '' && isRed(row[item.factorShowCode])">
              {{ row[`${item.factorCode}-Standard`] }}
            </p>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <paging-query ref="pageQuery" :refresh-time="300" :pager="pager" @query="getItemList()"/>
  </el-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { tableTitleLen, toFactorTree } from '@/libs/tools';

export default {
  name: 'RealTimeMonitor',
  mixins: [queryList],
  data() {
    return {
      tabModel: 1,             // 排口子类型值（废水：1：废水，2：污水厂，3：重金属 4：留样排口）（烟气：1：烟气，2：焚烧，3：VOC）
      downloading: false,       // 下载按钮状态
      url: 'amcs/realtime',
      isAuto: false,
      colFactor: [],            // 动态列字段
      monitorList: [],          // 废水/废气 子类型列表
      queryForm: {
        online: -1,             // 在线状态（1：在线，2：离线 -1:总数）
        portType: 1,            // 点位类型（1：废水，2：废气，3，固废，4：噪声）
        keyPollutant: -1,       // 重点污染源（-1：所有, 1：重点污染源，2：非重点污染源）
        childPortType: 1,      // 排口子类型值（废水：1：废水，2：污水厂，3：重金属 4：留样排口）（烟气：1：烟气，2：焚烧，3：VOC）
        isAll: true,            // 默认选全部站点
        key: '',                // 关键字
        factorCodes: [],        // 因子值类型（实时值）
        sort: 'regionName+,psName+,portName+',
      },
      itemList: [],
      onlineCount: {},          // 总数、离线、在线
      portList: [],             // 站点列表
      factorList: [],           // 因子列表
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,    // 1 废水 2 废气
    }),
    tabCodeModel() {                             // 被选中子类型的 dictCode Water01、Water02
      /** 注意计算数据根据 this.moitorList 变化
       */
      const item = this.monitorList.find(v => +(v.dictValue) === this.tabModel);
      return item ? item.dictCode : '';
    },
    factorGroup() {                              // 因子列表数据分组
      return toFactorTree(this.factorList);
    },
  },
  watch: {
    'queryForm.online': {         // 在线（1）、离线（2）、总数（''）
      handler() {
        this.getItemList();
      },
      deep: true,
    },
    tabModel(val) {               // 选中的子类型改变触发
      this.queryForm.childPortType = val;
    },
    tabCodeModel: {              // 子类型数据的 dictCode 变化（因子传参会用到）
      handler() {
        /** 先清空因子数据、列表数据
         *  1. 重新调取该子项下的因子
         *  2. 重置online字段,选取总数 -1 总数、1在线、2 离线
         *  3. 调查询接口
         */
        this.factorList = [];
        this.itemList = [];
        this.getFactorList().then(() => {
          this.queryForm.online = -1;
          this.getItemList();
        });
      },
    },
  },
  created() {
    this.getMonitorList();
  },
  methods: {
    ...mapMutations(['SetPortInfo']),

    onQueryList() {
      this.$refs.pageQuery.onResetCountDown();
    },

    onClickLink(row) {             // 点击进入单点详情
      this.SetPortInfo({
        ...row,
        childPortType: this.tabModel,
        childPortTypeName: this.monitorList.filter(n => +n.dictValue === this.tabModel)[0].dictName,
      });
      this.$router.push({ name: 'RealTimeMonitorDetails' });
    },

    /** 请求层 */
    getItemList() {        // 获取记录列表
      /** 需要注意的事项：
       * itemList        调用该接口前需先清空列表数据防止colFactor变动导致列报错
       * selectedIndexs  触发查询时取消勾选高亮
       */
      this.loading = true;
      this.selectedIndexs = [];
      const { page, rows } = this.pager;
      this.queryForm.portType = +(this.amcsType); // 1：废水，2：废气，3，固废，4：噪声
      this.queryForm.childPortType = this.tabModel;
      this.$http.post(this.url, this.queryForm, {
        params: { page, rows },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.colFactor = this.factorList.filter(v => this.queryForm.factorCodes.includes(v.factorShowCode));
          this.colFactor.sort((n, m) => { // 排序数组，相同因子放在相邻列
            let temp = n.orderNum - m.orderNum; // 根据排序号orderNum排序
            if (n.factorCode === m.factorCode) {
              temp = 0;
            }
            return temp;
          });
          this.itemList = response.data.data.onlineList;
          /* 点击在线、离线时,返回数据的onlineList变的不符合要求 */
          this.onlineCount = response.data.data.onlineCount;
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
    getMonitorList() {             // 获取顶部子类型列表
      return new Promise((resolve) => {
        const url = `sys/enumCode/child/PortType/${this.$enum.getLabel('LABEL_CODE', this.amcsType)}`;
        this.$http.get(url).then((response) => {
          if (response.status === 200) {
            /* 处理数据
             * 1. 如果是废水,需要将留样过滤掉
            */
            this.monitorList = response.data;
            if (this.amcsType === 1) {
              // this.monitorList = response.data.filter(v => v.dictName !== '留样');
              this.monitorList = response.data
                .filter(v => this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType).includes(+v.dictValue));
            }
            resolve();
          }
        });
      });
    },
    getFactorList() {              // 获取因子列表
      return new Promise((resolve) => {
        this.$http.get('cfg/pageShowItem', {
          params: {
            pageShowMainCode: `realFor${this.tabCodeModel}`,
            isEnabled: true,
            page: 1,
            rows: 100000,
            sort: 'orderNum-',
          },
        }).then((response) => {
          if (response.status === 200 && response.data.success) {
            /** factorList            记录接口返回数据中的实时数据
             *  queryForm.factorCodes 在数据获取到时将字段isShow为true的数据factorShowCode字段集合赋值给查询条件
             *  colFactor             通过查询条件中的factorShowCode找到在factorList中的对应的数据,显示在列表上
             */
            this.factorList = response.data.data.filter(v => v.valueType.includes('Rtd'));
            this.queryForm.factorCodes = this.factorList.filter(v => v.isShow).map(v => v.factorShowCode);
            this.colFactor = this.factorList.filter(v => this.queryForm.factorCodes.includes(v.factorShowCode));
            resolve();
          }
        });
      });
    },
    onDownload() {                 // 导出按钮
      this.downloading = true;
      this.queryForm.portType = +(this.amcsType); // 1：废水，2：废气，3，固废，4：噪声
      this.queryForm.childPortType = this.tabModel;
      const { queryForm } = this;
      const factorList = this.factorList.filter(v => this.queryForm.factorCodes.includes(v.factorShowCode))
        .map(item => ({
          factorShowCode: item.factorShowCode,
          factorShowName: item.factorShowName,
          unit: item.unit,
        }));
      const params = {
        factorList,
        portType: queryForm.portType,
        childPortType: queryForm.childPortType,
        keyPollutant: queryForm.keyPollutant,
        online: queryForm.online,
        isAll: queryForm.isAll,
        key: queryForm.key,
      };
      this.$http.post(`${this.url}/export`, params, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}实时监测${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },

    /** 特殊方法 */
    isRed(val) {                   // 因子是否显示为红色
      return typeof val === 'string' ? val.includes('red') : false;
    },
    isOut(val) {                   // 因子显示的值
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    getLabelWidth(label, unit) {   // 计算动态列宽度
      const labelLen = tableTitleLen(label);
      const unitLen = tableTitleLen(unit ? `(${unit})` : '');
      return labelLen >= unitLen ? labelLen : unitLen;
    },
  },
};
</script>

<style lang="scss" scoped>
  .col-status {
    > .cell {
      line-height: 20px !important;
    }
    .online, .no-online {
      position: relative;
      top: 4px;
      display: inline-block;
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-size: 20px;
      background-position: center center;
    }
    .online {
      background-image: url('~@/assets/img/online.svg');
    }
    .no-online {
      background-image: url('~@/assets/img/offline.svg');
    }
  }
</style>
