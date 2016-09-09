var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');
var Agent = require('../models/agents');

var loginRouter = express.Router();
loginRouter.use(bodyParser.json());

loginRouter.route('/').post(Agent.login);

module.exports = loginRouter;
