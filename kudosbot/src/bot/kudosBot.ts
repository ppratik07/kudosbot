import { ActivityHandler, BotState, ConversationState, MemoryStorage, StatePropertyAccessor } from 'botbuilder';
import { DialogSet, DialogState } from 'botbuilder-dialogs';
import { SendKudosDialog } from './dialogs/sendKudos';
import { ViewKudosDialog } from './dialogs/viewKudos';

export class KudosBot extends ActivityHandler {
  private conversationState: ConversationState;
  private dialogSet: DialogSet;
  private dialogState: StatePropertyAccessor<DialogState>;

  constructor() {
    super();
    // Use in-memory storage for development; replace with Cosmos DB for production
    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.dialogState = this.conversationState.createProperty<DialogState>('DialogState');
    this.dialogSet = new DialogSet(this.dialogState);
    this.dialogSet.add(new SendKudosDialog());
    this.dialogSet.add(new ViewKudosDialog());

    this.onMessage(async (context, next) => {
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