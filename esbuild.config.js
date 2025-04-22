import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  outdir: 'dist',
  format: 'esm',
  external: ['express', ...Object.keys(JSON.parse(await import('fs').then(fs => fs.promises.readFile('package.json', 'utf8'))).dependencies)]
}) 