exports = module.exports

exports.missingNodeIdError = new Error('Missing node id')
exports.missingDataError = new Error('Missing data')

exports.applyError = (reply, error) => {
  const code = 400
  return reply({
    message: error.message,
    code: code
  }).code(code)
}
