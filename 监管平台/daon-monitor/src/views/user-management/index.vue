<template>
  <container class="Page-UserManagement">

    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <a-row :gutter="10">
      <a-col :span="16">
        <search-extend>

          <!-- 检索表单 -->
          <template v-slot:right>
            <a-form layout="inline">
              <a-form-item>
                <a-input
                  allowClear
                  ref="input"
                  v-model="queryForm.key"
                  style="width: 200px" placeholder="请输入用户名称/中文名称">
                  <!-- <a-icon slot="prefix" type="search"></a-icon> -->
                </a-input>
              </a-form-item>
              <a-form-item class="mar-r-0">
                <a-input-search
                  ref="input"
                  allowClear
                  v-model="queryForm.mobile"
                  @search="onQueryList"
                  style="width: 220px" placeholder="请输入手机号码">
                  <a-icon slot="prefix" type="search"></a-icon>
                  <a-button slot="enterButton" title="查询">
                    <a-icon type="search"></a-icon>
                  </a-button>
                </a-input-search>
              </a-form-item>
            </a-form>
          </template>
        </search-extend>
        <a-card :bordered="false">

          <!-- 列表 -->
          <a-table
            class="mar-t-table"
            rowKey="id"
            size="middle"
            :loading='loading'
            :columns='columns'
            :dataSource='itemList'
            :pagination="pagination"
            @change="_change"
          >
            <template slot="nameSlot" slot-scope="text">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ text }}</span>
                </template>
                <span>{{ text }}</span>
              </a-tooltip>
            </template>
            <template slot="roleSlot" slot-scope="text">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ text }}</span>
                </template>
                <span>{{ text }}</span>
              </a-tooltip>
            </template>
            <template slot="operation" slot-scope="text, record">
              <!-- <a @click="onConfigRole(record)" style="margin-right:10px"><a-icon type="user"></a-icon> 角色</a> -->
              <a-button type="primary" @click="onConfigRole(record)" title="角色">
                <a-icon type="user"></a-icon>
              </a-button>
              <a-button type="primary" @click="onConfigAuthority(record)" title="权限">
                <a-icon type="idcard"></a-icon>
              </a-button>
              <!-- <a @click="onConfigAuthority(record)"><a-icon type="idcard"></a-icon> 权限</a> -->
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" style="height: 655px">
          <div class="invite-wrapper wrapper">
            <div class="invite-title title">邀请他人加入</div>
            <div class="invite-content">
              <p style="line-height: 30px;">
                可以将本机构代码
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    <span>点击复制</span>
                  </template>
                  <span @click="codeClick(code)">{{code}}</span>
                </a-tooltip>
                告诉他人，让他们输入该编码申请加入
              </p>
            </div>
          </div>
          <div class="apply-wrapper wrapper">
            <div class="apply-title title">
              <span>申请加入记录</span>
              <span class="history-title" @click="onHistoryClick">历史记录</span>
            </div>
            <a-spin :spinning="historySpin">

            </a-spin>
            <div class="apply-content" v-if="recordList.length !== 0">
              <div class="recode_txt" v-for="(item, index) in recordList" :key="index">
                <span style="float: left;" :title="`${item.userName} 于 ${item.operatedAt} 申请加入${item.relatedName}`">
                  {{index + 1}}. {{item.userName}} 于 {{item.operatedAt}} 申请加入{{item.relatedName}}</span>
                <a-button v-if="!item.status" size="small" type="primary" @click="revLication(item.id, 2)">同意</a-button>
                <a-button v-if="!item.status" size="small" type="danger" @click="revLication(item.id, 1)">拒绝</a-button>
              </div>
            </div>
            <div class="empty-apply-content" v-else>暂无数据</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <DialogRole ref="dialogRole" @refreshList="getItemList"></DialogRole>
    <DialogAuthority ref="dialogAuthority"></DialogAuthority>
    <DialogHistory ref="dialogHistory"></DialogHistory>
  </container>
