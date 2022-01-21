import XLSX from 'xlsx'
import { log } from './logger'

export default class XlsxExcel {
  fileReader
  xlsxBook
  /* fileReader Promise */
  resolve
  reject

  constructor () {
    this.initFileReader()
  }

  /**
   * 读取Excel文件
   * @param file 获取的上传文件
   * @return Promise
   * */
  fromFile (file) {
    const xlsxExcel = this
    return new Promise((resolve, reject) => {
      xlsxExcel.resolve = resolve
      xlsxExcel.reject = reject
      log.primary('XlsxExcel>>fromFile', '开始加载Excel')
      xlsxExcel.fileReader.readAsBinaryString(file.raw)
    })
  }

  isLoaded () {
    return Boolean(this.xlsxBook)
  }

  /**
   * 获取Excel文件所有SheetNames
   * @return Array
   * */
  getSheetNames () {
    log.info('XlsxExcel>>getSheetNames', 'SheetNames')
    console.debug(this.xlsxBook.SheetNames)
    return this.xlsxBook.SheetNames
  }

  getSheet (sheetName) {
    const bookSheet = this.xlsxBook.Sheets[sheetName]
    log.info('XlsxExcel>>getSheetData', 'SheetName：' + sheetName)
    if (!bookSheet) {
      log.danger('XlsxExcel>>getSheetData', 'Sheet不存在')
      return null
    }
    console.debug(bookSheet)
    return bookSheet
  }

  getJsonData (bookSheet) {
    const jsonData = XLSX.utils.sheet_to_json(bookSheet)
    log.info('XlsxExcel>>getSheetData', 'jsonData：')
    console.debug(jsonData)
    return jsonData
  }

  getHeader (bookSheet) {
    const header = []
    if (bookSheet) {
      const ref = bookSheet['!ref'].split(':')
      // 左上单元格
      const leftTop = ref[0]
      // 右下单元格
      const rightBottom = ref[1]
      // 左上单元格列名
      const headerStart = this.getColumnName(leftTop)
      // 右下单元格列名
      const headerEnd = this.getColumnName(rightBottom)
      // 获取第一行
      const row = this.getRow(leftTop)
      // 开始获取header
      let temp = headerStart
      while (temp !== this.getNextColumnName(headerEnd)) {
        if (bookSheet[temp + row]) {
          header.push(bookSheet[temp + row].w)
        } else {
          log.warning('XlsxExcel>>getHeader', '无法找到标题格：' + temp + row)
        }
        temp = this.getNextColumnName(temp)
      }
      log.info('XlsxExcel>>getHeader', 'header：')
      console.debug(header)
    }
    return header
  }

  /** 初始化fileReader及完成事件 */
  initFileReader () {
    log.primary('XlsxExcel>>initFileReader', '开始初始化')
    this.fileReader = new FileReader()
    // 文件加载完成
    this.fileReader.onload = (event) => {
      try {
        this.xlsxBook = XLSX.read(event.target.result, { type: 'binary' })
        // FIX resolve只能传输一个参数
        log.primary('XlsxExcel>>fileReader.onload', '加载完成')
        log.info('XlsxExcel>>fileReader.onload', 'xlsxBook')
        console.debug(this.xlsxBook)
        this.resolve()
      } catch (error) {
        log.danger('XlsxExcel>>fileReader.onload', '加载错误')
        log.danger('XlsxExcel>>fileReader.onload', error)
        this.reject(error)
      }
    }
    log.primary('XlsxExcel>>initFileReader', '完成初始化')
  }

  getColumnName (cell) {
    let columnName = ''
    for (const char of cell) {
      if (isNaN(char)) {
        columnName += char
      }
    }
    return columnName
  }

  getRow (cell) {
    let row = ''
    for (const char of cell) {
      if (!isNaN(char)) {
        row += char
      }
    }
    return row
  }

  getNextColumnName (columnName) {
    let carry = 1
    let nextColumnName = ''
    for (let i = columnName.length - 1; i >= 0; i--) {
      const char = columnName[i]
      if (carry) {
        if (char === 'Z') {
          nextColumnName = 'A' + nextColumnName
          carry = 1
        } else {
          nextColumnName = String.fromCharCode(columnName.charCodeAt(i) + 1) + nextColumnName
          carry = 0
        }
      } else {
        nextColumnName = char + nextColumnName
      }
    }
    if (carry) {
      nextColumnName = 'A' + nextColumnName
    }
    return nextColumnName
  }
}
