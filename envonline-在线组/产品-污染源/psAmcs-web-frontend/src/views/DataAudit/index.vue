<template>
  <!-- 数据审核页面 -->
  <div class="data-audit">
    <el-card v-show="!isShowDetail" class="card-left" id="data-audit-left-card">
      <div slot="header">
        <div style="float:left">
          <el-input
            placeholder="污染源名称、站点名称（回车检索）"
            v-model="key"
            clearable
            style="width:305px;margin-right: 10px"
            v-show="leftCardData.isFold"
            @keyup.enter.native="keySearch()"
          >
            <!-- <i slot="prefix" class="el-input__icon el-icon-search"></i> -->
            <el-button slot="append" icon="el-icon-search" @click="keySearch()"></el-button>
          </el-input>
        </div>
        <div style="display:inline-block;height:30px;padding-top:3px">
          <button class="flod-btn" @click="changeFlod()">
            <i :class="`fas fa-${leftCardData.isFold ? 'out' : 'in'}dent`"></i>
          </button>
        </div>
      </div>
      <!-- 菜单 -->
      <el-menu v-if="leftCardData.isFold" default-active="1" mode="horizontal" @select="changeMenu">
        <el-menu-item index="1">按区域</el-menu-item>
        <el-menu-item index="2">按类型</el-menu-item>
      </el-menu>
      <!-- 站点树 -->
      <el-tree
        ref="tree"
        v-show="leftCardData.isFold"
        v-loading="treeLoading"
        :data="leftCardData.treeList"
        show-checkbox
        node-key="id"
        :render-content="renderContent"
        style="height:calc(100% - 40px);padding-left: 5px;padding-top: 10px"
      ></el-tree>
    </el-card>
    <el-card v-show="!isShowDetail" class="card-right" id="data-audit-right-card">
      <div slot="header">
        <el-form :model="queryForm" inline>
          <el-form-item label="时间：">
            <el-date-picker
              style="width:140px"
              v-model="rightCardData.fromDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :editable="false"
            ></el-date-picker>&nbsp;~
            <el-date-picker
              style="width:140px"
              v-model="rightCardData.toDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          </el-form-item>
          <span style="float:right;line-height: 30px">
            <!-- <span>图例：</span> -->
            <el-tag type="danger">待人工审核</el-tag>
            <el-tag type="success" style="margin: 0 5px">自动审核通过</el-tag>
            <el-tag>人工审核通过</el-tag>
          </span>
        </el-form>
      </div>
      <!-- 列表 -->
      <el-table
        border
        highlight-current-row
        height="calc(100% - 30px)"
        v-loading="loading"
        :data="itemList"
        :row-class-name="rowClassName"
      >
        <el-table-column
          align="center"
          label="No."
          width="50"
          type="index"
          :index="index"
          :fixed="isFixed"
        ></el-table-column>
        <el-table-column
          label="区域"
          prop="regionName"
          width="100"
          show-overflow-tooltip
          :fixed="isFixed"
        ></el-table-column>
        <el-table-column
          label="污染源名称"
          prop="psName"
          min-width="200"
          show-overflow-tooltip
          :fixed="isFixed"
        ></el-table-column>
        <el-table-column
          label="站点名称"
          prop="portName"
          min-width="200"
          show-overflow-tooltip
          :fixed="isFixed"
        ></el-table-column>
        <el-table-column
          align="center"
          :prop="item.prop"
          :label="item.label"
          :key="i"
          width="70"
          v-for="(item,i) in fixedColumn"
        >
          <template slot-scope="scope">
            <div
              v-show="scope.row[item.prop]>=0"
              :class="['color-btn', `color${scope.row[item.prop]}`]"
              @click="auditClick(scope, item.prop)"
            ></div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="90">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="fas fa-file-invoice"
              @click="auditClick(scope, '', true)"
            >批量审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <paging-query :pager="pager" @query="getItemList" />
    </el-card>
    <!-- 详情页面 -->
    <data-audit-detail ref="detail" @close="showMain" v-show="isShowDetail"></data-audit-detail>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getDay, dateFormat, addDateTime } from '@/libs/tools';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DataAuditDetail from './components/Detail';

