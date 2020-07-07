<template>
  <a-modal
    class="enter_station_dialog"
    width="1240px"
    title="点位信息"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-row style="height: 600px">
        <a-col :span="6" style="overflow-y: auto;padding-right: 10px;">
          <div class="tree_class">
            <a-card class="tree_card">
              <template #title>
                <img class="title_img" src="@/assets/img/dianwei.png"/>
                <span class="title">站点</span>
              </template>
              <span slot="extra">
                <a-icon title="新增站点" class="add_class" type="file-add" @click="onClickStation(0)"/>
              </span>
              <ul class="tree_ul">
                <li
                  class="child"
                  v-for="item in treeData"
                  :key="item.id"
                  :class="{ 'selected': item.isSelect }"
                  @click="onSelectStaion(item)">
                  <span class="text" :title="item.name">{{item.name}}</span>
                  <span class="opera_class">
                    <a-icon title="编辑站点" class="save_classs" type="edit" @click="onClickStation(1)" />
                    <a-icon title="删除站点" class="delete_class" type="delete" @click="removeStation(item)"/>
                  </span>
                  <span class="lock_class" v-show="item.isRelated">
                    <a-icon  title="已关联" type="lock" />
                  </span>
                </li>
              </ul>
            </a-card>
            <!-- <a-tree
              :expandedKeys="expandedKeys"
              :autoExpandParent="autoExpandParent"
              @select="onSelect"
              :selectedKeys="selectedKeys"
              :replaceFields="replaceFields"
              :treeData="treeData"
            /> -->
          </div>
        </a-col>
        <a-col :span="18">
          <a-card class="station_card">
            <template #title>
              <img class="title_img" src="@/assets/img/xinxi.png"/>
              <span class="title">站点信息</span>
            </template>
            <!-- <span slot="extra">
              <a-icon title="新增站点" class="add_class" type="file-add" @click="onClickStation(0)"/>
              <a-icon title="编辑站点" class="save_classs" type="edit" @click="onClickStation(1)" />
              <a-icon title="删除站点" class="delete_class" type="delete" @click="removeStation"/>
            </span> -->
            <a-row>
              <a-col :span="12">站点名称：<span class="spn">{{pointImformation.name}}</span></a-col>
              <a-col :span="12">站点mn号：<span class="spn">{{pointImformation.mn}}</span></a-col>
              <a-col :span="12">站点经度：<span class="spn">{{pointImformation.lng}}</span></a-col>
              <a-col :span="12">站点纬度：<span class="spn">{{pointImformation.lat}}</span></a-col>
            </a-row>
          </a-card>
          <a-card class="instrument_card">
            <template #title>
              <img class="title_img" src="@/assets/img/yiqi.png"/>
              <span class="title">站点仪器信息</span>
            </template>
            <!-- <span slot="extra">
              <a-icon title="新增仪器" class="add_class" type="file-add" @click="onClickInstru" />
              <a-icon title="删除仪器" class="delete_class" type="delete" @click="removeInstu" />
            </span> -->
            <div style="margin-bottom: 5px">
              <a-button type="primary" icon="plus" @click="onClickInstru"> 新 增</a-button>
              <a-button type="danger" icon="delete" :disabled="!selectedRowKeys.length" @click="removeInstu"> 删 除</a-button>
            </div>
            <a-config-provider>
              <template v-if="!instruments.length" #renderEmpty>
                <div style="text-align: center">
                  <img style="width: 340px" src="@/assets/img/no_data.gif"/>
                </div>
              </template>
              <a-table
                class="pointDailog-detail-table"
                rowKey="id"
                size="middle"
                :columns='columns'
                :scroll="{ y: 310 }"
                :dataSource='instruments'
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                :pagination="false"
              >
                <template slot="factors" slot-scope="text">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ text }}</span>
                    </template>
                    <span>{{ text }}</span>
                  </a-tooltip>
                </template>
                <template slot="operation" slot-scope="text, record">
                  <a @click="onClickInstru(record)"><a-icon type="edit"></a-icon> 编辑</a>
                </template>
              </a-table>
            </a-config-provider>
          </a-card>
        </a-col>
        <station-dialog ref="station" :companyId="companyId" @getStationData="getStationData"/>
        <instru-dialog ref="instru" :companyId="companyId" :stationId="stationId" @getInstru="getInstru"/>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  getStation, getInstru, deleteStation, deleteInsu,
} from '@/api/modules/enter-management.js';
import StationDialog from './components/StationDialog';
import InstruDialog from './components/InstruDialog';

