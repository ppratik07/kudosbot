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
exports.KudosBot = void 0;
const botbuilder_1 = require("botbuilder");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const sendKudos_1 = require("./dialogs/sendKudos");
const viewKudos_1 = require("./dialogs/viewKudos");
class KudosBot extends botbuilder_1.ActivityHandler {
    constructor() {
        super();
        // Use in-memory storage for development; replace with Cosmos DB for production
        const memoryStorage = new botbuilder_1.MemoryStorage();
        this.conversationState = new botbuilder_1.ConversationState(memoryStorage);
        this.dialogState = this.conversationState.createProperty('DialogState');
        this.dialogSet = new botbuilder_dialogs_1.DialogSet(this.dialogState);
        this.dialogSet.add(new sendKudos_1.SendKudosDialog());
        this.dialogSet.add(new viewKudos_1.ViewKudosDialog());
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const text = (_a = context.activity.text) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim();
            const dialogContext = yield this.dialogSet.createContext(context);
            if (text === null || text === void 0 ? void 0 : text.includes('send kudos')) {
                yield dialogContext.beginDialog('sendKudosDialog');
            }
            else if (text === null || text === void 0 ? void 0 : text.includes('view kudos')) {
                yield dialogContext.beginDialog('viewKudosDialog');
            }
            else {
                yield context.sendActivity('Try "send kudos" or "view kudos".');
            }
            yield this.conversationState.saveChanges(context);
            yield next();
        }));
        this.onDialog((context, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.conversationState.saveChanges(context);
            yield next();
        }));
    }
}
exports.KudosBot = KudosBot;