export default {
  name: 'DataAudit',
  components: {
    DataAuditDetail,
  },
  mixins: [queryList],
  data() {
    return {
      // 左侧card数据源
      leftCardData: {
        treeList: [],
        isFold: true, // 是否展开
      },
      key: '',
      rightCardData: {
        fromDate: getDay(-6, true, false),
        toDate: getDay(0, true, false),
        portIds: [],
        isAll: false,
        portType: '',
        childPortTypes: '',
      },
      fixedColumn: [], // 动态列名
      isFixed: true, // 是否启用固定列
      isShowDetail: false, // 控制详情页面隐藏显示
      activeIndex: '1', // 当前打开的菜单索引
      treeLoading: false,
    };
  },
  created() {
    this.getTreeDataByRegion();
    document.onkeyup = (e) => {
      if (e.keyCode === 27 && this.$route.path === '/DataAudit' && this.isShowDetail) {
        this.isShowDetail = false;
      }
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType, // 1 废水 2 废气
    }),
  },
  watch: {
    // key() {
    //   this.keySearch();
    // },
  },
  methods: {
    // 左侧card折叠展开(是否改变)
    changeFlod() {
      this.leftCardData.isFold = !this.leftCardData.isFold;
      if (this.leftCardData.isFold) { // 展开
        document.getElementById('data-audit-left-card').style.width = '350px';
        document.getElementById('data-audit-right-card').style.width = 'calc(100% - 360px)';
      } else { // 收缩
        document.getElementById('data-audit-left-card').style.width = '35px';
        document.getElementById('data-audit-right-card').style.width = 'calc(100% - 45px)';
      }
    },
    // 查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取列表数据
    getItemList() {
      // 获取动态列名
      this.toFixedColumn();
      // 获取
      this.loading = true;
      // this.isFixed = false;
      if (this.$refs.tree) {
        // 节点全选状态会传id，可能企业id和区域id会误传，但不影响使用
        this.rightCardData.portIds = this.$refs.tree.getCheckedKeys();
      }
      const { page, rows } = this.pager;
      const url = 'audit/statusForDay';
      const sort = 'regionName+,psName+,portName+';
      const queryForm = { ...this.rightCardData };
      queryForm.isAll = queryForm.portIds.length === 0;
      queryForm.portType = this.amcsType;
      queryForm.childPortTypes = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
      this.$http.post(url, queryForm, {
        params: { page, rows, sort },
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
        // this.isFixed = true;
        this.loading = false;
      });
    },
    // 周一到周日列名和code
    toFixedColumn() {
      this.fixedColumn = [];
      const dtB = this.rightCardData.fromDate;
      const dtE = this.rightCardData.toDate;
      const countDay = (new Date(dtE) - new Date(dtB)) / 1000 / 3600 / 24 + 1;
      for (let i = 0; i < countDay; i++) {
        const d = addDateTime(new Date(this.rightCardData.fromDate), i);
        this.fixedColumn.push({
          prop: dateFormat(d, 'Y-m-d'),
          label: dateFormat(d, 'm-dl'),
        });
      }
    },
    // 详情页面返回
    showMain() {
      this.isShowDetail = false;
      this.getItemList();
    },
    // 获取区域树
    getTreeDataByRegion() {
      const queryForm = {
        portType: this.amcsType,
        childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType),
        key: this.key,
      };
      const sort = 'psName+,portType+,portName+';
      this.treeLoading = true;
      this.$http.post('bas/portInfo/queryAuthorityTree', queryForm, {
        params: { sort },
      }).then((response) => {
        if (response.data.success) {
          const temp = response.data.data;
          const temp2 = [...this.buildTree(this.getPortChildren(temp))];
          const temp3 = this.mixRegionAndPort(temp2);
          this.leftCardData.treeList = temp3;
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
        this.treeLoading = false;
      });
    },
    // 获取类型树
    getTreeDataByType() {
      // 获取站点类型
      this.treeLoading = true;
      this.$http.get(`sys/enumCode/child/PortType/${this.$enum.getLabel('LABEL_CODE', this.amcsType)}`, {
        params: {},
      }).then((response) => {
        // 获取站点信息
        this.getUserPort(response.data.filter(p => p.dictName !== '留样')); // 排除留样
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取用户站点
    getUserPort(portTypeList) {
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES', this.amcsType),
          portType: this.amcsType,
          key: this.key,
          sort: 'regionName+,psName+,portName+',
        },
      }).then((response) => {
        if (response.data.success) {
          // 构造树结构
          const data = [];
          portTypeList.forEach((item) => {
            const obj = {
              id: item.rowGuid,
              label: item.dictName,
              children: [],
            };
            const temp = response.data.data.filter(p => p.childPortType.toString() === item.dictValue);
            temp.forEach((item2) => {
              obj.children.push({
                id: item2.id,
                label: item2.portName,
                children: [],
              });
            });
            data.push(obj);
          });
          this.leftCardData.treeList = data;
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
        this.treeLoading = false;
      });
    },
    // 切换菜单
    changeMenu(index) {
      // 初始化数据
      this.leftCardData.treeList = [];
      this.key = '';
      this.activeIndex = index;
      if (index === '1') {
        this.getTreeDataByRegion();
      } else {
        this.getTreeDataByType();
      }
    },
    // 关键字查询
    keySearch() {
      this.leftCardData.treeList = [];
      if (this.activeIndex === '1') {
        this.getTreeDataByRegion();
      } else {
        this.getTreeDataByType();
      }
    },
    // 审核按钮(行数据，日期, 是否批量审核)
    auditClick(scope, date, isMore = false) {
      const { row } = scope;
      const index = scope.$index + 1;
      const detailModel = {
        date: [],
        portId: row.portId,
        portType: row.portType.toString(), // 排口大类
        childPortType: row.childPortType.toString(), // 排口小类
        portName: row.portName,
        psId: row.psId,
        psName: row.psName,
        regionCodeId: row.regionCodeId,
        regionName: row.regionName,
        currentNo: index + this.pager.rows * (this.pager.page - 1),
        portIds: this.rightCardData.portIds, // 上一个站点下一个站点要用
      };
      if (isMore) {
        // 批量审核 获取待审核的日期
        const keys = Object.keys(row).filter(p => p.includes('-')); // 获取日期列名
        keys.forEach((item) => {
          if (row[item] === this.$enum.getValue('AUDITSTATUS', '待人工审核')) {
            detailModel.date.push(item);
          }
        });
        if (!detailModel.date.length) {
          this.$message({
            type: 'warning',
            message: '当前数据行不存在 待人工审核 的记录',
            showClose: true,
          });
          return;
        }
        detailModel.date.sort(); // 时间升序
      } else {
        detailModel.date.push(date);
      }
      this.$refs.detail.loadData(detailModel);
      this.isShowDetail = true; // 显示详情页面
    },
    getPortChildren(portArr) {
      const arr = [...portArr];
      arr.forEach((element) => {
        if (element.psInfo) { // 一级菜单
          this.$set(element, 'id', element.rowGuid);
          this.$set(element, 'label', element.areaName);
          this.$set(element, 'children', element.psInfo);
          element.psInfo.forEach((ele) => { // 二级菜单
            if (ele.portInfo) {
              this.$set(ele, 'id', ele.psId);
              this.$set(ele, 'label', ele.psName);
              this.$set(ele, 'children', ele.portInfo);
              // ele.label = ele.psName;
              // ele.children = ele.portInfo;
              ele.portInfo.forEach((e) => {
                e.label = `${e.portName}`;
              });
            }
          });
        }
      });
      return arr;
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n.parentId === parentId) {
            temp.push(n);
            n.regions = fa(n.rowGuid);
          }
        }
        return temp;
      };
      return fa(id);
    },
    // 将排口与行政区域合在一起
    mixRegionAndPort(data) {
      const fa = (list) => {
        list.forEach((element) => {
          if (element.regions.length !== 0) {
            element.children.push(...element.regions);
            fa(element.regions);
          }
        });
        return list;
      };
      return fa(data);
    },
    // 树节点渲染函数
    renderContent(h, { node, store }) {
      return (
        <div class="node-item" ondblclick={event => this.ondblclick(node, store, event)}>
          <span class="el-tree__icon">
            <i v-show={node.isLeaf} class="fas fa-file" />
            <i v-show={!node.isLeaf} class={`fas fa-${node.expanded ? 'folder-open' : 'folder'}`} />
            <span>{node.label}</span>
          </span>
        </div>
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.data-audit {
  .card-left {
    background-color: #f5f7fa;
    width: 350px;
    float: left;
    margin-right: 10px;
    .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
    .el-tree {
      background-color: #f5f7fa;
      overflow: auto;
    }
  }
  .card-right {
    float: left;
    width: calc(100% - 360px);
    .color-btn {
      width: 24px;
      height: 24px;
      margin: 0 auto;
      border-radius: 50%;
      cursor: pointer;
    }
    .color-btn:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      opacity: 0.9;
    }
    .color2 {
      background-color: #409eff;
    }
    .color1 {
      background-color: #67c23a;
    }
    .color0 {
      background-color: #f56c6c;
    }
  }
  .flod-btn {
    font-size: 16px;
    color: #808695;
    cursor: pointer;
    line-height: 30px;
  }
}
</style>
