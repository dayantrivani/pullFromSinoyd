<!-- 文件上传 -->
<template>
  <div v-if="browserAvailable">
    <label class="el-button el-button--small">
      <input class="hidden" type="file" ref="file" :multiple="multiple" :name="name"
       style="width: 100%;" @change="onChange" :accept="accept"/>{{btnName}}
    </label>
    <span v-if="showFileHint" class="mar-lft hidden-xs">
      {{fileHint === 0 ? '未选择文件' : (typeof fileHint === 'number' ? fileHint + '个文件' : fileHint)}}
    </span>
    <p v-if="showFileHint" class="mar-no visible-xs">
      {{fileHint === 0 ? '未选择文件' : (typeof fileHint === 'number' ? fileHint + '个文件' : fileHint)}}
    </p>
    <p v-if="showFileHint" class="text-muted mar-top-0 mar-btm-0">上传文件大小请控制在{{fileSize}}M以内</p>
    <span v-else class="mar-lft">上传文件大小请控制在{{fileSize}}M以内</span>
    <div class="pos-rel box-inline" style="max-width: 300px;">
      <div class="pos-abs cur-pointer text-center bg-close" style="right: -1px;top: 0;width: 18px;height: 18px;">
        <i v-show="showClosePic && showPreview && isShow && !sizeWarning"
          ref="closePic" class="fa fa-times cur-pointer pos-abs text-danger"
          style="right: 1px;top: -1px;font-size: 20px;display:none;" @click="delImg">
        </i>
      </div>
      <img v-show="showPreview && !sizeWarning" ref="preview"
       style="display:none; max-width: 300px; max-height: 300px;">
    </div>
    <!--如果文件个数是0 并且 没有点过图片的关闭按钮则，显示slot内容。或者，文件个数是0，但选择了新文件后，再选择文件时点击了取消按钮，如果slot里的内容没有被删光的话，这时，也会把则显示slot内容显示出来-->
    <slot v-if="isFirstClose === false && beforeImgUrl === '' && fileHint === 0">
    </slot>
  </div>
  <div v-else>
    <p class="text-muted mar-top-0">您的浏览器不支持文件上传，请升级浏览器或使用现代浏览器（Chrome、Firefox）打开本站。</p>
  </div>
</template>
<script>
export default {
  props: {
    // 文件名
    name: String,
    // 是否多选，默认可以
    multiple: {
      type: Boolean,
      default: true,
    },
    // 上传文件max-size，默认为2MB
    fileSize: {
      type: Number,
      default: 2,
    },
    // 文件类型设定，默认为图片
    accept: {
      type: String,
      default: 'image/gif, image/jpeg, image/png',
    },
    // 是否显示上传图片预览
    showPreview: {
      type: Boolean,
      default: true,
    },
    // 是否需要显示关闭图片，默认为false,不需要
    showClosePic: {
      type: Boolean,
      default: false,
    },
    // 更改上传文件按钮的显示
    btnName: {
      type: String,
      default: '选择文件',
    },
    // 是否显示选择的文件名/文件个数
    showFileHint: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fileHint: 0,
      browserAvailable: this.identifyBorwser(),
      sizeWarning: false,
      // 是否需要显示叉叉，只有图片显示时，叉叉（关闭按钮）才显示，但图片显示不一定要关闭按钮，根据showClosePic的值来。
      isShow: false,
      // 用来判断是否关闭过选中的图片，如果关闭过，就是true,则，在关闭后，slot不应该显示
      // 当文件夹是点击的取消时，则应该把之前slot中的内容显示出来（slot中的内容在没有被删除的前提下，
      // 如果已经删光了，则也不显示）
      // 在onChange时,会有可能设为false,reset中可能设为false,关闭叉叉时设为true
      isFirstClose: false,
      // 保存之前选择的图片路径(用于：如果已经选择了图片之后再点击选择图片，但按了取消，此时，应该把打开文件选择框之前
      // 的图片保留显示出来，不应该被清空，这个变量就是保存之前的图片路径的，在取消的时候可以显示之前的图片)
      beforeImgUrl: '',
    };
  },
  methods: {
    onChange(e) {
      this.sizeWarning = false;
      const oFReader = new FileReader();
      if (this.showPreview) {
        oFReader.onload = (e) => {
          // 保存图片路径，如果已经选择过图片，并再次打开，选择了取消，则显示之前的图片（即这个变量保存的图片路径）
          this.beforeImgUrl = e.target.result;
          this.$refs.preview.src = e.target.result;
          this.$refs.preview.style.display = 'block';
          this.isShow = true;
        };
        if (this.showClosePic) {
          this.$refs.closePic.style.display = 'block';
        }
      }
      if (e.target.files) {
        // 文件不能超过设定大小
        for (let i = 0; i < e.target.files.length; i++) {
          if (e.target.files[i].size > this.fileSize * 1024 * 1024) {
            this.sizeWarning = true;
          }
        }
        // 只有单个文件的才有预览功能
        // e.target.files.length === 0 这个条件是点击了取消按钮
        if (e.target.files.length === 0) {
          this.fileHint = 0;
          if (this.showPreview) {
            // 把之前保存的图片路径保存起来
            this.$refs.preview.src = this.beforeImgUrl;
            this.isFirstClose = false;
          }
        } else if (e.target.files.length === 1) {
          this.fileHint = e.target.files[0].name;
          if (this.showPreview && !this.sizeWarning) {
            oFReader.readAsDataURL(e.target.files[0]);
          }
        } else if (e.target.files.length > 1) {
          this.fileHint = e.target.files.length;
        }
      }
      this.$emit('change', e.target.files);
    },
    // 识别能够使用FormData的浏览器(ie10+)
    identifyBorwser() {
      if (typeof window.FormData === 'undefined' || typeof window.File === 'undefined'
        || typeof window.FileReader === 'undefined') {
        return false;
      }
      return true;
    },
    // 删除当前选择的图片
    delImg() {
      this.fileHint = 0;
      this.sizeWarning = false;
      this.isShow = false;
      this.isFirstClose = true;
      this.$refs.preview.src = '';
      this.beforeImgUrl = '';
      this.$refs.preview.style.display = 'none';
      this.$refs.closePic.style.display = 'none';
    },
    reset() {
      if (!this.browserAvailable) {
        return;
      }
      // reset file input
      const f = this.$refs.file;
      const form = document.createElement('form');
      const label = f.parentNode;
      form.appendChild(f);
      form.reset();
      label.appendChild(f);

      // 其他可选方法
      // 可以由于ie11以下不支持将input的value值置为空的形式清空自身，故可以将input的type改变，
      // 然后再再用nextTick改回来的方式清空，此方法支撑ie10
      // this.$refs.file.value = '';
      // this.$refs.file.type = '';
      // this.$nextTick(() => {
      //   this.$refs.file.value = '';
      //   this.$refs.file.type = 'file';
      // });
      // 需要让之前已经显示的内容显示出来，这个是特殊情况，要设为false
      this.isFirstClose = false;
      this.beforeImgUrl = '';
      this.fileHint = 0;
      this.sizeWarning = false;
      if (this.showPreview) {
        this.$refs.preview.src = '';
        this.$refs.preview.style.display = 'none';
        this.isShow = false;
        if (this.showClosePic) {
          this.$refs.closePic.style.display = 'none';
        }
      }
    },
  },
};
</script>

<style scoped>
  .bg-close:hover {
    background-color: #fff;
  }
</style>
