<template>
  <div class="fill-h">
    <el-card v-if="userType === 'gov'">

      <!-- 查询表单 -->
      <template slot="header">
        <el-form inline :model="queryForm">
          <el-form-item label="监管级别：">
            <el-select clearable v-model="queryForm.attentionDegree">
              <el-option
                v-for="(item, index) in $enum.AttentionDegreeList"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业类型：">
            <el-select clearable v-model="queryForm.psBaseInfoType">
              <el-option
                v-for="(item, index) in $enum.psTypeList"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业类别：">
            <el-select
              style="width: 150px;"
              filterable
              clearable
              v-model="queryForm.industryTypeCodeId"
              :loading="dictLoading"
              @visible-change="show => show && !dict.IndustryCategory.length && getDictList('IndustryCategory')">
              <el-option
                v-for="(item, index) in dict.IndustryCategory"
                :key="index"
                :label="item.dictName"
                :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行政区域：">
            <select-tree
              style="width: 140px;"
              lazy
              filterable
              joint
              root-key="0"
              v-model="queryForm.regionCodeId"
              :props="{ label: 'areaName' }"
              url="sys/area"
            ></select-tree>
          </el-form-item>
          <el-form-item label="企业名称：">
            <el-input
              v-model="queryForm.psName"
              clearable
              style="width:160px">
              <!-- @keyup.enter.native="onQueryList()"> -->
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
          </el-form-item>
        </el-form>
      </template>

      <!-- 操作按钮 -->
      <div class="mar-l-sm mar-y-xs">
        <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
        <el-button
          type="danger"
          icon="fas fa-trash-alt"
          :disabled="!selectedIds.length"
          @click="onClickRemove()">删 除
        </el-button>
      </div>

      <!-- 列表 -->
      <el-table
        border
        highlight-current-row
        height="calc(100% - 70px)"
        v-loading="loading"
        :data="itemList"
        :row-class-name="rowClassName"
        @select="onChangeCheck"
        @select-all="onChangeCheckAll"
        @selection-change="onChangeSelected">
        <el-table-column align="center" type="selection" width="36"></el-table-column>
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column align="center" label="操作" width="166">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
            <el-button type="primary" icon="fas fa-link" @click="onClickDoc(scope.row)">附件</el-button>
            <el-button type="primary" icon="fas fa-file-invoice" @click="onClickInfo(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column property="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column property="psShortName" label="企业简称" show-overflow-tooltip></el-table-column>
        <el-table-column property="attentionDegree" label="监管级别" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $enum.AttentionDegreeList[scope.row.attentionDegree] }}
          </template>
        </el-table-column>
        <el-table-column property="regionName" label="行政区域" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          property="industryTypeName"
          label="行业类别"
          min-width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="企业类型" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $enum.psTypeList[scope.row.psBaseInfoType] }}
          </template>
        </el-table-column>
        <el-table-column label="密钥" width="125">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.appSecret" effect="dark" :content="scope.row.appSecret" placement="top">
              <el-button type="text"  v-copy="scope.row.appSecret">复制密钥</el-button>
            </el-tooltip>
            <el-button type="text" @click="onCreateKey(scope.row)">
              {{ scope.row.appSecret ? '重新生成' : '生成密钥' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <paging-query :pager="pager" @query="getItemList"/>

      <!-- 弹出框 -->
      <dialog-form ref="dialog" @query="getItemList" />
      <doc-list ref="docList" />
      <select-reason ref="selectReason" @query="getItemList" />
    </el-card>
    <template v-else>
      <p-s-info class="fill-h"></p-s-info>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PSInfo from '@/views/bas/PSInfo';
import DialogForm from './components/DialogForm';
import SelectReason from './components/SelectReason';
import DocList from '@/components/DocList';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { copyText } from '@/libs/tools';

export default {
  name: 'PSList',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    PSInfo,
    DialogForm,
    SelectReason,
    DocList,
  },
  computed: mapGetters('auth', ['userType']),
  data() {
    return {
      url: 'bas/psBaseInfo',
      itemList: [],
      // 字典数据
      dict: {
        IndustryCategory: [],       // 行业类别
      },
      dictLoading: false,
      // 查询表单绑定变量
      queryForm: {
        psType: -1,
        psName: '',             // 企业名称
        industryTypeCodeId: '', // 行业类别
        regionCodeId: '',       // 行政区域
        attentionDegree: '',    // 关注程度
        psBaseInfoType: '',     // 企业类型
      },
    };
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    onClickDoc(row) {
      this.$refs.docList.openDialog(row.id);
    },
    onClickRemove() {
      this.$refs.selectReason.openDialog(this.selectedIds);
    },
    // 获取字典表数据
    getDictList(key) {
      this.dictLoading = true;
      this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
        this.dict[key] = val;
        this.dictLoading = false;
      });
    },
    onClickInfo(row) {
      this.$store.commit('SetPsInfo', row);
      this.$router.push({ name: 'PSInfo' });
    },
    onCreateKey(row) {
      if (row.appSecret) {
        this.$confirm('将重新生成密钥?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => (
          this.$http.post('bas/psBaseInfo/ldar', {}, { params: { psId: row.psId } })
        )).then((response) => {
          const key = response.data.data.dtoPSBaseInfoExtend.appSecret;
          if (key && copyText(key)) {
            this.$message.success('重新生成成功，已复制至剪切板');
          } else {
            this.$message.success('重新生成成功！');
          }
          this.getItemList();
        });
      } else {
        this.$http.post('bas/psBaseInfo/ldar', {}, {
          params: { psId: row.psId },
        }).then((response) => {
          const key = response.data.data.dtoPSBaseInfoExtend.appSecret;
          if (key && copyText(key)) {
            this.$message.success('生成成功，已复制至剪切板');
          } else {
            this.$message.success('生成成功！');
          }
          this.getItemList();
        });
      }
    },
  },
};
</script>
