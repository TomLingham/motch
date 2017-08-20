'use strict';

const scalarTypes = [
  'number',
  'string',
  'undefined',
  'boolean',
  'symbol',
];

const reservedPatterns = [
  '_',
];

const arrowFunctionArgsRegExp = new RegExp("^(\\(.*\\)|[^ ]*)\\s*=>");

function getArgNames(func) {
  const argNames = func.toString()
    .match(arrowFunctionArgsRegExp)[1]
    .trim()
    .replace(new RegExp("^\\(+|\\)+$", 'g'), '')
    .split(',')
    .map(x => x.trim());

  return argNames;
}


function getKeyForMatch(str, argName) {
  const objectKeyRegExp = new RegExp(`[{,]{1}\\s*([a-zA-Z0-9_$]+)\\s*:\\s*${argName}\\s*[},]{1}`);
  const matches = str.match(objectKeyRegExp);
  return matches ? matches[1] : null;
}


function extractDefault(patterns) {
  return patterns._ || (x => console.log('no match for', x, patterns));
}

function isPatternReserved(pattern) {
  return reservedPatterns.includes(pattern);
}

function isScalar(value) {
  return value === null || scalarTypes.includes(typeof value);
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}


function matchScalarValue(arg, patterns) {
  for(let i in patterns) {
    if (i == arg) {
      return patterns[i](args);
    }
  }
}

function matchObjectValue(arg, patterns) {
  for(let i in patterns) {
    let didMatch = false;

    const matchedArgs = getArgNames(patterns[i])
      .map((name, argIndex) => {
        const matchedKey = getKeyForMatch(i, name);
        if (matchedKey && arg.hasOwnProperty(matchedKey)) {
          didMatch = true;
          return arg[matchedKey];
        }
      });


    if (didMatch) {
      return patterns[i](...matchedArgs);
    }
  }
}


module.exports = function match(args) {
  return (candidates) => {
    const patterns = Object.assign({}, candidates);
    const def = extractDefault(patterns);

    if (isScalar(args)) {
      return matchScalarValue(args, patterns) || def(args);
    }

    if (isObject(args)) {
      return matchObjectValue(args, patterns) || def(args);
    }

    def(args);
  }
}

