<template>
  <div style="margin-right: 2px;">
    <table class="basicInform-class" style="margin-bottom:2px">
      <caption>{{form.name}}</caption>
      <tbody style="width: 100%;display: block;">
        <!-- eslint-disable vue/no-use-v-if-with-v-for -->
        <tr v-for="field in form"
          :key="field.id"
          v-if="field.label && (!field.children || field.children.length === 0 )">
          <th style="width: 90px;" class="nowrap">
            <span v-if="field.type === 'suit_comparison'" title="比对因子">比对因子<br></span>
            <span :title="field.label">{{field.label}}</span>
            <span v-if="field.label2" :title="field.label2"><br>{{field.label2}}</span>
            <span v-if="field.label3" :title="field.label3"><br>{{field.label3}}</span>
            <span v-if="field.label4" :title="field.label4"><br>{{field.label4}}</span>
            <span v-if="field.label5" :title="field.label5"><br>{{field.label5}}</span>
          </th>
          <td v-if="field.type === 'attachment' || field.type === 'photo'" :class="cellClass">
            <div class="file-list" v-for="item in bucket[field.id]" :key="item.id">
              <!-- <div class="box-inline">{{ item.split('/')[item.split('/').length - 1].split('?')[0] }}</div> -->
              <div class="box-inline">{{fileName(item)}}</div>
              <div class="box-inline">
                <a-icon type="search" v-if="field.type === 'photo'" title="查看图片" @click="toBig(item)"/>
                <!-- <i class="fa fa-search-plus mar-lft-10 text-primary cur-pointer" title="查看图片" @click="toBig(item)"></i> -->
              </div>
              <div class="box-inline">
                <!-- <el-popover placement="top" width="200" @show="getDownloadSrc(item)">
                  <p>你确定要下载文件吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="emulateDocumentClick()">取消</el-button>
                    <a class="el-button el-button--primary el-button--mini"
                      @click="emulateDocumentClick()"
                      :href="downloadUrl"
                      :download="item.split('/')[item.split('/').length - 1]"
                      target="_blank"> 确定</a>
                  </div> -->
                  <a-icon type="arrow-down" title="下载" @click="downLoadIcon(item, field)" />
                  <!-- <i slot="reference" class="fa fa-download mar-lft-10 text-primary cur-pointer" title="下载"
                    @click="downLoadIcon(item)"></i> -->
                <!-- </el-popover> -->
              </div>
            </div>
          </td>
          <td v-else-if="field.type === 'signature'">
            <span v-if="(bucket[field.id] && typeof(bucket[field.id]) === 'string') || (bucket[field.id] && bucket[field.id][0])">
              <a-tag color="blue">已签名</a-tag>
              <span>{{typeof(bucket[field.id]) === 'string' ? bucket[field.id] : fileName(bucket[field.id][0])}}</span>
              <a-icon
                type="search"
                title="查看签名"
                style="margin-left: 5px"
                @click="toBig(bucket[field.id][0])"/>
              <!-- <i class="fa fa-search-plus mar-lft-10 text-primary cur-pointer"
                title="查看签名"
                @click="toBig(bucket[field.id])"></i> -->
            </span>
            <a-tag color="blue" v-else class="bg-gray">未签名</a-tag>
          </td>
          <td v-else-if="field.type === 'staff'">
            <a-tag
              v-for="s in bucket[field.id]"
              :key="s.id || s"
              color="blue">
              {{s.name || s}}
            </a-tag>
          </td>
          <td v-else v-html="displayTaskBucketField(form, bucket, field.id)" :class="cellClass"></td>
        </tr>
        <tr v-else-if="field.label && field.children && field.children.length > 0">
          <th :title="field.label">{{field.label}}</th>
          <td class="nopad">
            <template v-if="!field.onlyGroup">
              <show-task-bucket-table
                v-for="(v, idx) in bucket[field.id]"
                :key="field.id + idx"
                :form="field.children"
                :bucket="v"
                cellClass="nopad" />
            </template>
            <show-task-bucket-table v-else :form="field.children" :bucket="bucket" />
          </td>
        </tr>
        <tr v-else-if="!field.label && field.type === 'note' && !field.auto_hidden && field.placeholder">
          <td colspan="2" class="text-underline" :title="field.placeholder">{{field.placeholder}}</td>
        </tr>
      </tbody>
    </table>
    <!-- 查看图片弹框 -->
    <a-modal
      wrapClassName="TaskDetails-wrapClassName"
      class="TaskDetails-img-url"
      title="查看图片"
      :visible="picisible"
      :maskClosable="false"
      :footer="false"
      :centered="true"
      @cancel="closeDialog">
      <img :style="{transform: `rotate(${degree}deg)`}" class="pictrue-dialog-img" :src="imgUrl"/>
      <div class="icon-class">
        <img class="left" title="向左旋转90度" src="@/assets/img/left.png" @click="leftClick"/>
        <img class="right" title="向右旋转90度" src="@/assets/img/right.png"  @click="rightClick"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
