<!-- 弹窗表格选择企业 -->
<template>
  <div>
    <el-tooltip effect="dark" placement="top-start" :disabled="labelModel.length < 9" :content="labelModel">
      <el-input v-model="labelModel" readonly class="z-pointer" :size="size">
        <el-button slot="append" :size="size" @click="openDialog()">
          <i class="fas fa-th-list"></i>
        </el-button>
      </el-input>
    </el-tooltip>
    <!-- 弹窗 -->
    <dialog-modal ref="dialog" :title="title" @close="closeDialog" append-to-body scrollbar>
      <el-form inline :model="queryForm">
        <el-form-item label="企业名称：" v-if="type=== 'ps'">
          <el-input v-model="queryForm.psName" clearable @keyup.enter.native="getItemList()">
          </el-input>
        </el-form-item>
        <el-form-item label="岗位名称：" v-if="type === 'job'">
          <el-input v-model="queryForm.postName" clearable @keyup.enter.native="getItemList()"></el-input>
        </el-form-item>
        <el-form-item label="人员名称：" v-if="type === 'pe'">
          <el-input v-model="queryForm.name" clearable @keyup.enter.native="getItemList()"></el-input>
        </el-form-item>
        <el-form-item label="车间名称：" v-if="type === 'ws'">
          <el-input v-model="queryForm.departmentName" clearable @keyup.enter.native="getItemList()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="type !== 'dp'" icon="fas fa-search" @click="getItemList">查 询</el-button>
        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <el-table border height="70vh" highlight-current-row v-loading="loading" :data="itemList">
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column align="center" label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-check" @click="onClickCheck(scope.row)">确认</el-button>
          </template>
        </el-table-column>
        <!-- 企业 -->
        <el-table-column v-if="type === 'ps'" property="psName" label="企业名称" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="type === 'ps'" property="socialCreditCode" label="社会信用代码" min-width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="type === 'ps'" property="regionName" label="行政区域" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <!-- 岗位 -->
        <el-table-column v-if="type == 'job'" property="postName" label="岗位名称" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="type == 'job'" property="parentName" label="上级岗位" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="type == 'job'" property="orgName" label="所属机构" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <!-- 人员 -->
        <el-table-column v-if="type == 'pe'" property="name" label="人员名称" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="type == 'pe'" property="jobLevel" label="职级职位" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="type == 'pe'" property="mobilePhone" label="手机号" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <!-- 部门 -->
        <el-table-column v-if="type == 'dp'" property="deptName" label="部门名称" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="type == 'dp'" property="deptCode" label="部门编码" min-width="160" show-overflow-tooltip>
        </el-table-column>
        <!-- 车间 -->
        <el-table-column v-if="type == 'ws'" property="departmentName" label="车间名称" min-width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="type == 'ws'" property="code" label="车间编码" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="type == 'ws'" property="explain" label="车间说明" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <paging-query v-if="type !== 'dp'" :pager="pager" @query="getItemList" />
    </dialog-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'SelectInfoTable',
  // 设置绑定参数
  model: {
    event: 'selected',
  },
  props: {
    value: String,
    // 组件大小, 可选 large、small、mini
    size: {
      type: String,
      required: false,
      default: 'mini',
    },
    // 弹窗标题
    title: {
      type: String,
      required: true,
      default: '企业选择',
    },
    // 类型
    type: {
      type: String,
      required: true,
      default: 'ps', // ps企业  dp部门  job岗位  pe人员 ws车间
    },
    // 是否只读
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 显示值
    label: {
      type: String,
      required: false,
      default: '',
    },
    // 是否传psId作为条件
    isPsId: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      labelModel: '',        // 显示值
      queryForm: {
        orgGuid: this.$store.state.auth.user.orgGuid,
        orgId: this.$store.state.auth.user.orgGuid,
        psId: this.$store.state.auth.user.orgGuid,
        psName: '', // 企业名称
        postName: '', // 岗位名称
        name: '', // 人员名称
        departmentName: '', // 车间名称
      },
      // 接口地址
      urls: new Map([
        ['ps', 'bas/psBaseInfo'],
        ['job', 'sinoyd-frame/sys/posts/list'],
        ['pe', 'bas/personInfo'],
        ['ws', 'bas/psDepartment'],
        ['dp', `sinoyd-wrybase/sys/department/guid/${this.$store.state.auth.user.orgGuid}`],
        ['default', 'bas/psBaseInfo'],
      ]),
      // 查询条件
      queryMap: new Map([
        ['ps', () => ({
          psName: this.queryForm.psName, // 企业名称
          page: this.pager.page, // 分页
          rows: this.pager.rows,
        })],
        ['job', () => ({
          pageNo: this.pager.page, // 分页
          pageSize: this.pager.rows,
          orgGuid: this.isPsId ? this.$store.state.auth.user.orgGuid : '', // 企业id
          postName: this.queryForm.postName,
        })],
        ['pe', () => ({
          name: this.queryForm.psName, // 企业名称
          page: this.pager.page,
          rows: this.pager.rows,
          orgId: this.isPsId ? this.$store.state.auth.user.orgGuid : '',
        })],
        ['ws', () => ({
          departmentName: this.queryForm.departmentName, // 车间名称
          page: this.pager.page,
          rows: this.pager.rows,
          psId: this.isPsId ? this.$store.state.auth.user.orgGuid : '',
        })],
        ['dp', () => ({
        })],
        ['default', () => ({
          psName: this.queryForm.psName,
          page: this.pager.page,
          rows: this.pager.rows,
        })],
      ]),
      // 页面显示值
      labelMap: new Map([
        ['ps', row => row.psName],
        ['job', row => row.postName],
        ['pe', row => row.name],
        ['ws', row => row.departmentName],
        ['dp', row => row.deptName],
        ['default', row => row.psName],
      ]),
      itemList: [],
      pager: {            // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  mounted() {
    this.labelModel = this.value ? this.label : '';
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    openDialog() {
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 获取选项数据
    getItemList() {
      this.loading = true;
      const url = this.urls.get(this.type);
      const queryMapFun = this.queryMap.get(this.type);
      const queryMap = queryMapFun.call(this);
      this.$http.get(url, {
        params: { ...queryMap },
      }).then((response) => {
        if (this.type === 'dp') {
          this.itemList = response.data;
        } else if (response.data.success) {
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
    onClickCheck(row) {
      this.$emit('selectRow', row);
      const urlabelMap = this.labelMap.get(this.type);
      this.labelModel = urlabelMap.call(this, row);
      this.$emit('selected', this.labelModel);
      this.closeDialog();
    },
  },
};
</script>
