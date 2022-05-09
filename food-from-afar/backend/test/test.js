require('dotenv').config()
const request = require('supertest');
const assert = require('chai').assert;
const express = require('express')

const app = require("../server.js")

app.use(express.urlencoded());
app.use(express.json());

//Using this to store _id to delete
let _id = ""

//it() means a new test, the first param is the test name
it("POST Mr. Test's Chicken to /recipes/add", () => {
    //vvv creating object for POST request
    const builder = {
        "name": "Mr. Test's Chicken", 
        "creator": "Mr. Test",
        "time": 30,
        "instructions": ["Make Chicken", "Eat Chicken"]}
    //Make sure the last request has return before it
    return request(app)
    //vvv this is the type of request
    .post('/recipes/add')
    //vvv this sends the object we created in the body
    .send(builder)
    //vvv if you used statuses, here you can expect a status
    .expect(200)
    //vvv what runs after
    .then((res) => {
        //asserts follow this format, there are many kinds of asserts though
        //check out chai documentation for more
        assert.isNotEmpty(res.text)
    })
})

it("GET Mr. Test's Chicken from /recipes", () => {
    const query = {
        "name": "Mr. Test's Chicken"}
    return request(app)
    .get('/recipes')
    //make sure to send queries in .query()
    .query(query)
    .expect(200)
    .then((res) => {
        //storing the _id for our delete
        _id = res.body[0]._id
        //assert.equal(result, expected, message)
        assert.equal(res.body[0].creator, "Mr. Test")
        assert.equal(res.body[0].time, 30)
    })
})

it("PATCH Mr. Test's Chicken from /recipes", () => {
    const query = {
        "category": "Testing"
    }
    return request(app)
    .patch('/recipes/' + _id)
    //make sure to send queries in .query()
    .query(query)
    .expect(200)
    .then((res) => {
        //storing the _id for our delete
        assert.equal(res.body.category, "Testing", "Updated successfully")
    })
})

it("DELETE Mr. Test's Chicken from /recipes", () => {
    return request(app)
    .delete('/recipes/' + _id)
    .expect(200)
    .then((res) => {
        assert.isNotEmpty(res.text)
    })
})

it("GET Mr. Test's Chicken from /recipes", () => {
    const query = {
        "name": "Mr. Test's Chicken"}
    return request(app)
    .get('/recipes')
    .query(query)
    .expect(200)
    .then((res) => {
        //we want this to fail as it has been deleted
        assert.isArray(res.body)
        assert.equal(res.body.length, 0, "expecting empty array")
    })
})
