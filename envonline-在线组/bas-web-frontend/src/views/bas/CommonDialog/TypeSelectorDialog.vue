<template>
  <!-- 污染源管理 01-污染源加污水厂基本信息 马俊-->
  <div class="allSelect">
    <el-dialog
      :close-on-click-modal="false"
      :width="select.size"
      :visible.sync="dialogVisible">
      <div slot="title" class="dialogTitle">
        <span class="logo-name">{{select.title}}</span>
      </div>
      <!-- 嵌套内容 -->
      <div class="selectBox">
        <!-- 根据select.data数组 中的对象个数 实现循环 -->
        <div class="selectItem" :class="{ WIDTH: isClass }" v-for="(item, index) in select.data" :key="index">
          <el-card class="itemCard">
            <div slot="header" class="clearfix">
              <span style="line-height: 20px;">{{item.text}}</span>
            </div>
            <!-- 列表动态数据 -->
            <div
              class="itemContent"
              v-for="(oitem, i) in item.itemDateAll"
              :key="i"
              :class="{ clickClass: select.data[index].itemDateAll[i].clickClass,
                visitedClass: select.data[index].itemDateAll[i].visitedClass }"
              @click="getItemDate(oitem, index, i)">
              {{oitem.CodeValue + ' | ' + oitem.Text}}
            </div>
          </el-card>
        </div>
        <!-- 清除浮动 -->
        <div style="clear: both;"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="footerText">
          {{select.footer}}<span style="color: red; width:60%">{{options}}</span>
        </div>
        <el-button type="primary" @click="keepDate">
          <i class="fa fa-fw fa-floppy-o" aria-hidden="true"></i> 保 存
        </el-button>
        <el-button @click="dialogVisible = false">
          <i class="fa fa-fw fa-times" aria-hidden="true"></i> 关 闭
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // name: 'allSelect',
  name: 'TypeSelectorDialog',
  data() {
    return {
      code: '受纳水体代码', // 适配后台数据
      select: {
        title: '选择受纳水体',
        data: [ // 列表项名称
          {
            text: '流域',
            itemDateAll: [],
          },
          {
            text: '干流',
            itemDateAll: [],
          },
          {
            text: '一级支流',
            itemDateAll: [],
          },
          {
            text: '二级支流',
            itemDateAll: [],
          },
          {
            text: '其他河流',
            itemDateAll: [],
          },
        ],
        footer: '选择当前受纳水体 :',
        size: 'large',
      },
      route: [], // 点击的路径
      options: '',  // 最后选中字段的名字
      dropDownList: { // 传递给父组件的数据(选中内容名称和编号)
        Value: '',
        Text: '',
      },
      itemDate: [], // 所有的列表数据
      dialogVisible: false, // dialog框是否显示
      isClass: false,  // 是否使用列表数为3的样式
    };
  },
  methods: {
    handleClose(done) {
      done();
    },
    getItemDate(val, num, i) {
    // val 是前一级数据的 Text 和 Value, num表示当前数据的级数, i表示当前级数下列表的第几行

      // 设置 前1-n级别的 数据 的clickClass为false
      this.select.data.forEach((item, index) => {
        // 各级别点击的是哪个按钮
        const routeIndex = this.route[index].index;
        if (index <= num) {
          // 各级别点击样式清除
          this.select.data[index].itemDateAll[routeIndex].clickClass = false;
        }
      });
      // 设置当前级别的所有visitedClass 为false
      const routeNum = this.route[num].index;
      this.select.data[num].itemDateAll[routeNum].visitedClass = false;
      // 给 点击的div添加样式clickClass 和 visitedClass
      this.select.data[num].itemDateAll[i].clickClass = true;
      this.select.data[num].itemDateAll[i].visitedClass = true;

      // 记录路径
      this.route[num].item = this.select.data[num].itemDateAll[i].Text;
      this.route[num].index = i;
      // 清空后面的数据
      this.route.forEach((item, index) => {
        if (index > num) {
          this.route[index] = {
            index: 0,
            item: 0,
          };
        }
      });
      // 左下方文字
      this.options = val.Text;
      this.dropDownList = val;
      if (this.select.data[num + 1] === undefined) {
        // 如果是最后一项,那么将不执行下面的请求操作
        return;
      }
      this.$http.get('V1/Biz/GetCodeMappingDropDownListByName', {
        params: {
          name: this.code,
          parentId: val.Value,
        },
      }).then((response) => {
        // 数据传输成功,执行代码
        if (response.data.success) {
          // 清空前次操作遗留在对象中的数据
          this.select.data.forEach((item, index) => {
            if (index > num) {
              // item.itemDateAll = [];
              this.$set(item, 'itemDateAll', []); // 可能有错
            }
          });
          // this.select.data[num + 1].itemDateAll = response.data;
          // 给每个数据对象添加两个属性 clickClass 是否开启点击样式; visited 是否开启点击后样式;
          response.data.data.forEach((item) => {
            const reviseItem = Object.assign({
              clickClass: false,
              visitedClass: false,
            }, item);
            this.select.data[num + 1].itemDateAll.push(reviseItem);
          });
        }
      });
    },
    selectDialogClick(val) {
      // 清空选中字段 和 传输对象
      this.options = '';
      this.dropDownList = {
        Value: '',
        Text: '',
      };
      this.code = val;
      this.$http.get('sys/enumCode/', {
        params: {
          name: this.code,
          parentld: 0,
          codeValue: 'valleyId',
        },
      }).then((response) => {
      // 数据传输成功,执行代码
        if (response.data.success) {
          // 1. 判断点击的按钮
          if (val === '受纳水体代码') { // 受纳水体
            this.receiving();
          } else if (val === '所在行政区代码') { // 行政区
            this.district();
          } else if (val === '行业代码') { // 行业
            this.industry();
          }
          // 2. 数据对接
          // this.select.data[0].itemDateAll = response.data;
          response.data.data.forEach((item) => {
            const reviseItem = Object.assign({
              clickClass: false,
              visitedClass: false,
            }, item);
            this.select.data[0].itemDateAll.push(reviseItem);
          });
          // 3. 路径对接
          this.route = [];
          this.select.data.forEach(() => {
            const obj = {
              index: 0,
              item: 0,
            };
            this.route.push(obj);
          });
          // 4. 打开dialog
          this.dialogVisible = true;
        }
      });
    },
    receiving() { // 受纳水体
      this.isClass = false;
      this.code = '受纳水体代码';
      this.select = {
        title: '选择收纳水体',
        size: '80%',
        footer: '选中的当前受纳水体: ',
        data: [
          {
            text: '流域',
            itemDateAll: [],
          },
          {
            text: '干流',
            itemDateAll: [],
          },
          {
            text: '一级支流',
            itemDateAll: [],
          },
          {
            text: '二级支流',
            itemDateAll: [],
          },
          {
            text: '其他河流',
            itemDateAll: [],
          },
        ],
      };
    },
    district() { // 行政区
      this.isClass = true;
      this.code = '所在行政区代码';
      this.select = {
        title: '选择行政区',
        size: '50%',
        footer: '当前选择: ',
        data: [
          {
            text: '省/直辖市',
            itemDateAll: [],
          },
          {
            text: '市/区',
            itemDateAll: [],
          },
          {
            text: '区',
            itemDateAll: [],
          },
        ],
      };
    },
    industry() { // 行业
      this.isClass = true;
      this.code = '行业代码';
      this.select = {
        title: '选择行业',
        size: '50%',
        footer: '当前选中的行业: ',
        data: [
          {
            text: '大行业',
            itemDateAll: [],
          },
          {
            text: '中行业',
            itemDateAll: [],
          },
          {
            text: '小行业',
            itemDateAll: [],
          },
        ],
      };
    },
    keepDate() { // 保存按钮
      this.dialogVisible = false;
      // 传递数据给vuex 在vuex的方法中判断是哪个页面
      this.$emit('updataItem', {
        dialogType: this.code,
        dialogData: this.dropDownList,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$border1: rgb(136, 149, 167); // 内容边框颜色
$border2: rgb(152, 174, 201);
$backgroundColor1: #99A9BF; // 背景颜色

.WIDTH{
  width: 32% !important;
  &:not(:first-child){
    margin-left: 2% !important;
  }
}
.visitedClass{
  background-color: $backgroundColor1 !important;
  color: white !important;
}
.clickClass{
  background-color: rgba(24, 145, 242, .9)!important;
  color: white !important;
}


.allSelect{
  .dialogTitle{
    display: inline-block;
    .logo-name{
      line-height: 1px;
      font-size: 16px;
      font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
      font-weight: 700;
      color: #1f2c3d;
    }
  }
  .selectBox{
    width: 100%;
    .selectItem{
      box-sizing: border-box;
      float: left;
      width: 19%;
      height: 67vh;
      // border: 1px solid @border1;
      border-radius: 8px;
      padding: 14px 10px 10px 8px;
      &:not(:first-child){
        margin-left: 1.25%;
      }
      // .borderText{
      //   display: inline-block;
      //   position: absolute;
      //   top: -7px;
      //   left: 10px;
      //   height: 15px;
      //   padding: 0px 2px;
      //   font-size: 15px;
      //   font-weight: 400;
      //   background-color: #ffffff;
      //   line-height: 15px;
      //   letter-spacing: 1px;
      // }
      .itemCard{
        width: 100%;
        height: 100%;
        overflow: auto;
        .clearfix{
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 1px;
        }
        .itemContent{
          padding: 5px;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
          &:hover{
            background-color: $backgroundColor1;
            color: white;
          }
        }
      }
    }
  }
  .footerText{
    box-sizing: border-box;
    // float: left;
    display: inline-block;
    width: 50%;
    height: 32px;
    border: 1px solid #e9e9e9;
    // border-radius: 2%;
    padding: 8px 0 9px 10px;
    color: #000000;
    font-size: 15px;
    text-align: left;
    line-height: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    letter-spacing: 1px;
    span{
      font-size: 14px;
    }
  }
}
</style>
