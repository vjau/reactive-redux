import {Tracker} from "meteor/tracker";
import {get as pathGet} from 'object-path';

class ReactiveSource{
  constructor(pathOrSelector, Store, subscribe){
    this.dep = new Tracker.Dependency();
    this.Store = Store;
    if (typeof pathOrSelector === "string"){
      this.path = pathOrSelector;
      subscribe(pathOrSelector, ()=>(this.dep.changed()));
    } else if (typeof pathOrSelector === "function"){
      this.selector = pathOrSelector;
    } else {
      throw new Error("ReactiveSource constructor pathOrSelector param should be a path as as string or a selector function");
    }
  }
  get(){
    this.dep.depend();
    if (this.path){
      return pathGet(Store.getState(), this.path);
    } else if (this.selector){
      return this.selector(Store.getState());
    }

  }
}


export default ReactiveSource;