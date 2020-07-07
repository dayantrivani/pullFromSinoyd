<!-- 详细--罐体信息 -->
<template>
  <el-card type="title">
    <!-- 标题内容 -->
    <template slot="header">罐体信息</template>
    <!-- 检索条件 -->
    <el-form v-if="userType === 'gov'" inline :model="queryForm" class="mar-x-sm mar-t-xs">
      <el-form-item v-if="userType === 'gov'" label="关键字：">
        <el-input
          v-model="queryForm.name"
          clearable
          style="width:200px"
          placeholder="装置名称、装置编号">
          <!-- @keyup.enter.native="onQueryList()"> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="userType === 'gov'" type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
      </el-form-item>
    </el-form>
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
      :height="`calc(100% - ${userType === 'gov' ? '108px' : '70px'})`"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="145">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="warning" icon="fas fa-cog" @click="onClickFactor(scope.row)">监控参数</el-button>
        </template>
      </el-table-column>
      <el-table-column property="stName" label="装置名称" min-width="120" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column property="dgiMn" label="MN号" width="130" show-overflow-tooltip></el-table-column> -->
      <el-table-column property="tfName" label="所属罐区" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="stCode" label="装置编号" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="stContent" label="装置内容" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column property="safeDistance" label="安全距离（米）" width="120"></el-table-column>
      <el-table-column property="maximumStorage" label="最大存储量（立方米）" width="164"></el-table-column>
      <el-table-column label="是否为重大危险源" min-width="135" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.isMajorHazards ? '是' : '否'}}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialogform" @query="getItemList" />
    <dialog-item ref="dialogitem" @query="getItemList" />
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';
import DialogItem from './components/DialogItem';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'TanksInfo',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
    DialogItem,
  },
  data() {
    return {
      url: 'keyPoints/storageTankInfo',
      queryForm: {
        name: '',
      },
      itemList: [],
    };
  },
  computed: {
    psInfo() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo || JSON.parse(window.sessionStorage.getItem('psInfo'));
    },
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    // this.getDictList();
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialogform.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialogform.openDialog(row);
    },
    // 单击监控因子
    onClickFactor(row) {
      this.$refs.dialogitem.openDialog(row);
    },
    // 删除按钮的回调
    callback() {
    },
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      // this.$set(this.queryForm, 'psId', this.psInfo.id);
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          psId: `${this.userType === 'gov' ? this.psInfo.id : this.orgGuid}`,
          name: this.queryForm.name,
        },
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
    // 获取字典表数据
    // getDictList() {
    //   Object.keys(this.dict).forEach(((key) => {
    //     this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
    //       this.dict[key] = val;
    //     });
    //   }));
    // },
    // onClickInfo() {
    //   this.$router.push({ name: 'details' });
    // },
  },
};
</script>
