/**
 * Buffer class.
 * @class Buffer
 */
function Buffer(){
    this.waiting = false;
    this.callbacks = [];
    this.namedCallbacks = {};
    this.lastCallbacks = [];
    this.timeout = 100;
}

/**
 * Starts buffer timer. After that timer fires, all changes applies to chart
 * @function start
 * @private
 */
Buffer.prototype.start = function(){

    var self = this;

    if(!self.waiting){
        self.waiting = true;
        setTimeout(function(){

            // finish call be called manualy
            if(self.waiting){
                self.finish();
            }
        }, self.timeout);
    }
};


/**
 * If callback is function, calls it
 * @function resolveCallbacks
 * @private
 * @param {Function} callback
 */
function resolveCallback(callback){
    if(typeof callback === 'function'){
        callback();
    }
}

/**
 * Resolves all callbacks in given array
 * @function resolveCallbacks
 * @param {Array} array of callbacks
 */
function resolveCallbacks(callbacks){

    var length = callbacks.length;

    for(var i = 0; i < length; i++){
        var callback = callbacks[0];
        resolveCallback(callback);
        callbacks.shift();
    }
}

/**
 * Resolves all named callbacks
 * @function resolveNamedCallbacks
 * @private
 */
Buffer.prototype.resolveNamedCallbacks = function(){
    var self = this;

    for(var id in self.namedCallbacks){
        var namedCallback = self.namedCallbacks[id];
        self.namedCallbacks[id] = undefined;
        resolveCallback(namedCallback);
   }
};

/**
 * Resolves all main callbacks
 * @function resolveMainCallbacks
 * @private
 */
Buffer.prototype.resolveMainCallbacks = function(){
    var self = this;
    resolveCallbacks(self.callbacks);
};

/**
 * Resolves all callbacks that should be resolved last
 * @function resolveLastCallbacks
 * @private
 */
Buffer.prototype.resolveLastCallbacks = function(){
    var self = this;
    resolveCallbacks(self.lastCallbacks);
};

/**
 * Resolves all callbacks
 * @function finish
 * @private
 */

Buffer.prototype.finish = function(){
    var self = this;

    self.waiting = false;

    self.resolveNamedCallbacks();
    self.resolveMainCallbacks();
    self.resolveLastCallbacks();
};

/**
 * Resolves while buffer is not empty, but not more than 10 times.
 * @function finishAll
 * @returns {int} How many times 'finish' was called
 */
Buffer.prototype.finishAll = function(){
    var self = this;
    var counter = 0;

    while(!self.isEmpty() && counter<10){
        self.finish();
        counter++;
    }

    return counter;
};

/**
 * Adds callback to main queue and starts timer
 * @function onfinish 
 * @param {Function} callback
 */
Buffer.prototype.onfinish = function(callback){
    var self = this;
    self.start();
    self.callbacks.push(callback);
};

/**
 * Adds named callback to queue and starts timer. Only last callback with given id will be called
 * @function onlastfinish
 * @param {String} id of callback
 * @param {Function} callback
 */
Buffer.prototype.onlastfinish = function(id, callback){
    var self = this;
    self.start();
    self.namedCallbacks[id] = callback;
};

/**
 * Adds callback to queue that resolves after all other callbacks were called and starts timer
 * @function afterFinish
 * @param {Function} callback
 */
Buffer.prototype.afterfinish = function(callback){
    var self = this;
    self.start();
    self.lastCallbacks.push(callback);
};

/**
 * Returns whether or not there is a callback for given event to be fired
 * @function has
 * @param {String} id
 * @return {bool}
 */
Buffer.prototype.has = function(id){
    var self = this;
    return isUndefined(self.namedCallbacks[id]);
};

Buffer.prototype.isEmpty = function(){
    var self = this;

    for(var id in self.namedCallbacks){
        if(self.has(id)){
            return false;
        }
    }

    var callbacks = self.callbacks.length == 0;
    var lastCallbacks = self.lastCallbacks.length == 0;

    return callbacks && lastCallbacks;
};

/**
 * Sets timeout after which buffer should fire
 * @function setTimeout
 * @param {int} timeout
 */
Buffer.prototype.setTimeout = function(timeout){
    var self = this;
    if(isNaN(timeout)){
        throw new Error("Buffer timeout should be a number");
    }

    self.timeout = timeout;
};


/**
 * Returns current buffer timeout
 * @function getTimeout
 * @returns {int} timeout
 */
Buffer.prototype.getTimeout = function(){
    var self = this;
    return self.timeout;
};

