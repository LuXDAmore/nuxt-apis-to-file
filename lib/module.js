const { resolve } = require('path')

module.exports = async function (moduleOptions) {
  const options = {
    ...this.options['@luxdamore/nuxt-apis-to-file'],
    ...moduleOptions
  }

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: '@luxdamore/nuxt-apis-to-file.js',
    options
  })
}

module.exports.meta = require('../package.json')
