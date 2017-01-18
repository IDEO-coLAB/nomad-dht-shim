const Hapi = require('hapi')
const R = require('ramda')

const { applyError, missingInfoError, missingNodeIdError } = require('./error')
const store = require('./store')

const PORT = 8000

const server = new Hapi.Server()

server.connection({
  host: 'localhost',
  port: PORT
})

server.route({
  method: 'POST',
  path:'/conn/{node}',
  handler: function (request, reply) {
    const nodeId = request.params.node
    const peerInfo = request.payload.info  // possibly turn back into object

    if (!nodeId) {
      return applyError(reply, missingNodeIdError)
    }

    if (!peerInfo) {
      return applyError(reply, missingInfoError)
    }
    return store.set(nodeId, peerInfo)
      .then(() => reply(true))
      .catch((err) => applyError(reply, err))
  }
})

server.route({
  method: 'DELETE',
  path:'/conn/{node}',
  handler: function (request, reply) {
    const nodeId = request.params.node

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
  path:'/conn/{node}',
  handler: function (request, reply) {
    const nodeId = request.params.node

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

// Start the server
server.start((err) => {
  if (err) {
    throw err
  }
  console.log('Shim server running at:', server.info.uri)
})
