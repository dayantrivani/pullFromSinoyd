<template>
  <!-- 发展历程 -->
  <div class="block">
    <div class="block-top">
      <upload-picture objectId="000001"/>
    </div>
    <div class="block-bottom">
      <div class="block-bottom_sort" v-loading="loading">
        <div class="radio"><el-button
            type="primary"
            style="width: calc(100% - 10px);"
            icon="fas fa-pencil-alt"
            class="mar-b-xs"
            @click="onClickDialog">发 展 历 程 维 护</el-button>
          排序：
          <!-- <el-button
            type="primary"
            style="width: 80px;"
            icon="fas fa-pencil-alt"
            @click="onClickDialog(scope.row)"></el-button> -->
          <el-radio-group v-model="reverse">
            <el-radio :label="false">正序</el-radio>
            <el-radio :label="true">倒序</el-radio>
          </el-radio-group>
        </div>
        <time-line ref="timeline" class="time-line" :list="activities" v-model="select" :reverse="reverse">
          <template #default="{ item }">
            <p>{{ item.nodeDate && item.nodeDate.split(' ')[0] }}</p>
          </template>
        </time-line>
      </div>
      <div class="block-bottom_text" v-loading="loading">
        {{ select.eventContent }}
      </div>
      <div class="block-bottom_upload">
        <upload-table />
      </div>
    </div>
    <dialog-item ref="dialog" @query="getItemList"/>
  </div>
</template>

<script>
import UploadTable from './components/UploadTable';
import DialogItem from './components/DialogItem';
// import UploadPictrue from '@/components/upload-pictrue';
import { analyzeResp } from '@/global/libs/util';
// import { queryList, deleteItem } from '@/global/libs/mixins';


export default {
  name: 'DevelopmentCourse',
  // mixins: [queryList, deleteItem],
  components: {
    UploadTable,
    DialogItem,
    // UploadPictrue,
  },
  data() {
    return {
      reverse: false,     // 排序：false为正序
      select: {},         // 选中对象
      activities: [],
      url: 'bas/parkDevelopHistory',  // 上传文件请求地址
      isAuto: false,      // 触发混合
      itemList: [],       // 列表数据
      loading: false,     // 加载状态
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {   // 获取列表数据
      this.reverse = false;
      if (this.$refs.timeline) {
        this.$refs.timeline.selectIndex = 0;
      }
      this.loading = true;
      this.$http.get(this.url, {
        params: {
          page: 1,
          rows: 1000,
          sort: 'nodeDate+',
        },
      }).then((response) => {
        if (response.data.success) {
          this.activities = response.data.data || [];
          this.select = this.activities[0] || {};
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

    /* 特殊方法 */
    onClickDialog() {
      this.$refs.dialog.openDialog();
    },
    // deleCallback() {  // 删除后回调
    //   this.getItemList();
    // },
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
    > .block-bottom_sort{
      float: left;
      height: 100%;
      width: 200px;
      background-color: #fff;
      padding: 5px 0px 5px 10px;
      > .radio{
        line-height: 30px;
        border-bottom: 1px solid #E4E7ED;
        margin: 0 0 4px -10px;
        padding: 0 0 0 10px;
      }
      > .time-line {
        height: calc(100% - 66px);
        width: 100%;
        margin: 0;
      }
      // > .scrollbar{
      //   width: 100%;
      //   height: calc(100% - 66px);
      //   margin: 0;
      // }
    }
    > .block-bottom_text{
      float: left;
      height: 100%;
      width: 30%;
      background-color: #fff;
      margin: 0 10px;
      padding: 20px 20px 10px 20px;
      overflow-y: auto;
      white-space: normal;              /* 单词，文字断行*/
      word-wrap : break-word;
      text-align: justify;              /* 两端对齐*/
      text-justify: inter-ideograph;
    }
    > .block-bottom_upload {
      float: left;
      width: calc(70% - 220px);
      height: 100%;
      background-color: #fff;
    }
  }
}
</style>
