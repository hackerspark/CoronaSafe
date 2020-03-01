const {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { RiskyDialog, RISKY_DIALOG } = require("./riskyDialog");

const USER_PROFILE = 'USER_PROFILE';
const TRAVEL_DIALOG = 'TRAVEL_DIALOG';
const SRC_CTRY_PROMPT = 'SRC_CTRY_PROMPT';
const DEST_CTRY_PROMPT = 'DEST_CTRY_PROMPT';
const CHINA_TRAVEL_YN = 'CHINA_TRAVEL_YN';
const ITALY_TRAVEL_YN = 'ITALY_TRAVEL_YN';

const userDetails = {};

const chinaBanned = [
    'australia',
    'bahamas',
    'india',
    'indonesia',
    'japan',
    'madagascar',
    'malaysia',
    'new zealand',
    'philippines',
    'singapore',
    'turkey',
    'usa',
    'vietnam'
];

const italyBanned = [
    'Aruba',
    'Cook Islands',
    'Fiji',
    'Israel',
    'Jordan',
    'Lebanon',
    'Mauritius',
    'Mongolia',
    'St Lucia',
    'Seychelles'
];

class TravelDialog extends ComponentDialog {
    constructor(userState) {
        super(TRAVEL_DIALOG);

        this.addDialog(new TextPrompt(SRC_CTRY_PROMPT));
        this.addDialog(new TextPrompt(DEST_CTRY_PROMPT));
        this.addDialog(new ChoicePrompt(CHINA_TRAVEL_YN));
        this.addDialog(new ChoicePrompt(ITALY_TRAVEL_YN));
        this.addDialog(new RiskyDialog(userState));

        this.addDialog(
            new WaterfallDialog(TRAVEL_DIALOG, [
                this.srcCtryStep.bind(this),
                this.destCtryStep.bind(this),
                this.travelChinaStep.bind(this),
                this.travelItalyStep.bind(this),
                this.finalStep.bind(this)
            ])
        );

        this.initialDialogId = TRAVEL_DIALOG;
    }

    async srcCtryStep(step) {
        return await step.prompt(SRC_CTRY_PROMPT, 'Enter Source Country');
    }

    async destCtryStep(step) {
        const src = step.result;
        userDetails.src = src;
        return await step.prompt(DEST_CTRY_PROMPT, 'Enter Destination Country');
    }

    async travelChinaStep(step) {
        const dest = step.result;
        userDetails.dest = dest;
        return await step.prompt(CHINA_TRAVEL_YN, {
            prompt: 'Did you travel to China in last 14-28 days?',
            choices: ChoiceFactory.toChoices(['Yes', 'No'])
        });
    }

    async travelItalyStep(step) {
        const yn = step.result.value;
        if (
            yn.toLowerCase() === 'yes' &&
            chinaBanned.includes(userDetails.dest.toLowerCase())
        ) {
            await step.context.sendActivity(`Your travel from ${ userDetails.src } to ${ userDetails.dest } is not allowed.`);
            return await step.endDialog('hi');
        } else {
            return await step.prompt(ITALY_TRAVEL_YN, {
                prompt: 'Did you travel to Italy in last 14 days?',
                choices: ChoiceFactory.toChoices(['Yes', 'No'])
            });
        }
    }

    async finalStep(step) {
        const yn = step.result.value;
        if (
            yn.toLowerCase() === 'yes' &&
      italyBanned.includes(userDetails.dest.toLowerCase())
        ) {
            await step.context.sendActivity(`Your travel from ${ userDetails.src } to ${ userDetails.dest } is not allowed.`);
            return await step.endDialog('hi');
        } else {
            await step.context.sendActivity(`Your travel from ${ userDetails.src } to ${ userDetails.dest } is allowed.`);
            return await step.beginDialog(RISKY_DIALOG);
        }
    }
}

module.exports.TravelDialog = TravelDialog;
module.exports.TRAVEL_DIALOG = TRAVEL_DIALOG;
