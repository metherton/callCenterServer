var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');
var Agent = require('../models/agents');

var sessionRouter = express.Router();
sessionRouter.use(bodyParser.json());

sessionRouter.route('/')
    .get(Agent.getSession);

module.exports = sessionRouter;
