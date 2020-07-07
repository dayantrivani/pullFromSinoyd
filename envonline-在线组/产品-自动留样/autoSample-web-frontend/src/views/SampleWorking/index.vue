<template>
  <el-card fill>
    <div slot="header">
      <div>
        <el-form inline :model="queryForm">
          <el-form-item>
            <select-tree-lazy
              :label="region.regionLabel"
              placeholder="请选择行政区域"
              v-model="region.regionCodeId"
              @setLabel="setLabel"/>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.portId" placeholder="请选择点位" style="width:235px" class="z-pointer">
              <el-option v-for="(item, key) in portList" :key="key" :label="item.portName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="onSearchClick">查 询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <iframe id="frame" src="HT/index.html" width="100%" height="100%" style="border:0"></iframe>

    <dialog-modal ref="dialog" title="选择因子" size='mini'>
      <el-form label-width="120px" style='margin-bottom:50px'>
        <el-form-item label="因子：">
           <el-select v-model="factorCode" placeholder="请选择" style="width:100%" class="z-pointer">
            <el-option v-for="(item, key) in overFactorList" :key="key"
            :label="item.factorName" :value="item.factorCode">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFactor" icon="fas fa-save">确 定</el-button>
        <el-button @click="closeDialog" icon="fa fa-times">关 闭</el-button>
      </div>
    </dialog-modal>
  </el-card>
</template>

<script>

