const keys = require("./keys");
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 //retry every 1000ms if connection is not successful
});
const sub = redisClient.duplicate();

//recursive solution to calculate fibonacci value for a given index
function fib(index) {
    if (index < 2) return 1;
    return fib(index-1) + fib(index-2);
}

//message will be the index which is input by the user and stored in redis
sub.on('message', (channel,message) => {
    redisClient.hset('values', message, fib(parseInt(message)))
    //put into values hashset -> message key and fib value for message
});

//subscribe to INSERT event on redis
sub.subscribe('insert');