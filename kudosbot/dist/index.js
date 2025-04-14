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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const botbuilder_1 = require("botbuilder");
const dotenv_1 = require("dotenv");
const kudosBot_1 = require("./bot/kudosBot");
(0, dotenv_1.config)();
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
});
const bot = new kudosBot_1.KudosBot();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, (context) => __awaiter(void 0, void 0, void 0, function* () {
        yield bot.run(context);
    }));
});
const port = process.env.PORT || 3978;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
