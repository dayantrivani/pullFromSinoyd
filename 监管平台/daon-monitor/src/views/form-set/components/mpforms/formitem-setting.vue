<template>
  <div class="mp-item-setting">
    <div v-if="typeof item.label !== 'undefined'" class="field">
      <div class="fieldname">
        字段标识 <small class="text-muted">用于在报告中引用数据</small>
        <el-tooltip placement="top" effect="light">
          <div slot="content">
            <b>注意：</b>
            字段标识在同一个表单中不能重复。<br />
            以字母开头，后续跟字母、数字或下划线，建议自己起一个有意义的名称。<br />
            修改已保存的字段标识会导致之前提交的表单数据无法被报表正确引用！
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <div class="fieldblock">
        <el-input v-model="item.id"></el-input>
      </div>
    </div>
    <div v-if="typeof item.label !== 'undefined'" class="field">
      <div class="fieldname">
        标题 <small class="text-muted">显示的字段名称</small>
      </div>
      <div class="fieldblock">
        <el-input v-model="item.label"></el-input>
      </div>
    </div>
    <div v-if="typeof item.placeholder !== 'undefined'" class="field">
      <div class="fieldname">
        说明文字
        <small v-if="typeof item.label !== 'undefined'" class="text-muted">
          当不输入任何值时的提示
        </small>
        <small v-if="item.type === 'note'" class="text-muted">
          显示的说明文字（该控件无法输入仅做提示说明）
        </small>
      </div>
      <div class="fieldblock">
        <el-input
          v-if="item.type === 'note'"
          v-model="item.placeholder"
          :auto-size="{ minRows: 2 }"
          type="textarea"
        >
        </el-input>
        <el-input v-else v-model="item.placeholder"></el-input>
      </div>
    </div>
    <template v-for="i in [2, 3, 4]">
      <div v-if="typeof item[`label${i}`] !== 'undefined'" :key="i" class="field">
        <div class="fieldname">
          标题{{ i }}
        </div>
        <div class="fieldblock">
          <el-input v-model="item[`label${i}`]"></el-input>
        </div>
      </div>
      <div v-if="typeof item[`placeholder${i}`] !== 'undefined'" :key="i * 3" class="field">
        <div class="fieldname">
          说明文字{{ i }}
        </div>
        <div class="fieldblock">
          <el-input v-model="item[`placeholder${i}`]"></el-input>
        </div>
      </div>
    </template>

    <!-- 测量套件 -->
    <div v-if="typeof item.measure_times !== 'undefined'" class="field">
      <div class="fieldname">
        现场测量次数
      </div>
      <div class="fieldblock">
        <el-input-number v-model="item.measure_times" :min="1"></el-input-number>
      </div>
    </div>
    <div v-if="typeof item.record_measuring_time !== 'undefined'" class="field">
      <div class="fieldname">
        是否录入测量时间
      </div>
      <div class="fieldblock">
        <el-checkbox v-model="item.record_measuring_time">
          记录
        </el-checkbox>
      </div>
    </div>

    <!-- 日期区间 -->
    <div v-if="item.format" class="field">
      <div class="fieldname">
        日期类型
      </div>
      <div class="fieldblock">
        <el-radio v-model="item.format" label="yyyy-MM-dd HH:mm">
          年-月-日 时:分
        </el-radio>
        <el-radio v-model="item.format" label="yyyy-MM-dd">
          年-月-日
        </el-radio>
      </div>
    </div>

    <!-- 多选或单选/文字快捷填写 -->
    <div v-if="item.options" class="field">
      <div class="fieldname">
        {{ hasNonableOptions(item) ? '快捷输入': '选项' }}
        <a
          v-if="item.type !== 'qselect'"
          class="cur-pointer add-opt"
          @click.stop.prevent="addOption"
        >
          <i class="el-icon-plus"></i>
        </a>
        <small v-if="item.type === 'text' || item.type === 'textarea'" class="text-muted">
          用户可以从候选文字中选取并继续修改
        </small>
      </div>
      <div class="fieldblock">
        <div v-for="(option, idx) in item.options" :key="idx" class="field-setting-option">
          <el-input v-model="item.options[idx]">
            <!-- qselect 无法增减项目 -->
            <template v-if="item.type !== 'qselect'" slot="append">
              <a
                :class="{disabled: item.options.length === 1 && idx === 0}"
                class="cur-pointer remove-opt"
                @click.stop.prevent="removeOption(idx)"
              >
                <i class="el-icon-minus"></i>
              </a>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 默认值 -->
    <div v-if="typeof item.default !== 'undefined'" class="field">
      <div class="fieldname">
        默认值 <small class="text-muted">App打开时该控件的初始默认值</small>
      </div>
      <!-- 开关选择的默认也是个switch -->
      <div v-if="item.type === 'switch'" class="fieldblock">
        <el-switch v-model="item.default"></el-switch>
      </div>
      <!-- 快捷选择可以有默认值 -->
      <div v-else-if="item.type === 'qselect' || item.type === 'select'" class="fieldblock">
        <el-select v-model="item.default" style="width:100%">
          <el-option label="" value="" />
          <el-option v-for="(i, idx) in item.options" :key="idx" :label="i" :value="i" />
        </el-select>
      </div>
      <!-- 其他的都是文字 -->
      <div v-else class="fieldblock">
        <el-input v-model="item.default"></el-input>
      </div>
    </div>

    <!-- 必填 -->
    <div v-if="typeof item.required !== 'undefined'" class="field">
      <div class="fieldname">
        验证 <small class="text-muted">用户是否必须在该字段填写或选择</small>
      </div>
      <div class="fieldblock">
        <el-checkbox v-model="item.required">
          必填
        </el-checkbox>
      </div>
    </div>

    <div v-if="typeof item.auto_hidden !== 'undefined'" class="field">
      <div class="fieldname">
        显示
      </div>
      <div class="fieldblock">
        <el-checkbox v-model="item.auto_hidden">
          不在统计页显示
        </el-checkbox>
      </div>
    </div>

    <!-- 明细的增加 -->
    <div v-if="typeof item.collapsible !== 'undefined'" class="field">
      <div class="fieldname">
        明细可收起/展开
      </div>
      <div class="fieldblock">
        <el-checkbox v-model="item.collapsible" label=" 该明细分组内的控件可以收起隐藏或展开显示"></el-checkbox>
      </div>
    </div>
    <div v-if="typeof item.collapsed !== 'undefined' && item.collapsible" class="field">
      <div class="fieldname">
        初始收起状态
      </div>
      <div class="fieldblock">
        <el-checkbox v-model="item.collapsed" label=" 界面打开时该明细的控件是否默认收起隐藏"></el-checkbox>
      </div>
    </div>
    <div v-if="typeof item.onlyGroup !== 'undefined'" class="field">
      <div class="fieldname">
        仅组件分组
        <el-tooltip placement="top" effect="light">
          <div slot="content">
            <b>注意：</b>更改此设置也会导致报告引用方式发生变化，请谨慎考虑使用场景，<br />
            不要轻易修改，否则报告模板需要更新后才能使用。
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
      <div class="fieldblock">
        <el-checkbox v-model="item.onlyGroup"></el-checkbox> 仅分组方便分区块展示，若不是，则App端可以重复追加该明细内容
      </div>
    </div>
    <div
      v-if="typeof item.action_name !== 'undefined'
        && (item.onlyGroup === false || item.onlyGroup === undefined)"
      class="field"
    >
      <div class="fieldname">
        动作名称
      </div>
      <div class="fieldblock">
        <el-input v-model="item.action_name"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
    };
  },
  computed: {
    nextIndex() {
      return this.item.options ? this.item.options.length + 1 : 1;
    },
  },
  methods: {
    removeOption(i) {
      if (this.hasNonableOptions(this.item) || this.item.options.length > 1) {
        this.item.options.splice(i, 1);
      }
    },
    addOption() {
      if (this.item.options.length <= 1000) {
        const word = this.item.type === 'select' || this.item.type === 'multiselect' ? `选项${this.nextIndex++}` : '';
        this.item.options.push(word);
      }
    },
    hasNonableOptions(item) {
      return item.type === 'text' || item.type === 'textarea' || item.type === 'number';
    },
  },
};
</script>

<style lang="scss">
.mp-item-setting {
  .field-setting-option {
    user-select: none;
    margin-bottom: -1px;
    & input[type=text]:focus {
      position: relative;
      z-index: 1;
    }

    .add-opt:hover {
      color: #71a436;
    }
    .remove-opt:hover {
      color: #eb2521;
    }
  }
}
</style>
