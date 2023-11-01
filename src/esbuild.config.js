// esbuild.config.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true, // Para producción
}).catch(() => process.exit(1));
