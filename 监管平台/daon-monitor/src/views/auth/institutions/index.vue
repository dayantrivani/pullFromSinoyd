<template>
  <div
    :class="{
      'app': 1,
    }">
    <app-head />
    <container layout="empty">
      <div class="main-institu-class">
        <a-button type="dashed" @click="onBack"> <a-icon type="left"/>返 回</a-button>
        <span style="margin-left: 20px;">您可以新建监管机构或申请加入平台已有的监管机构</span>
        <a-row :gutter="16" style="margin-top: 16px;">
          <a-col :span="12">
            <a-card title="新建监管机构" class="card-institu-class" :bordered="false">
              <a-button
                @click="onAddApply"
                type="dashed"
                block>
                <a-icon type="plus" />新建机构</a-button>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="加入监管机构" class="card-institu-class" :bordered="false">
              <a-input
                v-model="code"
                :allowClear="true"
                placeholder="请输入机构代码"
                style="width: calc(100% - 120px);"/>
              <a-button
                type="dashed"
                @click="onJoin"
                style="margin-left: 10px;">
                <a-icon type="check"/>申请加入
              </a-button>
            </a-card>
          </a-col>
        </a-row>
        <a-row :gutter="16" style="margin-top: 16px;">
          <a-col :span="12">
            <a-card title="新建机构记录" class="card-institu-class" :bordered="false">
              <div class="minHeight">
                <p v-for="(item, index) in newRecordData" :key="index">
                  {{index + 1}}. 您于 {{item.date}} 创建机构：{{item.firmName}}
                </p>
              </div>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="申请加入记录" class="card-institu-class" :bordered="false">
              <div class="minHeight">
                <p v-for="(item, index) in recordData" :key="index">
                  {{index + 1}}. 您于 {{item.date}} 申请加入机构：{{item.firmName}}
                </p>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </container>
    <apply-dialog ref="ApplyDialog" @getApply="getApply"/>
  </div>
</template>

<script>
// import config from '@/config';
// import { setLocalStorage } from '@/libs/tools';
import AppHead from '@/layouts/default/components/app-head';
import { getApply, getJoin } from '@/api/institutions';
import ApplyDialog from './components/applyDialog';

// const localKey = config.localKey.homeLayout;

export default {
  name: 'institutions',
  components: {
    AppHead,
    ApplyDialog,
  },
  provide() {
    return { app: this };
  },
  data() {
    return {
      custom: this.$config.custom,  // 用户个性化配置 @/src/config
      scrollTop: 0,
      recordData: [], // 申请记录数据
      newRecordData: [], // 新建机构记录
      code: '',
    };
  },
  watch: {
    custom: {
      handler(val) {
        this.app.setCustomConfig(val);
      },
      deep: true,
    },
    'custom.theme': {
      handler(val) {
        document.body.setAttribute('theme', val);
      },
      immediate: true,
    },
    'custom.themeSide': {
      handler(val) {
        document.body.setAttribute('themetype', val);
      },
      immediate: true,
    },
  },
  created() {
    this.getApply();
  },
  methods: {
    onBack() {
      this.$router.back();
      this.$store.state.auth.toggle = 1;
    },
    // 设置&本地存储个性化配置
    setCustomConfig(config) {
      this.custom = config;
      this.$tools.setSessionStorage(this.$config.localKey.custom, config);
    },
    // 获取申请加入记录和新建机构记录
    getApply() {
      getApply().then((res) => {
        if (res.data.code === 200 && res.data.success) {
          // this.recordData = res.data.data.filter(val => val.status !== undefined);
          // this.newRecordData = res.data.data.filter(val => val.status === undefined);
          this.recordData = res.data.data.apply;
          this.newRecordData = res.data.data.create;
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    // 加入机构
    onJoin() {
      getJoin(this.code).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.$message.success(res.data.msg);
          this.getApply();
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    // 新建机构
    onAddApply() {
      this.$refs.ApplyDialog.openDialog();
    },
  },
};
</script>

<style lang="scss">
.card-institu-class{
  >.ant-card-body{
    padding: 14px;
  }
}
</style>

<style lang="scss" scoped>
.main-institu-class{
  padding-top: 30px;
  width: 80%;
  margin: 0 auto;
  display: block;
}
.minHeight{
  min-height: 390px;
  overflow-y: auto;
}
</style>
