<template>
  <a-modal
    class="rule-modal"
    width="90%"
    title="评分规则库"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-row :gutter="10">
        <a-col :span="7">
          <div class="rule-wrapper wrapper">
            <a-checkbox-group v-model="checkedValue">
              <a-row>
                <a-col :span="24" v-for="(item, index) in options" :key="index">
                  <a-checkbox :value="item.ruleId">{{item.ruleName}}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </div>
        </a-col>
        <a-col :span="17">
          <div class="config-wrapper wrapper">
            <div class="text-wrapper" v-if="checkedValue.length!==0">
              <a-icon type="warning" theme="filled" /> 注：扣分明细填写后请检查是否有误</div>
            <div class="box" v-for="(value,key) in maps" :key="key">
              <div class="title-info">{{ value[0].ruleName }}</div>
              <template v-if="value.length >= 1 && value[0].calcType === 1">
                <a-form>
                  <a-row :gutter="10">
                    <a-col :span="6">
                      <a-form-item label="权重：" :labelCol="{span:6}" :wrapperCol="{span:18}">
                        <a-input-number v-model="value[0].totalPoints" :min="0" :max="100"
                          @change="_change" @blur="setItemArr(value, $event)"></a-input-number>
                      </a-form-item>
                    </a-col>
                    <a-col :span="18">
                      <a-row v-for="(item, index) in value" :key="index" :gutter="10" style="position:relative">
                        <a-col :span="8">
                          <a-form-item label="分值：" :labelCol="{span:6}" :wrapperCol="{span:18}">
                            <a-input-number v-model="item.minusPoints" :min="0" :max="100"
                              @change="_change" @blur="verifyValue(item, $event)"></a-input-number>
                          </a-form-item>
                        </a-col>
                        <a-col :span="16">
                          <a-form-item label="扣分明细：" :labelCol="{span:6}" :wrapperCol="{span:18}">
                            <a-input style="width: calc(100% - 44px);" v-model="item.remark"
                              @change="_change" @blur="verifyRemark(item, $event)"></a-input>
                          </a-form-item>
                        </a-col>
                        <a-button class="delete-btn" type="danger"
                          style="position:absolute;top:4px;right:0"
                          @click="onRemoveClick(item, value)">
                          <a-icon type="delete" theme="filled"></a-icon>
                        </a-button>
                      </a-row>
                      <a-button style="float:right;margin-right:45px" type="primary" @click="onAddClick(value)">新 增</a-button>
                    </a-col>
                  </a-row>
                </a-form>
              </template>
              <template v-if="value.length === 1 && value[0].calcType === 3">
                <a-form>
                  <a-row :gutter="10">
                    <a-col :span="6">
                      <a-form-item label="权重：" :labelCol="{span:6}" :wrapperCol="{span:18}">
                        <a-input-number v-model="value[0].totalPoints" :min="0" :max="100"
                          @blur="verifyTotalPoints(value[0], $event)"></a-input-number>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="分值：" :labelCol="{span:6}" :wrapperCol="{span:18}">
                        <a-input-number v-model="value[0].minusPoints" :min="0" :max="100"
                          @blur="verifyValue(value[0], $event)"></a-input-number>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="扣分明细：" :labelCol="{span:6}" :wrapperCol="{span:18}">
                        <a-input style="width: calc(100% - 44px);" v-model="value[0].remark"></a-input>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </template>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-spin>
    <div slot="footer">
      <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import _ from 'lodash';
import { getRuleList } from '@/api/modules/auto-score-config.js';

