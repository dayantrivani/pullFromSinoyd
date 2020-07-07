import './style.scss';

import E from 'wangeditor';

import { menus } from './config';
import { uploadEdit } from '@/api/modules/notice.js';

export default {
  name: 'WangEditor',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: String,
  },
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      if (!this.editor) {
        this.editor = new E(this.$refs.editor);
      }
      this.editor.customConfig.menus = menus;
      this.editor.customConfig.zIndex = 1;
      this.editor.customConfig.onchange = (html) => {
        this.$emit('input', html);
      };
      // this.editor.customConfig.uploadImgShowBase64 = true;
      this.editor.customConfig.customUploadImg = (files, insert) => {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        // 上传代码返回结果之后，将图片插入到编辑器中
        const formatData = new FormData();
        formatData.append('file', files[0]);
        uploadEdit(formatData).then((res) => {
          insert(`/api/monitor/static/files/${res.data[0].filePath}`);
        });
      };
      this.editor.create();
      this.editor.txt.html(this.value);
    },
    toValue(val) {
      this.editor.create();
      this.editor.txt.html(val);
    },
  },
  render() {
    return (
      <div ref="editor" class="mod-wang-editor"></div>
    );
  },
};
