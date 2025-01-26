const JSONQuery = require('json-query');

const data = {
  info: {
    tags: [
      'remote',
    ],
  },
};

const locals = {
  includes: function(input, ...args) {
    if (Array.isArray(input)) {
      for (const arg of args) {
        if (input.includes(arg)) return input;
      }
    }
    return undefined;
  },
};

const result = JSONQuery('info.tags:includes(remote)', { data, locals });
console.log(result);
console.log(result.parents);