const Hapi = require('hapi')

const { applyError, missingDataError, missingNodeIdError } = require('./error')
const store = require('./store')

const PORT = 8000

const server = new Hapi.Server()

server.connection({
  // host: 'localhost',
  port: PORT
})

server.route({
  method: 'POST',
  path:'/conn',
  handler: function (request, reply) {
    const data = request.payload
    const nodeId = data.id

    if (!nodeId) {
      return applyError(reply, missingNodeIdError)
    }

    if (!data) {
      return applyError(reply, missingDataError)
    }
    return store.set(nodeId, data)
      .then(() => reply(true))
      .catch((err) => applyError(reply, err))
  }
})

server.route({
  method: 'DELETE',
  path:'/conn',
  handler: function (request, reply) {
    const data = request.payload
    const nodeId = data.id

    if (!nodeId) {
      return applyError(reply, missingNodeIdError)
    }
    return store.remove(nodeId)
      .then(() => reply(true))
      .catch((err) => applyError(reply, err))
  }
})

server.route({
  method: 'GET',
  path:'/conn',
  handler: function (request, reply) {
    const nodeId = request.query.id

    if (!nodeId) {
      return applyError(reply, missingNodeIdError)
    }
    return store.get(nodeId)
      .then((peerInfo) => {
        const result = peerInfo || null
        return reply(result)
      })
      .catch((err) => applyError(reply, err))
  }
})

// Start the shim server
server.start((err) => {
  if (err) {
    throw err
  }
  console.log('Shim server listening on port:', server.info.uri)
  console.log(server.info)
})
