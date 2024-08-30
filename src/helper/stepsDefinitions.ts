const baseUrl = '/submit-steps';
const welcomeUrl = '/welcome';

const baseComponentPath = 'SubmitSteps';
const middleComponentPathRecording = 'RecordingsSteps';
const middleComponentPathQuestionary = 'Questionary';
const middleComponentPathSubmission = 'Submission';
const recordYourCoughLogic = 'recordYourCough';

function getWizardData() {
  try {
    const output = JSON.parse(window.localStorage.getItem('virumap-app-wizard') || '{}');
    return output;
  } catch {
    return {};
  }
}

export function getCountry() {
  const data = getWizardData();
  return data?.welcome?.country ?? '';
}

function getCoughSteps(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '/step-record/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: '/welcome/step-4',
        nextStep: `${baseUrl}/step-listen/cough`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/cough`,
        },
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
    {
      path: '/step-manual-upload/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough`,
        nextStep: `${baseUrl}/step-listen/cough`,
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
    {
      path: '/step-listen/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough`,
        nextStep: `${baseUrl}/questionary/step1`,
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
  ];
}

function getQuestionarySteps(storeKey: string): Wizard.Step[] {
  const baseMetadata = {
    total: 16,
    progressCurrent: 1,
    progressTotal: 16,
  };
  return [
    {
      path: '/questionary/step1',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step1`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/cough`,
        nextStep: `${baseUrl}/questionary/step2`,
        metadata: {
          current: 1,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step2',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step2`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step1`,
        nextStep: `${baseUrl}/questionary/step3`,
        metadata: {
          current: 2,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step3',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step3`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step2`,
        nextStep: `${baseUrl}/questionary/step4`,
        metadata: {
          current: 3,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step4',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step4`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step3`,
        nextStep: `${baseUrl}/questionary/step5`,
        metadata: {
          current: 4,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step5',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step5`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step4`,
        nextStep: `${baseUrl}/questionary/step6`,
        metadata: {
          current: 5,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step6',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step6`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step5`,
        nextStep: `${baseUrl}/questionary/step7`,
        metadata: {
          current: 6,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step7',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step7`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step6`,
        nextStep: `${baseUrl}/questionary/step8`,
        metadata: {
          current: 7,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step8',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step8`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step7`,
        nextStep: `${baseUrl}/questionary/step9`,
        metadata: {
          current: 8,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step9',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step9`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step8`,
        nextStep: `${baseUrl}/questionary/step10`,
        metadata: {
          current: 9,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step10',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step10`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step9`,
        nextStep: `${baseUrl}/questionary/step11`,
        metadata: {
          current: 10,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step11',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step11`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step10`,
        nextStep: `${baseUrl}/questionary/step12`,
        metadata: {
          current: 11,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step12',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step12`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step11`,
        nextStep: `${baseUrl}/questionary/step13`,
        metadata: {
          current: 12,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step13',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step13`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step12`,
        nextStep: `${baseUrl}/questionary/step14`,
        metadata: {
          current: 13,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step14',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step14`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step13`,
        nextStep: `${baseUrl}/questionary/step15`,
        metadata: {
          current: 14,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step15',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step15`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step14`,
        nextStep: `${baseUrl}/questionary/step16`,
        metadata: {
          current: 15,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step16',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step16`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step15`,
        nextStep: `${baseUrl}/thank-you`,
        metadata: {
          current: 16,
          ...baseMetadata,
        },
      },
    },
    
  ];
}

/** Welcome Steps */

export function getWelcomeStepsWithoutDots(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '',
      componentPath: 'Welcome/Step1',
      props: {
        storeKey,
        nextStep: `${welcomeUrl}/step-2`,
      },
    },
  ];
}

export function welcomeStepsDefinitions(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '/step-2',
      componentPath: 'Welcome/Step2',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}`,
        nextStep: `${welcomeUrl}/step-3`,
      },
    },
    {
      path: '/step-3',
      componentPath: 'Welcome/Step3',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}/step-2`,
        nextStep: `${welcomeUrl}/step-4`,
      },
    },
    {
      path: '/step-4',
      componentPath: 'Welcome/Step4',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}/step-3`,
        nextStep: '/submit-steps/step-record/cough',
      },
    },
  ];
}

export default function stepsDefinition(storeKey: string) {
  const steps: Wizard.Step[] = [
    // Record Your Cough Steps
    ...getCoughSteps(storeKey),
    // Questionary
    ...getQuestionarySteps(storeKey),
    {
      path: '/thank-you',
      componentPath: `${baseComponentPath}/${middleComponentPathSubmission}/ThankYou`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/before-submit`,
        nextStep: '/welcome',
      },
    },
  ];

  return steps;
}
