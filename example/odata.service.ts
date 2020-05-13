import { Injectable } from '@angular/core';
import { ODataConfiguration, ODataQuery, ODataServiceFactory } from 'angular-odata-es5';
import { CoreStore } from 'mobility-lib';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { eq } from './odata';

export class Configuration extends ODataConfiguration {

  constructor(
    private store: CoreStore
  ) {
    super();
  }

  get baseUrl(): string {
    return this.store.server;
  }

  public getEntityUri(key: any = null, typeName: string): string {
    return `${this.getEntitiesUri(typeName)}/${key}`;
  }

  public extractQueryResultData<T>(res: HttpResponse<any>): T[] {
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`${res.status}`);
    }
    return (res && res.body) as T[];
  }

  //need the new function,Thank you.
  public extractRequestDataFormat(data: {[key: string]: any}) {
    return data;
  }
}


/**
 * odata api
 * CRUD
 */

@Injectable({
  providedIn: 'root'
})

export class OdataService {

  private table = {
    dispatchHeader: this.createService('dispatchHeader'),
    dispatchRecord: this.createService('dispatchRecord'),
    dispatchHeaderStatus: this.createService('getDispatchHeaderStatus'),
    rubricCategory: this.createService('getRubricCategory'),
    job: this.createService('getJob'),
    dispatchRecordType: this.createService('getDispatchRecordType')
  };

  createService(api: string) {
    const url = this.store.api[api];
    return this.odataFactory.CreateService<any>(url);
  }

  constructor(
    private odataFactory: ODataServiceFactory,
    private config: ODataConfiguration,
    private http: HttpClient,
    private store: CoreStore
  ) {}


  getQuery(table: string, filter: Array<string>= null, limit: number = -1, startIndex: number = null, orderBy: string = 'Id desc'): ODataQuery<any>  {
    let query = this.table[table].Query();
    if(filter) {
      let filterString: string = '';
      filter.forEach((f,k)=>{
        filterString = filterString + (k > 0 ? ' and ' : '') + f;
      });
      query = query.Filter(filterString);
    }
    if(limit !== -1) {
      query = query.Top(limit);
    }
    if(startIndex !== null) {
      query = query.Skip(startIndex);
    }
    if(orderBy) {
      query = query.OrderBy(orderBy);
    }
    return query;
  }

  getData(table: string, filter: Array<string>= null, limit: number = -1, startIndex: number = 0, orderBy: string = 'Id desc' ): Observable<any[]> {
    return this.getQuery(table,filter,limit,startIndex,orderBy).Exec();
  }

  addData(table: string, data: {[key: string]: any}): Observable<any> {
    this.config.postRequestOptions.headers = this.store.headers;
    return this.table[table].Post(data).Exec();
  }

  updateData(table: string, data: {[key: string]: any}): Observable<any> {
    this.config.postRequestOptions.headers = this.store.headers;
    return this.table[table].Put(data,data.Id).Exec();
  }


  getDataById(table: string, id: string): Observable<any> {
    let query = this.table[table].Query();
    query = query.Filter(eq('Id',id));
    return query.Exec();
  }
}
