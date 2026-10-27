// Dev/demo only: runs a single-node MongoDB replica set on 127.0.0.1:27017 without Docker
// or a system install. Data is kept in ./.mongo-data between runs. Stop with Ctrl+C.
// .env: DATABASE_URL=mongodb://127.0.0.1:27017/khunmaeju?directConnection=true
import { mkdirSync } from 'node:fs'
import path from 'node:path'

import { MongoMemoryReplSet } from 'mongodb-memory-server'

const dbPath = path.resolve('.mongo-data')
mkdirSync(dbPath, { recursive: true })

const replSet = await MongoMemoryReplSet.create({
  replSet: { name: 'rs0', count: 1, storageEngine: 'wiredTiger' },
  instanceOpts: [{ port: 27017, ip: '127.0.0.1', dbPath }],
})

console.log(`MongoDB ready: ${replSet.getUri('khunmaeju')}`)
console.log(`Data folder: ${dbPath}`)

const stop = async () => {
  // Keep the data folder: this is a persistent local database, not a throwaway test one.
  await replSet.stop({ doCleanup: false })
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
