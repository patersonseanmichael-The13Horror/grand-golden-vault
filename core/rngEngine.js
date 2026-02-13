// RNG Engine — Golden Vault Core
(function(){
  "use strict";

  const RNGEngine = {
    /**
     * Returns a secure random integer between min and max inclusive
     */
    getRandom(min, max) {
      if(typeof min !== 'number' || typeof max !== 'number' || min > max){
        throw new Error("Invalid RNG bounds");
      }
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const range = max - min + 1;
      return min + (array[0] % range);
    },

    /**
     * Returns a random element from an array
     */
    choice(array) {
      if(!Array.isArray(array) || array.length === 0){
        throw new Error("Invalid array for RNG choice");
      }
      return array[this.getRandom(0, array.length - 1)];
    }
  };

  Object.freeze(RNGEngine);
  window.RNGEngine = RNGEngine;

})();
