import { Color } from 'tvision-color'
import { defaultColor, darkColor, CHART_COLORS } from 'configs/color'
import { ETheme } from 'types/index.d'

/**
 * 依据主题颜色获取 ColorList
 * @param theme
 * @param themeColor
 */
function getColorFromThemeColor(theme: string, themeColor: string): Array<string> {
  let themeColorList = []
  const isDarkMode = theme === ETheme.dark
  const colorLowerCase = themeColor.toLocaleLowerCase()

  if (defaultColor.includes(colorLowerCase)) {
    const colorIdx = defaultColor.indexOf(colorLowerCase)
    const defaultGradients = !isDarkMode ? defaultColor : darkColor
    const spliceThemeList = defaultGradients.slice(0, colorIdx)
    themeColorList = defaultGradients.slice(colorIdx, defaultGradients.length).concat(spliceThemeList)
  } else {
    themeColorList = Color.getRandomPalette({
      color: themeColor,
      colorGamut: 'bright',
      number: 8,
    })
  }

  return themeColorList
}

/**
 *
 * @param theme 当前主题
 * @param themeColor 当前主题色
 */
export function getChartColor(theme: ETheme, themeColor: string) {
  const colorList = getColorFromThemeColor(theme, themeColor)
  // 图表颜色
  const chartColors = CHART_COLORS[theme]
  return { ...chartColors, colorList }
}

export function generateColorMap(
  theme: string,
  colorPalette: Array<string>,
  mode: 'light' | 'dark',
  brandColorIdx: number,
) {
  const isDarkMode = mode === 'dark'

  if (isDarkMode) {
    // eslint-disable-next-line no-use-before-define
    colorPalette.reverse().map((color) => {
      const [h, s, l] = Color.colorTransform(color, 'hex', 'hsl')
      return Color.colorTransform([h, Number(s) - 4, l], 'hsl', 'hex')
    })
    // eslint-disable-next-line no-param-reassign
    brandColorIdx = 10 - brandColorIdx
    colorPalette[0] = `${colorPalette[brandColorIdx]}20`
  }

  const colorMap = {
    '--td-brand-color': colorPalette[brandColorIdx], // 主题色
    '--td-brand-color-1': colorPalette[0], // light
    '--td-brand-color-2': colorPalette[1], // focus
    '--td-brand-color-3': colorPalette[2], // disabled
    '--td-brand-color-4': colorPalette[3],
    '--td-brand-color-5': colorPalette[4],
    '--td-brand-color-6': colorPalette[5],
    '--td-brand-color-7': brandColorIdx > 0 ? colorPalette[brandColorIdx - 1] : theme, // hover
    '--td-brand-color-8': colorPalette[brandColorIdx], // 主题色
    '--td-brand-color-9': brandColorIdx > 8 ? theme : colorPalette[brandColorIdx + 1], // click
    '--td-brand-color-10': colorPalette[9],
  }
  return colorMap
}

export function insertThemeStylesheet(theme: string, colorMap: Record<string, string>, mode: 'light' | 'dark') {
  const isDarkMode = mode === 'dark'
  const root = !isDarkMode ? `:root[theme-color='${theme}']` : `:root[theme-color='${theme}'][theme-mode='dark']`

  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = `${root}{
    --td-brand-color: ${colorMap['--td-brand-color']};
    --td-brand-color-1: ${colorMap['--td-brand-color-1']};
    --td-brand-color-2: ${colorMap['--td-brand-color-2']};
    --td-brand-color-3: ${colorMap['--td-brand-color-3']};
    --td-brand-color-4: ${colorMap['--td-brand-color-4']};
    --td-brand-color-5: ${colorMap['--td-brand-color-5']};
    --td-brand-color-6: ${colorMap['--td-brand-color-6']};
    --td-brand-color-7: ${colorMap['--td-brand-color-7']};
    --td-brand-color-8: ${colorMap['--td-brand-color-8']};
    --td-brand-color-9: ${colorMap['--td-brand-color-9']};
    --td-brand-color-10: ${colorMap['--td-brand-color-10']};
  }`

  document.head.appendChild(styleSheet)
}

