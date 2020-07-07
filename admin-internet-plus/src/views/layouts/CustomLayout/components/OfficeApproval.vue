<!-- 办公审批 -->
<template>
  <el-card fill shadow="hover" :body-style="{ padding: 0 }">
    <template slot="header">
      <div class="el-card__title">
        <icon name="icon-suoyoushenpi" color="#46D3C4" scale="1.3" />
        <span class="pad-l-sm">办公审批</span>
      </div>
      <div class="el-card__more">
        <el-tabs v-model="tabActive" class="display-inline">
          <el-tab-pane label="我发起的" name="first"></el-tab-pane>
          <el-tab-pane label="待我审核" name="second"></el-tab-pane>
          <el-tab-pane label="我已审核" name="third"></el-tab-pane>
        </el-tabs>
        <button class="pad-l-md z-pointer" @click="$emit('to', 'MyApproval')">
          <icon name="more" />
        </button>
      </div>
    </template>
    <scrollbar>
      <!-- content -->
    </scrollbar>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tabActive: 'first',
    };
  },
};
</script>
