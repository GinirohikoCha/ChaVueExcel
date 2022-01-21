function typeColor (type = 'default') {
  let color = ''
  switch (type) {
    case 'primary':
      color = '#2d8cf0'
      break
    case 'success':
      color = '#19be6b'
      break
    case 'info':
      color = '#909399'
      break
    case 'warning':
      color = '#ff9900'
      break
    case 'danger':
      color = '#f03f14'
      break
    case 'default':
      color = '#35495E'
      break
    default:
      color = type
      break
  }
  return color
}

export const log = {}

log.pretty = function (title, text, type = 'primary') {
  console.debug(
    `%c ${title} %c ${text} %c`,
    `background:${typeColor(type)};border:1px solid ${typeColor(type)}; padding: 1px; border-radius: 4px 0 0 4px; color: #fff;`,
    `border:1px solid ${typeColor(type)}; padding: 1px; border-radius: 0 4px 4px 0; color: ${typeColor(type)};`,
    'background:transparent'
  )
}

log.primary = function (title, text) {
  this.pretty(title, text, 'primary')
}
log.success = function (title, text) {
  this.pretty(title, text, 'success')
}
log.info = function (title, text) {
  this.pretty(title, text, 'info')
}
log.warning = function (title, text) {
  this.pretty(title, text, 'warning')
}
log.danger = function (title, text) {
  this.pretty(title, text, 'danger')
}
