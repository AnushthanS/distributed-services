const request = require("supertest");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = require("../server");

beforeAll(async() => {
    await prisma.$connect();
});

afterAll(async() => {
    await prisma.$disconnect();
});

describe('Product Catalog Service', () => {

    test('Health check', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'OK');
      });

    let createProductId;

    test('POST /products - Create Product', async() => {
        const res = await request(app)
        .post("/products")
        .send({
            name: 'Test Product',
            description: "This is a test product",
            price: 19.99,
            stockQuantity: 100
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        createProductId = res.body.id;
    });

    test('GET /products - Get All Products', async() => {
        const res = await request(app)
        .get("/products");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('GET /products/:id - Get Product By Id', async() => {
        const res = await request(app)
        .get(`/products/${createProductId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'Test Product');
    });

    test('PUT /products/:id - Update Product', async() => {
        const res = await request(app)
        .put(`/products/${createProductId}`)
        .send( {price: 24.99 } )

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('price', "24.99");
    });

    test('GET /products/:id/stock - Check product stock', async() => {
        const res = await request(app).get(`/products/${createProductId}/stock`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('inStock', true);
        expect(res.body).toHaveProperty('stockQuantity', 100);
    });

    test('DELETE /products/:id - Delete Product', async() => {
        const res = request(app).delete(`/products/${createProductId}`);

        expect(res.statusCode).toBe(204);
    });
});