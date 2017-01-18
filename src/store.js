const Datastore = require('nedb')

exports = module.exports

const DB_PATH = 'store/peer-id-store'

class Store {
  constructor (path = DB_PATH) {
    this.db = new Datastore({ filename: path, autoload: true })
  }

  get (node) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ node }, (err, object) => {
        if (err) {
          reject(err)
          return
        }
        if (object === null) {
          resolve(null)
          return
        }
        resolve(object.object)
        return
      })
    })
  }

  set (node, object) {
    const errorUpdateNotFound = new Error(`Failed to update ${node}: Not found`)

    return new Promise((resolve, reject) => {
      this.db.findOne({ node }, (err, found) => {
        if (err) {
          reject(err)
          return
        }

        // If no object is found, create one
        if (!found) {
          this.db.insert({ node, object }, (err, newObj) => {
            if (err) {
              reject(err)
              return
            }
            resolve(newObj.object)
          })
          return
        }

        // Otherwise update the existing one
        this.db.update({ node },
          { $set: { object: object } },
          (err, numUpdated) => {
            if (err) {
              reject(err)
              return
            }

            if (numUpdated === 0) {
              reject(errorUpdateNotFound)
              return
            }
            // Return the most recent one
            this.db.findOne({ node }, (err, updatedObj) => {
              if (err) {
                reject(err)
                return
              }
              resolve(updatedObj.object)
            })
          }
        )
      })
    })
  }

  remove (node) {
    return new Promise((resolve, reject) => {
      this.db.remove({ node }, (err, numRemoved) => {
        if (err) {
          reject(err)
          return
        }
        resolve(numRemoved)
        return
      })
    })
  }
}

module.exports = new Store()
