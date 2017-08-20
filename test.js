const { match, HAS, IS, TYPE } = require('./');

const result = match(t)(
  [IS(5), x => x]
);

console.log(result);
