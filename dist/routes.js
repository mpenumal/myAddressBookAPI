"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataAccess_1 = require("./dataAccess");
function RunOperation(target, property, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (req, res) {
        return originalMethod(req, res)
            .then((x) => { res.json(x); })
            .catch((x) => { res.send(x); });
    };
}
class Routes {
    static getContactsConditional(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contacts = yield dataAccess_1.getContactsConditionalDA(req.query.pageSize, req.query.page, req.query.query);
            return contacts;
        });
    }
    static getContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield dataAccess_1.getContactDA(req.params.name);
            return contact;
        });
    }
    static addContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dataAccess_1.addContactDA(req.body);
            return result;
        });
    }
    static updateContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dataAccess_1.updateContactDA(req.params.name, req.body);
            return result;
        });
    }
    static deleteContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dataAccess_1.deleteContactDA(req.params.name);
            return result;
        });
    }
}
__decorate([
    RunOperation
], Routes, "getContactsConditional", null);
__decorate([
    RunOperation
], Routes, "getContact", null);
__decorate([
    RunOperation
], Routes, "addContact", null);
__decorate([
    RunOperation
], Routes, "updateContact", null);
__decorate([
    RunOperation
], Routes, "deleteContact", null);
exports.router = express_1.Router();
exports.router.get('/', Routes.getContactsConditional);
exports.router.get('/:name', Routes.getContact);
exports.router.post('/', Routes.addContact);
exports.router.put('/:name', Routes.updateContact);
exports.router.delete('/:name', Routes.deleteContact);
