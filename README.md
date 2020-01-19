# Composer Core
Provide a manager capable of generate classes by composing different mixins.

Each composer can be defined as a normal class which provide public methods and getter and setter for their public properties.
### Memory access
All the composers can store their data using the internal memory manager.
```javascript
Composer.memory;
```
Please, have a look at the [manager documentation](https://github.com/mcastiello/memory-manager/blob/master/README.md) to learn how to use it.
### `create` and `destroy`
Each composer can expose a static `create` method that is executed when the object is initialised, and a static `destroy` method that is executed when the object is disposed. You can use it to clean up memory for each specific composer.
### Quick example
```javascript
import 'composer-core';

// Create a test composer
class TestComposer {
    static create(data) {
        data["test"] = "testString";
    }

    get test() {
        return Composer.memory.get(this, "test");
    }
}

// Create another composer... a little bit more useful...
class EventComposer {
    static create(data) {
        data.listeners = {};
    }
    addListener(name, callback) {
        const listeners = Composer.memory.get(this, "listeners");
        if (!listeners[name]) {
            listeners[name] = [];
        }
        listeners.name.push(callback);
    }
    removeListener(name, callback) {
        const listeners = Composer.memory.get(this, "listeners");
        if (listeners[name]) {
            const index = listeners[name].indexOf(callback);
            if (index >= 0) {
                listeners[name].splice(index, 1);
            }
        }
    }
    dispatch(event, data) {
        const listeners = Composer.memory.get(this, "listeners");
        if (listeners[event]) {
            for (let callback of listeners[event]) {
                callback(data);
            }
        }
    }
}

// Create a class composing the one just created
const BaseClass = Composer.compose([TestComposer, EventComposer]);

// You can then use it to create objects or extend it to create more complex classes.
const obj = new BaseClass();

console.log(obj.test); // "testString"

obj.addListener("test", () => console.log(obj.id));
obj.dispatch("test"); // "2C3EDAC0-5764-421B-9EDF-0B953FA9C311"
```