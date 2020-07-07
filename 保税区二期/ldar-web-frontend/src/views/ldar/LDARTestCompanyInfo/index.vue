y
<template>
  <div>
    <el-card>
      <div slot="header"
           class="clearfix">
        <el-form inline
                 :model="queryForm">
          <el-form-item label="检测机构名称：">
            <el-input clearable
                      v-model="queryForm.name"></el-input>
          </el-form-item>
          <el-form-item label="当前状态：">
            <el-select v-model="queryForm.status"
                       clearable>
              <el-option v-for="(item, index) in $enum.testCompanyStatus"
                         :key="index"
                         :label="item"
                         :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       icon="fas fa-search"
                       @click="onQueryList">查 询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="mar-l-sm mar-y-xs">
        <el-button type="primary"
                   icon="fas fa-plus"
                   @click="addDialog()"
                   aria-hidden="true">新 增</el-button>
        <el-button type="danger"
                   icon="fas fa-trash-alt"
                   @click="onDeleteItem()">删 除</el-button>
      </div>
      <el-table :data="itemList"
                border
                highlight-current-row
                height="calc(100% - 70px)"
                @select="onChangeCheck"
                v-loading="loading"
                @select-all="onChangeCheckAll"
                @selection-change="onChangeSelected">
        <el-table-column type="selection"
                         width="55"></el-table-column>
        <el-table-column align="center"
                         type="index"
                         width="50"
                         label="No."></el-table-column>
        <el-table-column align="center"
                         label="操作"
                         width="166">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="fas fa-pencil-alt"
                       @click="onClickEdit(scope.row)">编辑</el-button>
            <el-button type="primary"
                       icon="fas fa-file-invoice"
                       @click="onClickInfo(scope.row)">认证</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left"
                         width="200"
                         prop="name"
                         label="机构名称"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:red"
                  v-if="scope.row.isDeleted">{{scope.row.isDeleted === true?'(已删除)':''}}</span>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column align="left"
                         width="150"
                         prop="shortName"
                         label="检测机构短称"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="left"
                         width="180"
                         prop="organizationalCode"
                         label="组织机构代码"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         width="100"
                         prop="status"
                         label="当前状态"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{$enum.testCompanyStatus[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="contactMan"
                         label="联系人"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="contactMobile"
                         label="联系电话"
                         show-overflow-tooltip></el-table-column>
      </el-table>
      <paging-query :pager="pager"
                    @query="getItemList" />
    </el-card>
    <check-dialog ref="checkdialog"
                  @query="getItemList" />
    <dialog-form ref="dialog"
                 @query="getItemList" />
  </div>
</template>

<script>
import { queryList, deleteItem } from '@/libs/mixins';
import DialogForm from './components/DialogForm';
import CheckDialog from './components/CheckDialog';

export default {
  name: 'LDARTestCompanyInfo',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
    CheckDialog,
  },
  data() {
    return {
      url: 'ldar/testingCompanyInfo',
      itemList: [],
      queryForm: {
        name: '',
        belongYear: '',
        sort: 'status+,name',
      },
    };
  },
  methods: {
    // 单机新增回调
    addDialog() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    onClickInfo(row) {
      this.$refs.checkdialog.openDialog(row);
    },
  },
};
</script>
