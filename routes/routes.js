const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const items = require('../models/items');
const purchases = require('../models/purchase');
mongoose.Promise = require('bluebird');


//GET /api/customer/items - get a list of items
router.get('/api/customer/items', function(req, res) {
  items.find({})
  .then(function(item) {
    if (item) {
      res.setHeader('Content-Type', 'application/json');
      res.json({status:"success", data:item});
    } else {
      res.json({status:"success", data:"No Items found"});
    }
  }).catch(function(err) {
    res.json({status:"failure"});
  });
});

//POST /api/customer/items/:itemId/purchases - purchase an item
router.post('/api/customer/items/:itemId/purchases', function(req, res) {
  var query;
  var quantity = 0;
  var balanceAmount;
  var flagPurchased = false;
  var flagNotZero = false;

  query = items.findOne({_id:req.params.itemId});
  query.select('quantity');
  query.exec(function(err, result) {
  quantity = result.quantity;

  if(parseFloat(req.body.money_given) > 0.65){
    balanceAmount = parseFloat(req.body.money_given) - 0.65;
    balanceAmount = balanceAmount.toFixed(2);
    flagPurchased = true;
  }
  else{
    balanceAmount = 0;
  }

  if(parseInt(quantity) > 0) {
    flagNotZero = true;
    quantity--;

   items.update({_id:req.params.itemId},{quantity: quantity});
  }

  let purchaseInstance = new purchases({
      description_id      : req.params.itemId,
      money_given         : parseFloat(req.body.money_given),
      change_received     : parseFloat(balanceAmount)
  });

  if(flagPurchased && flagNotZero){
    purchaseInstance.save(function(err){
  if(!err){
    res.setHeader('Content-Type', 'application/json');
    res.json({status:"success", data:purchaseInstance});
  }
  else{
  res.json({status:"failure"});
      }
    });
  }
  }).catch(function(err) {
    res.json({status:"failure"});
  });
});

//GET /api/vendor/purchases - get a list of all purchases with their item and date/time
router.get('/api/vendor/purchases', function(req, res) {
  purchases.find({})
  .then(function(purchaseitem) {
    if (purchaseitem) {
      res.setHeader('Content-Type', 'application/json');
      res.json({status:"success", data:purchaseitem});
    } else {
      res.json({status:"failure"});
    }
  }).catch(function(err) {
    res.json({status:"failure"});
  });
});

//POST /api/vendor/items - add a new item not previously existing in the machine
router.post('/api/vendor/items', function(req,res){
  let itemInstance = new items({
    description: req.body.description,
    quantity: req.body.quantity,
    cost : 0.65
  });
  itemInstance.save(function(err){
    if(!err){
      res.setHeader('Content-Type', 'application/json');
      res.json({status:"success", data:itemInstance});
    }
    else{
      res.json({status:"failure"});
    }
  });
});

//GET /api/vendor/money - get a total amount of money accepted by the machine
router.get("/api/vendor/money", function(req, res){
  purchases.aggregate (
    [{
      $group:{
        "_id": null,
        "total": {$sum: {$subtract:["$money_given","$change_received"]}}
    }}],
    function(err, results){
        if (err){
          res.json({status:"failure"});
        }
        else {
          res.json({status:"success", data: results});
        }
    })
});

//PUT /api/vendor/items/:itemId - update item quantity, description
 router.put('/api/vendor/items/:itemId', (req, res, next) => {
   items.update(
     {_id:req.params.itemId},{
       description: req.body.description,
       quantity: parseInt(req.body.quantity)
      })
  .then(response => {
   res.json({status:"success"});
 })
 .catch(err => {
   res.json({status:"failure"});
 });
 });

module.exports = router;