</template>

<script>
import DialogRole from './components/DialogRole';
import DialogAuthority from './components/DialogAuthority';
import DialogHistory from './components/DialogHistory';
import {
  emptyQuery, getList, getCode, getApply, revlicate,
} from '@/api/modules/user-management.js';
import { queryTest } from '@/mixins';

export default {
  name: '',
  components: {
    DialogRole,
    DialogAuthority,
    DialogHistory,
  },
  mixins: [queryTest],
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      historySpin: false,
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1 + (this.queryForm.page - 1) * this.queryForm.rows}`,
        },
        {
          title: '用户名称',
          dataIndex: 'userName',
          key: 'userName',
          width: 120,
          scopedSlots: { customRender: 'nameSlot' },
        },
        {
          title: '中文名称',
          dataIndex: 'name',
          key: 'name',
          width: 120,
        },
        {
          title: '手机号码',
          dataIndex: 'mobile',
          key: 'mobile',
          width: 120,
        },
        {
          title: '邮箱地址',
          dataIndex: 'email',
          key: 'email',
          width: 150,
        },
        {
          title: '用户角色',
          dataIndex: 'roleStr',
          key: 'roleStr',
          width: 150,
          scopedSlots: { customRender: 'roleSlot' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      itemList: [],
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '15', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
      },
      code: '',
      recordList: [],
      getList,
      queryForm: emptyQuery(),
    };
  },
  methods: {
    // 审核申请事件
    revLication(id, status) {
      revlicate(id, status).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 1.5);
          this.getItemList();
          this.getApplyList();
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    // 角色点击事件
    onConfigRole(row) {
      this.$refs.dialogRole.openDialog(row);
    },
    // 权限点击事件
    onConfigAuthority(row) {
      this.$refs.dialogAuthority.openDialog(row);
    },
    onHistoryClick() {
      this.$refs.dialogHistory.openDialog();
    },
    // 获取信用代码
    getCode() {
      getCode().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.code = response.data.data.idCode;
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
    },
    // 获取申请列表
    getApplyList() {
      this.historySpin = true;
      getApply().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.recordList = response.data.data;
        } else {
          this.$message.warning(response.data.msg, 3);
        }
        this.historySpin = false;
      });
    },
    // 信用代码复制事件
    codeClick(code) {
      const input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', code);
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, 9999);
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        this.$message.success('复制成功！', 1.5);
      }
      document.body.removeChild(input);
    },
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.getItemList();
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
  },
  created() {
    this.getItemList();
    this.getCode();
    this.getApplyList();
  },
};
</script>
<style lang="scss" scoped>
.Page-UserManagement{
  .wrapper{
    border: 1px solid #CCCCCC;
    .title{
      height: 40px;
      width: 100%;
      color: #669FC7;
      padding-left: 20px;
      line-height: 40px;
      background: #F8F8F8;
      border-bottom: 1px solid #DDDDDD;
    }
    .history-title{
      float: right;
      margin-right: 20px;
      cursor: pointer;
      color: #409eff;
    }
  }
  .wrapper.invite-wrapper{
    margin-top: 5px;
    .invite-content{
      height: 60px;
      width: 100%;
      padding: 0 20px;
      line-height: 60px;
      overflow: hidden;
      span{
        color: #C7254E;
        cursor: pointer;
        user-select: none;
      }
    }
  }
  .wrapper.apply-wrapper{
    margin-top: 20px;
    height: 523px;
    overflow-y: auto;
    .apply-content{
      width: 100%;
      padding-left: 20px;
      .recode_txt:first-child{
        margin-top: 5px;
      }
      .recode_txt{
        width: 100%;
        line-height: 25px;
        margin-bottom: 5px;
        span{
          width: calc(100% - 110px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .empty-apply-content{
      height: 400px;
      line-height: 400px;
      text-align: center;
    }
  }
}
</style>
