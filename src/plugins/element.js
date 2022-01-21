import {
  ElAlert,
  ElButton,
  ElDialog,
  ElOption,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTransfer,
  ElUpload
} from 'element-plus'

export default (app) => {
  app.use(ElButton)
  app.use(ElUpload)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElDialog)
  app.use(ElAlert)
  app.use(ElSelect)
  app.use(ElOption)
  app.use(ElTransfer)
}
