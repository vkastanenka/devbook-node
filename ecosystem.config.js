export default {
  apps: [
    {
      name: 'devbook',
      cwd: './dist/src/server.js',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
