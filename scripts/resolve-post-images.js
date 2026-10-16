'use strict';

const path = require('path');

const configuredParsers = new WeakSet();
const normalizePath = value => value.replace(/\\/g, '/');

// Resolve both "image.png" and VS Code's "post-name/image.png" through Hexo.
// Markdown-it encodes Chinese URLs, while PostAsset IDs use decoded paths.
hexo.extend.filter.register('markdown-it:renderer', function(parser) {
  if (configuredParsers.has(parser)) return;
  configuredParsers.add(parser);

  const renderImage = parser.renderer.rules.image;

  parser.renderer.rules.image = function(tokens, index, options, env, renderer) {
    const token = tokens[index];
    const src = token.attrGet('src');

    if (hexo.config.post_asset_folder && hexo.config.markdown.images.post_asset &&
        env.postPath && src && !/^(?:[a-z][a-z\d+.-]*:|[/\\#])/i.test(src)) {
      const [, imagePath, suffix] = src.match(/^([^?#]*)(.*)$/);
      let decodedPath;
      try {
        decodedPath = decodeURIComponent(imagePath);
      } catch {
        return renderImage.call(this, tokens, index, options, env, renderer);
      }

      // Use POSIX separators consistently on Windows and on GitHub Actions.
      const postPath = path.posix.relative(
        normalizePath(hexo.base_dir), normalizePath(env.postPath)
      );
      const assetDir = postPath.slice(0, -path.posix.extname(postPath).length);
      const PostAsset = hexo.model('PostAsset');
      const asset = [
        path.posix.join(assetDir, decodedPath),
        path.posix.join(path.posix.dirname(postPath), decodedPath)
      ].map(id => PostAsset.findById(id)).find(Boolean);

      // The renderer's image rule adds the site's root and escapes the URL.
      if (asset) token.attrSet('src', '/' + asset.path + suffix);
    }

    return renderImage.call(this, tokens, index, options, env, renderer);
  };
});
