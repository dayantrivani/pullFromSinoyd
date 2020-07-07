<template>
<a-modal
    class="DownApp"
    title="下载app"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="isVisible = false"
  >
  <div class="app_main">
    <a-upload
      class="app_upload"
      name="file"
      :multiple="false"
      :beforeUpload="beforeUpload"
      :customRequest="upload"
      :showUploadList="false"
       accept=".apk"
       :openFileDialogOnClick="isOpen"
    >
    <div class="file_class">
      <div class="no_file" v-if="!Object.keys(app).length">上传app</div>
      <div class="file" v-else>
        <img src="@/assets/img/apk.png"/>
        <p>{{app.name}}</p>
      </div>
      <!-- <div class="file_black" @click="F">
        <span class="icon_class">
          <a-icon type="upload" title="上传" @click="up" />
          <a-icon type="download" title="下载" @click.stop="download" />
        </span>
      </div> -->
    </div>
    </a-upload>
    <span class="ver_class">
      版本号：
      <a-input v-model="version" placeholder="请输入" />
    </span>
    <a-button :disabled="!Object.keys(app).length" class="down_btn" type="dashed" icon="download" @click="download">
      下载
    </a-button>
  </div>
</a-modal>
</template>

<script>
export default {
  name: 'DownApp',
  data() {
    return {
      isVisible: false,
      app: {},
      version: '',
      formatData: {},
      isOpen: true,
    };
  },
  methods: {
    openDialog() {
      this.isVisible = true;
      this.getApp();
    },
    // 获取app文件
    getApp() {
      this.$axios.request({
        url: '/api/monitor/app/manage',
        method: 'get',
      }).then((res) => {
        if (res.data.code === 200 && res.data.success && res.data.data) {
          this.app = res.data.data;
          this.version = res.data.data.vision;
        } else {
          this.$message.warning(res.data.msg, 1.5);
        }
      });
    },
    // 文件上传前
    beforeUpload(file) {
      this.formatData = new FormData();
      this.formatData.append('file', file);
    },
    upload() {
      this.$axios.request({
        url: `/api/monitor/app/manage/upload?vision=${this.version}`,
        method: 'post',
        data: this.formatData,
      }).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.$message.success(res.data.msg, 1.5);
          this.getApp();
        } else {
          this.$message.warning(res.data.msg, 1.5);
        }
      });
    },
    download() {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.download = this.app.name;
      a.href = `/api/monitor/static/files/${this.app.filePath}`;
      document.body.appendChild(a);
      a.click();
    },
  },
};
</script>

<style lang="scss">
.app_upload{
  height: 100%;
  width: 100%;
  display: block;
  position: relative;
  >.ant-upload{
    margin: 0 auto;
    width: 120px;
    display: block!important;
  }
}
</style>

<style lang="scss" scoped>
.file_class{
  width: 120px;
  height: 120px;
  padding: 20px 10px;
  border: 1px dashed #c7c1c1;
  position: relative;
  .file_black{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: none;
    background: rgba(0, 0, 0, .5);
    >.icon_class{
      width: 65px;
      height: 20px;
      color: #fff;
      position: absolute;
      font-size: 22px;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      >i:nth-child(2) {
        margin-left: 15px;
      }
    }
  }
  &:hover{
    border-color: lightblue;
    cursor: pointer;
    .file_black{
      display: block;
    }
  }
  >.no_file{
    height: 100%;
    text-align: center;
    line-height: 75px;
  }
  >.file{
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    >img{
      width: 50px;
      display: block;
      margin: 0 auto;
    }
    >p{
      margin-top: 10px;
    }
  }
}
.ver_class{
  width: 150px;
  margin: 0 auto;
  display: block;
  >input{
    width: 80px;
    border: none;
    border-bottom: 1px solid #d9d9d9;
    outline: none;
    // text-align: center;
    &:focus{
      box-shadow: none!important;
    }
  }
}
.down_btn{
  margin: 0 auto;
  display: block;
  margin-top: 10px;
}
</style>
