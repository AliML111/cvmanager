import httpStatus from 'http-status'
import request from 'supertest'
import env from '../helper/env.js';
import app from '../app.js'
import AllInit from './init/all.init';

import UserData from './data/user.data';
import ManagerData from './data/manager.data';

import setupTestDB from './utils/setupTestDB'
import { Types } from 'mongoose';
import CompanyData from './data/company.data';

let server;
let token;
let company;
let manager;
let users;

setupTestDB();
describe("Company Routes", () => {

    beforeEach(() => {
        server = app.listen(env('PORT'));
        let allInit = new AllInit();
        allInit.setData();

        let userData = new UserData();
        token = userData.getAccessToken();
        users = userData.getUsers();

        let companyData = new CompanyData();
        company = companyData.getCompany();

        let managerData = new ManagerData();
        manager = managerData.getManager();

    })

    afterEach(async () => {
        server.close();
    })

    describe("PATCH /companies/{id}/manager", () => {

        it(`should get ${httpStatus.NOT_FOUND} company id is not valid`, async () => {
            const response = await request(app)
                .patch("/api/V1/companies/639c7ecfdb3ccff4925a6fa5/manager")
                .set('Authorization', token)
                .send({ 'manager_id': Types.ObjectId() });
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} company id is not a mongo id`, async () => {
            const response = await request(app)
                .patch("/api/V1/companies/fakeID/manager")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not sended`, async () => {
            console.log(company)
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not a mongo id`, async () => {
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send({ 'manager_id': 'fake' });
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} manager id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send({ 'manager_id': "639c7ecfdb3ccff4925a6fa5" });

            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} user is currently manager`, async () => {
            let newManager = {
                "id": Types.ObjectId(),
                "manager_id": manager.user_id,
                "user_id": manager._id,
            };

            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(newManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.CREATED} user successfully assign as manager`, async () => {
            let newManager = {
                "id": Types.ObjectId(),
                "manager_id": users[1]._id,
                "user_id": users[1]._id,
            };

            const response = await request(app)
                .patch(`/api/V1/companies/${company._id}/manager`)
                .set('Authorization', token)
                .send(newManager);

            expect(response.statusCode).toBe(httpStatus.CREATED);
        })

    })
})
