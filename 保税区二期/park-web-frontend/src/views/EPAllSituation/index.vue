<template>
  <!-- 企业整体情况 -->
  <div class="block">
    <div class="block-top">
      <upload-picture objectId="000002"/>
    </div>
    <div class="block-bottom">
      <div class="block-bottom__EP">
        <el-form
          class="mar-t-xs pad-x-sm item-space"
          ref="form"
          label-position="right"
          label-width="120px">

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="企业数量：">
                <el-input :value="status.total" :editable="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="在产企业数量：">
                <el-input :value="status.open" :editable="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="拟建企业数量：">
                <el-input :value="status.build" :editable="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="关停企业数量：">
                <el-input :value="status.close" :editable="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="block-bottom__check">
        <el-form
          class="mar-t-xs pad-x-sm item-space"
          ref="form"
          label-position="right"
          label-width="150px">

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="项目验收情况（%）：">
                <el-input
                  :value="`${(accept.pass / (accept.total || 1) * 100).toFixed(2)}%`"
                  :editable="true">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="企业总体项目数量：">
                <el-input :value="accept.total" :editable="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="企业已验收项目数量：">
                <el-input :value="accept.pass" :editable="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="企业未验收项目数量：">
                <el-input :value="accept.fail" :editable="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="block-bottom__total">
        <el-form
          class="mar-t-xs pad-x-sm item-space"
          ref="form"
          label-position="right"
          label-width="140px">

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="开票销售（万元）：">
                <el-input :value="industry.total" :editable="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" v-for="(item, index) in industry.detail" :key="index">
            <el-col :span="24">
              <el-form-item>
                <template slot="label">
                  <div style="overflow-x:auto;white-space:nowrap;" :title="item.key">{{item.key}}（万元）：</div>
                </template>
                <el-input :value="item.value" :editable="true">
                  <template slot="append">{{`${item.percent * 100}%`}}</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'EPAllSituation',
  mixins: [queryList],
  data() {
    return {
      url: 'bas/parkPSOutputValue/total', // 接口地址
      isAuto: false,      // 触发混合
      loading: false,     // 加载状态
      itemList: {},
    };
  },
  computed: {
    status() {
      return this.itemList.status || {
        total: '',        // 总企业数
        open: '',         // 在产
        close: '',        // 关闭
        build: '',        // 拟建
      };
    },
    accept() {
      return this.itemList.accept || {
        total: '',        // 总数
        accept: '',       // 验收
        unaccept: '',     // 未验收
      };
    },
    industry() {
      return this.itemList.industry || {
        total: '',        // 总产值
        detail: [],
      };
    },
  },
  watch: {
    $route(val) {
      if (val.name === 'EPAllSituation') {
        this.getItemList();
      }
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {          // 获取记录列表
      this.loading = true;
      this.$http.post(this.url).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data || {};
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.block{
  width: 100%;
  height: 100%;
  > .block-top {
    width: 100%;
    height: 50%;
    background-color: #FFF;
  }
  > .block-bottom {
    width: 100%;
    height: calc(50% - 10px);
    margin-top: 10px;
    overflow: hidden;
    display: flex;
    > div {
      background-color: #FFF;
      overflow: auto;
      &:not(:first-child){
        margin-left: 10px;
      }
      height: 100%;
      flex: 1;
      >.item-space{
        .el-row{
          margin-top: 10%;
        }
      }
    }
    // .block-bottom__EP{
    // }
    // .block-bottom__check{
    // }
    // .block-bottom__total{
    // }
  }
}
</style>
