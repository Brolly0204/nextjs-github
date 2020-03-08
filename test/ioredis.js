const Redis = require('ioredis')

const redis = new Redis({
  password: '1224'
})

// redis.set('name', 'brolly')

redis.keys('*').then(keys => {
  console.log(keys)
})
