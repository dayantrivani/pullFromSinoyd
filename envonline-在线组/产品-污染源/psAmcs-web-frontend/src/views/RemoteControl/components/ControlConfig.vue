<template>
  <el-row :gutter="$config.space" class="fill-h" v-loading="loading">
    <el-col :span="24" :h="6">
      <el-card type="title">
        <!-- 头部标题 -->
        <template slot="header">控制命令</template>
        <el-form
          inline
          :model="queryForm"
          v-if="portInfo.portId === ''"
          class="mar-t-xs mar-l-sm">
          <el-form-item label="控制点位：">
            <select-port
              width="180px"
              v-model="portIds"
              filterable
              :options="portList"
              :field="[
                { name: 'psName', key: 'psId' },
                { name: 'portName', key: 'id' }
              ]">
            </select-port>
          </el-form-item>
        </el-form>
        <el-tabs v-model="active" type="border-card" @tab-click="onTabClick">
          <el-tab-pane label="数据命令" name="data">
            <el-radio-group v-model="queryForm.cmdName" class="mar-l-sm mar-t-sm">
              <el-row>
                <!-- 协议为 05 或 17 -->
                <el-col
                  :span="24"
                  class="mar-b-sm"
                  v-for="(item, index) in $enum.get('REMOTE_PROYOCOL', active).common"
                  :key="index"
                >
                  <el-radio :label="index">{{item}}</el-radio>
                </el-col>
                <!-- 选择点位后协议存在即根据点位协议遍历 -->
                <div v-if="queryForm.protocol !== ''">
                  <el-col
                    :span="24"
                    class="mar-b-sm"
                    v-for="(item, index) in $enum.get('REMOTE_PROYOCOL', active)[queryForm.protocol]"
                    :key="index"
                  >
                    <el-radio :label="index">{{item}}</el-radio>
                  </el-col>
                </div>
              </el-row>
            </el-radio-group>
          </el-tab-pane>
          <el-tab-pane label="参数命令" name="argument">
            <el-radio-group v-model="queryForm.cmdName" class="mar-l-sm mar-t-sm">
              <el-row>
                <!-- 协议为 05 或 17 -->
                <el-col
                  :span="24"
                  class="mar-b-sm"
                  v-for="(item, index) in $enum.get('REMOTE_PROYOCOL', active).common"
                  :key="index"
                >
                  <el-radio :label="index">{{item}}</el-radio>
                </el-col>
                <!-- 选择点位后协议存在即根据点位协议遍历 -->
                <div v-if="queryForm.protocol !== ''">
                  <el-col
                    :span="24"
                    class="mar-b-sm"
                    v-for="(item, index) in $enum.get('REMOTE_PROYOCOL', active)[queryForm.protocol]"
                    :key="index"
                  >
                    <el-radio :label="index">{{item}}</el-radio>
                  </el-col>
                </div>
              </el-row>
            </el-radio-group>
          </el-tab-pane>
          <el-tab-pane label="控制命令" name="control">
            <el-radio-group v-model="queryForm.cmdName" class="mar-l-sm mar-t-sm">
              <el-row>
                <!-- 协议为 05 或 17 -->
                <el-col
                  :span="24"
                  class="mar-b-sm"
                  v-for="(item, index) in $enum.get('REMOTE_PROYOCOL', active).common"
                  :key="index"
                >
                  <el-radio :label="index">{{item}}</el-radio>
                </el-col>
                <!-- 选择点位后协议存在即根据点位协议遍历 -->
                <div v-if="queryForm.protocol !== ''">
                  <el-col
                    :span="24"
                    class="mar-b-sm"
                    v-for="(item, index) in $enum.get('REMOTE_PROYOCOL', active)[queryForm.protocol]"
                    :key="index"
                  >
                    <el-radio :label="index">{{item}}</el-radio>
                  </el-col>
                </div>
              </el-row>
            </el-radio-group>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
    <el-col :span="24" :h="6" class="mar-t-xs">
      <el-card type="title">
        <!-- 头部标题 -->
        <template slot="header">命令设置</template>
        <div class="mar-t-xs mar-l-sm">
          <el-button type="success" icon="fas fa-clipboard-check" @click="onSendOder">发送命令</el-button>
        </div>
        <div v-show="queryForm.cmdName === '2011'" class="mar-t-sm mar-l-sm">
          <div>取污染物实时数据</div>
          <div class="mar-t-xs">获取当前选择仪器最新数据</div>
        </div>
        <div v-show="queryForm.cmdName === '2012'" class="mar-t-sm mar-l-sm">
          <div>停止查看实时数据</div>
          <div class="mar-t-xs">停止获取污染物实时数据操作</div>
        </div>
        <div v-if="queryForm.cmdName === '2051'" class="mar-t-sm mar-l-sm">
          <div>取污染物分钟数据</div>
          <div class="mar-t-xs">提取时间段内污染物历史分钟数据</div>
          <el-form class="mar-t-xs">
            <el-form-item label="起止时间：">
              <el-date-picker
                style="width:330px"
                v-model="dateRange"
                clearable
                format="yyyy-MM-dd HH:mm"
                value-format="yyyyMMddHHmm"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="minute.pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '2061'" class="mar-t-sm mar-l-sm">
          <div>取污染物小时数据</div>
          <div class="mar-t-xs">提取时间段内污染物历史小时数据</div>
          <el-form class="mar-t-xs">
            <el-form-item label="起止时间：">
              <el-date-picker
                style="width:330px"
                v-model="dateRange"
                clearable
                format="yyyy-MM-dd HH"
                value-format="yyyyMMddHH"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="hour.pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '2031'" class="mar-t-sm mar-l-sm">
          <div>取污染物日数据</div>
          <div class="mar-t-xs">提取时间段内污染物历史日数据</div>
          <el-form class="mar-t-xs">
            <el-form-item label="起止时间：">
              <el-date-picker
                style="width:330px"
                v-model="dateRange"
                clearable
                format="yyyy-MM-dd"
                value-format="yyyyMMdd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="date.pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '2021'" class="mar-t-sm mar-l-sm">
          <div>取设备运行状态</div>
          <div class="mar-t-xs">获取设备运行状态数据</div>
        </div>
        <div v-show="queryForm.cmdName === '2022'" class="mar-t-sm mar-l-sm">
          <div>停止查看设备运行状态</div>
          <div class="mar-t-xs">停止查看设备运行状态数据</div>
        </div>
        <div v-show="queryForm.cmdName === '2041'" class="mar-t-sm mar-l-sm">
          <div>取设备运行时间日历史数据</div>
          <div class="mar-t-xs">提取时间段内污染物历史日数据</div>
          <el-form class="mar-t-xs">
            <el-form-item label="起止时间：">
              <el-date-picker
                style="width:330px"
                v-model="dateRange"
                clearable
                format="yyyy-MM-dd"
                value-format="yyyyMMdd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="date.pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '1000'" class="mar-t-xs mar-l-sm">
          <el-form class="mar-t-sm item-space">
            <el-form-item label="超时时间：">
              <el-input-number
                v-model="cmdParas[1000].OverTime"
                controls-position="right"
                :min="0"
                :max="2147483647"
                style="width:120px">
              </el-input-number>
            </el-form-item>
            <el-form-item label="重发次数：">
              <el-input-number
                v-model="cmdParas[1000].ReCount"
                controls-position="right"
                :min="0"
                style="width:120px">
              </el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '1011'" class="mar-t-xs mar-l-sm">
          <el-form class="mar-t-sm item-space">
            <el-form-item label="因子选择：">
              <el-select
                style="width:180px;"
                v-model="cmdParas[1011].PolId"
                filterable
              >
                <el-option
                  v-for="(item, index) in factorsList"
                  :key="index"
                  :label="item.factorName"
                  :value="item.factorCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '1012'" class="mar-t-xs mar-l-sm">
          <el-form class="mar-t-sm item-space">
            <el-form-item label="因子选择：">
              <el-select
                style="width:180px;"
                v-model="cmdParas[1012].PolId"
                filterable
              >
                <el-option
                  v-for="(item, index) in factorsList"
                  :key="index"
                  :label="item.factorName"
                  :value="item.factorCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '1061'" class="mar-t-sm mar-l-sm">
          <div>提取实时数据间隔</div>
          <div class="mar-t-xs">获取当前选择仪器最新数据间隔</div>
        </div>
        <div v-show="queryForm.cmdName === '1062'" class="mar-t-sm mar-l-sm">
          <div>设置实时数据间隔</div>
          <el-form class="mar-t-sm item-space">
            <el-form-item label="实时数据间隔：">
              <el-input-number
                v-model="cmdParas[1062].RtdInterval"
                controls-position="right"
                :min="0"
                :max="2147483647"
                style="width:120px">
              </el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '1072'" class="mar-t-sm mar-l-sm">
          <div>设置现场机访问密码</div>
          <el-form class="mar-t-sm item-space">
            <el-form-item label="访问密码：">
              <el-input v-model="cmdParas[1072].NewPW" show-password style="width:200px"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '1063'" class="mar-t-sm mar-l-sm">
          <div>提取分钟数据间隔</div>
          <div class="mar-t-xs">获取当前选择仪器分钟数据间隔</div>
        </div>
        <div v-show="queryForm.cmdName === '1064'" class="mar-t-sm mar-l-sm">
          <div>设置分钟数据间隔</div>
          <el-form class="mar-t-sm item-space">
            <el-form-item label="分钟数据间隔：">
              <el-input-number
                v-model="cmdParas[1064].RtdInterval"
                controls-position="right"
                :min="0"
                :max="2147483647"
                style="width:120px">
              </el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '3012'" class="mar-t-xs mar-l-sm">
          <el-form class="mar-t-sm item-space">
            <el-form-item label="因子选择：">
              <el-select
                style="width:180px;"
                v-model="cmdParas[3012].PolId"
                filterable
              >
                <el-option
                  v-for="(item, index) in factorsList"
                  :key="index"
                  :label="item.factorName"
                  :value="item.factorCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '3014'" class="mar-t-xs mar-l-sm">
          <el-form class="mar-t-sm item-space">
            <el-form-item label="因子选择：">
              <el-select
                style="width:180px;"
                v-model="cmdParas[3014].PolId"
                filterable
              >
                <el-option
                  v-for="(item, index) in factorsList"
                  :key="index"
                  :label="item.factorName"
                  :value="item.factorCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间选择：">
              <el-select
                style="width:180px;"
                v-model="cmdParas[3014].CTimes"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="(item, index) in 24"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '3016'" class="mar-t-xs mar-l-sm">
          <el-form class="mar-t-sm item-space">
            <el-form-item label="因子选择：">
              <el-select
                style="width:180px;"
                v-model="cmdParas[3016].PolId"
                filterable
              >
                <el-option
                  v-for="(item, index) in factorsList"
                  :key="index"
                  :label="item.factorName"
                  :value="item.factorCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间选择：">
              <el-select
                style="width:180px;"
                v-model="cmdParas[3016].CTime"
              >
                <el-option
                  v-for="(item, index) in 24"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '3015'" class="mar-t-sm mar-l-sm">
          <div>超标留样</div>
          <div class="mar-t-xs">设置当前选择仪器超标留样</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';
