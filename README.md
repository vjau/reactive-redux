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

## Alternative usage

Since version 1.1.0, you can provide a selector to the factory in place of the path key.
This way you can avoid using a magic string, and there is only one place to change (the selector), when your redux state shape changes.

The precedent example becomes this :
```js
import factory from "tracker-redux-source";
import {Tracker} from "meteor/tracker";
import {Store} from "./whereItWasInitialized.js";

//selector to access the part of the state tree you are interested in
const selector = (state)=>(state.posts.selectedId);

//the factory is provided this time with the selector instead of the string path
const reactivePostId = factory(selector, Store);

Tracker.autorun(()=>{
  Meteor.subscribe("post_comments", reactivePostId.get()); //reactivePostId is a reactive data source.
};
```

It's strongly recommended that your selector doesn't do too much cpu intensive tasks since it will be rerun on each redux state change for comparison purpose. 
Using the reselect library for memoization is also probably a good idea.


## API

The module has a unique export which is a factory function which generate the reactive data sources.

#### `factory(pathOrSelector, Store)` (_default export_) - returns a reactive data source whose get() method will return the part of the state tree you are interested in.

The `pathOrSelector` is a path string or a selector function.
 - A path string uses the [object-path](https://github.com/mariocasciaro/object-path) `get` path syntax
 - A selector is a function taking the whole redux state as a unique parameter and returning the part of the state tree you are interested in, eventualy after additional treatment. 

The `Store` param is the initialized Redux Store;

#### `reactiveDataSource` the object returned by the factory which will trigger a rerun of every Tracker/Meteor computation (Autoruns, Blaze helper..) you will put it in.
The object has a `get()` method which returns the value in your Store pointed by the path.

It has also a a `cancel()` method if for some reason you would like to unbind the value from the Store. In that case, get() will still return the current value, but the data source will not be reactive anymore.

## Acknowledgements

Thank you to Alexander Ivantsov whose [redux-subscriber](https://github.com/ivantsov/redux-subscriber) module allow this module to do its thing. 
