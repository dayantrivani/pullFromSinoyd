<template>
  <!-- 污水排放总量 -->
  <!-- <div class="mod-one-totalSewageDischarge">
  </div> -->
  <decor-border>
    <main-case title="污水排放总量">
      <template v-slot:title></template>
      <template v-slot:unit>
        <div class="unit-style">单位：{{unit}}</div>
      </template>
      <div class="progress" @mousewheel.stop="() => false">
        <el-scrollbar style="width: 100%; height: 100%;">
          <ul class="progress-list">
            <!-- <li v-for="(item, index) in list" :key="index">
              <div :title="item.psName">{{ item.psName }}</div>
              <div class="total">
                <div class="bgcolor">{{ item.num }}</div>
              </div>
            </li> -->
            <li v-for="(item, index) in 22" :key="index">
              <div class="psName" title="总排放量">总排放量</div>
              <div class="total">
                <div class="bgcolor">123456789</div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'TotalSewageDischarge',
  data() {
    return {
      unit: 't',    // 单位
      list: [
      ],
    };
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
