var app = require('../../app.js');

exports.queryDruid = function (request, response) {

    console.log('queryDruid function from druidApi.js was called.');

    var params = {host: "127.0.0.1:8084", debug: "true"};
    var druidRequester = require('facetjs-druid-requester').druidRequesterFactory(params);

    druidRequester({
        query: {
            'queryType': 'topN',
            'dataSource': 'wikipedia',
            'granularity': 'all',
            'dimension': 'page',
            'metric': 'edit_count',
            'threshold': 10,
            'aggregations': [
                {'type': 'longSum', 'fieldName': 'count', 'name': 'edit_count'}
            ],
            'filter': {'type': 'selector', 'dimension': 'country', 'value': 'United States'},
            'intervals': ['2012-10-01T00:00/2020-01-01T00']
        }
    })
            .then(function (result) {
                console.log('Result res[0]: ', result[0]);
                response.send({error: 0, jsonObjects: "{result: " + result[0] + " }"}, 201);
            })

            .done();
};