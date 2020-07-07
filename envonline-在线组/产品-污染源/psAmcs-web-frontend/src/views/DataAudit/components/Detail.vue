<template>
  <!-- 数据审核详情页面 -->
  <div>
    <el-card class="data-audit-detail">
      <div slot="header">
        <el-form :model="queryForm" inline>
          <el-form-item label="时间：" v-show="!isAuditMore">
            <el-date-picker
              v-model="queryForm.dateTime"
              type="date"
              :clearable="false"
              style="width: 135px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="因子：">
            <el-select
              v-model="queryForm.factorCodes"
              multiple
              collapse-tags
              style="width: 200px"
            >
              <el-option-group
                v-for="group in factorTreeList"
                :key="group.name"
                :label="group.name"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.factorShowCode"
                  :label="item.factorShowName"
                  :value="item.factorShowCode"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="getItemList()">查 询</el-button>
          </el-form-item>
          <el-form-item v-show="!isAuditMore">
            <el-dropdown split-button type="primary" @click="fastClick()" @command="fastClick">
              {{ currentFastButton.name }}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="fas fa-angle-up" command="1">上一个站点</el-dropdown-item>
                <el-dropdown-item divided icon="fas fa-angle-down" command="2">下一个站点</el-dropdown-item>
                <el-dropdown-item divided icon="far fa-check-circle" command="3">下个审核点</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="fas fa-download"
              :loading="downloading"
              @click="onDownload"
              plain
            >导 出</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="fas fa-arrow-left" @click="close()">返 回 (Esc)</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-dropdown>
              <span class="el-dropdown-link">
                颜色图例
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <i style="color:#f56c6c" class="fa fa-circle" aria-hidden="true"></i>待人工审核
                </el-dropdown-item>
                <el-dropdown-item>
                  <i style="color:#67C23A" class="fa fa-circle" aria-hidden="true"></i>自动审核通过
                </el-dropdown-item>
                <el-dropdown-item>
                  <i style="color:#409eff" class="fa fa-circle" aria-hidden="true"></i>人工审核通过
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <i style="color:#D8E4BC" class="fa fa-circle" aria-hidden="true"></i>人工修改(未保存)
                </el-dropdown-item>
                <el-dropdown-item>
                  <i style="color:#C4D79B" class="fa fa-circle" aria-hidden="true"></i>人工修改(已保存)
                </el-dropdown-item>
                <el-dropdown-item>
                  <i style="color:#D9D9D9" class="fa fa-circle" aria-hidden="true"></i>无效数据
                </el-dropdown-item>
                <!-- 废水有补遗功能 -->
                <el-dropdown-item v-if="queryForm.portType.toString() === '2'">
                  <i style="color:#B7DEE8" class="fa fa-circle" aria-hidden="true"></i>数据清零
                </el-dropdown-item>
                <!-- 烟气有清零功能 -->
                <el-dropdown-item v-if="queryForm.portType.toString() === '1'">
                  <i style="color:#FABF8F" class="fa fa-circle" aria-hidden="true"></i>补遗数据
                </el-dropdown-item>
                <el-dropdown-item>
                  <i style="color:#CCC0DA" class="fa fa-circle" aria-hidden="true"></i>网上报备
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form inline class="mar-t-xs mar-l-sm" style="float:left">
          <el-form-item>
            <span class="port-name">
              <img src="img/excel_logo.png" style="vertical-align: middle" />
              {{currentPortName}}
            </span>
          </el-form-item>
          <el-form-item>
            <span v-show="isIE">提示：使用谷歌浏览器或切换成极速模式可以改善页面显示效果！</span>
          </el-form-item>
        </el-form>
        <el-form inline class="mar-t-xs mar-l-sm" style="float:right">
          <el-form-item>
            <el-checkbox v-model="isShowEcharts" @change="showEcharts()">数据曲线</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="isShowFlag">原始标记位</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-upload" plain @click="uploadFileClick()">凭证上传</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-save" @click="saveChange()">修改保存</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="fas fa-check" @click="confirm()">审核确认</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="height:calc(100vh - 143px);overflow:auto;clear:both">
        <!-- 曲线 默认不显示 -->
        <el-card id="data-audit-detail-charts" style="height: 0px;clear:both"></el-card>
        <!-- 表格 -->
        <hot-table
          v-if="showTable"
          id="hot-table"
          ref="testHot"
          :settings="hotSettings"
          v-loading="loading"
        ></hot-table>
      </div>
    </el-card>
    <!-- 所有弹窗 -->
    <detail-dialog ref="myDialog" @refresh="getItemList"></detail-dialog>
  </div>
