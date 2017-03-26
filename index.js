import {get as pathGet} from 'object-path';
import initSubscriber from "redux-subscriber";
import {Tracker} from "meteor/tracker";

const watchSelector = (selector, Store, cb)=>{
  let prevComputedState = selector(Store.getState());
  const compare = (newState)=>{
    let newComputedState = selector(newState);
    if (prevComputedState !== newComputedState){
      prevComputedState = newComputedState;
      cb();
    }
  };
  return Store.subscribe(()=>(compare(Store.getState())));
};


let subscriber;

const factory = (pathOrSelector, Store)=>{
  if (typeof pathOrSelector !== "string" && typeof pathOrSelector !== "function"){
    throw new Error("factory pathOrSelector should be a string or a function");
  }
  if (!Store || typeof Store.getState !== "function"){
    throw new Error("factory should be provided with a Store");
  }

  if (!subscriber){
    subscriber = initSubscriber(Store);
  }
  const dep = new Tracker.Dependency();
  if (typeof pathOrSelector === "string"){
    const unsubscribe = subscriber(pathOrSelector, ()=>(dep.changed()));
    return {
      get(){
        dep.depend();
        return pathGet(Store.getState(), pathOrSelector);
      },
      cancel(){
        unsubscribe();
      }
    }
  }
  if (typeof pathOrSelector === "function"){
    const unsubscribe = watchSelector(pathOrSelector, Store, ()=>(dep.changed()));
    return {
      get(){
        dep.depend();
        return pathOrSelector(Store.getState());
      },
      cancel(){
        unsubscribe();
      }
    }
  }

};




export default factory;