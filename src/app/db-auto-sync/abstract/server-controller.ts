import { Observable } from 'rxjs';

export abstract class ServerController<TObj> {
    abstract set(obj: TObj, id: string): Observable<void>;
  
    abstract delete(id: string): Observable<void>;
  
    abstract swap(id1: string, id2: string): Observable<void>;
  }