exports = module.exports

exports.missingNodeIdError = new Error('Missing node')
exports.missingInfoError = new Error('Missing node info')

exports.applyError = (reply, error) => {
  const code = 400

  return reply({
    message: error.message,
    code: code
  }).code(code)
}
