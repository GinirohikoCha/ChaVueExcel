<template>
  <div>
    <el-table
      ref="importTable"
      style="width: 100%"
      :max-height="400"
      :data="data">
      <el-table-column
        v-for="item of Object.keys(headerMapper)" :key="item" :prop="item" :label="item"/>
      <el-table-column
        fixed="right"
        prop="importStatus"
        label="导入状态"
        width="150"
        :filters="statusMapper"
        :filter-method="filterHandler">
        <!--suppress HtmlUnknownAttribute -->
        <template #default="scope">
          <el-button
            plain
            size="mini"
            :type="getStatusType(scope.row.importStatus)"
            @click="showImportMessage(scope.row.importMessage)">
            {{ getStatusTitle(scope.row.importStatus) }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="step-footer-container" style="width: 100%; margin-top: 20px">
    <el-button style="float: right;margin-left: 10px" type="primary" @click="complete ? $emit('complete') : startImport()">
      {{ complete ? '关闭' : '开始导入' }}
    </el-button>
    <el-button v-if="!complete" style="float: right" type="primary" @click="$emit('back', 2)">
      {{ '上一步' }}
    </el-button>
    <div class="clear"></div>
  </div>
</template>

<script>
import { ElMessage, ElNotification } from 'element-plus'

const statusMapper = [
  { text: '等待导入', value: 0, type: 'warning' },
  { text: '正在导入', value: 1, type: 'primary' },
  { text: '导入成功', value: 2, type: 'success' },
  { text: '导入失败', value: 3, type: 'danger' }
]

export default {
  name: 'Step3StartImport',
  props: {
    headerMapper: Object,
    optionMapper: Object,
    data: Array,
    createMethod: Function
  },
  emits: {
    back: null,
    complete: null
  },
  data () {
    return {
      importing: false,
      complete: false,
      statusMapper,
      successList: [],
      failureList: [],
      progress: 0
    }
  },
  watch: {
    progress (newValue) {
      // 导入结束
      if (newValue === this.data.length) {
        this.importing = false
        this.complete = true
        ElNotification({
          title: '导入结束',
          message: '导入成功' + this.successList.length + '条，导入失败' + this.failureList.length + '条',
          duration: 0
        })
      }
    }
  },
  methods: {
    getStatusType (status) {
      if (status) {
        return statusMapper.find(item => item.value === status).type
      }
      return 'warning'
    },
    getStatusTitle (status) {
      if (status) {
        return statusMapper.find(item => item.value === status).text
      }
      return '等待导入'
    },
    filterHandler (value, row, column) {
      return row.importStatus === value || (!row.importStatus && !value)
    },
    showImportMessage (msg) {
      if (!msg) msg = '等待导入中，请点击开始导入'
      ElMessage({
        message: msg,
        type: 'info'
      })
    },
    async startImport () {
      this.importing = true
      for (const item of this.data) {
        if (!this.$refs.importTable) {
          break
        }
        item.importStatus = 1
        item.importMessage = '正在导入，请稍后'
        // eslint-disable-next-line no-unused-vars
        const formData = this.getFormData(item)
        // 调用传入createMethod
        const create = new Promise((resolve, reject) => {
          this.createMethod(formData, resolve, reject)
        })
        await create.then(result => {
          item.importStatus = 2
          item.importMessage = result
          this.successList.push(item)
          this.progress += 1
        }).catch(error => {
          item.importStatus = 3
          item.importMessage = '错误：' + error
          this.failureList.push(item)
          this.progress += 1
        })
      }
    },
    getFormData (data) {
      // 转换为导入的formData
      const formData = {}
      // TODO 优化值转换算法
      for (const column of Object.keys(this.headerMapper)) {
        const columnTitle = column
        const columnName = this.headerMapper[column]
        // 如果存在选项的情况下，将显示值换转换为真实值
        if (this.optionMapper[columnName]) {
          const option = this.optionMapper[columnName].find(option => {
            // TODO 自定义字段
            return option.label === data[columnTitle]
          })
          if (option) {
            // 找到option
            formData[columnName] = option.value
          } else {
            // 未找到option，不进行转换
            formData[columnName] = data[columnTitle]
          }
        } else {
          formData[columnName] = data[columnTitle]
        }
      }
      return formData
    }
  }
}
</script>

<style scoped>
.clear {
  clear: both;
}
</style>
