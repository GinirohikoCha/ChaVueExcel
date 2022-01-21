<template>
  <div class="step-container">
    <el-alert :title="alertMessage" :type="alertType" :closable="false"/>
  </div>

  <div style="width: 100%; margin-top: 20px">
    <el-select v-if="this.sheetNames.length > 1" v-model="selectedSheetName" placeholder="请选择" @change="handleSelect">
      <el-option
        v-for="item in sheetNames"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>

    <el-button style="float: right" type="primary" :disabled="!selectedSheetName" @click="handleNext">
      {{ '下一步' }}
    </el-button>
    <div class="clear"></div>
  </div>
</template>

<script>
import { log } from '../logger'

export default {
  name: 'Step1SelectSheet',
  props: {
    xlsxExcel: Object,
    header: Array,
    jsonData: Object
  },
  emits: {
    next: null,
    select: null
  },
  data () {
    return {
      selectedSheetName: null
    }
  },
  computed: {
    sheetNames () {
      return this.xlsxExcel.isLoaded() ? this.xlsxExcel.getSheetNames() : []
    },
    alertMessage () {
      if (this.sheetNames.length > 1 && !this.selectedSheetName) {
        return '检测到多个表格页，请选择需要导入的表格页'
      } else {
        return '已获取表格页：' + this.selectedSheetName + '，请点击下一步'
      }
    },
    alertType () {
      if (this.sheetNames.length > 1 && !this.selectedSheetName) {
        return 'warning'
      } else {
        return 'success'
      }
    }
  },
  mounted () {
    if (this.sheetNames.length === 1) {
      this.selectedSheetName = this.sheetNames[0]
      this.handleSelect(this.sheetNames[0])
    }
  },
  methods: {
    handleSelect (val) {
      if (val) {
        log.primary('Step1SelectSheet', '已选择Sheet：' + val)
        this.$emit('select', this.xlsxExcel.getSheet(val))
      }
    },
    handleNext () {
      this.$emit('next', 2)
    }
  }
}
</script>

<style scoped>
.clear {
  clear: both;
}
</style>