/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 *
 * @param   String  color   十六进制颜色值
 * @return  Boolean
 */
export const isHexColor = (color: string) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
  return reg.test(color)
}

/**
 * RGB 颜色值转换为 十六进制颜色值.
 * r, g, 和 b 需要在 [0, 255] 范围内
 *
 * @return  String          类似#ff00ff
 * @param r
 * @param g
 * @param b
 */
export const rgbToHex = (r: number, g: number, b: number) => {
  // tslint:disable-next-line:no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  return `#${new Array(Math.abs(hex.length - 7)).join('0')}${hex}`
}

/**
 * 将 十六进制颜色转换为 RGB颜色值
 * @param {string} hex 待转换颜色
 * @returns 转换后的 RGB 颜色
 */
export const hexToRGB = (hex: string, opacity?: number) => {
  let sHex = hex.toLowerCase()

  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
      }
      sHex = sColorNew
    }

    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sHex.slice(i, i + 2)}`))
    }
    return opacity ? `RGBA(${sColorChange.join(',')},${opacity})` : `RGB(${sColorChange.join(',')})`
  }

  return sHex
}

export const colorIsDark = (color: string) => {
  if (!isHexColor(color)) return
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item) => Number(item))
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/**
 * ‌根据指定百分比加深 十六进制颜色
 * @param {string} color 待处理颜色
 * @param {number} amount 改变颜色的数值
 * @returns {string} 改变后的 十六进制 颜色值
 */
export const darken = (color: string, amount: number): string => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount,
  )}${subtractLight(color.substring(4, 6), amount)}`
}

/**
 * 根据传入的百分比加亮 6位十六进制颜色
 * @param {string} color 要改变的颜色
 * @param {number} amount 改变颜色的值
 * @returns {string} 改变后的 十六进制 颜色值
 */
export const lighten = (color: string, amount: number): string => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(color.substring(2, 4), amount)}${addLight(
    color.substring(4, 6),
    amount,
  )}`
}

/* 将指定百分比添加到十六进制颜色分量（RR、GG或BB）以提高其亮度 */
/**
 * 为 十六进制 颜色的 R/G/B 分量添加指定百分比以提高亮度
 * @param {string} color 要改变的颜色
 * @param {number} amount 改变颜色的值
 * @returns {string} 改变后的 十六进制 颜色值
 */
const addLight = (color: string, amount: number): string => {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * 计算RGB色彩亮度值
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 */
const luminanace = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * 计算两色RGB对比度
 * @param {string} rgb1 rgb 1
 * @param {string} rgb2 rgb 2
 */
const contrast = (rgb1: string[], rgb2: number[]) =>
  (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)

/**
 * 根据背景对比度确定最佳文本颜色（黑色或白色）
 * @param hexColor - 上次用户选择的颜色
 */
export const calculateBestTextColor = (hexColor: string) => {
  const rgbColor = hexToRGB(hexColor.substring(1))
  const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}

/**
 * 对HEX色彩的R/G/B通道值执行百分比减法运算
 * @param {string} color 标注需要被处理的原始色彩变量
 * @param {number} amount 色彩变量幅度
 * @returns {string} 转换后的数据‌
 */
const subtractLight = (color: string, amount: number): string => {
  const cc = parseInt(color, 16) - amount
  const c = cc < 0 ? 0 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * 混合两种颜色
 *
 * @param {string} color1 - 第一个 颜色应为以#开头的6位十六进制颜色码.
 * @param {string} color2 - 第二个 颜色应为以#开头的6位十六进制颜色码.
 * @param {number} [weight=0.5] - ‌color1在混合中的权重应为 0 到 1 之间的数值：0 表示完全使用color2，1 表示完全使用color1
 * @returns {string} 混合结果应为以#开头的6位十六进制颜色码
 */
export const mix = (color1: string, color2: string, weight = 0.5): string => {
  let color = '#'
  for (let i = 0; i <= 2; i++) {
    const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16)
    const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16)
    const c = Math.round(c1 * weight + c2 * (1 - weight))
    color += c.toString(16).padStart(2, '0')
  }
  return color
}
