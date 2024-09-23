const request = require('supertest');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = require("../server");
const nock = require("nock");

jest.setTimeout(20000)

beforeAll(async () => {
    await prisma.$connect();

    nock('http://localhost:2000')
    .persist()
    .get('/products/1/stock')
    .reply(200, { id: 1, name: 'Test Product', inStock: true, stockQuantity: 100 })
    .get('/products/1')
    .reply(200, { id: 1, name: 'Test Product', price: 19.99 })
    .put('/products/1')
    .reply(200, { id: 1, name: 'Test Product', stockQuantity: 90 });
});

afterAll(async () => {
    await prisma.$disconnect();
    nock.cleanAll();
});

describe("Order Service", () => {
    let createdOrderId;

    test('POST /orders - create a new order', async() => {
        const res = await request(app)
        .post("/orders")
        .send({
            userId: 1,
            orderItems: [{
                productId: 1,
                quantity: 1,
                price: 19.99
            }]
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        createdOrderId = res.body.id;
    });

    test('GET /orders - get all orders', async() => {
        const res = await request(app)
        .get("/orders");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('GET /orders/:id - Get a single order', async () => {
        const res = await request(app).get(`/orders/${createdOrderId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('userId', 1);
      });

      test('PUT /orders/:id - Update an order status', async () => {
        const res = await request(app)
          .put(`/orders/${createdOrderId}`)
          .send({ status: 'COMPLETED' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'COMPLETED');
      });
      test('DELETE /orders/:id - Delete an order', async () => {
        const res = await request(app).delete(`/orders/${createdOrderId}`);
        expect(res.statusCode).toBe(204);
      });
});