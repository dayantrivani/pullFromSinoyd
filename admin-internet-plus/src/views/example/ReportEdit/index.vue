<!-- 应用 / 报告编制 -->

<template>
  <container fill :class="{ 'pad-r-0': visibleParmas }">
    <div :class="{ 'pad-b-sm': 1, 'flex-x-between': 1, 'pad-r-scope': visibleParmas }">
      <div class="operate-btn">
        <el-button type="success" :disabled="isSelected">报告完成</el-button>
        <el-button type="warning" :disabled="isSelected">重新编制</el-button>
      </div>
      <el-form inline>
        <el-form-item class="mar-b-0">
          <el-date-picker
            v-model="queryForm.startTime"
            type="datetime"
            style="width: 130px"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="mar-b-0">
          <el-date-picker
            v-model="queryForm.endTime"
            type="datetime"
            style="width: 130px"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="mar-b-0">
          <enum
            v-model="queryForm.projectTypeId"
            clearable
            type="OPERATE_TYPE"
            width="120px"
            placeholder="项目类型"
          />
        </el-form-item>
        <el-form-item class="mar-b-0">
          <enum
            v-model="queryForm.status"
            dot
            clearable
            type="DISPOSE_STATUS"
            width="80px"
            placeholder="状态"
          />
        </el-form-item>
        <el-form-item class="mar-b-0 mar-r-0">
          <el-input
            v-model="queryForm.loginID"
            clearable
            style="width: 435px"
            prefix-icon="el-icon-search"
            placeholder="项目编号/名称、委托方、样品编号、点位名称、报告编号"
            @keyup.enter.native="onQueryList()"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="onQueryList()" />
        </el-form-item>
      </el-form>
    </div>
    <div class="fn-flex" style="height: calc(100% - 43px)">
      <el-card fill shadow="never" class="flex-1" :body-style="{ padding: 0 }">
        <el-table
          v-loading="loading"
          ref="table"
          border
          double
          highlight-current-row
          height="calc(100% - 43px)"
          :data="itemList"
          :row-class-name="rowClassName"
          @row-click="onRowClick"
          @select-all="selectAll"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" width="45" />
          <el-table-column align="center" label="No." width="50" type="index" :index="index" />
          <el-table-column width="225" label="项目">
            <template v-slot="{ row }">
              <div class="row-sm">
                <span class="pad-r-xs i-bold">{{ row.projectCode }}</span>
                <icon v-if="$enum.getLabel('GRADE', row.grade) === '特急'" name="danger" color="#FD3C7C" />
                <icon v-if="row.isStress" name="attention" color="#FF9900" />
                <span class="fn-right text-info">{{ row.inceptTime | sliceDate }}</span>
              </div>
              <div class="row-sm i-overflow">{{ row.projectName }}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="80" label="委托方">
            <template v-slot="{ row }">
              <el-tooltip placement="top-start">
                <div slot="content" class="row-sm">
                  <p>{{ row.customerName }}</p>
                  <p>联系人：{{ row.linkMan }}</p>
                  <p>联系电话：{{ row.linkPhone }}</p>
                </div>
                <span class="row-sm i-overflow-2">{{ row.customerName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="80" prop="projectTypeName" label="项目类型" />
          <el-table-column width="105" label="要求完成日期">
            <template v-slot="{ row }">
              <div class="row-sm">{{ row.deadLine | sliceDate }}</div>
              <div class="row-sm text-info">{{ $tools.getRelativeTime(row.deadLine) }}</div>
            </template>
          </el-table-column>
          <el-table-column width="105" label="要求报告日期">
            <template v-slot="{ row }">
              {{ row.reportDate | sliceDate }}
            </template>
          </el-table-column>
          <el-table-column min-width="80" align="center" label="检测情况">
            <template v-slot="{ row }">
              <div class="text-center">{{ row.analyzeSummary }}</div>
              <el-tooltip>
                <div slot="content" class="row-sm">
                  <p>报告出证：{{ row.analyzeDetail[0] }}</p>
                  <p>检测完毕：{{ row.analyzeDetail[1] }}</p>
                  <p>未检毕：{{ row.analyzeDetail[2] }}</p>
                </div>
                <Progress
                  :color="['#67c23a', '#666']"
                  :data="[row.analyzeDetail[1], row.analyzeDetail[2]]"
                  :count="row.analyzeDetail[1] + row.analyzeDetail[2]"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column min-width="90" align="center" label="报告情况">
            <template v-slot="{ row }">
              <div class="text-center">
                <span>{{ `${row.reportDetail[0]} / ${row.reportDetail[1]}` }}</span>
                <el-tooltip content="报告已完成">
                  <i v-show="row.reportDetail[0] && row.reportDetail[0] >= row.reportNum" class="el-icon-success text-success pad-l-xs"></i>
                </el-tooltip>
                <el-tooltip content="项目报告中有关联样品的修改">
                  <i v-show="row.dataChangeStatus === 1" class="el-icon-warning text-warning pad-l-xs"></i>
                </el-tooltip>
              </div>
              <el-tooltip>
                <div slot="content" class="row-sm">
                  <p>要求报告数：{{ row.reportNum }}</p>
                  <p>已签发报告数：{{ row.reportDetail[0] }}</p>
                  <p>实际报告数：{{ row.reportDetail[1] }}</p>
                </div>
                <Progress
                  :color="['#67c23a', '#666']"
                  :data="[row.reportDetail[0], row.reportDetail[1] - row.reportDetail[0]]"
                  :count="row.reportDetail[1]"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" width="100" label="操作">
            <template v-slot="{ row }">
              <el-button simple type="primary" title="详情" @click.stop="onDetail(row)">
                <icon name="view" />
              </el-button>
              <el-button simple type="primary" title="评价">
                <icon name="attention" />
              </el-button>
              <el-button simple type="warning" title="转交">
                <icon name="toggle" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="flex-x-between">
          <span class="pad-y-sm pad-x-md">
            <icon name="el-icon-info" scale="1.2" />
            <span class="text-info pad-l-xs">点击表格行，显示项目报告</span>
          </span>
          <paging :pager="pager" @query="getItemList" />
        </div>
      </el-card>
      <!-- 详细信息 -->
      <list-report
        v-show="visibleParmas"
        ref="listReport"
        style="width: 320px"
        @update-row="onUpdateRow"
      />
    </div>
  </container>
</template>

<script>
import Progress from '@/components/Progress';
import { tableSelected, tablePager } from '@/mixins';

import ListReport from './components/ListReport';
import { emptyQuery, getProjectList } from './request';

export default {
  name: 'ReportEdit',
  components: {
    Progress,
    ListReport,
  },
  mixins: [tableSelected, tablePager],
  data() {
    return {
      once: true,
      loading: false,
      visibleParmas: false,
      queryForm: emptyQuery(),
      itemList: [],
    };
  },
  created() {
    this.onQueryList();
  },
  methods: {
    onQueryList() {
      this.initPage();
      this.visibleParmas = false;
      this.getItemList();
    },
    onDetail() {},
    onRowClick(row) {
      this.once = true;
      this.visibleParmas = true;
      this.$refs.listReport.init(row);
    },
    onUpdateRow(row) {
      if (this.once) {
        this.once = false;
      } else {
        const index = this.itemList.findIndex(v => v.id === row.id);
        if (index > -1) {
          getProjectList({ page: 1, rows: 1, ...emptyQuery({ key: row.projectCode }) })
            .then((response) => {
              const { success, data } = response.data;
              if (success) {
                this.$set(this.itemList, index, data[0] || row);
                this.$nextTick(() => {
                  this.$refs.table.setCurrentRow(this.itemList[index]);
                });
              }
            });
        }
      }
    },
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      getProjectList({ page, rows, ...this.queryForm })
        .then((response) => {
          const {
            success, data, count, msg,
          } = response.data;
          if (success) {
            this.itemList = data || [];
            this.pager.count = count;
            this.$refs.listReport.init();
          } else {
            this.$message.warning(msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
