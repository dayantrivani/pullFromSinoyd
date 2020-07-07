<!-- 通知公告 -->
<template>
  <el-card fill shadow="hover" :body-style="{ padding: 0 }">
    <template slot="header">
      <div class="el-card__title">
        <icon name="icon-gonggaoguanli" color="#FD6195" scale="1.3" />
        <span class="pad-l-sm">通知公告</span>
      </div>
      <div class="el-card__more">
        <button @click="$emit('to', 'Notice')">
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
};
</script>
