import { ComponentDialog, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';
import { CardFactory } from 'botbuilder';
import * as kudosForm from '.../../`adaptiveCards/kudosForm.json';
import { GraphService } from '../../services/graphService';
import { PrismaService } from '../../services/prismaService';

const SEND_KUDOS_DIALOG = 'sendKudosDialog';

export class SendKudosDialog extends ComponentDialog {
  private prismaService: PrismaService;

  constructor() {
    super(SEND_KUDOS_DIALOG);
    this.prismaService = new PrismaService();
    this.addDialog(
      new WaterfallDialog(SEND_KUDOS_DIALOG, [
        this.promptForm.bind(this),
        this.processForm.bind(this),
      ])
    );
  }

  async promptForm(step: WaterfallStepContext) {
    await step.context.sendActivity({
      attachments: [CardFactory.adaptiveCard(kudosForm)],
    });
    return step.endDialog();
  }

  async processForm(step: WaterfallStepContext) {
    const formData = step.context.activity.value;
    if (!formData || formData.action !== 'sendKudos') {
      await step.context.sendActivity('Kudos submission cancelled.');
      return step.endDialog();
    }

    const { recipient, kudosType, message, visibility } = formData;
    const senderId = step.context.activity.from.aadObjectId;

    // Mock GraphService for user lookup (replace with actual token logic)
    const graphService = new GraphService('mock-token');
    const recipientId = await graphService.getUserId(recipient);

    if (!recipientId) {
      await step.context.sendActivity('Recipient not found. Please check the name or email.');
      return step.endDialog();
    }

    // Save kudos
    await this.prismaService.saveKudos({
      senderId,
      recipientId,
      kudosType,
      message,
      visibility: visibility || 'private',
    });

    // Notify sender
    await step.context.sendActivity(`Kudos sent to ${recipient}!`);

    // Notify recipient (simplified; use Teams/Outlook APIs for actual notifications)
    await step.context.sendActivity({
      type: 'message',
      text: `You received kudos from ${step.context.activity.from.name} for ${kudosType}: ${message}`,
      channelData: { channelId: recipientId }, // Adjust for Teams DM
    });

    // Post to channel if public
    if (visibility === 'public') {
      await step.context.sendActivity({
        type: 'message',
        text: `🎉 ${step.context.activity.from.name} gave kudos to ${recipient} for ${kudosType}: ${message}`,
        channelData: { channelId: 'your-channel-id' }, // Replace with actual channel
      });
    }

    return step.endDialog();
  }
}