<template functional>
  <div class="row-md">

    <!-- 标记位说明 -->
    <template v-if="props.name === '标记位说明'">
      <p>
        RM 自动或人工置为无效 <el-divider direction="vertical" />
        VA 人工置为有效 <el-divider direction="vertical" />
        H 有效数据不足 <el-divider direction="vertical" />
        HSp 超上限 <el-divider direction="vertical" />
        LSp 超下限 <el-divider direction="vertical" />
        Rep 重复异常 <el-divider direction="vertical" />
        Neg 负值异常 <el-divider direction="vertical" />
        Out 离群异常
      </p>
      <p>
        UPd 数据倒挂 <el-divider direction="vertical" />
        BB 连接不良 <el-divider direction="vertical" />
        B 运行不良 <el-divider direction="vertical" />
        W 等待数据恢复 <el-divider direction="vertical" />
        PS 跨度检查 <el-divider direction="vertical" />
        PZ 零点检查 <el-divider direction="vertical" />
        AS 精度检查 <el-divider direction="vertical" />
        CZ 零点校准 <el-divider direction="vertical" />
        CS 跨度校准
      </p>
    </template>

    <!-- 标记位说明2 -->
    <template v-else-if="props.name === '标记位说明2'">
      <p>
        H 有效数据不足 <el-divider direction="vertical" />
        HSp 超上限 <el-divider direction="vertical" />
        Neg 负值异常 <el-divider direction="vertical" />
        BB 连接不良 <el-divider direction="vertical" />
        B 运行不良 <el-divider direction="vertical" />
        W 等待数据恢复 <el-divider direction="vertical" />
        PS 跨度检查 <el-divider direction="vertical" />
        PZ 零点检查 <el-divider direction="vertical" />
        AS 精度检查 <el-divider direction="vertical" />
        CZ 零点校准 <el-divider direction="vertical" />
        CS 跨度校准
      </p>
    </template>

    <!-- 审核流程说明 -->
    <template v-else-if="props.name === '审核流程说明'">
      <p>三审流程：
        <status type="info">待运维上报</status> <i class="el-icon-caret-right pad-r-xs" />
        <status type="warning">待质控审核</status> <i class="el-icon-caret-right pad-r-xs" />
        <status type="warning">待中心审核</status> <i class="el-icon-caret-right pad-r-xs" />
        <status type="success">中心已审核</status>
      </p>
      <p>二审流程：
        <status type="info">待运维上报</status> <i class="el-icon-caret-right pad-r-xs" />
        <status type="warning">待中心审核</status> <i class="el-icon-caret-right pad-r-xs" />
        <status type="success">中心已审核</status>
      </p>
      <p>中心直审：
        <status type="primary">中心直审</status> <i class="el-icon-info" />
      </p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Info',
};
</script>
