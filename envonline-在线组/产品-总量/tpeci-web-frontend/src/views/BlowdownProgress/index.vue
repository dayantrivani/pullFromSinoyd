<!-- 排污进度 -->
<template>
  <el-card>
    <el-form inline class="mar-t-xs mar-x-sm fn-flex">
      <div class="flex-1 fn-no-wrap">

        <el-form-item label="关注：">
          <el-switch
            v-model="attention"
            active-color="#13ce66"
            inactive-color="#409eff"
            active-text="浓度"
            inactive-text="所有"/>
        </el-form-item>

        <el-form-item label="阀门状态：">
          <el-select style="width: 110px" v-model="queryForm.valveStatus">
            <el-option :value="-1" label="全部"></el-option>
            <el-option :value="1" label="开启"></el-option>
            <el-option :value="0" label="关闭"></el-option>
            <el-option :value="5" label="阀门故障"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关键字：">
          <el-input
            style="width: 160px;"
            v-model="queryForm.key"
            placeholder="企业名称、站点名称"
            @keyup.enter.native="onQueryList()"
            clearable>
          </el-input>
        </el-form-item>
        <br/>
        <el-form-item label="站点：">
          <select-port
            v-model="queryForm.portIds"
            filterable
            :options="portList"
            :field="[
              { name: 'psName', key: 'psId' },
              { name: 'portName', key: 'id' }
            ]">
          </select-port>
          <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="selectPort">站 点</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>

      </div>

      <el-form-item class="text-right fn-no-wrap">
        <el-radio-group v-model="queryForm.onlineStatus">
          <el-radio :label="-1" class="text-warning">总数：{{ onlineCount.totalCount }}</el-radio>
          <el-radio :label="0" class="text-success">在线：{{ onlineCount.onlineCount }}</el-radio>
          <el-radio :label="1" class="text-info">离线：{{ onlineCount.offlineCount }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-table
      border
      highlight-current-row
      class="border-cell"
      height="calc(100% - 64px)"
      v-loading="loading"
      :data="itemList"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }" slot="header">
          <p>区域</p>
          <p>行业类别</p>
          <span style="display: none">{{ row }}</span>
        </template>
        <template slot-scope="{ row }">
          <span title="区域">
            {{ row.regionName }}
          </span>
          <span title="行业类别">
            {{ row.industryTypeName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed property="psName" label="企业名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column fixed property="portName" label="站点名称" min-width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span
            style="color: #409EFF;cursor: pointer;"
            type="text"
            @click="onClickLink(row)"
          >
            <!-- v-if="userType === 'gov'" -->
            {{ row.portName }}
          </span>
          <!-- <span v-else>{{ row.portName }}</span> -->
        </template>
      </el-table-column>
      <el-table-column fixed min-width="140" show-overflow-tooltip>
        <template slot-scope="{ row }" slot="header">
          <p>在线状态 数据状态</p>
          <p>泵状态 阀门状态</p>
          <span style="display: none">{{ row }}</span>
        </template>
        <template slot-scope="{ row }">
          <span :title="`在线状态：${row.onlineStatus}`" class="icon-box">
            <span :style="{
              backgroundImage: `url(${row.onlineStatus === '在线' ? icons.onlineStatus : icons.onlineStatus1})`,
            }"></span>
          </span>
          <span :title="`数据状态：${row.isOverProof ? '超标' : '正常'}`" class="icon-box">
            <span :style="{
              backgroundImage: `url(${row.isOverProof ? icons.overProofStatus1 : icons.overProofStatus})`,
            }"></span>
          </span>
          <span v-show="row.pumpOpenStatus !== null" :title="`泵状态：${row.pumpOpenStatus || '关'}`" class="icon-box">
            <span :style="{
              backgroundImage: `url(${row.pumpOpenStatus === '开' ? icons.pumpOpenStatus : icons.pumpOpenStatus1})`,
            }"></span>
          </span>
          <span v-show="row.valveOpenStatus !== null" :title="`阀门状态：${row.valveOpenStatus || '关'}`" class="icon-box">
            <span :style="{
              backgroundImage:
                `url(${row.valveOpenStatus === '开'
                  ? icons.valveOpenStatus : row.valveOpenStatus === '阀门故障'
                  ? icons.valveOpenStatus2 : icons.valveOpenStatus1})`,
            }"></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed property="valveControlStatus" label="控制状态" width="80">
        <template slot-scope="{ row }">
          {{ row.valveControlStatus }}
        </template>
      </el-table-column>
      <el-table-column fixed property="valveControlTime" label="实时状态时间" width="160"></el-table-column>
      <template v-for="(item, index) in factorColumns">
        <el-table-column
          :key="index"
          v-if="item.isActive || !attention"
          show-overflow-tooltip
          class="fixed2-header-height"
          align="center"
          :min-width="getLabelWidth(item.label, item.unit, item.subtitle)">
          <template slot-scope="{ row }" slot="header">
            <p style="line-height: 20px">{{ `${item.label}` }}</p>
            <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
            <p v-show="item.subtitle">{{item.subtitle}}</p>
            <span style="display: none">{{ row }}</span>
          </template>
          <template slot-scope="{ row }">
            <template v-if="item.isProgress">
              <el-tooltip
                effect="dark"
                :disabled="row[item.value[0]]
                  / (row[item.value[0]] - 0 + (row[item.value[1]] - 0)) ? false : true"
                :content="`${row[item.value[0]]}/${(row[item.value[0]] - 0)
                  + (row[item.value[1]] - 0)}`"
                placement="top-start"
              >
                <div class="progress-box">
                  <div class="progress" :class="row[item.value[0]] / (row[item.value[0]] - 0 + (+row[item.value[1]]))
                    ?
                    (row[item.value[0]] / (row[item.value[0]] - 0 + (row[item.value[1]] - 0))) * 100 >= 0
                    ?
                    (row[item.value[0]] / (row[item.value[0]] - 0 + (row[item.value[1]] - 0))) * 100 >= 80
                    ?
                    (row[item.value[0]] / (row[item.value[0]] - 0 + (row[item.value[1]] - 0))) * 100 >= 100
                    ?
                    'bg-danger'
                    :
                    'bg-warning'
                    :
                    'bg-success'
                    :
                    ''
                    : ''">
                    <div
                      class="shadow"
                      :style="{
                        width: row[item.value[0]]
                        / (row[item.value[0]] - 0 + (row[item.value[1]] - 0))
                        ? `${(1 - row[item.value[0]]
                        / (row[item.value[0]] - 0 + (row[item.value[1]] - 0))) * 100}%` : '100%',
                      }"
                    >
                    </div>
                  </div>
                </div>
              </el-tooltip>
            </template>
            <template v-else>
              <span :class="{ 'text-danger': isRed(row[item.value]) }">
                {{ isOut(row[item.value]) }}
              </span>
              <span v-show="row[item.value]">
                <span :title="item.subtitle" v-if="row[item.standard]">/{{row[item.standard]}}</span>
                <span v-else-if="item.standard">/-</span>
              </span>
            </template>
          </template>
        </el-table-column>
      </template>
      <el-table-column property="tstamp" label="浓度数据时间" width="160">
        <template slot-scope="{ row }">
          {{ row.tstamp }}
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" :refreshTime="300" @query="getItemList(true)"/>
    <Transfer-port ref="port" @getQueryData="getQueryData"></Transfer-port>
  </el-card>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { tableTitleLen } from '@/libs/tools';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';
// 状态图片引入
import onlineStatus from '../../assets/img_status/onlineStatus.png';
import onlineStatus1 from '../../assets/img_status/onlineStatus1.png';
import overProofStatus from '../../assets/img_status/overProofStatus.png';
import overProofStatus1 from '../../assets/img_status/overProofStatus1.png';
import pumpOpenStatus from '../../assets/img_status/pumpOpenStatus.png';
import pumpOpenStatus1 from '../../assets/img_status/pumpOpenStatus1.png';
import valveOpenStatus from '../../assets/img_status/valveOpenStatus.png';
import valveOpenStatus1 from '../../assets/img_status/valveOpenStatus1.png';
import valveOpenStatus2 from '../../assets/img_status/valveOpenStatus2.png';

export default {
  name: 'BlowdownProgress',
  mixins: [queryList],
  components: { SelectPort, TransferPort },
  data() {
    return {
      url: 'tpeci/realtime/progress',
      isAuto: false,
      attention: false,
      colFactor: [],            // 动态列字段
      icons: {
        onlineStatus,
        onlineStatus1,
        overProofStatus,
        overProofStatus1,
        pumpOpenStatus,
        pumpOpenStatus1,
        valveOpenStatus,
        valveOpenStatus1,
        valveOpenStatus2,
      },
      queryForm: {
        key: '',
        isAll: true,
        portIds: [],
        valveStatus: -1,
        onlineStatus: -1,
        factorList: [],
      },
      itemList: [],
      onlineCount: {},          // 总数、离线、在线
      factorList: [],           // 因子列表
      factorColumns: [],
      portList: [], // 站点数据组
    };
  },
  watch: {
    'queryForm.onlineStatus': {         // 在线（1）、离线（2）、总数（''）
      handler() {
        this.getItemList(true);
      },
      deep: true,
    },
    queryForm: {
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this.queryForm, 'isAll', false);
        } else {
          this.$set(this.queryForm, 'isAll', true);
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    this.getFactorList();
    this.getPortList();
  },
  methods: {
    ...mapMutations(['SetPortInfo']),

    // 站点选择事件
    onChangeCheck(val) { // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    getQueryData(portIds) {
      this.queryForm.portIds = portIds || [];
      this.queryForm.isAll = portIds.length === 0;
      this.onQueryList();
    },
    // 站点选择
    selectPort() {
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    onClickLink(row) {             // 点击进入单点详情
      this.SetPortInfo(row);
      this.$router.push({ name: 'BlowdownProgressInfo' });
    },

    /** 请求层 */
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          portType: 1,
          childPortType: 5,
          sort: 'psName+,portName',
          status: 1,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList(notCount) {        // 获取记录列表
      /** 需要注意的事项：
       * itemList        调用该接口前需先清空列表数据防止colFactor变动导致列报错
       * selectedIndexs  触发查询时取消勾选高亮
       */
      // this.queryForm.psId = this.orgGuid;
      this.loading = true;
      this.selectedIndexs = [];
      const { page, rows } = this.pager;
      this.$http.post(this.url, { ...this.queryForm }, {
        params: {
          page,
          rows,
          sort: 'regionName+,psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data.onlineList;
          /* 点击在线、离线时,返回数据的onlineList变的不符合要求 */
          if (!notCount) this.onlineCount = response.data.data.onlineCount;
          // DPQ  YPQ YUQ  Rtd
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
    getFactorList() {              // 获取因子列表
      return new Promise((resolve) => {
        this.$http.get('cfg/pageShowItem', {
          params: {
            pageShowMainCode: 'TPECI_PollutantDischargeProgress',
            isEnabled: true,
            page: 1,
            rows: 100000,
            sort: 'orderNum-',
          },
        }).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.queryForm.factorList = response.data.data.map(n => ({
              factorShowCode: n.factorShowCode,
              factorShowName: n.factorShowName,
              factorName: n.factorName,
              factorCode: n.factorCode,
              unit: n.unit,
              unitCou: n.unitCou,
              valueType: n.valueType,
            }));
            const factorColumns = this.queryForm.factorList.filter(n => n.valueType === 'Cou').map(n => ({
              label: `${n.factorName}日排放量`,
              value: `${n.factorCode}-DPQ`,
              unit: n.unitCou,
              isActive: false,
            }));
            factorColumns.push(...this.queryForm.factorList.filter(n => n.valueType === 'Cou').map(n => ({
              label: n.factorName,
              isProgress: true,
              value: [`${n.factorCode}-YPQ`, `${n.factorCode}-YUQ`],
              isActive: false,
              subtitle: '年排污进度',
            })));
            factorColumns.push(...this.queryForm.factorList.filter(n => n.valueType === 'Avg').map(n => ({
              label: n.factorName,
              value: `${n.factorCode}-Avg`,
              unit: n.unit,
              isActive: true,
              subtitle: '平均浓度（标准值）',
              standard: `${n.factorCode}-Standard`,
            })));
            this.factorColumns = factorColumns;
            this.onQueryList();
            resolve();
          }
        });
      });
    },

    /** 特殊方法 */
    isRed(val) {                   // 因子是否显示为红色
      return typeof val === 'string' ? val.includes('red') : false;
    },
    isOut(val) {                   // 因子显示的值
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    getLabelWidth(label, unit, subtitle) {   // 计算动态列宽度
      // const labelLen = tableTitleLen(label);
      // const unitLen = tableTitleLen(unit ? `(${unit})` : '');
      // const subtitleLen = tableTitleLen(subtitle || '');
      const strArr = [tableTitleLen(label), tableTitleLen(unit ? `(${unit})` : ''), tableTitleLen(subtitle || '')];
      // return labelLen >= unitLen ? labelLen : unitLen;
      strArr.sort((m, n) => n - m);
      return strArr[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-box {
  height: 100%;
  position: relative;
  .progress {
    position: absolute;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    overflow: hidden;
    transform: translateY(50%);
    width: 100%;
    margin-top: 2px;
    height: 16px;
    // background-image: linear-gradient(to right, #0fd850 0%, #f9f047 50%, #ff5d6c 100%);
    .shadow {
      float: right;
      height: 100%;
      background-color: #f9f9f9;
    }
  }
}
.icon-box {
  >span {
    display: inline-block;
    width: 25%;
    height: 16px;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
