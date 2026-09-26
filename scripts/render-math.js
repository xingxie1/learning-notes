'use strict';

const markedKatex = require('marked-katex-extension');

hexo.extend.filter.register('marked:use', function(markedUse) {
  markedUse(markedKatex({
    throwOnError: false,
    nonStandard: true,
    trust: false
  }));
});
