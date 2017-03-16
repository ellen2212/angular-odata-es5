import { assert } from 'chai';
import { Observable, Operator } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ConnectionBackend, HttpModule } from '@angular/http';
import { IEmployee } from './helpers/employee';

import { AngularODataModule } from '../src';
import { ODataOperation, ODataServiceFactory, ODataConfiguration, ODataQuery, ODataPagedResult } from './../src/index';

export class ODataQueryMock<IEmployee> extends ODataQuery<IEmployee> {
    public Exec(): Observable<Array<IEmployee>> {
        return Observable.of(new Array<IEmployee>());
    }

    public ExecWithCount(): Observable<ODataPagedResult<IEmployee>> {
        const pagedResult = new ODataPagedResult<IEmployee>();
        pagedResult.count = 0;
        pagedResult.data = new Array<IEmployee>();

        return Observable.of(pagedResult);
    }
}

describe('ODataQuery', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                {
                    provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                // {
                //     provide: Location, useFactory: () => {
                //         return {
                //             path: 'http://localhost/test'
                //         };
                //     }
                // },
                ODataConfiguration,
                ODataServiceFactory
            ],
            imports: [
                AngularODataModule.forRoot(),
                HttpModule
            ]
        });
    });

    it('Exec', inject([ Http, ODataConfiguration ], (http: Http, config: ODataConfiguration) => {
        // Assign
        const query = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        query
            .Filter('x')
            .Top(10)
            .Skip(20)
            .OrderBy('x');

        const result = query.Exec();

        // Assert
        spyOn(http, 'get');
        // expect(http.get).toHaveBeenCalled();
    }));

    it('Filter(string)', inject([ Http, ODataConfiguration ], (http: Http, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        test.Filter('x');

        // Assert
        assert.equal(test['_filter'], 'x');
    }));

    it('OrderBy(string)', inject([ Http, ODataConfiguration ], (http: Http, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        test.OrderBy('o');

        // Assert
        assert.equal(test['_orderBy'], 'o');
    }));

    it('Skip(number)', inject([ Http, ODataConfiguration ], (http: Http, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        test.Skip(10);

        // Assert
        assert.equal(test['_skip'], 10);
    }));

    it('Top(number)', inject([ Http, ODataConfiguration ], (http: Http, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        test.Top(20);

        // Assert
        assert.equal(test['_top'], 20);
    }));
});
