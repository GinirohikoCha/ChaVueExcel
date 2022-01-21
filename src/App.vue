<template>
  <el-config-provider :locale="locale">
    <img src="./assets/logo.png" alt="Vue logo"/>

    <import-excel
      :header-mapper="headerMapper"
      :option-mapper="optionMapper"
      :create-method="create"
      @complete="getData">
      <template v-slot="{loading}">
        <el-button class="horizontal-center" type="primary" size="small" icon="el-icon-upload" :loading="loading">
          {{ '导入' }}
        </el-button>
      </template>
    </import-excel>

    <el-table :data="tableData" stripe style="width: 50%; left: 50%; transform: translate(-50%, 0); margin-top: 50px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="gender" label="性别" >
        <template v-slot="{row}">
          {{ genderMapper[row.gender] ? genderMapper[row.gender].label : null }}
        </template>
      </el-table-column>
    </el-table>
  </el-config-provider>
</template>

<script>
import ImportExcel from '@/components/ImportExcel'
import { ElConfigProvider } from 'element-plus'
import zhCN from 'element-plus/lib/locale/lang/zh-cn'
import { list, create } from '@/api/api'

const genderMapper = [{
  label: '男',
  value: 0
}, {
  label: '女',
  value: 1
}]

export default {
  name: 'App',
  components: {
    ElConfigProvider,
    ImportExcel
  },
  data () {
    return {
      locale: zhCN,
      genderMapper,
      headerMapper: {
        学号: 'id',
        姓名: 'name',
        年龄: 'age',
        性别: 'gender',
        预设未识别: 'unknown'
      },
      optionMapper: {
        gender: [
          { label: '男', value: '0' },
          { label: '女', value: '1' }
        ]
      },
      tableData: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      list().then(response => {
        this.tableData = response.data.items
      }).catch(error => {
        console.log(error)
      })
    },
    create (data, resolve, reject) {
      create(data).then(response => {
        resolve(response.message)
      }).catch(error => {
        reject(error)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  text-align: center;
}

</style>
