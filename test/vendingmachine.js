const request          = require("supertest");
const assert           = require("assert");
const app              = require("../app");
const itemModel        = require("../models/items");
const purchaseModel    = require("../models/purchase");
const mongoose         = require('mongoose');
const nodeEnv          = process.env.NODE_ENV || "test";
const config           = require("../config.json")[nodeEnv];
var expect             = require('chai').expect;
var should             = require('should');

// runs before all tests in this block

let item;
let purchase;

 before("Database Setup", function(done) {
  mongoose.connect(config.mongoURL,  { useMongoClient: true });

    let newItem = new itemModel({
       description: "item1",
       cost: 0.65,
       quantity:1
    });
    newItem.save(function(err){
    item = newItem;

    let newPurchase = new purchaseModel({
      description_id: item._id,
      date: "12/12/2012",
      money_given: 0.75,
      change_received: 0.10
    });
    newPurchase.save(function(err){
     purchase = newPurchase;
    });
});
done();
});

 describe("GET /api/customer/items", function () {
  it("should return all the items", function (done) {
     request(app)
       .get('/api/customer/items')
       .expect(200)
       .expect("Content-Type", "application/json; charset=utf-8")
       .expect(function(res){
         assert.equal(res.body.status, "success");
         assert(res.body.data.length > 1);
       })
       done();
    })
 });

describe("POST /api/customer/items/itemId/purchases", function () {
   it("customer should be able to purchase an item", function (done) {
     request(app)
       .post('/api/customer/items/1/purchases')
       .set('Content-Type', 'application/x-www-form-urlencoded')
       .send({money_given:1})
       .expect(200)
       .expect("Content-Type", "application/json; charset=utf-8")
       .expect(function(res){
         assert.equal(res.body.status, "success");
         assert(res.body.data.length == 1);
       })
       done();
       })
 });

describe("GET /api/vendor/purchases", function () {
  it("list purchases made so far date-wise", function (done) {
     request(app)
       .get("/api/vendor/purchases")
       .expect(200)
       .expect("Content-Type", "application/json; charset=utf-8")
       .expect(function (res) {
          assert.equal(res.body.status, "success");
          assert(res.body.data.length > 0);
       })
      done();
  })
});

describe("GET /api/vendor/items", function () {
  it("list all the vendor items", function (done) {
    request(app)
      .get("/api/vendor/purchases")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(function (res) {
        assert.equal(res.body.status, "success");
        assert(res.body.data.length > 0);
      })
      done();
  })
});

 describe("PUT /api/vendor/items/:itemId", function () {
   it("update item quantity and description", function (done) {
     request(app)
       .put("/api/vendor/items/1")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({description:"waffers",quantity:10})
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
       .expect(function (res) {
        assert.equal(res.body.status, "success");
        assert(res.body.data.length == 1);
     })
     done();
   })
 });

 describe("GET /api/vendor/money", function(){
   it("get the sum of money collected", function(done){
     request(app)
     .get("/api/vendor/money")
     .expect(200)
     .expect("Content-Type","application/json; charset=utf-8")
     .expect(function(res){
       assert.equal(res.body.status, "success");
       assert(res.body.data.length > 0);
     })
     done();
   })
 });

//runs after all tests in this block  /************COMMENTING OUT FOR TESTING *******/
after("drop database", function (done) {
  mongoose.connection.dropDatabase(done);
})
