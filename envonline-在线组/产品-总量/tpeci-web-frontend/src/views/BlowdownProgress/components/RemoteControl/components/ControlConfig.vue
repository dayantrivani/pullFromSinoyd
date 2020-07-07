<template>
  <el-row :gutter="$config.space" class="fill-h" v-loading="loading">
    <el-col :span="24" :h="6">
      <el-card type="title">
        <!-- 头部标题 -->
        <template slot="header">控制命令</template>
        <el-tabs v-model="active" type="border-card" @tab-click="onTabClick">
          <el-tab-pane label="控制命令" name="valve">
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
        <!-- <div v-show="queryForm.cmdName === '2011'" class="mar-t-sm mar-l-sm">
          <div>取污染物实时数据</div>
          <div class="mar-t-xs">获取当前选择仪器最新数据</div>
        </div> -->
        <div v-show="queryForm.cmdName === '1'" class="mar-t-sm mar-l-sm">
          <div>取总量阈值</div>
          <div class="mar-t-xs">提取关阀总量阈值命令</div>
        </div>
        <div v-show="queryForm.cmdName === '2'" class="mar-t-sm mar-l-sm">
          <div>取浓度阈值</div>
          <div class="mar-t-xs">提取关阀浓度阈值命令</div>
        </div>
        <div v-show="queryForm.cmdName === '3811'" class="mar-t-sm mar-l-sm">
          <div>远程关阀</div>
          <div class="mar-t-xs">远程关阀命令</div>
        </div>
        <div v-show="queryForm.cmdName === '3812'" class="mar-t-sm mar-l-sm">
          <div>解除阀门控制</div>
          <div class="mar-t-xs">解除阀门控制命令</div>
        </div>
        <div v-show="queryForm.cmdName === '2881'" class="mar-t-sm mar-l-sm">
          <div>取阀门动态信息</div>
          <div class="mar-t-xs">提取时间段内阀门动态信息</div>
          <el-form class="mar-t-xs">
            <el-form-item label="开始时间：">
              <el-date-picker
                style="width: 200px;"
                v-model="cmdParas['2881'].BeginTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker
                style="width: 200px;"
                v-model="cmdParas['2881'].EndTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '2873'" class="mar-t-sm mar-l-sm">
          <div>提取报警历史</div>
          <div class="mar-t-xs">提取时间段内提取报警历史</div>
          <el-form class="mar-t-xs">
            <el-form-item label="开始时间：">
              <el-date-picker
                style="width: 200px;"
                v-model="cmdParas['2873'].BeginTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker
                style="width: 200px;"
                v-model="cmdParas['2873'].EndTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '2831'" class="mar-t-sm mar-l-sm">
          <div>取总量日数据</div>
          <div class="mar-t-xs">提取时间段内总量历史日数据</div>
          <el-form class="mar-t-xs">
            <el-form-item label="开始时间：">
              <el-date-picker
                style="width: 140px;"
                v-model="cmdParas['2831'].BeginTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd 00:00:00"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker
                style="width: 140px;"
                v-model="cmdParas['2831'].EndTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd 23:59:59"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="queryForm.cmdName === '2861'" class="mar-t-sm mar-l-sm">
          <div>取总量小时数据</div>
          <div class="mar-t-xs">提取时间段内总量历史小时数据</div>
          <el-form class="mar-t-xs">
            <el-form-item label="开始时间：">
              <el-date-picker
                style="width: 160px;"
                v-model="cmdParas['2861'].BeginTime"
                type="datetime"
                format="yyyy-MM-dd HH"
                value-format="yyyy-MM-dd HH:00:00"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker
                style="width: 160px;"
                v-model="cmdParas['2861'].EndTime"
                type="datetime"
                format="yyyy-MM-dd HH"
                value-format="yyyy-MM-dd HH:00:00"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { formatDate } from '@/global/libs/tools';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'ControlConfig',
  props: ['portId'],
  data() {
    return {
      loading: false,
      queryForm: {
        cmdName: '3810',
        portId: '',
        protocol: 1,
        st: 43,
        cmdParas: {},
      },
      portIds: [],                  // 多选点位id
      factorsList: [],              // 因子数据
      active: 'valve', // 命令类型 data 数据命令 argument 参数命令 control 控制命令
      cmdParas: {
        2881: {                                            // 取阀门动态信息
          BeginTime: formatDate(new Date(), 'Y-m-d 00:00:00'),
          EndTime: formatDate(new Date(), 'Y-m-d 23:59:59'),
        },
        2873: {                                            // 提取报警历史
          BeginTime: formatDate(new Date(), 'Y-m-d 00:00:00'),
          EndTime: formatDate(new Date(), 'Y-m-d 23:59:59'),
        },
        2831: {                                            // 提取日数据
          BeginTime: formatDate(new Date(), 'Y-m-d 00:00:00'),
          EndTime: formatDate(new Date(), 'Y-m-d 23:59:59'),
        },
        2861: {                                            // 提取小时数据
          BeginTime: formatDate(new Date(), 'Y-m-d 00:00:00'),
          EndTime: formatDate(new Date(), 'Y-m-d 00:00:00'),
        },
        3810: {
          UT: 1,
        },
        3811: {
          UT: 1,
        },
        3812: {
          UT: 1,
        },
        1: {},
        2: {},
        1000: {                                            // 设置超时时间及重发次数
          OverTime: 0,
          ReCount: 0,
        },
      },
    };
  },
  watch: {
    portId(val) {
      this.queryForm.portId = val;
    },
  },
  created() {
    this.queryForm.portId = this.portId;
    // this.getFactorsList();
  },
  methods: {
    onTabClick(tab) {
      [this.queryForm.cmdName] = Object.keys(this.$enum.get('REMOTE_PROYOCOL', tab.name).common);
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
      this.loading = true;
      if (this.queryForm.cmdName !== '2' && this.queryForm.cmdName !== '1') {
        const queryForm = { ...this.queryForm, cmdParas: { ...this.cmdParas[this.queryForm.cmdName] } || {} };
        if (queryForm.cmdParas.BeginTime) queryForm.cmdParas.BeginTime = queryForm.cmdParas.BeginTime.replace(/\D/g, '');
        if (queryForm.cmdParas.EndTime) queryForm.cmdParas.EndTime = queryForm.cmdParas.EndTime.replace(/\D/g, '');
        this.$http.post('tpeci/remoteControl/execute', queryForm).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$emit('onQuerylist', response);
            this.$message.success({
              message: '发送成功',
              duration: 3000,
              showClose: true,
            });
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, (response) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
      } else {
        const queryForm = {
          portId: this.portId,
          type: this.queryForm.cmdName,
        };
        this.$http.get('tpeci/valveScheme2Port/extract', {
          params: { ...queryForm },
        }).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$emit('onQuerylist', response);
            this.$message.success({
              message: '发送成功',
              duration: 3000,
              showClose: true,
            });
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, (response) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
