"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ViewKudosDialog = void 0;
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const botbuilder_1 = require("botbuilder");
const kudosList = __importStar(require("../../adaptiveCards/kudosList.json"));
const prismaService_1 = require("../services/prismaService");
const graphService_1 = require("../services/graphService");
const VIEW_KUDOS_DIALOG = 'viewKudosDialog';
class ViewKudosDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor() {
        super(VIEW_KUDOS_DIALOG);
        this.prismaService = new prismaService_1.PrismaService();
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(VIEW_KUDOS_DIALOG, [
            this.showKudos.bind(this),
        ]));
    }
    showKudos(step) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = step.context.activity.from.aadObjectId;
            if (userId === null || userId === undefined) {
                yield step.context.sendActivity('User ID not found. Please check your credentials.');
                return step.endDialog();
            }
            const kudos = yield this.prismaService.getKudos(userId);
            // Mock GraphService for name lookup
            const graphService = new graphService_1.GraphService('mock-token');
            const received = yield Promise.all(kudos
                .filter((k) => k.recipientId === userId)
                .map((k) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    sender: (yield graphService.getUserName(k.senderId)) || 'Unknown',
                    kudosType: k.kudosType,
                    message: k.message,
                    createdAt: k.createdAt.toISOString().split('T')[0],
                });
            })));
            const card = Object.assign(Object.assign({}, kudosList), { body: [
                    ...kudosList.body,
                    {
                        type: 'Container',
                        items: [
                            {
                                type: 'TextBlock',
                                text: received.length > 0 ? 'Received Kudos:' : 'No kudos received yet.',
                                weight: 'bolder',
                            },
                            {
                                type: 'FactSet',
                                facts: received.map((k) => ({
                                    title: `From ${k.sender}: ${k.kudosType}`,
                                    value: `${k.message} (${k.createdAt})`,
                                })),
                            },
                        ],
                    },
                ] });
            yield step.context.sendActivity({
                attachments: [botbuilder_1.CardFactory.adaptiveCard(card)],
            });
            return step.endDialog();
        });
    }
}
exports.ViewKudosDialog = ViewKudosDialog;