</template>

<script>
import Echarts from 'echarts';
import { analyzeResp } from '@/global/libs/util';
import { HotTable } from '@handsontable/vue';
import 'handsontable/languages/zh-CN';
import { dateFormat } from '@/libs/tools';
import * as _cloneDeep from 'lodash/cloneDeep';
import detailDialog from './Dialog';

export default {
  name: 'DataAuditDetail',
  components: {
    HotTable,
    detailDialog,
  },
  data() {
    return {
      isIE: false,
      loading: false,
      downloading: false,
      showTable: false,
      isAuditMore: false, // 是否连续审核
      isShowEcharts: false,
      isShowFlag: false,
      queryForm: {
        portId: '',
        portType: '',
        dateTime: '',
        dateTimeArr: [],
        factorCodes: [],
      },
      factorList: [], // 因子列表
      factorTreeList: [], // 因子下拉数据源
      chart: null, // 曲线对象
      currentPortName: '',
      currentPsId: '',
      currentPsName: '',
      currentRegionCodeId: '',
      currentRegionName: '',
      currentNo: 0, // 当前排口所在主页面的行号
      currentPortIds: [], // 主页面站点树检索
      hotSettings: {
        data: null,
        colHeaders: true, // 显示列头
        rowHeaders: true, // 显示行头
        maxCols: 100,
        startRows: 100,
        startCols: 100,
      },
      currentFastButton: {
        type: 3, // 1 上个站点 2 下个站点 3 下个审核点
        name: '下个审核点',
      },
      factorListForStore: [], // 缓存因子，防止重复加载
      itemList: [], // 列表数据
      tableList: [], // 列表数据(table绑定数据)
      originData: [], // 原始数据（二维数组）
    };
  },
  created() {
    // 是否IE浏览器
    if (window.ActiveXObject || 'ActiveXObject' in window) {
      this.isIE = true;
    }
  },
  mounted() { },
  computed: {
    // 是否折叠侧栏,用于改变折叠按钮的样式
    isFold() {
      return this.$store.state.isFold;
    },
  },
  watch: {
    isFold() { // 菜单折叠 图表自适应
      setTimeout(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 500);
    },
    isShowFlag() {
      this.$refs.testHot.hotInstance.loadData(this.tableList);
    },
  },
  methods: {
    // 加载数据
    loadData(detailModel) {
      this.currentPortName = detailModel.portName;
      this.currentPsId = detailModel.psId;
      this.currentPsName = detailModel.psName;
      this.currentRegionCodeId = detailModel.regionCodeId;
      this.currentRegionName = detailModel.regionName;
      this.currentNo = detailModel.currentNo;
      this.currentPortIds = detailModel.portIds; // 主页面勾选的排口
      // 是否连续审核
      this.isAuditMore = detailModel.date.length > 1;
      if (!this.isAuditMore) {
        const temp = detailModel.date[0];
        this.queryForm.dateTime = temp;
      } else {
        this.queryForm.dateTimeArr = detailModel.date;
      }
      this.queryForm.portId = detailModel.portId;
      this.queryForm.portType = detailModel.portType;
      // 加载排口因子
      this.getFactorsList(detailModel.portType, detailModel.childPortType, this.getItemList);
    },
    // 获取排口因子(排口大类、排口小类、回调函数)
    getFactorsList(portType, childPortType, callback) {
      const code = `dataAuditFor${this.$enum.getLabel('LABEL_CODE', portType)}0${childPortType}`;
      const temp = this.factorListForStore.find(p => p.key === code);
      if (temp) {
        this.factorList = temp.data;
        this.factorTreeList = temp.tree;
        // 默认勾选
        this.queryForm.factorCodes = this.factorList.filter(p => p.isShow).map(p => p.factorShowCode);
        if (typeof callback === 'function') {
          callback();
        }
        return;
      }
      // 初次加载
      this.$http.get('cfg/pageShowItem', {
        params: {
          pageShowMainCode: code,
          isEnabled: true,
          page: 1,
          rows: 10000,
          sort: 'orderNum-',
        },
      }).then((response) => {
        if (response.data.success) {
          if (!response.data.data.length) {
            this.$message({
              type: 'warning',
              message: `未配置编码为${code}的因子显示配置，请联系系统管理员`,
              showClose: true,
            });
            return;
          }
          const obj = response.data.data;
          // 构造因子分组下拉树(分组大类和小类排序根据排序值确定)
          const treeData = [];
          const temp2 = [];
          obj.forEach((item) => {
            if (!temp2.includes(item.valueTypeName)) {
              temp2.push(item.valueTypeName);
              treeData.push({
                name: item.valueTypeName,
                children: obj.filter(p => p.valueTypeName === item.valueTypeName),
              });
            }
          });
          this.factorList = obj;
          this.factorTreeList = treeData;
          // 默认勾选
          this.queryForm.factorCodes = this.factorList.filter(p => p.isShow).map(p => p.factorShowCode);
          // 缓存数据
          this.factorListForStore.push({
            key: code,
            data: obj,
            tree: treeData,
          });
          if (typeof callback === 'function') {
            callback();
          }
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取列表数据
    getItemList() {
      const temp = { ...this.queryForm };
      temp.sort = 'Tstamp';
      temp.fromDates = this.isAuditMore ? temp.dateTimeArr : [dateFormat(new Date(temp.dateTime))];
      this.loading = true;
      this.$http.post('audit/dataAudit', temp, {
        params: {},
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          // 如果曲线显示，需要刷新
          if (this.isShowEcharts) {
            this.createEcharts();
          }
          // 渲染table
          this.toSetHotTable();
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
    // 导出数据
    onDownload() {
      this.downloading = true;
      const temp = { ...this.queryForm };
      temp.sort = 'Tstamp';
      temp.fromDates = this.isAuditMore ? temp.dateTimeArr : [dateFormat(new Date(temp.dateTime))];
      temp.isShowSourceFlag = true; // 是否显示原始标记位
      temp.isShowAuditFlag = true; // 是否显示审核标记位
      temp.factorList = this.factorList.filter(p => temp.factorCodes.includes(p.factorShowCode));
      this.$http.post('audit/dataAudit/export', temp, {
        'responseType': 'blob',
        params: {},
      }).then((response) => {
        const filename = `审核数据导出（${this.currentPortName}）.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 返回前置页面
    close() {
      // 清空页面数据
      this.currentPortName = '';
      this.currentPsId = '';
      this.currentPsName = '';
      this.currentRegionCodeId = '';
      this.currentRegionName = '';
      this.itemList = [];
      this.factorList = [];
      this.showTable = false;
      // this.toSetHotTable(); // 清空表格
      this.queryForm = {
        portId: '',
        portType: '',
        dateTime: '',
        dateTimeArr: [],
        factorCodes: [],
      };
      this.$emit('close');
    },
    // 显示隐藏曲线
    showEcharts() {
      document.getElementById('data-audit-detail-charts').style.height = this.isShowEcharts ? '500px' : '0px';
      // 展开曲线必须重新渲染
      if (this.isShowEcharts) {
        this.createEcharts();
      }
    },
    // 渲染曲线
    createEcharts() {
      if (!this.itemList.length) {
        return;
      }
      const arr = this.factorList.filter(p => this.queryForm.factorCodes.includes(p.factorShowCode));
      const factorName = [];
      const xData = this.itemList.map(p => p.tstamp.substr(11, 5)); // 只显示时分
      const data = [];
      arr.forEach((item) => {
        const str = (`${item.factorShowName}(${item.unit})`).replace('(无量纲)', '');
        factorName.push(str);
        const obj = {
          name: str,
          type: 'line',
          data: this.itemList.map(p => p[item.factorShowCode]),
          smooth: true,
          symbol: 'none',
        };
        data.push(obj);
      });
      const temp = this.isAuditMore ? this.queryForm.dateTimeArr : [dateFormat(new Date(this.queryForm.dateTime))];
      this.chart = Echarts.init(document.getElementById('data-audit-detail-charts'));
      const option = {
        title: {
          text: `${this.currentPortName}${temp.join('、')}数据走势图`,
          textStyle: {
            color: 'white',
          },
        },
        backgroundColor: '#404A59',
        toolbox: {
          feature: {
            magicType: {
              type: ['line', 'bar'],
            },
            saveAsImage: {
              title: '下载',
            },
          },
          iconStyle: {
            color: 'gray',
            borderColor: 'gray',
          },
          top: '5px',
          right: '15px',
        },
        color: ['#409EFF', '#9BCA63', '#D7AB82', '#ff733f', '#ffd285', '#BB8AB0', '#59C4E6', '#22C3AA', '#E5CF0D'],
        calculable: true,
        animation: false,
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          top: '100px',
          left: '80px',
          right: '50px',
          bottom: '50px',
        },
        legend: {
          top: '30px',
          data: factorName,
          textStyle: {
            color: 'white',
          },
        },
        xAxis: {
          name: '时间',
          type: 'category',
          boundaryGap: false,
          data: xData,
          axisLine: {
            lineStyle: {
              color: 'white',
            },
          },
        },
        yAxis: {
          name: '监测值',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'white',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#5F6979',
            },
          },
        },
        series: data,
      };
      this.chart.setOption(option, true);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
    // 渲染表格
    toSetHotTable() {
      const that = this; // 存储当前对象
      this.showTable = false;
      this.tableList = _cloneDeep(this.itemList);
      this.tableCode = ['tstamp', 'auditStatus'];
      const tableName = ['监测时间', '审核状态'];
      const selectedFactorList = this.factorList.filter(p => this.queryForm.factorCodes.includes(p.factorShowCode));
      selectedFactorList.forEach((item) => {
        this.tableCode.push(item.factorShowCode);
        if (item.unit === '' || item.unit === '无量纲') {
          tableName.push(`${item.factorName}<br />${item.valueTypeName}`);
        } else {
          const title = `${item.factorName}<br />${item.valueTypeName}(${item.unit})`;
          tableName.push(title);
        }
      });
      const columnsArr = []; // 列定义
      this.tableCode.forEach((code, i) => {
        let obj = {
          data: code,
          type: 'text', // 类型设置成文本
          readOnly: false,
          renderer: (hotInstance, TD, row, col, prop, value, cellProperties) => {
            TD.innerHTML = value;
            if (this.isShowFlag && this.tableList[row][`${prop.split('-')[0]}-Flag`]) {
              TD.innerHTML += `<span style="margin-left:5px;">${this.tableList[row][`${prop.split('-')[0]}-Flag`]}</span>`;
            }
            if (!this.isIE) {
              TD.style.cursor = 'url("img/cross.ico"),crosshair';
            }
            TD.style.color = '#515a6e';
            TD.style.textAlign = 'right';
            TD.style.verticalAlign = 'middle';
            TD.style.background = '#fff';
            // 控制单元格颜色(注意先后顺序，后面的颜色可能覆盖前面的颜色)
            if (this.tableList[row][`${prop}-AuditFlag`] === 'W') { // 人工修改过的数据，包括置有效无效(已保存)
              TD.style.background = '#C4D79B'; // 深绿色
            }
            if (this.tableList[row][`${prop}-AuditFlag`] === 'w') { // 手工录入的数据(未保存)
              TD.style.background = '#D8E4BC'; // 浅绿色
            }
            if (this.tableList[row][`${prop}-AuditFlag`] === 'CB') { // 废水补遗的数据
              TD.style.background = '#FABF8F'; // 橙色
            }
            if (this.tableList[row][`${prop}-AuditFlag`] === 'A') { // 烟气清零的数据
              TD.style.background = '#B7DEE8'; // 淡蓝色
            }
            if (this.tableList[row][`${prop}-IsValid`] === '0') { // 无效数据
              TD.style.background = '#D9D9D9'; // 灰色
            }
            if (this.tableList[row][`${prop}-AuditFlag`] === 'F') { // 网上报备
              TD.style.background = '#CCC0DA'; // 紫色
            }
            return cellProperties;
          },
        };
        // 固定列特殊处理
        if (i < 1) {
          obj = {
            data: code,
            type: 'text',
            readOnly: true,
            renderer: (hotInstance, TD, row, col, prop, value, cellProperties) => {
              TD.innerHTML = value;
              if (!this.isIE) {
                TD.style.cursor = 'url("img/cross.ico"),crosshair';
              }
              TD.style.color = 'black';
              TD.style.textAlign = 'center';
              TD.style.verticalAlign = 'middle';
              return cellProperties;
            },
          };
        }
        if (i === 1) {
          obj = {
            data: code,
            type: 'text',
            readOnly: true,
            renderer: (hotInstance, TD, row, col, prop, value, cellProperties) => {
              if (value) {
                if (value === that.$enum.getValue('AUDITSTATUS', '待人工审核')) {
                  TD.style.backgroundColor = '#f56c6c';
                } else if (value === that.$enum.getValue('AUDITSTATUS', '自动审核通过')) {
                  TD.style.backgroundColor = '#67C23A';
                } else if (value === that.$enum.getValue('AUDITSTATUS', '人工审核通过')) {
                  TD.style.backgroundColor = '#409eff';
                }
              }
              if (!this.isIE) {
                TD.style.cursor = 'url("img/cross.ico"),crosshair';
              }
              return cellProperties;
            },
          };
        }
        columnsArr.push(obj);
      });
      // 结尾加审核日志列
      tableName.push('审核日志');
      const temp = {
        readOnly: true,
        renderer: (hotInstance, TD, row, col, prop, value, cellProperties) => {
          TD.innerHTML = '<span style="color:#409EFF;">日 志</span>';
          TD.style.cursor = 'pointer';
          TD.style.textAlign = 'center';
          TD.style.verticalAlign = 'middle';
          return cellProperties;
        },
      };
      columnsArr.push(temp);
      this.hotSettings = {
        language: 'zh-CN', // 声明用中文的语言包
        rowHeaders: true,
        // 自定义列表头
        colHeaders: tableName,
        // 数据--数组
        data: this.tableList,
        // 列--对应
        columns: columnsArr,
        // 行高--(不包含表头)
        rowHeights: 25,
        className: 'htCenter htMiddle',
        // 右键菜单
        contextMenu: {
          callback(key, options) {
            that.onRightClick(key, options, columnsArr);
          },
          items: {
            modify: {
              name: '<span style="color:#606266;line-height:30px"><i class="fas fa-pen-square" aria-hidden="true"></i> 人工修改</span>',
            },
            valid: {
              name: '<span style="color:#606266;line-height:30px"><i class="fas fa-check-square" aria-hidden="true"></i> 置为有效</span>',
            },
            invalid: {
              name: '<span style="color:#606266;line-height:30px"><i class="fas fa-minus-square" aria-hidden="true"></i> 置为无效</span>',
            },
            restoreData: {
              name: '<span style="color:#606266;line-height:30px"><i class="fas fa-share-square" aria-hidden="true"></i> 数据还原</span>',
            },
          },
        },
        // 固定左侧多少列不能水平滚动
        fixedColumnsLeft: 2,
        // 列留白
        minSpareCols: 0,
        // 行留白
        minSpareRows: 0,
        // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"
        fillHandle: false,
        // 添加边框
        customBorders: [],
        // 根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
        stretchH: 'all',
        // 手动固定列
        manualColumnFreeze: false,
        // 手动移动列
        manualColumnMove: false,
        // 手动移动行
        manualRowMove: false,
        // 手工更改列宽度
        manualColumnResize: true,
        // 手动更改行距
        manualRowResize: true,
        // 单元格被改变前
        beforeChange(changes, source) {
          // changes是一个2维数组包含row prop oldVal newVal4个属性
          // source其值为一个字符串 值可以为:alter empty populateFromArray loadData autofill paste
          if (source === 'edit') {
            const newValue = changes[0][3];
            if (!newValue.match(/^[+-]?\d+(\.\d+)?$/)) {
              that.$message('请输入数值');
              // 如果编辑器输入的值不符合要求，还原回原始值
              const old = changes[0][2];
              changes[0][3] = old;
              return;
            }
            // 只有数据改变时才作为修改数据
            if (changes[0][3] !== changes[0][2]) {
              const row = changes[0][0]; // 行
              const prop = changes[0][1]; // 列
              that.tableList[row][`${prop}-AuditFlag`] = 'w'; // 人工审核标记位(未保存)
              that.$refs.testHot.hotInstance.loadData(that.tableList);
            }
          }
        },
        // 点击单元格触发的事件
        afterOnCellMouseUp(event, cell) { // 三个返回值，event，{row，col}，dom节点
          // 点击审核日志
          if (cell.col === (this.countCols() - 1) && cell.row >= 0) {
            that.auditLogClick(cell.row);
          }
        },
      };
      // 动态配置右键菜单
      if (this.queryForm.portType - 1) { // 烟气
        this.$set(this.hotSettings.contextMenu.items, 'clear', {
          name: '<span style="color:#606266;line-height:30px"><i class="fas fa-minus-square" aria-hidden="true"></i> 数据清零</span>',
        });
      } else {
        this.$set(this.hotSettings.contextMenu.items, 'replenish', {
          name: '<span style="color:#606266;line-height:30px"><i class="fas fa-plus-square" aria-hidden="true"></i> 数据补遗</span>',
        });
      }
      setTimeout(() => {
        this.showTable = true;
      }, 1);
      setTimeout(() => {
        this.originData = this.$refs.testHot.hotInstance.getData();
      }, 500);
    },
    // 审核日志按钮
    auditLogClick(value) {
      const item = this.tableList[value];
      const model = {
        fromTime: item.tstamp,
        toTime: item.tstamp,
        portType: this.queryForm.portType,
        portId: item.portId,
      };
      this.$refs.myDialog.openDialogForLog(model);
    },
    // 凭证上传按钮
    uploadFileClick() {
      // 判断是否未保存
      if (this.validateUnSaveData()) {
        return;
      }
      const model = {
        factorTreeList: this.factorTreeList,
        factorList: this.factorList,
        beginTime: this.tableList[0].tstamp,
        endTime: this.tableList[this.tableList.length - 1].tstamp,
        portId: this.queryForm.portId,
        portName: this.currentPortName,
        psId: this.currentPsId,
        psName: this.currentPsName,
        regionCodeId: this.currentRegionCodeId,
        regionName: this.currentRegionName,
      };
      this.$refs.myDialog.openDialogForFile(model);
    },
    // 数据比对（判断数据是否修改未保存）
    checkDataChange() {
      const temp = [];
      const nowData = this.$refs.testHot.hotInstance.getData();
      for (let i = 0; i < this.originData.length; i++) {
        for (let j = 2; j < this.originData[i].length; j++) { // 固定列排查
          if (this.originData[i][j] !== nowData[i][j]) {
            temp.push({
              row: i,
              tstamp: nowData[i][0],
              prop: this.$refs.testHot.hotInstance.getCellMeta(i, j).prop,
              value: nowData[i][j],
            });
          }
        }
      }
      return temp;
    },
    // 快捷操作（上一个站点、下一个站点、下个审核点）
    fastClick(type) {
      const temp = {
        1: '上一个站点',
        2: '下一个站点',
        3: '下个审核点',
      };
      if (type) {
        this.currentFastButton.type = type;
        this.currentFastButton.name = temp[type];
      }
      // 调取接口
      let newNo = this.currentNo;
      let url = 'audit/dataAudit/next';
      if (this.currentFastButton.type < 3) { // 上下站点
        if (this.currentFastButton.type - 1) {
          newNo = this.currentNo + 1;
        } else {
          newNo = this.currentNo - 1;
        }
      } else { // 下个审核点(不用考虑currentNo)
        url = 'audit/dataAudit/nextAudit';
      }
      const model = {
        isAll: this.currentPortIds.length === 0,
        portIds: this.currentPortIds,
        portType: this.queryForm.portType,
        childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.queryForm.portType),
        fromDate: dateFormat(new Date(this.queryForm.dateTime)),
        currentPortId: this.queryForm.portId,
      };
      this.$http.post(url, model, {
        params: {
          page: newNo,
          sort: 'regionName+,psName+,portName+',
        },
      }).then((response) => {
        if (response.data.success) {
          // 判断是否有数据
          const temp = response.data.data;
          if (!temp.portId) {
            this.$message(`${this.currentFastButton.name}不存在`);
            return;
          }
          // 更新当前排口No
          this.currentNo = newNo;
          // 更新当前排口id和类型
          this.queryForm.portId = temp.portId;
          this.queryForm.portType = temp.portType;
          this.currentPortName = temp.portName;
          this.currentPsId = temp.psId;
          this.currentPsName = temp.psName;
          this.currentRegionCodeId = temp.regionCodeId;
          this.currentRegionName = temp.regionName;
          // 获取当前排口的因子
          this.getFactorsList(temp.portType, temp.childPortType, this.getItemList);
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
    // 审核确认（不考虑权限）
    confirm() {
      // 判断是否未保存
      if (this.validateUnSaveData()) {
        return;
      }
      // 确认接口
      this.$confirm('确认审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.post('audit/dataAudit/affirm', {
          tstamps: this.isAuditMore ? this.queryForm.dateTimeArr : [dateFormat(new Date(this.queryForm.dateTime))],
          portType: this.queryForm.portType,
          portId: this.queryForm.portId,
        }, { params: {} })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          // 刷新列表
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
      });
    },
    // 修改保存
    saveChange() {
      // 获取修改的记录
      const temp = this.checkDataChange();
      if (!temp.length) {
        this.$message({
          type: 'warning',
          message: '没有需要保存的数据',
          showClose: true,
        });
        return;
      }
      // 构造对象
      const data = this.actionData(temp);
      // 调取接口
      const model = {
        action: 'modify',
        portType: this.queryForm.portType,
        dataAuditItems: data,
      };
      this.$http.post('audit/dataAudit/action', model, {
        params: {},
      }).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          // 刷新列表
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
      });
    },
    // 右键操作
    onRightClick(key, options, columns) {
      // 是否选中非数字区域
      const colArr = options.map(i => i.start.col);
      const endArr = options.map(i => i.end.col);
      if (colArr.includes(0) || colArr.includes(1)) {
        this.$message('选择的区域包含不可编辑区域！');
        return;
      }
      if (endArr.includes(columns.length - 1)) {
        this.$message('选择的区域包含不可编辑区域！');
        return;
      }
      // 判断是否未保存
      const temp = this.checkDataChange();
      if (temp.length) {
        this.$message({
          type: 'warning',
          message: '请先保存手工修改的数据，再进行右键操作',
          showClose: true,
        });
        return;
      }
      // 获取数据
      const data = [];
      options.forEach((cells) => {
        for (let i = cells.start.row; i <= cells.end.row; i++) {
          const obj = {
            portId: this.queryForm.portId,
            tstamp: this.tableList[i].tstamp,
            dataAuditDetails: [],
          };
          for (let j = cells.start.col; j <= cells.end.col; j++) {
            if (key === 'clear') {
              obj.dataAuditDetails.push({
                factorCode: columns[j].data.split('-')[0],
                valueType: columns[j].data.split('-')[1],
                factorValue: 0,
              });
            } else {
              obj.dataAuditDetails.push({
                factorCode: columns[j].data.split('-')[0],
                valueType: columns[j].data.split('-')[1],
              });
            }
          }
          data.push(obj);
        }
      });
      const model = {
        action: key,
        portType: this.queryForm.portType,
        dataAuditItems: data,
      };
      // 人工修改需要弹窗
      if (key === 'modify') {
        this.$refs.myDialog.openDialogForChange(model);
        return;
      }
      // 调取接口
      this.$http.post('audit/dataAudit/action', model, {
        params: {},
      }).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          // 刷新列表
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
      });
    },
    // action数据公共方法
    actionData(temp) {
      const times = [];
      temp.forEach((item) => {
        if (!times.includes(item.tstamp)) {
          times.push(item.tstamp);
        }
      });
      const data = [];
      times.forEach((item) => {
        const obj = {
          portId: this.queryForm.portId,
          tstamp: item,
          dataAuditDetails: [],
        };
        temp.filter(p => p.tstamp === item).forEach((p) => {
          obj.dataAuditDetails.push({
            factorCode: p.prop.split('-')[0],
            valueType: p.prop.split('-')[1],
            factorValue: p.value,
          });
        });
        data.push(obj);
      });
      return data;
    },
    // 验证是否存在未保存数据
    validateUnSaveData() {
      let result = false;
      const temp = this.checkDataChange();
      if (temp.length) {
        this.$message({
          type: 'warning',
          message: '存在人工修改未保存的数据，请先点击保存按钮',
          showClose: true,
        });
        result = true;
      }
      return result;
    },
  },
};
</script>

<style>
.data-audit-detail .port-name {
  font-size: 16px;
  font-weight: bold;
  color: #606266;
  float: right;
}
.wtHolder {
  height: auto;
}
.handsontable table.htCore thead tr th {
  height: 30px;
  font-weight: 500;
  font-size: 14px;
  color: #607182;
  vertical-align: middle;
}
.handsontable table.htCore tbody tr th {
  vertical-align: middle;
}
.htContextMenu .wtHider table tbody tr td {
  line-height: 30px;
}
.handsontable td.area:before {
  opacity: 0.5;
}
.handsontable td.area:before,
.handsontable td.area-1:before,
.handsontable td.area-2:before,
.handsontable td.area-3:before,
.handsontable td.area-4:before,
.handsontable td.area-5:before,
.handsontable td.area-6:before,
.handsontable td.area-7:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  bottom: -100%\9; /* Fix for IE9 to spread the ":before" pseudo element to 100% height of the parent element */
  /*background: #005eff;*/
  background: #d5d4d5;
}
</style>
