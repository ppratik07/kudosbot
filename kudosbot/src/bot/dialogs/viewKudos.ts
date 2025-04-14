import { ComponentDialog, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';
import { CardFactory } from 'botbuilder';
import * as kudosList from '../../adaptiveCards/kudosList.json';
import { PrismaService } from '../../services/prismaService';
import { GraphService } from '../../services/graphService';

const VIEW_KUDOS_DIALOG = 'viewKudosDialog';

export class ViewKudosDialog extends ComponentDialog {
  private prismaService: PrismaService;

  constructor() {
    super(VIEW_KUDOS_DIALOG);
    this.prismaService = new PrismaService();
    this.addDialog(
      new WaterfallDialog(VIEW_KUDOS_DIALOG, [
        this.showKudos.bind(this),
      ])
    );
  }

  async showKudos(step: WaterfallStepContext) {
    const userId = step.context.activity.from.aadObjectId;
    const kudos = await this.prismaService.getKudos(userId);

    // Mock GraphService for name lookup
    const graphService = new GraphService('mock-token');
    const received = await Promise.all(
      kudos
        .filter((k) => k.recipientId === userId)
        .map(async (k) => ({
          sender: await graphService.getUserName(k.senderId) || 'Unknown',
          kudosType: k.kudosType,
          message: k.message,
          createdAt: k.createdAt.toISOString().split('T')[0],
        }))
    );

    const card = {
      ...kudosList,
      body: [
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
      ],
    };

    await step.context.sendActivity({
      attachments: [CardFactory.adaptiveCard(card)],
    });

    return step.endDialog();
  }
}