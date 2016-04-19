var app = require('../../app.js');

exports.queryDruid = function (req, res) {
    console.log('queryDruid function from druidApi.js was called.');

    var messagesToReturn = [];

    var Kafka = require('no-kafka-slim');
    var producer = new Kafka.Producer();

    var consumer = new Kafka.SimpleConsumer();
    var startOffset = 260;

    // config: connectionString - comma delimited list of initial brokers list,
    // defaults to '127.0.0.1:9092'

    var i = 0;

    // data handler function can return a Promise 
    var dataHandler = function (messageSet, topic, partition) {
        messageSet.forEach(function (m) {

            console.log(topic, partition, m.offset, m.message.value.toString('utf8'));

            messagesToReturn[i] = m.message.value.toString('utf8');
            i = i + 1;
        });

        // after consuming the whole topic...
        console.log("****** " + messagesToReturn[0]);
        res.send({error: 0, jsonObjects: messagesToReturn}, 201);
    };

    return consumer.init().then(function () {
        // Subscribe partitons 0 and 1 in a topic: 
        // offset: 0 read from the beginning
        return consumer.subscribe('InfiSpectorTopic', [0], {offset: startOffset}, dataHandler);
    });

};
