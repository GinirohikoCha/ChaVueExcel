<template>
  <div class="step-container">
    <div>
      <el-alert :title="'请选择需要导入的字段，无法识别的字段不能导入'" :type="alertType" :closable="false" show-icon/>
    </div>

    <div style="text-align: center; margin-top: 10px">
      <el-transfer
        v-model="selectedHeader"
        style="text-align: left; display: inline-block;"
        :titles="['读取字段', '导入字段']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="headerData"/>
    </div>
  </div>

  <div class="step-footer-container" style="width: 100%; margin-top: 20px">
    <el-button style="float: right;margin-left: 10px" type="primary" :disabled="!allowedNext" @click="$emit('next', 3)">
      {{ '下一步' }}
    </el-button>
    <el-button style="float: right" type="primary" @click="$emit('back', 1)">
      {{ '上一步' }}
    </el-button>
    <div class="clear"></div>
  </div>
</template>

<script>
export default {
  name: 'Step2SelectColumn',
  props: {
    header: Object,
    headerMapper: Object,
    // v-model
    selectedHeaderMapper: Object
  },
  emits: {
    back: null,
    next: null,
    'update:headerMapper': null,
    'update:selectedHeaderMapper': null
  },
  data () {
    return {
      selectedHeader: []
    }
  },
  computed: {
    allowedNext () {
      // TODO Mapper必填字段检测，必填字段未选择/未识别无法下一步
      return this.selectedHeader && this.selectedHeader.length > 0
    },
    alertType () {
      return this.allowedNext ? 'success' : 'info'
    },
    // 映射为el-transfer可用的数组
    headerData () {
      const data = []
      for (const item of this.header) {
        data.push({
          key: item,
          label: '读取-' + item,
          disabled: this.headerMapper ? !this.headerMapper[item] : true
        })
      }
      for (const item of Object.keys(this.headerMapper)) {
        if (!data.find(header => header.key === item)) {
          data.push({
            key: item,
            label: '预设-' + item,
            disabled: true
          })
        }
      }
      return data
    }
  },
  watch: {
    selectedHeader (newValue) {
      const headerMapper = {}
      for (const item of newValue) {
        headerMapper[item] = this.headerMapper[item]
      }
      this.$emit('update:selectedHeaderMapper', headerMapper)
    }
  }
}
</script>

<style scoped>
.clear {
  clear: both;
}
</style>
