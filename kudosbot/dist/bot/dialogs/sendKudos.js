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
exports.SendKudosDialog = void 0;
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const botbuilder_1 = require("botbuilder");
const kudosForm = __importStar(require("../../adaptiveCards/kudosForm.json"));
const graphService_1 = require("../services/graphService");
const prismaService_1 = require("../services/prismaService");
// Type assertion to ensure compatibility
const kudosFormCard = kudosForm;
const SEND_KUDOS_DIALOG = "sendKudosDialog";
class SendKudosDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor() {
        super(SEND_KUDOS_DIALOG);
        this.prismaService = new prismaService_1.PrismaService();
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(SEND_KUDOS_DIALOG, [
            this.promptForm.bind(this),
            this.processForm.bind(this),
        ]));
    }
    promptForm(step) {
        return __awaiter(this, void 0, void 0, function* () {
            yield step.context.sendActivity({
                attachments: [botbuilder_1.CardFactory.adaptiveCard(kudosFormCard)],
            });
            return step.endDialog();
        });
    }
    processForm(step) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = step.context.activity.value;
            if (!formData || formData.action !== "sendKudos") {
                yield step.context.sendActivity("Kudos submission cancelled.");
                return step.endDialog();
            }
            const { recipient, kudosType, message, visibility } = formData;
            const senderId = step.context.activity.from.aadObjectId;
            // Mock GraphService for user lookup (replace with actual token logic)
            const graphService = new graphService_1.GraphService("mock-token");
            const recipientId = yield graphService.getUserId(recipient);
            if (!recipientId) {
                yield step.context.sendActivity("Recipient not found. Please check the name or email.");
                return step.endDialog();
            }
            if (!senderId) {
                yield step.context.sendActivity("SenderId not found. Please check the name or email.");
                return step.endDialog();
            }
            // Save kudos
            yield this.prismaService.saveKudos({
                senderId,
                recipientId,
                kudosType,
                message,
                visibility: visibility || "private",
            });
            // Notify sender
            yield step.context.sendActivity(`Kudos sent to ${recipient}!`);
            // Notify recipient (simplified; use Teams/Outlook APIs for actual notifications)
            yield step.context.sendActivity({
                type: "message",
                text: `You received kudos from ${step.context.activity.from.name} for ${kudosType}: ${message}`,
                channelData: { channelId: recipientId }, // Adjust for Teams DM
            });
            // Post to channel if public
            if (visibility === "public") {
                yield step.context.sendActivity({
                    type: "message",
                    text: `🎉 ${step.context.activity.from.name} gave kudos to ${recipient} for ${kudosType}: ${message}`,
                    channelData: { channelId: "your-channel-id" }, // Replace with actual channel
                });
            }
            return step.endDialog();
        });
    }
}
exports.SendKudosDialog = SendKudosDialog;
