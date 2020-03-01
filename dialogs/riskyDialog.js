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

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const EMAIL_PROMPT = 'EMAIL_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const QA_PROMPT = 'QA_PROMPT';
const RISKY_DIALOG = 'RISKY_DIALOG';

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

const userDetails = {};

class RiskyDialog extends ComponentDialog {
    constructor(userState) {
        super(RISKY_DIALOG);

        this.addDialog(new TextPrompt(QA_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));

        this.addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                this.ageStep.bind(this),
                this.tempStep.bind(this),
                this.diseaseStep.bind(this),
                this.finalStep.bind(this)
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    // This is for risk assessment
    async ageStep(step) {
        return await step.prompt(NUMBER_PROMPT, 'Enter your age');
    }

    async tempStep(step) {
        userDetails.age = step.result;

        return await step.prompt(NUMBER_PROMPT, 'Enter your body temperature');
    }

    async diseaseStep(step) {
        userDetails.temperature = step.result;

        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please select in case you are suffering from any of these:',
            choices: ChoiceFactory.toChoices([
                'fever, tiredness, and dry cough',
                'aches and pains',
                'nasal congestion, runny nose',
                'sore throat',
                'diarrhea',
                'difficulty in breathing',
                'N/A'
            ])
        });
    }

    async finalStep(step) {
        let msg = '';
        userDetails.isSuffering = step.result.value;

        if (userDetails.isSuffering !== 'N/A') {
            msg += `${ userDetails.isSuffering } could be a problem.`;
        }
        if (parseInt(userDetails.age) >= 60) {
            msg += `Age of ${ userDetails.age } could be a problem.`;
        }

        if (parseInt(userDetails.temperature) >= 100) {
            msg += 'High temperature could be a problem';
        }
        if (msg) {
            await step.context.sendActivity(msg);
        } else {
            await step.context.sendActivity('You can travel');
        }
        return await step.endDialog();
    }
}

module.exports.RiskyDialog = RiskyDialog;
module.exports.RISKY_DIALOG = RISKY_DIALOG;