import _ from 'lodash';
// import PreviewImage from '@/components/mixins/preview-image';

export default {
  name: 'show-task-bucket-table',
  // mixins: [PreviewImage],
  props: {
    form: {
      required: true,
      type: Array,
    },
    bucket: {
      required: true,
      // type: Object,
    },
    cellClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      degree: 0, // 图片旋转角度
      picisible: false,
      imgUrl: '', // 图片地址
    };
  },
  methods: {
    fileName(str) {
      const a = str ? str.split('/') : '';
      return str ? a[a.length - 1] : a;
    },
    leftClick() {
      this.degree -= 90;
    },
    rightClick() {
      this.degree += 90;
    },
    closeDialog() {
      this.picisible = false;
      this.degree = 0;
    },
    toBigAssign(item) {
      // 当传递字符串id时
      if (typeof (item) === 'string') {
        this.picisible = true;
        this.$axios.request({
          url: '/api/monitor/app/supervision/attach-ids',
          method: 'get',
          params: {
            attachIds: item,
          },
        }).then((response) => {
          // this.downLoadIcon(response.data.data[0].filePath);
          this.imgUrl = `/api/monitor/static/files/${response.data.data[0].filePath}`;
        });
      } else {
        // 当传递数组图片数据时
        this.toBig(item[0]);
      }
    },
    // 图片放大
    toBig(item) {
      this.picisible = true;
      // this.imgUrl = item;
      // const url = this.fileName(item);
      this.imgUrl = `/api/monitor/static/files/${item}`;
    },
    // 图片下载
    downLoadIcon(item) {
      const a = document.createElement('a');
      a.style.display = 'none';
      // eslint-disable-next-line
      // a.download = item.split('/')[item.split('/').length - 1].split('?')[0];
      a.download = this.fileName(item);

      // a.href = item;
      a.href = `/api/monitor/static/files/${item}`;
      // console.log(a.href);
      document.body.appendChild(a);
      a.click();
    },
    downloadTest(item) {
      this.$axios.request({
        url: '/api/monitor/app/supervision/attach-ids',
        method: 'get',
        params: {
          attachIds: item,
        },
      }).then((response) => {
        this.downLoadIcon(response.data.data[0]);
      });
    },
    /* eslint-disable */
    displayTaskBucketField(form, bucket, id) {
      const field = _.find(form, { id });
      if (field === undefined) {
        return '<b class="text-danger">没有找到数据</b>';
      }
      const content = bucket[id];;
      if (typeof content === 'string') {
        return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      }
      if (typeof content === 'boolean') {
        return content ? '是' : '否';
      }
      if (_.isArray(content)) {
        switch (field.type) {
          case 'daterange':
            return `${content[0] || ''}<br>${content[1] || ''}`;
          case 'attachment':
          case 'photo':
            return '&gt;&gt;预览图片或下载附件&lt;&lt;';
          default:
            return content.join(', ');
        }
      }
      if (_.isObject(content)) {
        switch (field.type) {
          case 'suit_comparison':
            return this.displaySuitComparisonBucketField(field, content);
          case 'suit_calibration':
            return `${content.name || '-'}<br>${content.v1 || '-'}<br>${content.v2 || '-'}`;
          case 'suit_reagent':
            return `${content.reagent_name}<br>${content.amount}`;
          case 'suit_spare':
            return `${content.spare_name}<br>${content.amount}`;
          case 'suit_asset':
            return `${content.asset_name}${content.asset_sn ? `[${content.asset_sn}]` : ''}`
              + `<br>${content.amount}<br>${content.from_warehouse_name || '-'}<br>${content.to_warehouse_name || '-'}`;
          case 'suit_repair':
            return `${content.begin}<br>${content.end}<br>${content.state ? '正常' : '不正常'}`
            + `<br>${content.fault}<br>${content.cause}`;
          default:
            return content;
        }
      }
      return content;
    },
    displaySuitComparisonBucketField(field, content) {
      /* eslint-disable prefer-template */
      let html = '<table class="table-nobord">';
      ['factor_name', 'sn', 'v1s', 'v2'].forEach((keyname) => {
        html += '<tr>';
        _.forOwn(content, (v) => {
          if (!v.sn && !v.factor_name) { // 外层数据
            return;
          }
          if (keyname === 'v1s' && Array.isArray(v.v1s)) {
            if (v.v1s.length > 1) { // 现场多次测量
              let title = '';
              for (let i = 0; i < v.v1s.length; i++) {
                title += `${v.v1s[i] !== undefined && v.v1s[i] !== '' ? v.v1s[i] : '-'} `
                  + `${(v.tms && v.tms[i]) ? '(' + v.tms[i] + ')' : ''}\n`;
              }
              html += `<td class="nopad" title="${title}"><b>${v.v1s.length}</b>次测量
                <i class="fa fa-info-circle"></i></td>`;
            } else { // 一次测量
              html += `<td class="nopad">${v.v1 !== undefined && v.v1 !== '' ? v.v1 : '-'} `
                + `${v.tm ? '(' + v.tm + ')' : ''}</td>`;
            }
          } else {
            html += `<td class="nopad">${v[keyname] !== undefined && v[keyname] !== '' ? v[keyname] : '-'} `;
            if (keyname === 'factor_name') {
              if (v.result === 1 || v.result === '1') {
                html += '<i class="far fa-check-circle text-success" title="比对通过"></i>';
              } else if (v.result === -1 || v.result === '-1') {
                html += '<i class="far fa-times-circle text-danger" title="比对不通过"></i>';
              }
            }
            html += '</td>';
          }
        });
        html += '</tr>';
      });
      return html + '</table>';
    },
  },
};
</script>

