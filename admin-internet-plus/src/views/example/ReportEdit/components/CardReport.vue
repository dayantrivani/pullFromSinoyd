<template>
  <el-card shadow="never" class="card-report">
    <div v-show="showBtn" class="mork">
      <el-button simple type="primary" title="编辑" @click="$emit('edit', data)">
        <icon name="el-icon-edit" />
      </el-button>
      <el-button simple type="success" title="提交" class="mar-l-md" @click="$emit('submit', data)">
        <icon name="check" />
      </el-button>
      <el-button simple type="danger" title="删除" class="mar-l-md" @click="$emit('remove', data)">
        <icon name="el-icon-delete" />
      </el-button>
    </div>
    <span class="status-seal">
      <icon v-if="data.status === '报告未通过'" name="seal-fail" scale="6" />
      <icon v-else-if="data.status === '已签发'" name="seal-pass" scale="6" />
    </span>
    <div class="content">
      <p class="flex-x-between">
        <span>
          {{ data.code }}
          <el-tooltip content="样品或分析项目存在改动">
            <i v-show="data.dataChangeStatus === 2" class="el-icon-info text-primary"></i>
          </el-tooltip>
        </span>
        <status :type="$enum.get('REPORT_STATUS:label', data.status).tag">{{ data.status }}</status>
      </p>
      <p class="flex-x-between">
        <span><icon name="el-icon-menu" /> {{ data.reportTypeName }}</span>
        <span>{{ data.comment }}</span>
      </p>
      <p class="flex-x-between">
        <span><icon name="user" /> {{ data.reportMakerName }}</span>
        <span><icon name="el-icon-date" /> {{ data.submitTime | sliceDate }}</span>
      </p>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    showBtn: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.card-report {
  &:hover .mork {
    display: block;
  }
  + .card-report {
    margin-top: $-scope;
  }
  .content {
    position: relative;
    line-height: 2;
  }
  .status-seal {
    position: absolute;
    top: 30%;
    right: 12%;
    z-index: 1;
  }
  .mork {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 15%;
    width: 100%;
    height: 100%;
    text-align: center;
    vertical-align: middle;
    background-color: rgba(#000, .4);
    z-index: 1;
  }
}
</style>
