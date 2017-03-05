# reactive-redux
Allows you to generate a reactive data source for Meteor/Tracker from a part of a Redux tree.

## Goals

Whether you are integrating Redux into an existing Meteor project, or wanting to create a new project using Redux and Tracker, it is not easy to get both systems (Redux/Tracker) to play well together. This mini helper module allow you to generate reactive data source from the redux Store for Meteor to consume.

## Usage

Let say you have a Redux Store with state having the following shape :
```
state = {
  posts {
    total : 12,
    selectedId : "zec1d4"
  }
}
```

You would like to rerun your autoruns based on the id of the selected post in your store.
```js
import factory from "tracker-redux-source";
import {Tracker} from "meteor/tracker";
import {Store} from "./whereItWasInitialized.js";

//regular Meteor reactive datasource with a get() method
const reactivePostId = factory("posts.selectedId", Store); //Store is you Redux Store

Tracker.autorun(()=>{
  Meteor.subscribe("post_comments", reactivePostId.get()); //reactivePostId is a reactive data source.
};
```

The reactive data source has a get() method like a ReactiveVar or Session.
However it has no set() since all your mutations should be commited on the redux Store through action creators.

## API

The module has a unique export which is a factory function which generate the reactive data sources.

#### `factory(path, Store)` (_default export_) - returns a reactive data source whose get() method will return the part of the state tree you are interested in.

The `path` param uses the [object-path](https://github.com/mariocasciaro/object-path) `get` path syntax

The `Store` param is the initialized Redux Store;

#### `reactiveDataSource` the object returned by the factory which will trigger a rerun of every Tracker/Meteor computation (Autoruns, Blaze helper..) you will put it in.
The object has a `get()` method which returns the value in your Store pointed by the path.

It has also a a `cancel()` method if for some reason you would like to unbind the value from the Store. In that case, get() will still return the current value, but the data source will not be reactive anymore.

## Acknowledgements

Thank you to Alexander Ivantsov whose [redux-subscriber](https://github.com/ivantsov/redux-subscriber) module allow this module to do its thing. 
