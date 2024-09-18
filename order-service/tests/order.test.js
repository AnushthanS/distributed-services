const request = require('supertest');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = ("../server");
const nock = require("nock");

beforeAll(async () => {
    await prisma.$connect();

    nock('http://localhost:5000')
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

