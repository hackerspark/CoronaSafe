const {
    AttachmentPrompt,
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { CardFactory } = require("botbuilder");

// const { MainDialog, MAIN_DIALOG } = require("./mainDialog");

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const EMAIL_PROMPT = 'EMAIL_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const QA_PROMPT = 'QA_PROMPT';
const SOME_DIALOG = 'SOME_DIALOG';

const myth = `The following measures ARE NOT effective against COVID-2019 and can be harmful
    Smoking
    Taking traditional herbal remedies
    Wearing multiple masks
    Taking self-medication such as antibiotics`;
const qA = `What is coronavirus?
Coronaviruses are a large family of viruses which may cause illness in animals or humans.  
In humans, several coronaviruses are known to cause respiratory infections ranging from 
the common cold to more severe diseases such as Middle East Respiratory Syndrome (MERS) and Severe 
Acute Respiratory Syndrome (SARS). The most recently discovered coronavirus causes coronavirus disease COVID-19.

What are the symptoms of COVID-19?
    -fever, tiredness, and dry cough
	-aches and pains
	-nasal congestion, runny nose
	-sore throat
	-diarrhea
    -difficulty in breathing
    
How does COVID-19 spread?
People can catch COVID-19 from others who have the virus. 
The disease can spread from person to person through small droplets from the nose or 
mouth which are spread when a person with COVID-19 coughs or exhales. 

Should I wear a mask to protect myself?
People with no respiratory symptoms, such as cough, do not need to wear a medical mask. 
WHO recommends the use of masks for people who have symptoms of COVID-19 and for those caring for individuals who have symptoms, such as cough and fever. 
The use of masks is crucial for health workers and people who are taking care of someone (at home or in a health care facility).
    `;

const preventiveMeasures = `
-Regularly and thoroughly clean your hands with an alcohol-based hand rub or wash them with soap and water.
-Maintain at least 1 metre (3 feet) distance between yourself and anyone who is coughing or sneezing.
-Make sure you, and the people around you, follow good respiratory hygiene. This means covering your mouth and nose with your bent elbow or tissue when you cough or sneeze.
-If you have a fever, cough and difficulty breathing, seek medical attention and call in advance. 
`;

const userDetails = {

};

class SomeDialog extends ComponentDialog {
    constructor(userState) {
        super(SOME_DIALOG);

        this.addDialog(new TextPrompt(QA_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                this.chooseQA.bind(this),
                this.policyProviderStep.bind(this)
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async chooseQA(step) {
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please select the option:',
            choices: ChoiceFactory.toChoices([
                'Myth Busters',
                'FAQs',
                'Preventive Measures'
            ])
        });
    }

    async policyProviderStep(step) {
        userDetails.category = step.result.value;

        if (userDetails.category === 'Myth Busters') {
            await step.context.sendActivity(myth);
        } else if (userDetails.category === 'FAQs') {
            await step.context.sendActivity(qA);
        } else if (userDetails.category === 'Preventive Measures') {
            const msg = {
                $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                type: 'AdaptiveCard',
                version: '1.0',
                body: [
                    {
                        type: 'TextBlock',
                        text:
                    'Regularly and thoroughly clean your hands with an alcohol-based hand rub or wash them with soap and water.',
                        wrap: true
                    },
                    {
                        type: 'TextBlock',
                        text:
                    'Maintain at least 1 metre (3 feet) distance between yourself and anyone who is coughing or sneezing.',
                        wrap: true
                    },
                    {
                        type: 'TextBlock',
                        text:
                    'Make sure you, and the people around you, follow good respiratory hygiene. This means covering your mouth and nose with your bent elbow or tissue when you cough or sneeze.',
                        wrap: true
                    },
                    {
                        type: 'TextBlock',
                        text:
                    'If you have a fever, cough and difficulty breathing, seek medical attention and call in advance.',
                        wrap: true
                    }
                ]
            };
            await step.context.sendActivity({
              attachments: [CardFactory.adaptiveCard(msg)]
            });
        }

        return await step.endDialog();
    }
}

module.exports.SomeDialog = SomeDialog;
module.exports.SOME_DIALOG = SOME_DIALOG;
