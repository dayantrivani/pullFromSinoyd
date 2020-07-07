<template>
  <el-row :gutter="$config.space" class="fill-h">
      <el-col :span="24" :h="6" class="mar-t-xs">
        <!-- 站点信息显示 -->
        <!-- <el-card type="title" fill> -->
        <div class="title-info mar-l-sm mar-t-xs">站点信息</div>
        <!-- 表单展示内容 -->
        <el-form ref="form" :model="itemModelOne" label-width="117px">
          <el-row :gutter="10" class="pad-x-sm">
            <el-col :span="24">
              <el-row class="mar-y-xs">
                <el-col :span="6">
                  <el-form-item label="污染源名称：">
                    <span>{{itemModelOne.psName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="站点名称：">
                    <span>{{itemModelOne.portName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="站点简称：">
                    <span>{{itemModelOne.portShortName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="站点类型：">
                    <span>{{portInfo.childPortTypeName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mar-b-xs">
                <el-col :span="6">
                  <el-form-item label="站点编号：">
                    <span>{{itemModelOne.portCode}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="进/出口：">
                    <span>{{`${itemModelOne.isOutput === 0 ? '出口': '进口'}`}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="监管级别：">
                    <!-- <span>{{$enum.getLabel('KEY_POLLUTANT', itemModelOne.attentionDegree)}}</span> -->
                    <span>{{itemModelOne.attentionDegreeName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="经度：">
                    <span>{{itemModelOne.longitude}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="纬度：">
                    <span>{{itemModelOne.latitude}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="数采仪MN号：">
                    <span>{{itemModelOne.dgiMn}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="是否启用：">
                    <span>{{`${itemModelOne.status === 0 ? '停用' : '启用'}`}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="是否联网：">
                    <span>{{`${itemModelOne.isNetWorking === 0 ? '已联网' : '未联网'}`}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="联系人电话：">
                    <span>{{itemModelOne.contactPhoneNumber}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
        <!-- </el-card> -->
      </el-col>
      <el-col :span="24" :h="6" class="mar-t-xs">
        <!-- 污染源信息显示 -->
        <!-- <el-card type="title" fill> -->
          <div class="title-info mar-l-sm mar-t-xs">污染源信息</div>
          <!-- 表单展示内容 -->
          <el-row :gutter="10" class="pad-x-sm">
            <el-col :span="24">
              <el-form ref="form" :model="itemModelTwo" label-width="131px">
                <el-row class="mar-y-xs">
                  <el-col :span="6">
                    <el-form-item label="统一社会信用代码：">
                      <span>{{itemModelTwo.socialCreditCode}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="污染源名称：">
                      <span>{{itemModelTwo.psName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="污染源简称：">
                      <span>{{itemModelTwo.psShortName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="污染源编码：">
                      <span>{{itemModelTwo.psCode}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="mar-b-xs">
                  <el-col :span="6">
                    <el-form-item label="行业类别：">
                      <span>{{itemModelTwo.industryTypeName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="所属区域：">
                      <span>{{itemModelTwo.regionName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="经度：">
                      <span>{{itemModelTwo.psLongitude}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="纬度：">
                      <span>{{itemModelTwo.psLatitude}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        <!-- </el-card> -->
      </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PaneOutletInfo',
  data() {
    return {
      itemModelOne: {
        // psName: '',                           // 污染源名称：
        // portName: '',                         // 站点名称：
        // portShortName: '',                    // 站点简称：
        // childPortTypeName: '',                // 站点类型：
        // portCode: '',                         // 站点编号：
        // isOutput: '',                         // 进/出口：
        // attentionDegreeName: '',              // 监管级别：
        // longitude: '',                        // 经度：
        // latitude: '',                         // 纬度：
        // dgiMn: '',                            // 数采仪MN号：
        // status: '',                           // 是否启用：
        // isNetWorking: '',                     // 是否联网：
        // contactPhoneNumber: '',               // 联系人电话：
      },
      itemModelTwo: {
        // socialCreditCode: '',        // 统一社会信用代码
        // psName: '',                  // 污染源名称
        // psShortName: '',             // 污染源简称
        // psCode: '',                  // 污染源编码
        // psType: '',                  // 行业类型
        // regionName: '',              // 所属区域
        // longitude: '',               // 经度
        // latitude: '',                // 纬度
      },
    };
  },
  watch: {
    // eslint-disable-next-line
    'itemModelTwo.psType': function () {
      if (this.itemModelTwo.psType === 1) {
        this.itemModelTwo.psType = '污染源';
      } else if (this.itemModelTwo.psType === 2) {
        this.itemModelTwo.psType = '客户';
      } else if (this.itemModelTwo.psType === 4) {
        this.itemModelTwo.psType = '供应商';
      } else if (this.itemModelTwo.psType === 8) {
        this.itemModelTwo.psType = '考核单位';
      } else if (this.itemModelTwo.psType === 16) {
        this.itemModelTwo.psType = '分包商';
      } else if (this.itemModelTwo.psType === 32) {
        this.itemModelTwo.psType = '生产厂商';
      } else if (this.itemModelTwo.psType === 64) {
        this.itemModelTwo.psType = '鉴定机构';
      }
    },
    // eslint-disable-next-line
    'portInfo.portId'(val) {
      this.getFormData();
    },
  },
  computed: {
    ...mapState({
      portInfo: state => state.portInfo,
      portType: state => state.portType,
    }),
    attentionDegree() {
      let attentionDegree = '';
      if (this.itemModelOne.attentionDegree === 1) {
        attentionDegree = '国控';
      } else if (this.itemModelOne.attentionDegree === 2) {
        attentionDegree = '省控';
      } else if (this.itemModelOne.attentionDegree === 4) {
        attentionDegree = '市控';
      } else if (this.itemModelOne.attentionDegree === 8) {
        attentionDegree = '区控';
      }
      return attentionDegree;
    },
  },
  created() {
    this.getFormData();
  },
  methods: {
    // 获取表单详情
    getFormData() {
      this.$http.get('bas/portInfo/siteDetails', {
        params: {
          portId: this.portInfo.portId,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemModelOne = response.data.data;
          this.itemModelTwo = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>
