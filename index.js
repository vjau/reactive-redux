import {Tracker} from "meteor/tracker";
import {get as pathGet} from 'object-path';
import initSubscriber from "redux-subscriber";
import {subscribe} from "redux-subscriber";


let subscriber;

const factory = (path, Store)=>{
  if (typeof path !== "string"){
    throw new Error("factory path should be a string");
  }
  if (!Store || typeof Store.getState !== "function"){
    throw new Error("factory should be provided with a Store");
  }

  if (!subscriber){
    subscriber = initSubscriber(Store);
  }
  const dep = new Tracker.Dependency();
  const unsubscribe = subscriber(path, ()=>(dep.changed()));
  return {
    get(){
      dep.depend();
      return pathGet(Store.getState(), path);
    },
    cancel(){
      unsubscribe();
    }
  }
};


export default factory;