<style lang="scss">
  .table-nobord{
    td{
      padding: 5px 10px;
    }
  }
  .TaskDetails-wrapClassName{
    overflow: inherit!important;
  }
  .TaskDetails-img-url{
    width: 100%!important;
    position: relative;
    height: 100%!important;
    background-color: hsla(0,0%,100%,.7);
    padding-bottom: 0!important;
    >.ant-modal-content{
      height: 100%;
      background-color: rgba(255, 255, 255, 0.7);
      >.ant-modal-header{
        background: none;
      }
      >.ant-modal-body{
        position: relative;
        height: calc(100vh - 55px);
        >.pictrue-dialog-img{
          max-width: 100vw;
          max-height: calc(100vh - 55px);
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          margin: auto;
        }
        >.icon-class{
          position: absolute;
          bottom: 45px;
          left: 0;
          right: 0;
          margin: auto;
          display: block;
          width: 130px;
          height: 50px;
          >img{
            width: 30px;
            height: 30px;
            cursor: pointer;
          }
          >.left{
            position: absolute;
            left: 0;
          }
          >.right{
            position: absolute;
            right: 0;
          }
        }
      }
    }
  }
</style>


<style lang="scss" scoped>
  .basicInform-class{
    table-layout: fixed;
    margin-top: 10px;
    border-spacing: 0;
    width: 100%;
    display: block;
    tr,th,td{
      height: 35px;
      border: 1px solid #E9E9E9;
      word-break: break-all;
      word-wrap:break-word;
    }
    th{
      width: 100px!important;
      color: #2B425B;
      font-weight: bold;
      text-align: center;
      padding: 7px;
      white-space: nowrap;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    td{
      width: 93%!important;
      padding: 7px;
      // white-space: nowrap;
    }
  }
  .cur-pointer{
    cursor: pointer;
  }
  .box-inline{
    display: block;
    float: left;
    margin-left: 10px;
  }
  .text-underline{
    text-decoration: underline;
  }
</style>
