<template>
  <div class="mp-form-generator" v-loading="loading">
    <div class="widgetspanel">
      <div class="paneltab">
        <a class="tabitem active">控件库</a>
      </div>
      <div class="clearfix panelbody">
        <div class="widgetitem"
          v-for="(widget, index) in widgets"
          :key="index"
          draggable="true"
          @dragstart="onWidgetDragstart($event, widget)"
          @dragend="onAnyDragend($event)">
          {{widget.label}}
          <i :class="['fa', 'fa-fw', 'text-muted', 'text-lg', 'fa-' + widget.icon]"></i>
        </div>
      </div>

      <!-- <div class="paneltab">
        <a class="tabitem active">套件库</a>
      </div>
      <div class="clearfix panelbody">
        <div class="widgetitem"
          v-for="(widget, index) in suits"
          :key="index"
          draggable="true"
          @dragstart="onWidgetDragstart($event, widget)"
          @dragend="onAnyDragend($event)">
          <i :class="['fa', 'fa-fw', 'text-muted', 'text-lg', 'fa-' + widget.icon]"></i> {{widget.label}}
        </div>
      </div> -->
    </div>

    <div class="formwrapper">
      <div class="formcanvas mini-scroller" @drop="onCanvasDrop($event)" @dragover="onCanvasDragover($event)">
        <mp-formitem
          v-for="(item, index) in form.fieldList"
          :key="index"
          :item="item"
          :currentItem="currentItem"
          :movingItem="movingItem"
          :onRemoveFormitem="onRemoveFormitem"
          :onEnterFormitem="onEnterFormitem"
          :onLeaveFormitem="onLeaveFormitem"
          :onStartFormitem="onStartFormitem"
          :onAnyDragend="onAnyDragend"
          :onActiveFormitem="onActiveFormitem"
          :onEnterFormarea="onEnterFormarea"
          :onLeaveFormarea="onLeaveFormarea"
        />
      </div>
    </div>

    <div class="settingpanel">
      <div class="paneltab">
        <a :class="{tabitem: true, active: settingTab=='component'}"
          @click.stop.prevent="switchSettingTab('component')"
          >控件设置
        </a>
        <a :class="{tabitem: true, active: settingTab=='form'}"
          @click.stop.prevent="switchSettingTab('form')"
          >表单设置
        </a>
      </div>
      <div class="clearfix panelbody">
        <div v-if="settingTab === 'component'">
          <mp-formitem-setting v-if="currentItem" :item="currentItem" />
        </div>
        <mp-form-setting v-else ref="formSetting" :attachList="attachList" :form="form" />
      </div>
      <div class="panelfoot">
        <!-- <router-link class="el-button el-button--small" :to="{ name: 'FormManage' }">
          <i class="fa fa-chevron-left fa-fw"></i> 返回
        </router-link> -->
        <el-button type="primary" @click="toBack">
          <i class="fa fa-fw fa-save"></i> 返回
        </el-button>
        <el-button type="primary" @click="saveForm">
          <i class="fa fa-fw fa-save"></i> 保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import MpFormSetting from './mpforms/form-setting';
import MpFormitemSetting from './mpforms/formitem-setting';
import MpFormitem from './mpforms/formitem';
import { save, getOne } from '@/api/modules/form-set.js';

