<template>
  <div style="text-align: unset">
    <el-upload
      action=""
      accept=".xls,.xlsx"
      :show-file-list="false"
      :auto-upload="false"
      :disabled="loading || visible"
      :on-change="handleGetFile">
      <!--suppress HtmlUnknownAttribute -->
      <template #default>
        <!--suppress HtmlUnknownAttribute -->
        <slot :loading="loading">
          <el-button type="primary" size="small" icon="el-icon-upload" :loading="loading">
            {{ '导入' }}
          </el-button>
        </slot>
      </template>
    </el-upload>

    <el-dialog
      v-model="visible"
      width="70%"
      custom-class="cha-vue-excel-progress-dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :before-close="handleClose"
      @closed="resetData">
      <!--   步骤一   -->
      <step1-select-sheet
        v-if="step === 1"
        :xlsx-excel="xlsxExcel"
        :header="header"
        :json-data="jsonData"
        @select="handleSelectSheet"
        @next="handleStep"/>
      <!--   步骤二   -->
      <step2-select-column
        v-if="step === 2"
        v-model:header-mapper="tempHeaderMapper"
        v-model:selected-header-mapper="selectedHeaderMapper"
        :header="header"
        @back="handleStep"
        @next="handleStep"/>
      <!--   步骤三   -->
      <step3-start-import
        v-if="step === 3"
        :header-mapper="selectedHeaderMapper"
        :option-mapper="optionMapper"
        :data="jsonData"
        :create-method="createMethod"
        @back="handleStep"
        @complete="handleComplete"/>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { log } from './logger'
import XlsxExcel from './XlsxExcel'
import Step1SelectSheet from './step/Step1SelectSheet'
import Step2SelectColumn from './step/Step2SelectColumn'
import Step3StartImport from './step/Step3StartImport'

export default {
  name: 'ImportExcel',
  components: {
    Step3StartImport,
    Step2SelectColumn,
    Step1SelectSheet
  },
  props: {
    // 不直接操作，不使用v-model，外部变化时覆盖更新到tempHeaderMapper
    // 用来实现可自定义headerMapper且不影响外部引入headerMapper变化时的更新
    /** 顶部栏-字段 映射 */
    headerMapper: Object,
    /** label-value 映射 */
    optionMapper: Object,
    createMethod: Function
  },
  emits: {
    complete: null
  },
  data () {
    return {
      /* 组件状态 */
      loading: false,
      visible: false,
      step: 0,
      /* Excel文件信息 */
      /** 文件名 */
      excelName: '',
      /** xlsx对象 */
      xlsxExcel: null,
      /* 数据信息 */
      selectedSheet: null,
      header: null,
      jsonData: null,
      selectedHeaderMapper: null,
      /* 操作数据信息 */
      /** 支持自定义headerMapper */
      tempHeaderMapper: this.headerMapper
    }
  },
  computed: {
    dialogTitle () {
      return '正在导入：' + this.excelName
    }
  },
  watch: {
    selectedSheet (newValue) {
      if (this.xlsxExcel) {
        this.header = this.xlsxExcel.getHeader(newValue)
        this.jsonData = this.xlsxExcel.getJsonData(newValue)
      }
    },
    headerMapper (newValue) {
      this.tempHeaderMapper = newValue
    }
  },
  methods: {
    checkImport () {
      if (!this.createMethod) {
        log.danger('ImportExcel>>checkImport', 'createMethod参数未传入！')
        ElMessage({
          message: '无法获取导入方法！',
          type: 'error'
        })
        return false
      }
      return true
    },
    handleGetFile (file) {
      if (!this.checkImport()) {
        return
      }
      this.loading = true
      this.excelName = file.name
      log.primary('ImportExcel>>handleGetFile', '已选择文件:' + this.excelName)
      this.xlsxExcel = new XlsxExcel()
      this.xlsxExcel.fromFile(file).then(() => {
        this.step = 1
        this.visible = true
        this.loading = false
      }).catch(error => {
        console.error(error)
        ElMessage({
          message: '文件读取发生错误！',
          type: 'error'
        })
        this.loading = false
      })
    },
    /** 手动关闭对话框 */
    handleClose (done) {
      ElMessageBox.confirm(
        '确定取消导入吗？',
        '取消导入',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        done()
      }).catch(() => {})
    },
    handleStep (step) {
      this.step = step
    },
    /** Step1选择Sheet */
    handleSelectSheet (bookSheet) {
      this.selectedSheet = bookSheet
    },
    handleComplete () {
      this.visible = false
      this.$emit('complete')
    },
    /** 重置导入状态 */
    resetData () {
      this.step = 0
      this.excelName = null
      this.xlsxExcel = null
      this.selectedSheet = null
      this.header = null
      this.jsonData = null
    }
  }
}
</script>

<style>
</style>
