<template>
  <a-modal
    class="dialogSystem"
    width="960px"
    title="系统切换"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <el-carousel @change="idChange" indicator-position="none" :autoplay="false" type="card" height="300px">
      <el-carousel-item
        v-for="item in organizationMap"
        :key="item.id"
        :style="{ 'backgroundImage': `url(${item.pic ? `/api/monitor/static/files/${item.pic}` : imgUrl})` }">
        <h3 class="medium" style="text-align: center">{{ item.firmName || item.companyName }}</h3>
      </el-carousel-item>
    </el-carousel>
    <template slot="footer">
      <a-button type="primary" @click="determine">确 定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex';
import { setSessionStorage } from '@/libs/tools';
import img from '@/assets/img/login_bg_1920x1080.jpg';
import { getMenu } from '@/api/auth.js';
import { resetRouter } from '@/routes';

export default {
  name: 'dialogSys',
  data() {
    return {
      isVisible: false,
      organizationMap: [],   // 当前用户的机构、企业数据
      currData: {},  // 当前选中
      imgUrl: img,
    };
  },
  methods: {
    ...mapActions('auth', ['GetUserMenu']),
    openDialog() {
      this.isVisible = true;
      this.getItemLIst();
    },
    closeDialog() {
      this.isVisible = false;
    },
    idChange(index) {
      this.currData = this.organizationMap[index];
    },
    // 获取机构/企业数据
    getItemLIst() {
      this.$axios.request({
        // url: '/api/monitor/permission/omsp-client',
        url: '/api/monitor/user/auth',
        method: 'get',
      }).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.organizationMap = Object.values(res.data.data.organizationMap);
          // eslint-disable-next-line
          this.currData = this.organizationMap[0];
        }
      }, ({ res }) => {
        this.$hp.resp(res);
      });
    },
    // 选择机构、企业确定事件
    determine() {
      this.isVisible = false;
      // type 1是机构 2是企业（之前模拟数据0为企业 1为机构，在此进行转换）
      window.localStorage.setItem('identity', this.currData.type === 1 ? 1 : 0);
      const identity = +window.localStorage.getItem('identity');
      // 储存当前企业id到sessionStorage
      if (!identity) {
        window.localStorage.setItem('psId', this.currData.relatedId);
      }
      // 将当前选中的企业或机构储存到本地
      window.sessionStorage.setItem('currEnter', JSON.stringify(this.currData));
      this.$axios.request({
        url: `/api/monitor/auth/choice?orgId=${this.currData.id}`,
        method: 'get',
      }).then(() => {
        getMenu().then((response) => {
          if (response.data.code === 200 && response.data.success) {
            const tem = response.data.data;
            const temFunc = (obj) => {
              this.$set(obj, 'id', obj.url);
              this.$set(obj, 'icon', obj.icon.slice(5));
              this.$set(obj, 'label', obj.name);
              this.$set(obj, 'moduleCode', obj.url);
              this.$set(obj, 'moduleUrl', obj.url);
              this.$set(obj, 'parentId', '0');
              if (obj.children && obj.children.length !== 0) {
                obj.children.forEach((el) => {
                  this.$set(el, 'parentCode', obj.url);
                  temFunc(el);
                });
              } else if (obj.children && obj.children.length === 0) {
                this.$delete(obj, 'children');
              }
            };
            tem.forEach((el) => {
              temFunc(el);
            });
            setSessionStorage(this.$config.localKey.navMenu, tem);
            this.GetUserMenu().then((data) => {
              resetRouter(data);
              this.$router.go(0);
            });
          } else {
            this.$message.error(response.data.msg);
          }
        });
      }, ({ res }) => {
        this.$hp.resp(res);
      });
    },
  },
};
</script>

<style lang="scss">
  .dialogSystem.ant-modal{
    .ant-modal-content{
      // border-radius: 10px;
      .ant-modal-body{
        .el-carousel{
          height: 300px;
          .el-carousel__container{
            width: 700px;
            height: 240px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    // line-height: 200px;
    margin: 0;
  }
  .el-carousel__item{
    width: 210px;
    height: 150px;
    margin-top: 40px;
    overflow: visible;
    background-size: 100% 100%;
    >h3{
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: -50px;
    }
  }
</style>
