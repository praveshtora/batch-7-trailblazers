module.exports = {
  '*.js': ['eslint', 'prettier --single-quote --write', 'git add'],
  '*.{html,css,json}': ['prettier --single-quote --write', 'git add']
};
