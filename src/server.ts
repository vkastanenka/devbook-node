import app from './app'

// Uncaught exception handling
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down!')
  console.log(err.name, err.message)
  process.exit(1)
})

const port = Number(process.env.PORT) || 5000
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}!`)
})

// Unhandled rejection handling
process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION! 💥 Shutting down!')
  server.close(() => {
    process.exit(1)
  })
})
