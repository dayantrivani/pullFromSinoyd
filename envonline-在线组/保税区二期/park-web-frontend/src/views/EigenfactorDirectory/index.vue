<!-- 园区特征因子名录库 -->
<template>
  <el-card id='EigenfactorDirectory-table'>
    <!-- 检索表单 -->
    <template slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="企业名称：">
          <el-input clearable
                    style="width:150px"
                    v-model="queryForm.psName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 列表展示 -->
    <el-table border
              highlight-current-row
              stripe
              :height="`calc(100% - 32px)`"
              v-loading="loading"
              :data="itemList">
      <!-- <el-table-column type="expand">
        <template slot-scope="{ row }">
          <div style="margin-left:0px;margin-top:0px;"
               v-for="(item,index) in row.water.split('、')"
               :key="index">
            <div v-show="item != '--'"
                 style="border: 2px solid #E8EAEC;float:left;margin-left:10px;margin-top:10px;border-radius: 5px;">
              <i class="el-icon-position"
                 style="vertical-align: center; margin-left: 4px;color:#2D8CF0;"></i>
              {{item}}
              <img src="@/assets/img/font.png"
                   style="vertical-align: top; margin-right: -1px;">
            </div>
          </div>
          <div v-for="(item,index) in row.air.split('、')"
               :key="index">
            <div v-show="item != '--'"
                 style="border: 2px solid #E8EAEC;float:left;margin-left:10px;margin-top:10px;border-radius: 5px;">
              <i class="el-icon-position"
                 style="vertical-align: center; margin-left: 4px;color:#2D8CF0;"></i>
              {{item}}
              <img src="@/assets/img/font.png"
                   style="vertical-align: top; margin-right: -1px;">
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column align="center"
                       label="No."
                       width="50"
                       type="index"
                       :index="index"></el-table-column>
      <el-table-column property="psName"
                       label="企业名称"
                       min-width="120"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="water"
                       label="废水特征污染物因子"
                       min-width="180"
                       show-overflow-tooltip>
        <template v-if="row.water" slot-scope="{ row }">
          <div v-for="(item,index) in row.water.split('、')"
               :key="index">
            <div v-show="item != '--'"
                 style="border: 2px solid #E8EAEC;float:left;margin-left:10px;margin-top:10px;border-radius: 5px;">
              <i class="el-icon-position"
                 style="vertical-align: center; margin-left: 4px;color:#2D8CF0;"></i>
              {{item}}
              <img src="@/assets/img/font.png"
                   style="vertical-align: top; margin-right: -1px;">
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="air"
                       label="废气特征污染物因子"
                       min-width="180"
                       show-overflow-tooltip>
        <template v-if="row.air" slot-scope="{ row }">
          <div v-for="(item,index) in row.air.split('、')"
               :key="index">
            <div v-show="item != '--'"
                 style="border: 2px solid #E8EAEC;float:left;margin-left:10px;margin-top:10px;border-radius: 5px;">
              <i class="el-icon-position"
                 style="vertical-align: center; margin-left: 4px;color:#1BDF49;"></i>
              {{item}}
              <img src="@/assets/img/font2.png"
                   style="vertical-align: top; margin-right: -1px;">
            </div>
          </div>
        </template></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />
  </el-card>
</template>

<script>
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'EigenfactorDirectory',
  data() {
    return {
      url: 'bas/pSCharacteristicPollutants/query',
      // 【定义变量——检索条件】
      queryForm: {
        psName: '',
      },                // 检索表单内容
    };
  },
  mixins: [                   // 混合
    queryList,
  ],
};
</script>

<style>
#EigenfactorDirectory-table .el-table td {
  vertical-align: top !important;
}
</style>