export default {
  name: 'SampleWorking',
  data() {
    return {
      queryForm: {
        portId: '',
        factorCodes: [],
        regionCodeId: '',
        key: '',
        alarmStatus: -1,
        sampleInsStatus: -1,
        sort: 'regionCodeId+,psName+,portName',
      },
      region: { // 行政区域
        regionLabel: '',
        regionCodeId: '',
      },
      portList: [],
      gridFactorList: [],
      factorCode: '', // 选中的因子
      overFactorList: [],
    };
  },
  created() {
    this.getPortList();
    this.getOverFactorList();
    window.addEventListener('message', this.postMessageListener); // 监听子页面的传参
  },
  destroyed() {
    window.removeEventListener('message', this.postMessageListener, false);
  },
  watch: {
    region() {
      this.queryForm.portIds = [];
      this.getPortList();
    },
  },
  computed: {},
  methods: {
    // 显示弹窗
    openDialog() {
      this.$refs.dialog.openDialog();
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 查询
    onSearchClick() {
      // 判断是否选择排口
      if (!this.queryForm.portId) {
        this.$message({
          type: 'info',
          message: '请选择排口',
          duration: 3000,
          showClose: true,
        });
        return;
      }
      // 清空信息
      this.setSampleInfo(null);
      const thePort = this.portList.find(p => p.id === this.queryForm.portId);
      this.queryForm.key = thePort.portName;
      this.$http.post('autoSample/realtime', { ...this.queryForm }, {
        params: {
          rows: 1,
          page: 1,
        },
      }).then((response) => {
        if (response.data.success) {
          const list = response.data.rows || response.data.data || response.data;
          if (!list.length) {
            this.$message({
              type: 'info',
              message: '未获得留样仪数据',
              duration: 3000,
              showClose: true,
            });
            return;
          }
          this.setSampleInfo(list[0]);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {});
    },
    // 获取排口
    getPortList() {
      this.$http.get('bas/portInfo/queryAuthority/?page=1&rows=100000&portType=1&sort=portName', {
        params: {
          regionCodeId: this.region.regionCodeId,
        },
      }).then((response) => {
        if (response.data.success) {
          this.portList = response.data.rows || response.data.data || response.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
    // 获取在线列表显示的因子列表
    getFactorList() {
      this.$http.get('cfg/pageShowItem?page=1&rows=100000&sort=valueType%2B,orderNum', {
        params: {
          pageShowMainCode: 'realForSample',
          isEnabled: true,
        },
      }).then((response) => {
        if (response.data.success) {
          this.gridFactorList = response.data.rows || response.data.data || response.data;
          this.queryForm.factorCodes = this.gridFactorList.filter(n => n.isShow).map(n => n.factorShowCode);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
      });
    },
    // 获取超标配置的采样因子
    getOverFactorList() {
      this.$http.get('cfg/factors/?page=1&rows=100000&factorsType=1&category=1&sort=factorName').then((response) => {
        if (response.data.code === 200) {
          this.overFactorList = response.data.rows || response.data.data || response.data;
        }
      });
    },
    setLabel(val) { // 行政区选择储存label值
      this.region.regionLabel = val;
      this.$nextTick(() => {
        this.getPortList();
      });
    },
    // 设置采样信息
    setSampleInfo(data) {
      const model = {
        alreadyBottle: '', // 已留样瓶数
        remainBottle: '', // 剩余瓶数
        sampleNum: '', // 留样瓶数
        sampleType: '', // 采样方式
        tstamp: '', // 留样时间
        relationBottle: '', // 关联瓶号
        overInfo: '', // 超标信息
        sampleInsStatus: '无', // 留样仪状态
        bottleStatus: [], // 留样瓶状态
        currentNum: 1, // 留样仪当前操作的瓶号
        injectPumpStatus: 0, // 进样泵状态 0停止 1运行
      };
      if (data) { // 如果data不传则是清空显示
        model.alreadyBottle = data.alreadyBottle;
        model.remainBottle = data.remainBottle;
        model.sampleNum = data.sampleNum;
        model.sampleType = data.sampleType;
        model.tstamp = data.tstamp;
        model.sampleInsStatus = data.sampleInsStatus;
        // 获取关联瓶号与留样量
        const arr = data.sampleBottleVolume.map(p => `${p.bottleNumber}(${p.bottleVolume}mL)`); // 1#(500mL);2#(500mL)
        model.relationBottle = arr.length ? arr.join(';') : '';
        // 获取超标信息
        const overArr = [];
        const keys = Object.keys(data);
        this.overFactorList.forEach((item) => {
          if (keys.includes(item.factorShowCode) && data[item.factorShowCode].includes('red:')) {
            const unit = item.unit === '无量纲' ? '' : item.unit;
            overArr.push(`${item.factorName}，${data[item.factorShowCode].replace('red:', '')}${unit}`);
          }
        });
        model.overInfo = overArr.join(';');
        // 获取留样瓶状态
        model.bottleStatus = data.sampleBottleStatus; // {value: "工作中", key: "1#"}
        // 获取当前操作瓶号
        const temp = [...data.sampleBottleStatus.filter(p => p.value).map(p => parseInt(p.key.replace('#', ''), 10))];
        if (temp && temp.length) {
          const num = temp.sort((a, b) => b - a)[0];
          model.currentNum = num;
        }
        // 获取进样泵状态
        if (data.injectPumpStatus.length) {
          // 可能存在多个泵 只要有一个泵运行 水管就流动
          model.injectPumpStatus = data.injectPumpStatus.filter(p => p.value === '1').length > 0 ? 1 : 0;
        }
      }
      // 调用子页面的方法
      document.getElementById('frame').contentWindow.setSampleInfo(model);
    },
    // 发送立即采样命令
    sendLJCY(data) {
      const list = [];
      const n = this.portList.find(p => p.id === this.queryForm.portId);
      list.push({
        regionCodeId: n.regionCodeId,
        regionName: n.regionName,
        psId: n.psId,
        psName: n.psName,
        portName: n.portName,
        portId: n.id,
        dgiMn: n.dgiMn,
        sampleModule: 2, // 立即采样
        sampleType: 1, // 单样
        sampleBottle: data.lyps, // 采样瓶数
        equalRatio: '', // 等比量
        mixingAmount: data.hhl, // 混合量
        mixingTimes: '1', // 混合次数
      });
      this.$http.post('autoSample/remoteSampleRecord/batch', list).then((response) => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    // 发送定时采样命令
    sendDSCY(data) {
      const n = this.portList.find(p => p.id === this.queryForm.portId);
      const temp = {
        regionCodeId: n.regionCodeId,
        regionName: n.regionName,
        psId: n.psId,
        psName: n.psName,
        portName: n.portName,
        portId: n.id,
        dgiMn: n.dgiMn,
        sampleModule: 1, // 定时采样
        sampleType: 1, // 单样
        sampleBottle: data.lyps, // 采样瓶数
        equalRatio: '', // 等比量
        mixingAmount: data.hhl, // 混合量
        mixingTimes: '1', // 混合次数
        timePoint: 1, // 时间点个数
        timePoints: [this.$hp.formatDate(new Date(data.time), 'Y-m-d H:i:s')], // 时间
      };
      this.$http.post('autoSample/remoteSampleRecord', temp).then((response) => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    // 发送超标留样设置命令
    sendCBLYSZ(data) {
      const n = this.portList.find(p => p.id === this.queryForm.portId);
      const factor = this.overFactorList.find(p => p.factorCode === this.factorCode);
      const temp = {
        regionCodeId: n.regionCodeId,
        regionName: n.regionName,
        psId: n.psId,
        psName: n.psName,
        portName: n.portName,
        portId: n.id,
        dgiMn: n.dgiMn,
        sampleBottleNum: data.lyps, // 采样瓶数
        mixingAmount: data.hhl, // 混合量
        standardLow: data.cbxz1,
        standardUpper: data.cbxz2,
        timeSpan: data.lysjjg,
        factorName: factor.factorName,
        factorId: factor.id,
        factorCode: this.factorCode,
      };
      this.$http.post('autoSample/overProofSampleConfig', temp).then((response) => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    // 保存因子
    saveFactor() {
      // 调用子页面的方法
      if (!this.factorCode) {
        this.$message({
          type: 'warning',
          message: '请选择因子',
          duration: 3000,
          showClose: true,
        });
        return;
      }
      const temp = this.overFactorList.find(p => p.factorCode === this.factorCode).factorName;
      document.getElementById('frame').contentWindow.btn_yzxz(temp);
      this.closeDialog();
    },
    // 子页面请求监听
    postMessageListener(e) {
      const regex = /^\d+(?=\.{0,1}\d+$|$)/; // 验证数字和小数点
      if (e.data.commond === 'reload') { // 页面刷新
        if (this.queryForm.portId) {
          this.onSearchClick();
        }
      } else {
        // 判断是否选择排口
        if (!this.queryForm.portId) {
          this.$message({
            type: 'warning',
            message: '请选择排口并点击查询',
            duration: 3000,
            showClose: true,
          });
          return;
        }
        if (e.data.commond === 'ljcy') { // 立即采样
          if (e.data.lyps && e.data.hhl && regex.test(e.data.lyps) && regex.test(e.data.hhl)) {
            this.sendLJCY(e.data);
          } else {
            this.$message({
              type: 'warning',
              message: '留样瓶数和混合量必填,请录入数字',
              duration: 3000,
              showClose: true,
            });
          }
        } else if (e.data.commond === 'dscy') { // 定时采样
          if (e.data.lyps && e.data.hhl && e.data.year && e.data.month && e.data.day && e.data.hour && e.data.minute
          && regex.test(e.data.lyps) && regex.test(e.data.year)
          && regex.test(e.data.month) && regex.test(e.data.day)
          && regex.test(e.data.hour) && regex.test(e.data.minute)) {
            const date = `${e.data.year}-${e.data.month}-${e.data.day} ${e.data.hour}:${e.data.minute}`;
            const temp = {
              time: date,
              lyps: e.data.lyps,
              hhl: e.data.hhl,
            };
            this.sendDSCY(temp);
          } else {
            this.$message({
              type: 'warning',
              message: '留样瓶数、混合量、时间框必填,请录入数字',
              duration: 3000,
              showClose: true,
            });
          }
        } else if (e.data.commond === 'szyz') {
          this.openDialog();
        } else if (e.data.commond === 'cblysz') { // 超标留样设置
          if (this.factorCode && e.data.hhl && e.data.lyps && e.data.cbxz1 && e.data.cbxz2 && e.data.lysjjg
          && regex.test(e.data.lyps) && regex.test(e.data.hhl)
          && regex.test(e.data.cbxz1) && regex.test(e.data.cbxz2) && regex.test(e.data.lysjjg)) {
            this.sendCBLYSZ(e.data);
          } else {
            this.$message({
              type: 'warning',
              message: '文本框必填,请录入数字',
              duration: 3000,
              showClose: true,
            });
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
