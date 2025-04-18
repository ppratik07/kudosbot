import { ActivityHandler, BotState, ConversationState, MemoryStorage } from 'botbuilder';
import { DialogSet, DialogState } from 'botbuilder-dialogs';
import { SendKudosDialog } from './dialogs/sendKudos';
import { ViewKudosDialog } from './dialogs/viewKudos';

export class KudosBot extends ActivityHandler {
  private conversationState: ConversationState;
  private dialogSet: DialogSet;
  private dialogState: BotState;

  constructor() {
    super();
    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    //@ts-ignore
    this.dialogState = this.conversationState.createProperty<DialogState>('DialogState');
    //@ts-ignore
    this.dialogSet = new DialogSet(this.dialogState);
    this.dialogSet.add(new SendKudosDialog());
    this.dialogSet.add(new ViewKudosDialog());

    this.onMessage(async (context, next) => {
      console.log('Incoming activity:', JSON.stringify(context.activity, null, 2));
      const text = context.activity.text?.toLowerCase().trim();
      const dialogContext = await this.dialogSet.createContext(context);

      if (text?.includes('send kudos')) {
        await dialogContext.beginDialog('sendKudosDialog');
      } else if (text?.includes('view kudos')) {
        await dialogContext.beginDialog('viewKudosDialog');
      } else {
        await context.sendActivity('Try "send kudos" or "view kudos".');
      }

      await this.conversationState.saveChanges(context);
      await next();
    });

    this.onDialog(async (context, next) => {
      await this.conversationState.saveChanges(context);
      await next();
    });
  }
}