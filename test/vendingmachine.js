const request          = require("supertest");
const assert           = require("assert");
const app              = require("../app");

const mongoose         = require('mongoose');
const nodeEnv          = process.env.NODE_ENV || "test";
const config           = require("../config.json")[nodeEnv];
mongoose.connect(config.mongoURL,{useMongoClient:true});



// runs before all tests in this block
// before("connect to Mongo", function (done) {
//   mongoose.connect(config.mongoURL).then(done);
// });

// runs after all tests in this block  /************COMMENTING OUT FOR TESTING *******/
// after("drop database", function (done) {
//   mongoose.connection.dropDatabase(done);
// })


describe("GET /api/customer/items", function () {
  it("should return all the items in the vending machine", function (done) {
    request(app)
      .get("/api/customer/items")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(function (res) {
        assert.equal(res.body.status, "success");
      })
      .end(done);
  })
});

describe("POST /api/customer/items/itemId/purchases", function () {
  it("customer should be able to purchase an item", function (done) {
    request(app)
      .post("/api/customer/items/596448ff1af6500ee152079b/purchases")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({money_given:1})
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(function(res){
        assert.equal(res.body.status, "success");
      })
      .end(done);
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
      .end(done);
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
      .end(done);
  })
});

describe("PUT /api/vendor/items/:itemId", function () {
  it("update item quantity and description", function (done) {
    request(app)
      .put("/api/vendor/items/59644c40454cb10f5998f44c")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({description:"waffers",quantity:10})
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(function (res) {
        assert.equal(res.body.status, "success");
    })
    .end(done);
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
    })
    .end(done);
  })
});
