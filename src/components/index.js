import ImportExcel from './ImportExcel'

const components = [
  ImportExcel
]

const install = (app) => {
  if (install.installed) {
    return
  }
  install.installed = true
  components.map(component => {
    app.component(component.name, component)
  })
}

export default {
  install,
  ImportExcel
}
