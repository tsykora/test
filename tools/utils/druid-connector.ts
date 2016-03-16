/// <reference path="../../node_modules/facetjs-druid-requester/build/druidRequester.d.ts" />
/// <reference path="../../node_modules/facetjs-druid-requester/build/facetjs-druid-requester.d.ts" />

export * from './template-injectables';
export * from './template-locals';
export * from './server';
export * from './tasks-tools';

import * as fdr from 'facetjs-druid-requester';
import * as events from 'events';

class Params implements fdr.DruidRequesterParameters {
    locator: Locator.FacetLocator;
    host: string;
    timeout: number;
    debug: Boolean;
    cancellationToken: events.EventEmitter;
}

export function connectToDruid() {

    let params = new Params;
    params.host = '127.0.0.1:8084';
    params.debug = true;

    var druidRequester: Requester.FacetRequester<Druid.Query> = fdr.druidRequesterFactory(params);

    druidRequester({
        query: {
            'queryType': 'topN',
            'dataSource': 'wikipedia',
            'granularity': 'all',
            'dimension': 'page',
            'metric': 'edit_count',
            'threshold': 10,
            'aggregations': [
                { 'type': 'longSum', 'fieldName': 'count', 'name': 'edit_count' }
            ],
            'filter': { 'type': 'selector', 'dimension': 'country', 'value': 'United States' },
            'intervals': ['2012-10-01T00:00/2020-01-01T00']
        }
    })
        .then(function(res) {
            console.log('Result res[0]: ', res[0]);
        })
        .done();
}
