export default {
  apps: [
    {
      name: 'devbook',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
