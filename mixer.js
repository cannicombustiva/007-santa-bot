const R = require('ramda');

const mixer = (people) => {
  const pairing = ([x, ...xs]) => R.zip([x, ...xs], [...xs, x]);
  // Add shuffle function instead of (people) => people if you want
  return R.compose(pairing, (people) => people)(people);
}

module.exports = mixer;