export default {
  data() {
    return {
      isVisible: false,
      options: [],
      itemList: [],
      spinning: false,
      maps: {},
      checkedValue: [],
      test: 0,
      preMaps: {},
      once: false,
    };
  },
  watch: {
    checkedValue: {
      handler(val) {
        const temArr = [];
        if (this.once && this.preMaps) {
          this.maps = _.cloneDeep(this.preMaps);
          this.once = false;
        } else {
          val.forEach((el) => {
            this.options.forEach((ele) => {
              if (ele.ruleId === el) {
                temArr.push(ele);
              }
            });
          });
          // 获取选中数据中存在多少种ruleId,并将每种 ruleId 都赋值为空数组
          temArr.forEach((item) => {
            if (this.preMaps[item.ruleId]) {
              this.maps[item.ruleId] = this.preMaps[item.ruleId];
            } else {
              this.maps[item.ruleId] = [];
            }
            // if (this.maps[item.ruleId] && this.maps[item.ruleId].length !== 0 && this.maps[item.ruleId][0].calcType === 1) {
            // // if (this.maps[item.ruleId] && this.maps[item.ruleId].length !== 0) {
            //   this.maps[item.ruleId] = this.maps[item.ruleId];
            // } else {
            //   this.maps[item.ruleId] = [];
            // }
          });
          // 循环接口数据，将map中存在的所有ruleId对应的对象添加到各自的空数组中
          temArr.forEach((item) => {
            if (!this.preMaps[item.ruleId] || this.preMaps[item.ruleId].length === 0) {
              if (this.maps[item.ruleId] && this.maps[item.ruleId].length !== 0 && this.maps[item.ruleId][0].calcType === 1) {
                this.maps[item.ruleId] = this.maps[item.ruleId];
              } else {
                this.maps[item.ruleId].push(item);
              }
            }
          });
          const keys = Object.keys(this.maps);
          const ids = [];
          temArr.forEach((el) => {
            ids.push(String(el.ruleId));
          });
          const temKey = keys.filter(el => ids.indexOf(el) === -1);
          temKey.forEach((el) => {
            delete this.maps[el];
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    // calcType = 1, 设置列表 权重
    setItemArr(val, el) {
      const minusArr = [];
      val.forEach((item) => {
        this.$set(item, 'totalPoints', el.target.value);
        minusArr.push(Number(item.minusPoints));
      });
      minusArr.sort((a, b) => a - b);
      if (val[0].totalPoints < minusArr[minusArr.length - 1]) {
        this.$message.warning('权重不能小于单项分值', 3);
        val.forEach((item) => {
          this.$set(item, 'totalPoints', minusArr[minusArr.length - 1]);
        });
      }
    },
    // 检验
    verifyTotalPoints(value, el) {
      if (value.minusPoints > Number(el.target.value)) {
        this.$message.warning('分值不能大于权重', 3);
        this.$set(value, 'totalPoints', value.minusPoints);
      }
    },
    // 检验权重分值minusPoints
    verifyValue(value, el) {
      if (value.totalPoints < Number(el.target.value)) {
        this.$message.warning('分值不能大于权重', 3);
        this.$set(value, 'minusPoints', value.totalPoints);
      }
    },
    // 检验明细
    verifyRemark(value, el) {
      const patt = /^((([1-9]?[0-9]|100)%([<|>]=?|=))?x(([<|>]=?|=)([1-9]?[0-9]|100)%)?)$/;
      const newPatt = /^((([1-9]?[0-9]|100)([<|>]=?|=))?x(([<|>]=?|=)([1-9]?[0-9]|100))?)$/;
      const bool = patt.test(el.target.value);
      if (!bool || el.target.value.length === 1) {
        const newBool = newPatt.test(el.target.value);
        if (newBool) {
          let str = el.target.value.replace(/ /g, '');
          const arr = [];
          // 将所有数字的索引存入arr
          for (let i = 0; i < str.length; i++) {
            // eslint-disable-next-line
            if (!isNaN(+str[i])) {
              arr.push(i);
            }
          }
          // 判断最后一个是不是%
          if (str[arr[arr.length]] !== '%') {
            str = `${str}%`;
          }
          // 判断第一个数后面是不是%
          for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] !== arr[i - 1] + 1) {
              if (i && str[arr[i]] !== '%') {
                const ser = arr[i - 1];
                const before = str.slice(0, ser + 1);
                const after = str.slice(ser + 1, str.length);
                str = `${before}%${after}`;
              }
            }
          }
          this.$set(value, 'remark', str);
        } else {
          this.$message.warning('请正确配置表达式,例：0%<=x<=30%或x=100%', 3);
          this.$set(value, 'remark', '');
        }
      }
    },
    // 删除扣分项
    onRemoveClick(item, value) {
      if (value.length === 1) {
        this.$message.warning('扣分规则至少有一条', 3);
        return;
      }
      let index = null;
      value.forEach((copyitem, i) => {
        if (item === copyitem) index = i;
      });
      value.splice(index, 1);
      this.maps[value[0].ruleId] = value;
      this.$forceUpdate();
    },
    // 新增扣分项
    onAddClick(val) {
      const {
        ruleId,
        ruleName,
        totalPoints,
        calcType,
      } = _.cloneDeep(val[0]);
      const obj = {
        ruleId,
        ruleName,
        totalPoints,
        calcType,
        remark: '',
        minusPoints: 0,
      };
      this.$set(val, val.length, obj);
      this.maps[val[0].ruleId] = val;
      this.$forceUpdate();
    },
    // 强制刷新渲染
    _change() {
      this.$forceUpdate();
    },
    // 对象数组去重
    uniqueObjArr(arr, fieldName) {
      const result = [];
      const resultArr = [];
      arr.forEach((child) => {
        if (result.indexOf(child[fieldName]) === -1) {
          result.push(child[fieldName]);
          resultArr.push(child);
        }
      });
      return resultArr;
    },
    // 弹框显示
    openDialog(map) {
      if (map) {
        this.once = true;
        this.preMaps = _.cloneDeep(map);
        this.maps = _.cloneDeep(map);
        this.getOptions();
        const temArr = Object.values(map);
        const arr = [];
        temArr.forEach((el) => {
          el.forEach((ele) => {
            arr.push(ele.ruleId);
          });
        });
        this.checkedValue = arr;
      } else {
        this.getOptions();
      }
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.options = [];
      this.checkedValue = [];
      this.maps = {};
      this.preMaps = {};
    },
    // 保存配置项
    onSave() {
      const map = _.cloneDeep(this.maps);
      const arr = [];
      Object.keys(map).forEach((key) => { arr.push(...map[key]); });
      let index;
      // 查漏补缺
      arr.forEach((item, i) => {
        if (item.remark === '') index = i;
      });
      if (index !== undefined) {
        this.$message.warning(`${arr[index].ruleName}的扣分明细不能为空`, 3);
        return;
      }
      this.$emit('save', this.maps);
      // console.log(this.maps);
      this.closeDialog();
    },
    // 获取规则树
    getOptions() {
      this.spinning = true;
      getRuleList().then((response) => {
        this.itemList = response.data.data;
        const temList = response.data.data;
        const teArr = this.uniqueObjArr(temList, 'ruleName');
        teArr.forEach((el) => {
          this.options.push(el);
        });
        this.spinning = false;
      });
    },
  },
};
</script>

<style lang="scss">
  .rule-modal.ant-modal{
    .ant-modal-content{
      .ant-modal-body{
        padding: 12px 24px;
        .delete-btn{
          padding: 0 10px;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .wrapper{
    width: 100%;
    height: 600px;
    border: 1px solid #e8e8e8;
    padding: 5px 10px;
    overflow: auto;
  }
  .config-wrapper{
    .text-wrapper{
      color: #f56c6c;
      float: right;
    }
    .box{
      .title-info{
        font-weight: bold;
        color: #409eff;
      }
    }
  }
</style>
