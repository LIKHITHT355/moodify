const Redis = require("ioredis").default;
const redis = new Redis({
    host: process.env.redishost,
    port:process.env.redisport,
    password:process.env.redispass
})
redis.on("connect",()=>{
    console.log("redis connected")
})
redis.on("error", (error) => {
    console.error("redis connection error:", error.message)
})


module.exports = redis
