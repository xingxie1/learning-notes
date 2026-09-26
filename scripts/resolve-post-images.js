'use strict';

const path = require('path');

// VS Code inserts "post-name/image.png" for its local Markdown preview.
// Hexo expects "image.png" when resolving the same post asset for the site.
hexo.extend.filter.register('marked:renderer', function(renderer) {
  const renderImage = renderer.image;

  renderer.image = function(token) {
    const postPath = this.options.postPath;
    const href = token.href;

    if (postPath && typeof href === 'string') {
      const postName = path.posix.basename(postPath.replace(/\\/g, '/'));
      const prefix = postName + '/';

      if (href.startsWith(prefix)) {
        const imageName = href.slice(prefix.length);
        const assetId = path.posix.join(postPath.replace(/\\/g, '/'), imageName);
        const asset = this.options.hexo.model('PostAsset').findById(assetId);

        if (asset) token = { ...token, href: imageName };
      }
    }

    return renderImage.call(this, token);
  };
});
