import { JSONStorage } from "node-localstorage";
import { EventEmitter } from "events";
import { FilterMeta } from "./filterMeta";

export const FILTER_FOUND_EVENT: string = "filterFoundEvenet";
export const FILTER_ADD_EVENT: string = "filterAddEvent";
export const FILTER_REMOVE_EVENT: string = "filterRemoveEvent";

export class FilterStore{
  public readonly localStorage: JSONStorage;
  public readonly emitter: EventEmitter;

  constructor(path : string){
    this.localStorage = new JSONStorage(path);
    this.emitter = new EventEmitter();
  }
  
  getEmitter(){
    return this.emitter;
  }
  
  addFilter(filter: string, meta: FilterMeta): void {
    console.log(filter);
    filter = filter?.toLowerCase();
    this.localStorage.setItem(filter, meta);
    this.emitter.emit("addFilter", filter);
  }
  
  removeFilter(filter: string): void {
    console.log(filter);
    filter = filter?.toLowerCase();
    this.localStorage.removeItem(filter);
    this.emitter.emit("removeFilter", filter);
  }
  
  checkFilter(filter: string): boolean {
    filter = filter?.toLowerCase();
    return this.localStorage.getItem(filter) != null;
  }
  
  getFilter(filter: string): FilterMeta | null{
    filter = filter?.toLowerCase();
    return this.localStorage.getItem(filter);
  }
}