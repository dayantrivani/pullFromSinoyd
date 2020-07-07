<template>
  <el-row class="drop-query-form">
    <el-col style="width: calc(100% - 150px);overflow: hidden;">
      <slot></slot>
    </el-col>
    <el-col style="width: 150px;">
      <el-form style="float: right;">
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
            <el-button type="primary" @click="onMoreQuery">
              <i class="fas fa-angle-double-down drop-rotate"></i>
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'SearchFlex',
  props: {
    row: {
      type: [String, Number],
      default: 2,
    },
  },
  data() {
    return {
      itemList: [],
      portList: [], // 点位列表
      queryForm: {},
      pager: {},
    };
  },
  computed: {},
  created() {},
  methods: {
    onMoreQuery() {
      document.querySelector('.drop-query-form .drop-rotate').classList.toggle('active-drop-rotate');
      document.querySelector('.g-main>.el-card>.el-card__header').classList.toggle(`drop-height${this.row}`);
      document.querySelector('.g-main>.el-card>.el-card__body').classList.toggle(`drop-height${this.row}`);
    },
    onQueryList() {
      this.$emit('query');
    },
  },
};
</script>

<style lang="scss">
  .g-main {
    .el-card {
      .el-card__header {
        &.drop-height1 {
          height: 40px;
        }
        &.drop-height2 {
          height: 73px;
        }
        &.drop-height3 {
          height: 106px;
        }
        &.drop-height4 {
          height: 139px;
        }
      }
      .el-card__body {
        &.drop-height1 {
          height: calc(100% - 39px);
        }
        &.drop-height2 {
          height: calc(100% - 72px);
        }
        &.drop-height3 {
          height: calc(100% - 105px);
        }
        &.drop-height4 {
          height: calc(100% - 138px);
        }
      }
    }
  }
  .drop-query-form {
    .drop-rotate {
      transition: transform 0.2s linear;
    }
    .drop-rotate.active-drop-rotate {
      transform: rotate(180deg);
    }
  }
</style>
