const {
    ComponentDialog,
    DialogSet,
    ChoiceFactory,
    ChoicePrompt,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { SomeDialog, SOME_DIALOG } = require('./someDialog');
const { TravelDialog, TRAVEL_DIALOG } = require('./travelDialog');

const { CardFactory } = require("botbuilder");

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const USER = 'USER';

const countryDetails = [
    {
        country: 'Country',
        cases: 'Cases',
        deaths: 'Deaths',
        recovered: 'Recovered',
        lastupdated: 'Feb. 29, 3.19am'
    },
    {
        country: 'Mainland China',
        cases: '79251',
        deaths: '2,835',
        recovered: '39002',
        lastupdated: 'Feb. 29, 3.19am'
    },
    {
        country: 'Hong Kong',
        cases: '94',
        deaths: '2',
        recovered: '30',
        lastupdated: 'T'
    },
    {
        country: 'Macau',
        cases: '10',
        deaths: '0',
        recovered: '8'
    },
    {
        country: 'Taiwan',
        cases: '39',
        deaths: '1',
        recovered: '9'
    },
    {
        country: 'Afghanistan',
        cases: '1',
        deaths: '0',
        recovered: '1'
    },
    {
        country: 'Algeria',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Australia',
        cases: '24',
        deaths: '0',
        recovered: '11'
    },
    {
        country: 'Austria',
        cases: '2',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Azerbaijan',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Bahrain',
        cases: '36',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Belarus',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Belgium',
        cases: '1',
        deaths: '0',
        recovered: '1'
    },
    {
        country: 'Brazil',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Cambodia',
        cases: '1',
        deaths: '0',
        recovered: '1'
    },
    {
        country: 'Canada',
        cases: '14',
        deaths: '0',
        recovered: '3',
        lastupdated: 'Feb 15, 6am'
    },
    {
        country: 'Croatia',
        cases: '5',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Denmark',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Egypt',
        cases: '1',
        deaths: '0',
        recovered: '0',
        lastupdated: 'Feb 15, 1am'
    },
    {
        country: 'Estonia',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Finland',
        cases: '2',
        deaths: '0',
        recovered: '1'
    },
    {
        country: 'France',
        cases: '57',
        deaths: '2',
        recovered: '11'
    },
    {
        country: 'Germany',
        cases: '53',
        deaths: '0',
        recovered: '14'
    },
    {
        country: 'Georgia',
        cases: '2',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Greece',
        cases: '4',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Iceland',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'India',
        cases: '3',
        deaths: '0',
        recovered: '3'
    },
    {
        country: 'Iraq',
        cases: '8',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Iran',
        cases: '388',
        deaths: '34',
        recovered: '0'
    },
    {
        country: 'Israel',
        cases: '4',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Italy',
        cases: '888',
        deaths: '21',
        recovered: '46'
    },
    {
        country: 'Japan',
        cases: '235',
        deaths: '5',
        recovered: '22'
    },
    {
        country: 'Diamond Princess',
        cases: '705',
        deaths: '6',
        recovered: '0'
    },
    {
        country: 'Kuwait',
        cases: '45',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Lebanon',
        cases: '3',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Lithuania',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Malaysia',
        cases: '25',
        deaths: '0',
        recovered: '18'
    },
    {
        country: 'Mexico',
        cases: '2',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Nepal',
        cases: '1',
        deaths: '0',
        recovered: '1'
    },
    {
        country: 'Netherlands',
        cases: '2',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'New Zealand',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'North Macedonia',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Nigeria',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Norway',
        cases: '1',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Oman',
        cases: '6',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Pakistan',
        cases: '2',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Philippines',
        cases: '3',
        deaths: '1',
        recovered: '2'
    },
    {
        country: 'Romania',
        cases: '3',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Russia',
        cases: '5',
        deaths: '0',
        recovered: '2'
    },
    {
        country: 'Singapore',
        cases: '98',
        deaths: '0',
        recovered: '69'
    },
    {
        country: 'South Korea',
        cases: '2931',
        deaths: '16',
        recovered: '18'
    },
    {
        country: 'Spain',
        cases: '41',
        deaths: '0',
        recovered: '2'
    },
    {
        country: 'Sri Lanka',
        cases: '1',
        deaths: '0',
        recovered: '1'
    },
    {
        country: 'Sweden',
        cases: '7',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Switzerland',
        cases: '5',
        deaths: '0',
        recovered: '0'
    },
    {
        country: 'Thailand',
        cases: '41',
        deaths: '0',
        recovered: '22'
    },
    {
        country: 'United Arab Emirates',
        cases: '19',
        deaths: '0',
        recovered: '4'
    },
    {
        country: 'United Kingdom',
        cases: '20',
        deaths: '0',
        recovered: '8'
    },
    {
        country: 'United States',
        cases: '62',
        deaths: '0',
        recovered: '6'
    },
    {
        country: 'Vietnam',
        cases: '16',
        deaths: '0',
        recovered: '16'
    }
];

class MainDialog extends ComponentDialog {
    constructor(userState) {
        super(MAIN_DIALOG);
        this.userState = userState;
        this.userProfileAccessor = userState.createProperty(USER);

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new SomeDialog(userState));
        this.addDialog(new TravelDialog(userState));
        this.addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                this.countryOverview.bind(this),
                this.chooseOption.bind(this),
                this.openStep.bind(this),
                this.finalStep.bind(this)
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async countryOverview(step) {
        if (!step.options.isRestarted) {
            await step.context.sendActivity({
              attachments: [this.createAdaptiveCard(countryDetails)]
            });
        }
         return await step.next();
    }

    createAdaptiveCard(results) {
        const struct = {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.0',
            type: 'AdaptiveCard'
        };

        const countries = results.map(result => ({
            type: 'TextBlock',
            weight: 'bolder',
            text: result.country
        }));

        const cases = results.map(result => ({
            type: 'TextBlock',
            weight: 'bolder',
            text: result.cases
        }));

        const deaths = results.map(result => ({
            type: 'TextBlock',
            weight: 'bolder',
            text: result.deaths
        }));

        const recovered = results.map(result => ({
            type: 'TextBlock',
            weight: 'bolder',
            text: result.recovered
        }));

        const body = [
            {
                type: 'ColumnSet',
                columns: [
                    {
                        type: 'Column',
                        items: countries
                    },
                    {
                        type: 'Column',
                        items: cases
                    },
                    {
                        type: 'Column',
                        items: deaths
                    },
                    {
                        type: 'Column',
                        items: recovered
                    }
                ]
            }
        ];
        struct.body = body;

        return CardFactory.adaptiveCard(struct);
    }

    async chooseOption(step) {
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Select An Option',
            choices: ChoiceFactory.toChoices([
                'Plan And Access Travel',
                'Coronavirus Knowhow'
            ])
        });
    }

    async openStep(step) {
        const choice = step.result.value;

        if (choice === 'Plan And Access Travel') {
            return await step.beginDialog(TRAVEL_DIALOG);
        } else if (choice === 'Coronavirus Knowhow') {
            return await step.beginDialog(SOME_DIALOG);
        }
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async finalStep(stepContext) {
        return await stepContext.replaceDialog(this.initialDialogId, {
            isRestarted: true
        });
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;
