export default {
  apps: [
    {
      name: 'devbook',
      script: './dist/src/server.js',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
