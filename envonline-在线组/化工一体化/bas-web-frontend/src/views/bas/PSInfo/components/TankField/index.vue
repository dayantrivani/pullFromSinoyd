<!-- 详细--罐体信息 -->
<template>
  <el-card type="title">
    <!-- 标题内容 -->
    <template slot="header">罐区信息</template>

    <!-- 检索条件 -->
    <div class="mar-t-xs mar-l-sm">
      <el-form :model="queryForm" inline>
        <!-- <el-form-item v-if="userType === 'gov'" label="企业名称：">
          <el-select v-model="queryForm.psId" style="width: 250px">
            <el-option
              v-for="(item, index) in psInfoList"
              :key="index"
              :label="item.psName"
              :value="item.psId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="罐区名称：">
          <el-input v-model="queryForm.tfName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <hr>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 109px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="95">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary">更多
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-hockey-puck" @click="onClickCg(scope.row)">储罐</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-video" @click="onClickSxt(scope.row)">摄像头</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="warning" icon="fas fa-cog" @click="onClickFactor(scope.row)">监控气体</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="tfName" label="罐区名称" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column property="tfCode" label="罐区编码" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="isMajorHazards" label="是否重大污染源" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.isMajorHazards ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column property="longitude" label="罐区经度" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="latitude" label="罐区纬度" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="tfAddress" label="罐区地址" width="164" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialogform" @query="getItemList" />
    <dialog-tank ref="dialogtank" />
    <dialog-supervision ref="dialogsupervision" @query="getItemList" />
    <dialog-item ref="dialogitem" />
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import DialogTank from './components/DialogTank';
import DialogSupervision from './components/DialogSupervision';
import DialogItem from './components/DialogItem';

export default {
  name: 'TankField',
  mixins: [
    deleteItem,
  ],
  components: {
    DialogForm,
    DialogTank,
    DialogSupervision,
    DialogItem,
  },
  data() {
    return {
      url: 'keypoints/tankFarmInfo',
      // 检索表单项数据源
      queryForm: {
        psId: '',                       // 企业id值
        tfName: '',                     // 罐区名称 模糊查询
      },
      // 列表数据源
      itemList: [],
      loading: false,     // 数据列表加载状态
      // 企业数据源
      psInfoList: [],
      selected: [],       // 已选择的数据对象
      selectedIds: [],    // 已选择的数据 id 数组
      selectedIndexs: [], // 已选择的数据的索引
      pager: {            // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  computed: {
    psInfo() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo || JSON.parse(window.sessionStorage.getItem('psInfo'));
    },
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  watch: {
    itemList() {
      this.selectedIndexs = [];
    },
  },
  created() {
    this.onQueryList();
  },
  methods: {
    // 当选择项发生变化时会触发该事件
    onChangeSelected(option) {
      this.selected = option;
      this.selectedIds = option.map(val => val.id);
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    onChangeCheck(selection, row) {
      const rowindex = this.itemList.findIndex(v => v === row);
      const index = this.selectedIndexs.findIndex(v => v === rowindex);
      if (index !== -1) {
        this.selectedIndexs.splice(index, 1);
      } else {
        this.selectedIndexs.push(rowindex);
      }
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    onChangeCheckAll(selection) {
      const len = selection.length;
      const all = [];
      if (len) {
        for (let i = 0; i < len; i++) { all.push(i); }
      }
      this.selected = selection;
      this.selectedIndexs = all;
    },
    rowClassName({ rowIndex }) {
      const className = 'selected-row';
      return this.selectedIndexs.includes(rowIndex) ? className : '';
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },

    // 新增（弹出框——新增编辑弹框）
    onClickAdd() {
      this.$refs.dialogform.openDialog();
    },
    // 编辑（弹出框——新增编辑弹框）
    onClickEdit(row) {
      this.$refs.dialogform.openDialog(row);
    },

    // 储罐（弹出框——储罐弹框）
    onClickCg(row) {
      this.$refs.dialogtank.openDialog(row);
    },

    // 摄像头（弹出框——摄像头弹框）
    onClickSxt(row) {
      this.$refs.dialogsupervision.openDialog(row);
    },

    // 检测因子
    onClickFactor(row) {
      this.$refs.dialogitem.openDialog(row);
    },
    // 获取所有的企业
    // getPsInfoList() {
    //   this.$http.get('bas/psBaseInfo', {
    //     params: {
    //       psType: -1,
    //       psName: '',
    //       industryTypeCodeId: '',
    //       regionCodeId: '',
    //       attentionDegree: '',
    //       psBaseInfoType: '',
    //     },
    //   }).then((response) => {
    //     this.psInfoList = response.data.data;
    //   });
    // },
    // 获取列表数据
    getItemList() {
      if (this.userType === 'gov') {
        this.queryForm.psId = this.psInfo.id;
      } else {
        this.queryForm.psId = this.orgGuid;
      }
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post('keypoints/tankFarmInfo/find', this.queryForm, {
        params: { page, rows, sort: 'tfCode-' },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
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
  },
};
</script>
