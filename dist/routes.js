"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataAccess_1 = require("./dataAccess");
exports.router = express_1.Router();
this.router.get('/pageSize={:pageSize}&page={:page}&query={:queryStr}', getContactsConditional);
this.router.post('/', addContact);
this.router.get('/:name', getContact);
this.router.put('/:name', updateContact);
this.router.delete('/:name', deleteContact);
function getContactsConditional(req, res, next) {
    let pageSize = req.params.pageSize;
    let page = req.params.page;
    let queryStr = req.params.queryStr;
    dataAccess_1.getContactsConditionalDA(pageSize, page, queryStr)
        .then(function (x) {
        res.json(x.responses);
    });
}
function addContact(req, res, next) {
    let contact = req.body;
    dataAccess_1.addContactDA(contact)
        .then(function (x) {
        res.status = x.status;
    });
}
function updateContact(req, res, next) {
    let contact = req.body;
    let name = req.params.name;
    dataAccess_1.updateContactDA(name, contact)
        .then(function (x) {
        res.send(x.updated);
    });
}
function getContact(req, res, next) {
    let name = req.params.name;
    console.log(name);
    dataAccess_1.getContactDA(name)
        .then(function (x) {
        res.json(x
            .hits
            .hits
            .map(x => { return x._source; }));
    });
}
function deleteContact(req, res, next) {
    dataAccess_1.deleteContactDA(name)
        .then(function (x) {
        res.send(x.deleted);
    });
}
