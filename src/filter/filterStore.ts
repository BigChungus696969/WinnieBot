import { JSONStorage } from "node-localstorage";
import { EventEmitter } from "events";
import { FilterMeta } from "./filterMeta";

let localStorage = new JSONStorage("./filterStore");
export const FILTER_FOUND_EVENT: string = "filterFoundEvenet";
export const FILTER_ADD_EVENT: string = "filterAddEvent";
export const FILTER_REMOVE_EVENT: string = "filterRemoveEvent";
export const filterEmitter = new EventEmitter();

export function addFilter(filter: string, meta: FilterMeta): void {
  console.log(filter);
  filter = filter?.toLowerCase();
  localStorage.setItem(filter, meta);
  filterEmitter.emit("addFilter", filter);
}

export function removeFilter(filter: string): void {
  console.log(filter);
  filter = filter?.toLowerCase();
  localStorage.removeItem(filter);
  filterEmitter.emit("removeFilter", filter);
}

export function checkFilter(filter: string): boolean {
  filter = filter?.toLowerCase();
  return localStorage.getItem(filter) != null;
}

export function getFilter(filter: string): FilterMeta | null{
  filter = filter?.toLowerCase();
  return localStorage.getItem(filter);
}
