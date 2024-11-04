// utils
import request from 'supertest'

import app from '../app'

describe('GET /api/v1/addresses/test', () => {
  it('should successfully respond', async () => {
    const response = await request(app).get('/api/v1/addresses/test')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Addresses route secured')
  })
})
