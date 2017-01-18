const Hapi = require('hapi')
const R = require('ramda')

const { applyError, missingInfoError, missingNodeIdError } = require('./error')

const PORT = 8000

const server = new Hapi.Server()

let store = new Map()

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
    store.set(nodeId, peerInfo)
    return reply(true)
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
    store.delete(nodeId)
    return reply(true)
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
    const result = store.get(nodeId) || null
    return reply(result)
  }
})

// Start the server
server.start((err) => {
  if (err) {
    throw err
  }
  console.log('Shim server running at:', server.info.uri)
})
