import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'dist',
  format: 'esm',
  external: ['express', 'ws', 'sqlite3', 'bcryptjs', 'passport', 'express-session'],
}) 