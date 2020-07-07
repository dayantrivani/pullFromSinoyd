<template>
  <div class="fill">
    <div class="flex-x-between pad-b-sm">
      <div class="operate-btn">
        <el-button type="danger" :disabled="isSelected">删除</el-button>
        <el-button type="success" :disabled="isSelected">办结</el-button>
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
          <select-person
            v-model="queryForm.leaderId"
            clearable
            filterable
            style="width: 120px"
            placeholder="项目负责人"
            roles="pro_leader_all"
          />
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
            v-model="queryForm.projectStatus"
            clearable
            dot
            type="PROJECT_STATUS"
            width="120px"
            placeholder="项目状态"
            :filter-method="v => v.label !== '结果评价中'"
          />
        </el-form-item>
        <el-form-item class="mar-b-0 mar-r-0">
          <el-input
            v-model="queryForm.key"
            clearable
            style="width: 355px"
            prefix-icon="el-icon-search"
            placeholder="项目编号、项目名称、样品编号、委托单位"
            @keyup.enter.native="onQueryList()"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="onQueryList()" />
        </el-form-item>
      </el-form>
    </div>
    <el-card fill shadow="never" class="flex-1" style="height: calc(100% - 43px)" :body-style="{ padding: 0 }">
      <el-table
        v-loading="loading"
        ref="table"
        border
        double
        height="calc(100% - 43px)"
        :data="itemList"
        :row-class-name="rowClassName"
        @select-all="selectAll"
        @selection-change="selectionChange"
      >
        <el-table-column align="center" type="selection" width="45" />
        <el-table-column align="center" label="No." width="50" type="index" :index="index" />
        <el-table-column width="225" label="项目">
          <template v-slot="{ row }">
            <div class="row-sm">
              <el-button type="text" class="pad-r-xs pad-y-0" @click="$emit('detail', row)">
                <span class="i-text i-bold">{{ row.projectCode }}</span>
              </el-button>
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
        <el-table-column width="110" prop="leaderName" label="项目负责人" />
        <el-table-column width="105" label="要求完成日期">
          <template v-slot="{ row }">
            <div class="row-sm">{{ row.deadLine | sliceDate }}</div>
            <div class="row-sm text-info">{{ $tools.getRelativeTime(row.deadLine) }}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="80" align="center" label="合同信息">
          <template v-slot="{ row }">
            <div class="text-center">{{ row.contractCode || '--' }}</div>
            <el-tooltip :disabled="!row.collectionDetail.length">
              <template slot="content">
                <p>已收款: {{row.collectionDetail[0] || 0}}</p>
                <p class="pad-t-xs">坏账: {{row.collectionDetail[1] || 0}}</p>
                <p class="pad-t-xs">总金额: {{row.collectionDetail[2] || 0}}</p>
              </template>
              <Progress
                :color="['#67c23a', '#000']"
                :data="[row.collectionDetail[0], row.collectionDetail[1]]"
                :count="row.collectionDetail[2]"
              />
            </el-tooltip>
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
        <el-table-column width="115" label="项目状态">
          <template v-slot="{ row }">
            <status :type="$enum.get('PROJECT_STATUS:value', row.status).tag">
              {{ $enum.getLabel('PROJECT_STATUS', row.status) || '' }}
            </status>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="fn-clear">
        <paging class="fn-right" :pager="pager" @query="getItemList" />
      </div>
    </el-card>
  </div>
</template>

<script>
import SelectPerson from '@/components/SelectPerson';
import Progress from '@/components/Progress';

import { tableSelected, tablePager } from '@/mixins';
import { emptyQuery, getProjectList } from '../request';

export default {
  components: {
    SelectPerson,
    Progress,
  },
  mixins: [tableSelected, tablePager],
  data() {
    return {
      loading: false,
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
      this.getItemList();
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