export default {
  name: 'pointDailog',
  components: {
    StationDialog,
    InstruDialog,
  },
  data() {
    return {
      companyId: 0, // 当前选中的企业id
      stationId: 0, // 当前选中的站点id
      spinning: false,
      isVisible: false,
      selectedKeys: [],
      selectedRowKeys: [],
      replaceFields: {
        children: 'children',
        title: 'name',
      },
      treeData: [],
      pointImformation: { // 点位详情
        name: '',
        mn: '',
        lat: '',  // 纬度
        lng: '',  // 经度
      },
      instruments: [], // 仪器数据
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '仪器名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '仪器编号',
          dataIndex: 'sn',
          key: 'sn',
          scopedSlots: { customRender: 'sn' },
        },
        // {
        //   title: '站点因子',
        //   dataIndex: 'factors',
        //   key: 'factors',
        // },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    };
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 弹框显示
    openDialog(row) {
      this.instruments = [];
      if (row) {
        this.companyId = row.id;
        this.getStationData({ id: this.companyId, checkId: 0 });
      }
    },
    // 删除站点
    removeStation(item) {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前站点吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteStation([item.id]).then((res) => {
            if (res.data.code === 200 && res.data.success) {
              this.getStationData({ id: this.companyId, checkId: this.treeData[0].id });
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          });
        },
      });
    },
    // 删除仪器
    removeInstu() {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前仪器吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteInsu(this.selectedRowKeys).then((res) => {
            if (res.data.code === 200 && res.data.success) {
              this.getInstru(this.stationId);
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          });
        },
      });
    },
    // 获取企业站点
    getStationData(obj) {
      this.isVisible = true;
      getStation(obj.id).then((res) => {
        if (res.data.code === 200) {
          const values = [...res.data.data];
          if (values.length) {
            this.treeData = [...values];
            this.treeData.map((val) => {
              const obj = val;
              this.$set(obj, 'isSelect', false);
              return obj;
            });
            if (!obj.checkId) obj.checkId = this.treeData[0].id;
            this.selectTree(obj.checkId);
          } else {
            this.treeData = [];
            // eslint-disable-next-line
            Object.keys(this.pointImformation).map(val => this.pointImformation[val] = '');
          }
          this.spinning = false;
        } else {
          this.$message.error(res.data.msg);
          this.spinning = false;
        }
      });
    },
    // tree 在编辑、刷新、加载之后的默认选中
    selectTree(id) {
      if (!id) return;
      this.treeData.forEach((val) => {
        if (val.id === id) {
          val.isSelect = true;
          // 获取当前站点下数据
          this.getInstru(id);
          this.stationId = id;
          this.pointImformation = { ...val };
        } else {
          val.isSelect = false;
        }
      });
    },
    // 获取站点仪器
    getInstru(id) {
      getInstru(id).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.instruments = res.data.data;
        }
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
    // 新增、编辑站点事件
    onClickStation(type) {
      this.$refs.station.openDialog(type ? this.pointImformation : '');
    },
    // 新增、编辑仪器事件
    onClickInstru(row) {
      this.stationId = this.pointImformation.id;
      this.$refs.instru.openDialog(row ? row.id : '');
    },
    onSelectStaion(item) {
      this.treeData.map((val) => {
        const obj = val;
        obj.isSelect = false;
        return obj;
      });
      item.isSelect = true;
      this.pointImformation = item;
      this.getInstru(item.id);
    },
  },
};
</script>

<style lang="scss">
.enter_station_dialog{
  >.ant-modal-content{
    >.ant-modal-body{
      padding: 10px!important;
    }
  }
}
.station_card{
  height: 135px;
  >.ant-card-body{
    padding: 10px;
    .ant-row{
      height: 100%;
      .ant-col-12{
        height: 50%;
      }
    }
  }
}
.instrument_card{
  height: calc(100% - 145px);
  margin-top: 10px;
  >.ant-card-body{
    padding: 10px;
  }
}
.pointDailog-detail-table{
  height: calc(100% - 35px);
  // overflow-y: auto;
  .ant-table-content{
    min-height: 0;
  }
}
</style>

<style lang="scss" scoped>
$pri-color: #1890FF;
.pri-color{
  color: #1890FF;
  cursor: pointer;
}
.spn{
  font-weight: 600;
}
.save_classs{
  @extend .pri-color;
  margin-left: 10px;
}
.delete_class{
  color: #FF4D4F;
  margin-left: 10px;
  cursor: pointer;
}
.lock_class{
  position: absolute;
  right: 10px;
  height: 100%;
  width: 14px;
  margin: auto;
  top: 0;
}
.add_class{
  @extend .pri-color;
  margin-left: 10px;
}
.upload_class{
  @extend .pri-color;
}
.tree_class{
  height: 100%;
  position: relative;
  >.tree_card{
    height: 100%;
    .tree_ul{
      height: 100%;
      padding: 10px 10px 0 10px;
      .selected{
        background: #bae7ff!important;
      }
      >.child{
        height: 35px;
        width: 100%;
        line-height: 35px;
        padding: 0;
        padding-left: 5px;
        cursor: pointer;
        user-select: none;
        margin-top: 5px;
        position: relative;
        >.text{
          max-width: 75%;
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        >.opera_class{
          width: 60px;
          height: 100%;
          position: absolute;
          right: 20px;
          top: 0;
          display: none;
        }
        &:nth-child(1){
          margin-top: 0;
        }
        &:hover{
          background: #e6f7ff;
          .opera_class{
            display: block!important;
          }
        }
      }
    }
  }
}
.title_img{
  width: 20px;
  margin-right: 5px;
}
.title{
  color: #409eff;
  font-weight: 600;
}
</style>