const MarkItem = { type: '_mark' };
export default {
  name: 'formly',
  components: {
    MpFormSetting,
    MpFormitemSetting,
    MpFormitem,
  },
  data() {
    return {
      loading: true,
      widgets: [
        {
          label: '单行输入框', icon: 'i-cursor', type: 'text', placeholder: '请输入',
        },
        {
          label: '多行输入框', icon: 'i-cursor', type: 'textarea', placeholder: '请输入',
        },
        {
          label: '数字输入框', icon: 'i-cursor', type: 'number', placeholder: '请输入',
        },
        {
          label: '说明文字', icon: 'comment', type: 'note', placeholder: '说明',
        },
        {
          label: '开关选择', icon: 'toggle-on', type: 'switch', placeholder: '请选择',
        },
        {
          label: '快捷选择', icon: 'hand-pointer', type: 'qselect', placeholder: '请选择',
        },
        {
          label: '单选框', icon: 'dot-circle', type: 'select', placeholder: '请选择',
        },
        {
          label: '多选框', icon: 'check-square', type: 'multiselect', placeholder: '请选择',
        },
        {
          label: '日期', icon: 'calendar', type: 'date', placeholder: '请选择',
        },
        {
          label: '日期区间', icon: 'calendar-minus', type: 'daterange', placeholder: '请选择',
        },
        {
          label: '图片', icon: 'file-image', type: 'photo', placeholder: '请上传图片',
        },
        {
          label: '附件', icon: 'paperclip', type: 'attachment', placeholder: '请上传附件',
        },
        {
          label: '金额', icon: 'yen-sign', type: 'money', placeholder: '请输入',
        },
        {
          label: '手写签名', icon: 'edit', type: 'signature', placeholder: '手写输入',
        },
        // {
        //   label: '人员选择', icon: 'user', type: 'staff', placeholder: '请选择',
        // },
        // {
        //   label: '计算组件', icon: 'calculator', type: 'compute', placeholder: '自动计算',
        // },
        {
          label: '明细', icon: 'list', type: 'table', placeholder: '请输入',
        },
      ],
      suits: [
        {
          label: '比对套件', icon: 'exchange', type: 'suit_comparison', placeholder: '样品编号、序号、时间等',
        },
        {
          label: '校准套件', icon: 'tachometer', type: 'suit_calibration', placeholder: '校准的参数名称',
        },
        {
          label: '试剂更换套件', icon: 'flask', type: 'suit_reagent', placeholder: '请选择试剂',
        },
        {
          label: '配件更换套件', icon: 'cubes', type: 'suit_spare', placeholder: '请选择配件',
        },
        {
          label: '物资申请套件', icon: 'sticky-note', type: 'suit_asset', placeholder: '请选择物资名称',
        },
        {
          label: '故障处理套件', icon: 'wrench', type: 'suit_repair', placeholder: '请选择故障开始时间',
        },
      ],
      attachList: [],  // 附件列表
      form: {
        name: '自定义表单',
        // group_id: 0,
        comment: '',
        relatedAlarm: true,
        fieldList: [],
        reportId: '',
        fieldsCount: '',
      },
      id: '',
      initForm: {},
      currentItem: null, // 当前正在编辑的表单项目
      currentWidget: null, // 当前正在拖放将要加入表单的控件类型
      settingTab: 'form', // 设置上选中的tab
      hoveringItem: null, // 拖动目标表单项目
      hoveringArea: null, // 拖动目标表单详情
      movingItem: null, // 拖动着的表单项目
    };
  },
  computed: {},
  watch: {
    settingTab(val) {
      if (val === 'form') {
        this.$nextTick(() => {
          this.$refs.formSetting.changeAttch();
        });
      }
    },
  },
  created() {
    this.loading = false;
    // @title 自定义/编辑表单;
    // this.$mp.bread([
    //   { title: '表单设置', location: { name: 'FormManage' } },
    //   {
    //     title: this.$route.params.id === 'create' ? '自定义表单' : this.$route.params.name,
    //     location: { name: 'FormEdit' },
    //   },
    // ]);
    // if (this.$route.params.id === 'create') {
    //   this.loading = false;
    //   this.initForm = _.cloneDeep(this.form);
    // } else {
    //   this.$axios.get(`form/${this.$route.params.id}`).then((resp) => {
    //     this.form = resp.data;
    //     this.initForm = _.cloneDeep(this.form);
    //   }, (resp) => {
    //     this.$mp.alarmResponse(resp);
    //   }).finally(() => {
    //     this.loading = false;
    //   });
    // }
  },
  mounted() {
    if (!('ondragend' in document.createElement('div')) || document.documentMode <= 9) {
      this.$message.error('您的浏览器不支持操作自定义表单，请使用如谷歌、火狐、Edge或IE10以上的高级浏览器。');
    }
  },
  methods: {
    getOneData(id) {
      getOne(id).then((res) => {
        this.id = id;
        if (res.data.code === 200 && res.data.success) {
          const { data } = res.data;
          this.form = {
            name: data.name,
            comment: data.comment,
            relatedAlarm: data.relatedAlarm,
            fieldList: data.fieldList,
            fieldsCount: data.fieldsCount,
            reportId: data.reportId,
          };
          this.attachList = data.attach ? [data.attach] : [];
          this.toEnter();
          this.$emit('swtichType', true);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    toEnter() {
      this.initForm = _.cloneDeep(this.form);
    },
    toBack() {
      if (!_.isEqual(this.form, this.initForm)) { // has form data change?
        const _this = this;
        this.$confirm({
          title: '您对该表单进行的修改还没有保存，确定要离开吗？',
          onOk() {
            _this.$emit('swtichType', false);
          },
          onCancel() {
            _this.$emit('swtichType', true);
          },
          class: 'test',
        });
      } else {
        this.$emit('swtichType', false);
      }
    },
    /* eslint-disable */
    onWidgetDragstart(evt, widget) {
      evt.dataTransfer.setData('text/plain', 'dummy'); // needed in firefox
      this.currentWidget = widget;
    },
    onAnyDragend(evt) {
      evt.preventDefault();
      // 为避免用户拖入控件又拖出范围放弃，或者移动中途放弃，做收尾清除工作
      setTimeout(() => {
        if (this.deepRemoveItem(MarkItem)) {
          this.currentWidget = null;
          this.movingItem = null;
          this.hoveringItem = null;
          this.$forceUpdate();
        }
      }, 10);
    },
    // 创建控件原型
    newItem() {
      // const arr = ['Asignature', 'Aattachment', 'Aphoto'];
      // const id = arr.includes(this.currentWidget.type) ?
      //   this.generateUniqId(this.currentWidget.type.substr(0, 2)) :
      //   this.generateUniqId(this.currentWidget.type.substr(0, 1));
      // console.log(id);
      const item = {
        id: this.generateUniqId(this.currentWidget.type.substr(0, 1)),
        type: this.currentWidget.type,
        label: this.currentWidget.label,
        placeholder: this.currentWidget.placeholder || '',
        required: false,
      };
      if (item.type === 'text' || item.type === 'textarea' || item.type === 'number') {
        item.options = [];
      }
      if (item.type === 'switch') {
        delete item.placeholder;
        delete item.required;
        item.default = true;
      }
      if (item.type === 'select' || item.type === 'multiselect') {
        item.options = ['选项1', '选项2', '选项3'];
      }
      if (item.type === 'qselect') {
        delete item.placeholder;
        delete item.required;
        item.options = ['正常', '不正常'];
      }
      if (item.type === 'text' || item.type === 'textarea' || item.type === 'qselect') {
        item.default = '';
      }
      if (item.type === 'daterange') {
        item.label = '开始时间';
        item.label2 = '结束时间';
        item.placeholder2 = '请选择';
      }
      if (item.type === 'date' || item.type === 'daterange') {
        item.format = 'yyyy-MM-dd';
      }
      if (item.type === 'note') {
        delete item.required;
        delete item.label;
        item.auto_hidden = false;
      }
      if (item.type === 'staff') {
        item.staff_source = 'team';
      }
      if (item.type === 'compute') {
        item.exp = '';
      }
      if (item.type === 'table') {
        delete item.placeholder;
        delete item.required;
        item.onlyGroup = true;
        item.collapsible = false; // 可收缩
        item.collapsed = false; // 初始收缩
        // item.action_name = '增加明细';
        item.children = [];
      }
      if (item.type === 'suit_comparison') {
        item.label = '采样编码';
        item.label2 = '现场读数';
        item.placeholder2 = '现场仪器的读数';
        item.label3 = '标准数值';
        item.placeholder3 = '标样值或检验值，可后期填写';
        item.record_measuring_time = false;
        item.measure_times = 1;
      }
      if (item.type === 'suit_calibration') {
        item.label = '校准参数';
        item.label2 = '校准前参数';
        item.label3 = '校准后参数';
        item.placeholder2 = '自动获取上一次校准参数';
        item.placeholder3 = '新的校准参数';
      }
      if (item.type === 'suit_reagent') {
        item.label = '试剂类型';
        item.label2 = '使用数量';
        item.placeholder2 = '请输入使用量';
      }
      if (item.type === 'suit_spare') {
        item.label = '备件名称';
        item.label2 = '使用数量';
        item.placeholder2 = '请输入使用数量';
      }
      if (item.type === 'suit_asset') {
        item.label = '物资名称';
        item.label2 = '申请数量';
        item.label3 = '源仓库';
        item.label4 = '目标仓库';
        item.placeholder2 = '请输入申请数量';
        item.placeholder3 = '请选择希望申请的仓库';
        item.placeholder4 = '请选择希望进入的仓库';
      }
      if (item.type === 'suit_repair') {
        item.label = '开始时间';
        item.label2 = '结束时间';
        item.label3 = '仪器状态';
        item.label4 = '故障表现';
        item.label5 = '故障原因';
        item.placeholder2 = '请选择故障修复完成时间';
        item.placeholder3 = '';
        item.placeholder4 = '请选择或输入故障表现';
        item.placeholder5 = '请选择或输入故障原因';
      }
      return item;
    },
    onCanvasDrop(evt) {
      evt.preventDefault();
      if (this.currentWidget) { // 新增控件
        const item = this.insertNewItem();
        // 如果插入失败为false（如把明细插入明细）
        if (item) {
          this.onActiveFormitem(item);
        }
      } else if (this.movingItem) { // 移动控件
        const markFinder = this.deepFindItem(MarkItem);
        const targetItems = markFinder[0];
        const markIndex = markFinder[1];
        if (markIndex > -1) {
          if (this.movingItem.type === 'table' && targetItems !== this.form.fieldList) {
            // table只能在顶层移动, 这里什么都不做
          } else {
            this.deepRemoveItem(this.movingItem);
            // 虽然上面会删除一个元素导致markIndex可能会减小1
            // 插入原markIndex的位置总是安全的，区别只是markIndex在前或在后
            targetItems.splice(markIndex, 0, this.movingItem);
          }
        }
      }
      this.completeCanvasDrop();
    },
    onCanvasDragover(evt) {
      // 允许drop在上面
      evt.preventDefault();
    },
    onRemoveFormitem(item) {
      // console.log('will remove ' + JSON.stringify(item));
      this.deepRemoveItem(item);
      if (item === this.currentItem) {
        this.currentItem = null;
        this.settingTab = 'form';
      }
    },
    // 拖拽中的目标表单元素
    onEnterFormitem(item) {
      // console.log('enter ' + JSON.stringify(item));
      // 当从tableArea回到table时，hoveringItem未变，重新插入
      if (this.hoveringItem !== item || this.hoveringItem.type === 'table') {
        this.hoveringItem = item;
        this.deepRemoveItem(MarkItem);
        // 这个MacroTask用以在area回到table时，不会被更晚触发的leaveFormarea删除Marker
        setTimeout(() => {
          this.insertMovingMark();
        }, 0);
      }
    },
    onLeaveFormitem() {
      this.hoveringItem = null;
    },
    // 拖拽到table的area去
    onEnterFormarea(areaItem) {
      // console.log('enter table area');
      if (this.hoveringArea !== areaItem) {
        this.hoveringArea = areaItem;
        this.deepRemoveItem(MarkItem);
        this.insertMovingMark();
      }
    },
    onLeaveFormarea() {
      // console.log('leave table area');
      this.deepRemoveItem(MarkItem);
      this.hoveringArea = null;
    },
    onStartFormitem(item) {
      // console.log('moving' + item.id);
      this.onActiveFormitem(item);
      this.movingItem = item;
    },
    onActiveFormitem(item) {
      // console.log('select it ' + JSON.stringify(item));
      this.currentItem = item;
      this.settingTab = 'component';
    },
    switchSettingTab(tab) {
      this.settingTab = tab;
    },
    // 返回bool是否真的清除
    deepRemoveItem(item) {
      // console.trace(item);
      const finder = this.deepFindItem(item);
      if (finder[1] > -1) {
        finder[0].splice(finder[1], 1);
        return true;
      }
      return false;
    },
    generateUniqId(prefix = '') {
      let id = prefix + ((new Date()).getTime() % 10000);
      while (this.deepFindItemById(id)[1] > -1) {
        id = prefix + Math.round(Math.random() * 100000);
      }
      return id;
    },
    deepFindItemById(id) {
      let items = this.form.fieldList;
      let itemIndex = -1;
      itemIndex = _.findIndex(items, v => v.id === id);
      if (itemIndex === -1) {
        _.forEach(_.filter(this.form.fieldList, { type: 'table' }), (table) => {
          items = table.children;
          itemIndex = _.findIndex(items, v => v.id === id);
          if (itemIndex > -1) {
            return false;
          }
          return true;
        });
      }
      return [items, itemIndex];
    },
    // 遍历查找指定元素，返回[元素组，元素组中的序号]
    // 元素组可能是顶层元素或者table中的children
    deepFindItem(item) {
      let items = this.form.fieldList;
      let itemIndex = -1;
      itemIndex = items.indexOf(item);
      if (itemIndex === -1) {
        _.forEach(_.filter(this.form.fieldList, { type: 'table' }), (table) => {
          items = table.children;
          itemIndex = items.indexOf(item);
          if (itemIndex > -1) {
            return false;
          }
          return true;
        });
      }
      return [items, itemIndex];
    },
    insertMovingMark() {
      let items;
      let hoveringIndex = -1;
      if (this.hoveringItem && this.hoveringItem.type !== 'table' // 顶层普通控件
        || this.hoveringItem && this.hoveringItem.type === 'table' && !this.hoveringArea) { // area中的普通控件
        const finder = this.deepFindItem(this.hoveringItem);
        items = finder[0];
        hoveringIndex = finder[1];
      } else if (this.hoveringArea) { // 仅是加到area中
        items = this.hoveringArea.children;
        hoveringIndex = 0;
      } else {
        items = this.form.fieldList;
        hoveringIndex = this.form.fieldList.length;
      }
      if (hoveringIndex > -1) {
        items.splice(hoveringIndex + 1, 0, MarkItem);
      }
    },
    insertNewItem() {
      // 加入area还是canvas
      const item = this.newItem();
      // 看有没有指定在某个控件下面
      const finder = this.deepFindItem(MarkItem);
      const items = finder[0];
      const markIndex = finder[1];
      if (item.type === 'table' && items !== this.form.fieldList) { // 明细只能插入顶层
        return false;
      }
      if (markIndex > -1) {
        items.splice(markIndex, 0, item);
      } else {
        // 实在没办法插到最后
        this.form.fieldList.push(item);
      }
      return item;
    },
    // 当用户保存后，因为Form数据重新设置，高亮组件会消失，需要再次寻找
    findCurrentItemAgain() {
      if (!this.currentItem) {
        return null;
      }
      const finder = this.deepFindItemById(this.currentItem.id);
      if (finder[1] >= 0) {
        return finder[0][finder[1]];
      }
      return null;
    },
    completeCanvasDrop() {
      this.currentWidget = null;
      this.movingItem = null;
      this.hoveringItem = null;
      this.hoveringArea = null;
      setTimeout(() => {
        this.deepRemoveItem(MarkItem);
      }, 0);
    },
    saveForm() {
      // this.loading = true;
      console.log(this.form);
      this.$set(this.form, 'fieldsCount', this.form.fieldList.length)
      save(this.form, this.id).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.$message.success(res.data.msg);
          console.log(res.data.data);
          this.id = res.data.data.id;
          console.log(this.id);
          this.toEnter();
        } else {
          this.form.fieldsCount = '';
          this.$message.error(res.data.msg);
        }
      });
      // this.$axios[this.form.id ? 'put' : 'post'](this.form.id ? `form/${this.form.id}` : 'form', {
      //   ...this.form,
      //   fieldList: this.form.fieldList,
      // }).then((json) => {
      //   this.$message({
      //     showClose: true,
      //     message: '保存表单设置成功',
      //     type: 'success',
      //     duration: '1500',
      //   });
      //   this.form = json.data;
      //   this.currentItem = this.findCurrentItemAgain();
      //   this.initForm = _.cloneDeep(this.form);
      // }, (resp) => {
      //   this.$mp.alarmResponse(resp);
      // }).finally(() => {
      //   this.loading = false;
      // });
    },
  },
  // beforeRouteLeave(to, from, next) {
  // if (!_.isEqual(this.form, this.initForm)) { // has form data change?
  //   this.$confirm('您对该表单进行的修改还没有保存，确定要离开吗？', '保存确认', {
  //     type: 'warning',
  //   }).then(() => {
  //     next();
  //   }).catch(() => {
  //     next(false);
  //   });
  // } else {
  //   next();
  // }
  // },
};
</script>

<style lang="scss">
  $pcolor: #2db7f5;

  .mp-form-generator {
    position: relative;
    padding: 10px 15px;
    min-width: 980px;
    min-height: 780px;
    margin: 0 auto;
    .widgetspanel {
      width: 360px;
      width: calc((100% - 421px) / 2);
      float: left;
      .widgetitem {
        border: 1px dashed lighten($pcolor, 25%);
        margin: 0 15px 15px 0;
        width: 148px;
        width: calc(50% - 32px);
        height: 42px;
        float: left;
        font-size: 12px;
        line-height: 42px;
        text-align: left;
        padding-left: 15px;
        cursor: move;
        color: #222;
        position: relative;
        overflow: hidden;
        &:hover {
          border: 1px dashed $pcolor;
        }
        i.fa {
          line-height: 42px;
          float: right;
          margin-right: 0.5em;
        }
      }
    }
    .settingpanel {
      width: 360px;
      width: calc((100% - 421px) / 2);
      float: right;
    }
    .widgetspanel, .settingpanel {
      .paneltab {
        font-size: 0;
        .tabitem {
          color: grey;
          text-align: center;
          border-bottom: 2px solid grey;
          font-size: 17px;
          height: 35px;
          line-height: 28px;
          display: inline-block;
          width: 100%;
          cursor: pointer;
          &.active {
            color: $pcolor;
            border-bottom: 2px solid $pcolor;
          }
        }
        // 若有两个标签，平分宽度
        .tabitem:nth-last-child(2):first-child, .tabitem:nth-last-child(2):first-child + .tabitem {
          width: 50%;
        }
      }
      .paneltab + .panelbody {
        margin-top: 20px;
      }
      .panelbody {
        .field {
          margin: 5px 0 20px;
        }
        .fieldname {
          color: #333;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 8px;
          padding-left: 2px;
          .em {
            color: #666;
            font-weight: normal;
            font-style: normal;
          }
        }
        .fieldblock {
          margin: 5px 0;
          font-size: 14px;
        }
      }
      .panelfoot {
        margin-top: 15px;
        padding: 15px 0;
        border-top: 1px solid #e0e0e0;
        text-align: right;
      }
    }
    .formwrapper {
      position: absolute;
      left: 50%;
      top: 0;
      height: 766px;
      width: 421px;
      margin-left: -211px;
      background: url('../../../assets/img/phone-bg.png') no-repeat top center;
      background-size: 100% 100%;
    }
    .formcanvas {
      position: absolute;
      left: 38px;
      top: 84px;
      width: 345px;
      height: 584px;
      max-height: 548px;
      overflow-x: hidden;
      overflow-y: auto;
      background: #f0eff4;
      padding-bottom: 20px;
      .dragging-mark {
        background: #ff4500;
        height: 2px;
        overflow: visible;
        position: relative;
        margin: 3px 0;
        &:before, &:after {
          position: absolute;
          content: '';
          display: block;
          height: 0;
          width: 0;
          border-style: solid;
          border-color: transparent;
          border-width: 4px 8px;
          top: -3px;
        }
        &:before {
          left: 0px;
          border-left-color: #ff4500;
        }
        &:after {
          right: 0px;
          border-right-color: #ff4500;
        }
      }
    }
  }
</style>
