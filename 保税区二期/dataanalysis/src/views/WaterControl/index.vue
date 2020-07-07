<template>
  <!-- 水控制 -->
  <div class="mod-watercontrol pad-t-lg">
    <decor-button type="left">应急排放</decor-button>
    <decor-button type="rignt" style="right: 0px">张家港某化工企业
      <i style="transform: rotate(90deg);display: inline-block;opacity: 0.7;">&raquo;</i>
    </decor-button>
    <el-row style="height: 100%; padding-bottom: 0.1rem;">
      <el-col style="width: 30.75%">
        <div style="height: calc(75% - 0.1rem)">
          <decor-border>
            <main-case title="污水厂排放量">
              <div slot="title" class="mar-l-sm">
                <yd-button :active="true">昨日</yd-button>
                <yd-button :active="false" class="mar-l-sm">近7天</yd-button>
                <yd-button :active="false" class="mar-l-sm">30天</yd-button>
              </div>
              <sewage-info></sewage-info>
            </main-case>
          </decor-border>
        </div>
        <div style="height: calc(25% - 0.1rem);margin-top: 0.2rem">
          <decor-border>
            <main-case title="预警报警信息">
              <alarm-warning></alarm-warning>
            </main-case>
          </decor-border>
        </div>
      </el-col>
      <el-col style="width: 30.75%;margin-left: 3.875%">
        <middle></middle>
      </el-col>
      <el-col style="width: 30.75%;margin-left: 3.875%">
        <div style="height: calc(100% - 5.5rem)">
          <decor-border>
            <main-case title="企业信息">
              <p-s-info></p-s-info>
            </main-case>
          </decor-border>
        </div>
        <div style="height: 5.3rem;margin-top: 0.2rem">
          <decor-border>
            <main-case title="排口留样信息">
              <sample-info></sample-info>
            </main-case>
          </decor-border>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SewageInfo from './components/SewageInfo';
import AlarmWarning from './components/AlarmWarning';
import Middle from './components/Middle';
import PSInfo from './components/PSInfo';
import SampleInfo from './components/SampleInfo';

export default {
  name: 'WaterControl',
  components: {
    SewageInfo,
    AlarmWarning,
    Middle,
    PSInfo,
    SampleInfo,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.mod-watercontrol {
  color: #ccd;
}
</style>