import { formatDate } from '@/global/libs/tools';
import { analyzeResp } from '@/global/libs/util';
import SelectPort from '@/components/widget/select-port';
import * as cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'ControlConfig',
  components: { SelectPort },
  props: ['portList', 'portInfo'],
  data() {
    return {
      loading: false,
      queryForm: {
        cmdName: '2011',
        portId: '',
        protocol: '',
        st: 33,
        cmdParas: {},
      },
      portIds: [],                  // 多选点位id
      factorsList: [],              // 因子数据
      active: 'data',
      cmdParas: {
        2051: {                                            // 取污染物分钟数据
          BeginTime: formatDate(new Date(), 'Ymd0000'),
          EndTime: formatDate(new Date(), 'Ymd2359'),
        },
        2061: {                                            // 取污染物小时数据
          BeginTime: formatDate(new Date(), 'Ymd00'),
          EndTime: formatDate(new Date(), 'Ymd23'),
        },
        2031: {                                            // 取污染物日数据
          BeginTime: formatDate(new Date(), 'Ymd'),
          EndTime: formatDate(new Date(), 'Ymd'),
        },
        2041: {                                            // 取设备运行时间日历史数据
          BeginTime: formatDate(new Date(), 'Ymd'),
          EndTime: formatDate(new Date(), 'Ymd'),
        },
        1000: {                                            // 设置超时时间及重发次数
          OverTime: 0,
          ReCount: 0,
        },
        1011: {                                            // 提取现场机时间
          PolId: '',
        },
        1012: {                                            // 设置现场机时间
          PolId: '',
          SystemTime: '',
        },
        1062: {                                            // 设置实时数据间隔
          RtdInterval: 0,
        },
        1072: {                                            // 设置现场机访问密码
          NewPW: '',
        },
        1064: {                                            // 设置分钟数据间隔
          RtdInterval: 0,
        },
        3012: {                                            // 即时采样
          PolId: '',
        },
        3014: {                                            // 设置采样时间周期 05协议
          PolId: '',
          CTimes: [],
        },
        3016: {                                            // 设置采样时间周期 17协议
          PolId: '',
          CstartTime: '000000',
          CTime: [],
        },
      },
      minute: {                                          // 分钟控件规则处理
        pickerOneDate: '',                      // 日期控件定义变量
        pickerOptions: {                        // 日期控件方法
          onPick: ({ maxDate, minDate }) => {
            this.minute.pickerOneDate = minDate.getTime();
            if (maxDate) {
              this.minute.pickerOneDate = '';
            }
          },
          disabledDate: (time) => {
            if (this.minute.pickerOneDate !== '') {
              let date = '';
              let max = '';
              let min = '';
              date = 0 * 24 * 3600000;
              max = this.minute.pickerOneDate + date;
              min = this.minute.pickerOneDate - date;
              return time.getTime() > max || time.getTime() < min || time.getTime() > +new Date();
            }
            return time.getTime() > +new Date();
          },
        },
      },
      hour: {                                            // 小时控件规则处理
        pickerOneDate: '',                      // 日期控件定义变量
        pickerOptions: {                        // 日期控件方法
          onPick: ({ maxDate, minDate }) => {
            this.hour.pickerOneDate = minDate.getTime();
            if (maxDate) {
              this.hour.pickerOneDate = '';
            }
          },
          disabledDate: (time) => {
            if (this.hour.pickerOneDate !== '') {
              let date = '';
              let max = '';
              let min = '';
              date = 6 * 24 * 3600000;
              max = this.hour.pickerOneDate + date;
              min = this.hour.pickerOneDate - date;
              return time.getTime() > max || time.getTime() < min || time.getTime() > +new Date();
            }
            return time.getTime() > +new Date();
          },
        },
      },
      date: {                                            // 日选择控件规则处理
        pickerOneDate: '',                      // 日期控件定义变量
        pickerOptions: {                        // 日期控件方法
          onPick: ({ maxDate, minDate }) => {
            this.date.pickerOneDate = minDate.getTime();
            if (maxDate) {
              this.date.pickerOneDate = '';
            }
          },
          disabledDate: (time) => {
            if (this.date.pickerOneDate !== '') {
              let date = '';
              let max = '';
              let min = '';
              date = 90 * 24 * 3600000;
              max = this.date.pickerOneDate + date;
              min = this.date.pickerOneDate - date;
              return time.getTime() > max || time.getTime() < min || time.getTime() > +new Date();
            }
            return time.getTime() > +new Date();
          },
        },
      },
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,            // 1 废水 2 废气
    }),
    portListTree() { // 处理排口数据为单选树组件支持格式
      return this.handleParentData(cloneDeep(this.portList), 0);
    },
    dateRange: {
      get() {
        let date = '';
        if (this.cmdParas[this.queryForm.cmdName]) {
          date = (!this.cmdParas[this.queryForm.cmdName].BeginTime && !this.cmdParas[this.queryForm.cmdName].EndTime)
            ? ''
            : [this.cmdParas[this.queryForm.cmdName].BeginTime, this.cmdParas[this.queryForm.cmdName].EndTime];
        }
        return date;
      },
      set(val) {
        [this.cmdParas[this.queryForm.cmdName].BeginTime, this.cmdParas[this.queryForm.cmdName].EndTime] = val || ['', ''];
      },
    },
  },
  watch: {
    portInfo: {
      handler(val) {
        this.queryForm.portId = val.portId;
        this.queryForm.protocol = val.protocol;
      },
      deep: true,
    },
    portIds(val) {
      const protocols = this.portList.filter(n => val.includes(n.id)).map(n => n.protocol);
      const isCommon = protocols.every(n => n === protocols[0]);
      this.queryForm.protocol = isCommon ? protocols[0] : '';
    },
  },
  created() {
    this.queryForm.portId = this.portInfo.portId;
    this.queryForm.protocol = this.portInfo.protocol;
    this.queryForm.st = this.amcsType === 1 ? 32 : 31;
    this.getFactorsList();
  },
  methods: {
    onTabClick(tab) {
      [this.queryForm.cmdName] = Object.keys(this.$enum.get('REMOTE_PROYOCOL', tab.name).common);
    },
    onChangeClick(val) {
      if (val === null) {
        this.queryForm.protocol = '';
      } else {
        this.queryForm.protocol = this.portList.filter(n => n.id === val.value)[0].protocol;
      }
    },
    /* 请求接口 */
    getFactorsList() {              // 获取因子数据列表
      this.$http.get('cfg/factors/', {
        params: {
          page: 1,
          rows: 100000,
          factorsType: 1,
          category: this.amcsType,
          sort: 'factorCode',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.factorsList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onSendOder() {             // 发送命令
      if (this.queryForm.portId === '' && this.portIds.length === 0) {
        this.$message.warning({
          message: '请先选择点位',
          duration: 3000,
          showClose: true,
        });
        return;
      }
      this.loading = true;
      const queryForm = [];
      if (this.portIds.length !== 0) {
        this.portIds.forEach((element) => {
          queryForm.push({
            ...this.queryForm,
            portId: element,
            cmdParas: this.cmdParas[this.queryForm.cmdName] || {},
          });
        });
      } else {
        queryForm.push({
          ...this.queryForm,
          cmdParas: this.cmdParas[this.queryForm.cmdName] || {},
        });
      }
      this.$http.post('amcs/remoteControl/executeBatch', queryForm).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$emit('onQuerylist', response);
          this.$message.success({
            message: '发送成功',
            duration: 3000,
            showClose: true,
          });
        } else {
          this.$message.warning({
            message: response.data.message,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    /* 处理数据 */
    handleParentData(val, iNum) {
      const field = [
        { name: 'psName', key: 'psId' },
        { name: 'portName', key: 'id' },
      ];
      const valmap = val.map(item => item[field[iNum].key]);
      const arr = [];
      for (let i = 0; i < val.length; i += 1) {
        const arrmap = arr.map(item => item.value);
        if (!arrmap.includes(valmap[i])) {
          const treedata = {};
          this.$set(treedata, 'label', val[i][field[iNum].name]);
          this.$set(treedata, 'value', val[i][field[iNum].key]);
          arr.push(treedata);
        }
      }
      if (iNum < field.length - 1) {
        arr.forEach((item) => {
          this.$set(item, 'children', []);
          val.forEach((op) => {
            if (item.value === op[field[iNum].key]) item.children.push(op);
          });
          if (item.children.length) {
            const num = iNum + 1;
            this.$set(item, 'children', this.handleParentData(item.children, num));
          }
        });
      }
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
