// utils
import request from 'supertest'

import app from '../app'

describe('GET /api/v1/auth/test', () => {
  it('should successfully respond', async () => {
    const response = await request(app).get('/api/v1/auth/test')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Auth route secured')
  })
})
