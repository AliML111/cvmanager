import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'

import UserData from './data/user.data';
import ManagerData from './data/manager.data';

import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import CompanyData from './data/company.data';
import { faker } from '@faker-js/faker';

let token;
let company;
let companies;
let manager;
let users;
let user;
let managerData;

prepareDB();
describe("Company Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();
        users = userData.getUsers();
        user = userData.getUser();

        let companyData = new CompanyData();
        company = companyData.getCompany();
        companies = companyData.getCompanies();

        managerData = new ManagerData();
        manager = managerData.getManagerByEntityId(company._id);

    })

    describe('GET /', () => {
        it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/companies?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/companies?page=1&size=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it('should get no item if name is not find', async () => {
            const response = await request(app)
                .get("/api/V1/companies?page=1&size=1&query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(app)
                .get("/api/V1/companies?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(app)
                .get("/api/V1/companies")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('logo')
            expect(data).toHaveProperty('description')
            expect(data).toHaveProperty('phone')
            expect(data).toHaveProperty('address')
            expect(data).toHaveProperty('is_active')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
        })

        it('should get list of companies', async () => {
            const response = await request(app)
                .get("/api/V1/companies")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`GET /:id`, () => {

        it(`should get ${httpStatus.BAD_REQUEST} company id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/fakeID`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} company id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} success if correct`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty(`_id`)
            expect(data).toHaveProperty(`name`)
            expect(data).toHaveProperty(`logo`)
            expect(data).toHaveProperty('description')
            expect(data).toHaveProperty('phone')
            expect(data).toHaveProperty('address')
            expect(data).toHaveProperty(`is_active`)
            expect(data).toHaveProperty(`created_by`)
            expect(data).toHaveProperty(`deleted`)
            expect(data).toHaveProperty(`createdAt`)
            expect(data).toHaveProperty(`updatedAt`)
            expect(response.statusCode).toBe(httpStatus.OK)
        })
    })

    describe(`POST /`, () => {

        let newCompany;
        beforeEach(async () => {
            newCompany = {
                '_id': Types.ObjectId(),
                'name': faker.random.alpha(10),
                "description": faker.random.alpha(50),
                "phone": faker.phone.number('989#########'),
                "address": faker.random.alpha(100),
                'created_by': user._id
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if name is not send`, async () => {
            delete newCompany.name;
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is less than 3 character`, async () => {
            newCompany.name = faker.random.alpha(2);
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is grather than 50 character`, async () => {
            newCompany.name = faker.random.alpha(51);
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is less than 10 character`, async () => {
            newCompany.description = faker.random.alpha(9);
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is grather than 100 character`, async () => {
            newCompany.description = faker.random.alpha(101);
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if phone is less than 9 character`, async () => {
            newCompany.phone = faker.phone.number('98######');
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if phone is grather than 12 character`, async () => {
            newCompany.phone = faker.phone.number('98###########');
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if address is less than 10 character`, async () => {
            newCompany.address = faker.random.alpha(9);
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if address is grather than 200 character`, async () => {
            newCompany.address = faker.random.alpha(201);
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.CONFLICT} if company already exists `, async () => {
            newCompany.name = company.name;
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        })
        it(`should get ${httpStatus.CREATED} if all data correct `, async () => {
            const response = await request(app)
                .post(`/api/V1/companies`)
                .set(`Authorization`, token)
                .send(newCompany);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })
    })

    describe(`PATCH /:id`, () => {

        let updateCompany;
        beforeEach(async () => {
            updateCompany = {
                'name': faker.random.alpha(8),
                "description": faker.random.alpha(50),
                "phone": faker.phone.number('989#########'),
                "address": faker.random.alpha(100)
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if company id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/companies/fakeId`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is less than 3 character`, async () => {
            updateCompany.name = faker.random.alpha(2);
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is grather than 50 character`, async () => {
            updateCompany.name = faker.random.alpha(51);
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is less than 10 character`, async () => {
            updateCompany.description = faker.random.alpha(9);
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is grather than 100 character`, async () => {
            updateCompany.description = faker.random.alpha(101);
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if phone is less than 9 character`, async () => {
            updateCompany.phone = faker.phone.number('98######');
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if phone is grather than 12 character`, async () => {
            updateCompany.phone = faker.phone.number('98###########');
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if address is less than 10 character`, async () => {
            updateCompany.address = faker.random.alpha(9);
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if address is grather than 200 character`, async () => {
            updateCompany.address = faker.random.alpha(201);
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if company is not exists`, async () => {
            const response = await request(app)
                .patch(`/api/V1/companies/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.CONFLICT} if company already exists `, async () => {
            updateCompany.name = companies[1].name;
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send(updateCompany);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`DELETE /:id`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} if company id is not valid`, async () => {
            const response = await request(app)
                .delete(`/api/V1/companies/fakeId`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if company not found `, async () => {
            const response = await request(app)
                .delete(`/api/V1/companies/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .delete(`/api/V1/companies/${company._id}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe("PATCH /companies/{id}/manager", () => {


        let setManager;
        beforeEach(() => {
            setManager = {
                'manager_id': manager.user_id,
            };
        })

        it(`should get ${httpStatus.BAD_REQUEST} company id is not a mongo id`, async () => {
            const response = await request(app)
                .patch(`/api/V1/companies/fakeID/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} company id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/companies/${Types.ObjectId()}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })


        it(`should get ${httpStatus.BAD_REQUEST} manager id is not sended`, async () => {
            delete setManager.manager_id
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not a mongo id`, async () => {
            setManager.manager_id = 'fakeid'
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} manager id is not valid`, async () => {
            setManager.manager_id = Types.ObjectId()
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} user is currently manager`, async () => {
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.CREATED} user successfully assign as manager`, async () => {
            setManager.manager_id = user._id
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })

    })

    describe("DELETE /companies/{id}/manager", () => {

        let deleteManager;
        beforeEach(() => {
            deleteManager = {
                'manager_id': manager.user_id,
            };
        })

        it(`should get ${httpStatus.NOT_FOUND} company id is not valid`, async () => {
            const response = await request(app)
                .delete(`/api/V1/companies/${Types.ObjectId()}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} company id is not a mongo id`, async () => {
            const response = await request(app)
                .delete("/api/V1/companies/fakeID/manager")
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not sended`, async () => {
            delete deleteManager.manager_id
            const response = await request(app)
                .delete(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not a mongo id`, async () => {
            deleteManager.manager_id = 'fake'
            const response = await request(app)
                .delete(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} manager id is not valid`, async () => {
            deleteManager.manager_id = Types.ObjectId()
            const response = await request(app)
                .delete(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} this user is not manager for this company`, async () => {
            deleteManager.manager_id = users[0]._id
            const response = await request(app)
                .delete(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} user is owner manager for this company`, async () => {
            manager = managerData.getManagerByEntityIdAndType(company._id,'owner');
            deleteManager.manager_id = users[0]._id
            const response = await request(app)
                .delete(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.OK} manager successfully deleted`, async () => {
            const response = await request(app)
                .delete(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe("GET /companies/{id}/projects", () => {
        it(`should get ${httpStatus.BAD_REQUEST} company id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/fakeID/projects`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} company id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/${Types.ObjectId()}/projects`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} company projects list `, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/${company._id}/projects`)
                .set('Authorization', token)
                .send();
            let data = response.body.data[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('company_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('is_active')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('managers')
            expect(data).toHaveProperty('id')
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe("GET /companies/{id}/managers", () => {

        it(`should get ${httpStatus.BAD_REQUEST} company id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/fakeID/managers`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} company id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/${Types.ObjectId()}/managers`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })


        it(`should get ${httpStatus.OK} company managers list `, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/${company._id}/managers`)
                .set('Authorization', token)
                .send();
            let data = response.body.data[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('user_id')
            expect(data).toHaveProperty('entity')
            expect(data).toHaveProperty('entity_id')
            expect(data).toHaveProperty('type')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe("GET /companies/{id}/resumes", () => {
        it(`should get ${httpStatus.BAD_REQUEST} company id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/fakeID/resumes`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} company id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/${Types.ObjectId()}/resumes`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} company resumes list `, async () => {
            const response = await request(app)
                .get(`/api/V1/companies/${company._id}/resumes`)
                .set('Authorization', token)
                .send();
            let data = response.body.data[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('company_id')
            expect(data).toHaveProperty('project_id')
            expect(data).toHaveProperty('position_id')
            expect(data).toHaveProperty('firstname')
            expect(data).toHaveProperty('lastname')
            expect(data).toHaveProperty('gender')
            expect(data).toHaveProperty('email')
            expect(data).toHaveProperty('birth_year')
            expect(data).toHaveProperty('marital_status')
            expect(data).toHaveProperty('status')
            expect(data).toHaveProperty('mobile')
            expect(data).toHaveProperty('residence_city')
            expect(data).toHaveProperty('work_city')
            expect(data).toHaveProperty('education')
            expect(data).toHaveProperty('phone')
            expect(data).toHaveProperty('min_salary')
            expect(data).toHaveProperty('max_salary')
            expect(data).toHaveProperty('work_experience')
            expect(data).toHaveProperty('military_status')
            expect(data).toHaveProperty('status_updated_at')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('status_history')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

})
