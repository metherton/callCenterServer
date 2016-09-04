var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');
var SetUp = require('../models/setup');

var validationRouter = express.Router();
validationRouter.use(bodyParser.json());

validationRouter.route('/')
    .get(SetUp.validate);

module.exports = validationRouter;
