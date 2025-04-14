"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphService = void 0;
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
class GraphService {
    constructor(token) {
        this.client = microsoft_graph_client_1.Client.init({
            authProvider: (done) => done(null, token),
        });
    }
    getUserId(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.client.api(`/users/${email}`).get();
                return user.id;
            }
            catch (error) {
                return null;
            }
        });
    }
    getUserName(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.client.api(`/users/${userId}`).get();
                return user.displayName;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.GraphService = GraphService;
