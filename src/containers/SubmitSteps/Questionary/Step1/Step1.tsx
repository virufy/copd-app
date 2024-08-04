import React, {
  memo, useCallback, useEffect, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Components
import OptionList from 'components/OptionList';
import OptionListMulti from 'components/OptionListMulti';
import WizardButtons from 'components/WizardButtons';

// Styles
import {
  QuestionText,
  MainContainer,
  QuestionNote,
  QuestionInput,
  InputLabel,
} from '../style';

const schema = Yup.object({
  illStatus: Yup.string().oneOf(['yes', 'no', 'unsure']).required(),
  zipCode: Yup.string().required(),
  age: Yup.string().oneOf(['<18 years', '18-45', '45-65', '>65"', 'Decline to answer']).required(),
  ethnicity: Yup.array().of(Yup.string().oneOf(['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic, Latino, or Spanish Origin', 'White', 'Other', 'Decline to answer'])).min(1).required(),
  gender: Yup.array().of(Yup.string().oneOf(['Female', 'Male', 'Transgender', 'Other'])).min(1).required(),
  sex: Yup.array().of(Yup.string().oneOf(['Female', 'Male', 'Decline to answer'])).min(1).required(),
  condition: Yup.string().oneOf(['Allergies', 'Asthma', 'Bronchitis', 'Congestive heart failure', 'Cough from other medical conditions', 'Cystic fibrosis', 'Emphysema', 'Extreme obesity', 'HIV', 'Lung cancer', 'Pneumonia', 'Pregnancy', 'Pulmonary fibrosis', 'Sinusitis', 'Tuberculosis', 'Valvular heart disease']).required(),
  isSmoking: Yup.array().of(Yup.string().oneOf(['Once in a while', 'Every 2 weeks', 'Every week', 'Alternate days', 'Every day', 'No, never smoke'])).min(1).required(),
  yearsSmoked: Yup.array().of(Yup.string().oneOf(['Less than one year', '1 to 3 years', '3 to 6 years', '6 to 10 years', '> 10 years', 'Not Applicable'])).min(1).required(),
  COPDsymptoms: Yup.string().oneOf([]).required(),
  numChestAttacks: Yup.string().oneOf(['<2', '2 to 4', '4 to 6', '6 to 8', '>8']).required(),
  numHospitalized: Yup.string().oneOf(['Rarely', 'Sometimes', 'Half of the time', 'Most often', 'Every time']).required(),
  compliance: Yup.string().oneOf(['Non-compliant', 'Sometimes', 'Compliant']).required(),
  trigger: Yup.string().oneOf(['Acute infection', 'Exposure to pollutants', 'Respiratory disease']).required(),
  rateQOL: Yup.string().oneOf([]).required(),
  recover: Yup.string().oneOf(['<1 week', '1-2 weeks', '<1 month', '1-2 months', '>2 months']).required(),
  QOLimprovement: Yup.string().oneOf(['Significantly worsened', 'Worsened', 'No change', 'Slightly improved', 'Significantly improved']).required(),
}).defined();

type Step1Type = Yup.InferType<typeof schema>;

const Step2 = ({
  previousStep,
  nextStep,
  storeKey,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const {
    setDoGoBack, setTitle, setType, setSubtitle,
  } = useHeaderContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { state, action } = useStateMachine(updateAction(storeKey));
  const {
    control, handleSubmit, formState,
  } = useForm({
    mode: 'onChange',
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });
  console.log(formState);

  const { errors, isValid } = formState;

  // States
  const [activeStep, setActiveStep] = useState(true);

  // Callbacks
  const handleDoBack = useCallback(() => {
    setActiveStep(false);
    if (previousStep) {
      history.push(previousStep);
    } else {
      history.goBack();
    }
  }, [history, previousStep]);

  const onSubmit = async (values: Step1Type) => {
    if (values) {
      action(values);
      if (nextStep) {
        setActiveStep(false);
        history.push(nextStep);
      }
    }
  };

  // Effects
  useEffect(() => {
    scrollToTop();
    setTitle(`${t('questionary:headerQuestions')}`);
    setType('primary');
    setDoGoBack(() => handleDoBack);
    setSubtitle('');
  }, [handleDoBack, setDoGoBack, setTitle, setType, metadata, t, setSubtitle]);

  const illOptions = [
    {
      value: 'yes',
      label: t('questionary:step1.options1.yes'),
    },
    {
      value: 'no',
      label: t('questionary:step1.options1.no'),
    },
    {
      value: 'unsure',
      label: t('questionary:step1.options1.unsure'),
    },
  ];

  const ageOptions = [
    {
      value: '<18 years',
      label: t('questionary:step1.options3.<18 years'),
    },
    {
      value: '18-45',
      label: t('questionary:step1.options3.18-45'),
    },
    {
      value: '45-65',
      label: t('questionary:step1.options3.45-65'),
    },
    {
      value: '>65',
      label: t('questionary:step1.options3.>65'),
    },
    {
      value: 'Decline to answer',
      label: t('questionary:step1.options3.Decline to answer'),
    },
  ];

  const ethnicityOptions = [
    {
      value: 'American Indian or Alaska Native',
      label: t('questionary:step1.options4.American Indian or Alaska Native'),
    },
    {
      value: 'Asian',
      label: t('questionary:step1.options4.Asian'),
    },
    {
      value: 'Black or African American',
      label: t('questionary:step1.options4.Black or African American'),
    },
    {
      value: 'Hispanic, Latino, or Spanish Origin',
      label: t('questionary:step1.options4.Hispanic, Latino, or Spanish Origin'),
    },
    {
      value: 'White',
      label: t('questionary:step1.options4.White'),
    },
    {
      value: 'Other',
      label: t('questionary:step1.options4.Other'),
    },
    {
      value: 'Decline to answer',
      label: t('questionary:step1.options4.Decline to answer'),
    },
  ];

  const genderOptions = [
    {
      value: 'Female',
      label: t('questionary:step1.options5.Female'),
    },
    {
      value: 'Male',
      label: t('questionary:step1.options5.Male'),
    },
    {
      value: 'Transgender',
      label: t('questionary:step1.options5.Transgender'),
    },
    {
      value: 'Other',
      label: t('questionary:step1.options5.Other'),
    },
  ];

  const biologicalSexOptions = [
    {
      value: 'Female',
      label: t('questionary:step1.options6.Female'),
    },
    {
      value: 'Male',
      label: t('questionary:step1.options6.Male'),
    },
    {
      value: 'Decline to answer',
      label: t('questionary:step1.options6.Decline to answer'),
    },
  ];

  const conditionOptions = [
    {
      value: 'Allergies',
      label: t('questionary:step1.options7.Allergies'),
    },
    {
      value: 'Asthma',
      label: t('questionary:step1.options7.Asthma'),
    },
    {
      value: 'Bronchitis',
      label: t('questionary:step1.options7.Bronchitis'),
    },
    {
      value: 'Congestive heart failure',
      label: t('questionary:step1.options7.Congestive heart failure'),
    },
    {
      value: 'Cough from other medical conditions',
      label: t('questionary:step1.options7.Cough from other medical conditions'),
    },
    {
      value: 'Cystic fibrosis',
      label: t('questionary:step1.options7.Cystic fibrosis'),
    },
    {
      value: 'Emphysema',
      label: t('questionary:step1.options7.Emphysema'),
    },
    {
      value: 'Extreme obesity',
      label: t('questionary:step1.options7.Extreme obesity'),
    },
    {
      value: 'HIV',
      label: t('questionary:step1.options7.HIV'),
    },
    {
      value: 'Lung cancer',
      label: t('questionary:step1.options7.Lung cancer'),
    },
    {
      value: 'Pneumonia',
      label: t('questionary:step1.options7.Pneumonia'),
    },
    {
      value: 'Pregnancy',
      label: t('questionary:step1.options7.Pregnancy'),
    },
    {
      value: 'Pulmonary fibrosis',
      label: t('questionary:step1.options7.Pulmonary fibrosis'),
    },
    {
      value: 'Sinusitis',
      label: t('questionary:step1.options7.Sinusitis'),
    },
    {
      value: 'Tuberculosis',
      label: t('questionary:step1.options7.Tuberculosis'),
    },
    {
      value: 'Valvular heart disease',
      label: t('questionary:step1.options7.Valvular heart disease'),
    },
  ];

  const smokingOptions = [
    {
      value: 'Once in a while',
      label: t('questionary:step1.options8.Once in a while'),
    },
    {
      value: 'Every 2 weeks',
      label: t('questionary:step1.options8.Every 2 weeks'),
    },
    {
      value: 'Every week',
      label: t('questionary:step1.options8.Every week'),
    },
    {
      value: 'Alternate days',
      label: t('questionary:step1.options8.Alternate days'),
    },
    {
      value: 'Every day',
      label: t('questionary:step1.options8.Every day'),
    },
    {
      value: 'No, never smoke',
      label: t('questionary:step1.options8.No, never smoke'),
    },
  ];

  const yearsSmokedOptions = [
    {
      value: 'Less than one year',
      label: t('questionary:step1.options9.Less than one year'),
    },
    {
      value: '1 to 3 years',
      label: t('questionary:step1.options9.1 to 3 years'),
    },
    {
      value: '3 to 6 years',
      label: t('questionary:step1.options9.3 to 6 years'),
    },
    {
      value: '6 to 10 years',
      label: t('questionary:step1.options9.6 to 10 years'),
    },
    {
      value: '> 10 years',
      label: t('questionary:step1.options9.> 10 years'),
    },
    {
      value: 'Not Applicable',
      label: t('questionary:step1.options9.Not Applicable'),
    },
  ];

  const numChestAttackOptions = [
    {
      value: '<2',
      label: t('questionary:step1.options11.<2'),
    },
    {
      value: '2 to 4',
      label: t('questionary:step1.options11.2 to 4'),
    },
    {
      value: '4 to 6',
      label: t('questionary:step1.options11.4 to 6'),
    },
    {
      value: '6 to 8',
      label: t('questionary:step1.options11.6 to 8'),
    },
    {
      value: '>8',
      label: t('questionary:step1.options11.>8'),
    },
  ];

  const numHospitalizedOptions = [
    {
      value: '<Rarely',
      label: t('questionary:step1.options12.Rarely'),
    },
    {
      value: 'Sometimes',
      label: t('questionary:step1.options12.Sometimes'),
    },
    {
      value: 'Half of the time',
      label: t('questionary:step1.options12.Half of the time'),
    },
    {
      value: 'Most often',
      label: t('questionary:step1.options12.Most often'),
    },
    {
      value: 'Every time',
      label: t('questionary:step1.options12.Every time'),
    },
  ];

  const complianceOptions = [
    {
      value: 'Non-compliant',
      label: t('questionary:step1.options13.Non-compliant'),
    },
    {
      value: 'Sometimes',
      label: t('questionary:step1.options13.Sometimes'),
    },
    {
      value: 'Compliant',
      label: t('questionary:step1.options13.Compliant'),
    },
  ];

  const triggerOptions = [
    {
      value: 'Acute infection',
      label: t('questionary:step1.options14.Acute infection'),
    },
    {
      value: 'Exposure to pollutants',
      label: t('questionary:step1.options14.Exposure to pollutants'),
    },
    {
      value: 'Respiratory disease',
      label: t('questionary:step1.options14.Respiratory disease'),
    },
  ];

  const recoverOptions = [
    {
      value: '<1 week',
      label: t('questionary:step1.options16.<1 week'),
    },
    {
      value: '1-2 weeks',
      label: t('questionary:step1.options16.1-2 weeks'),
    },
    {
      value: '<1 month',
      label: t('questionary:step1.options16.<1 month'),
    },
    {
      value: '1-2 months',
      label: t('questionary:step1.options16.1-2 months'),
    },
    {
      value: '>2 months',
      label: t('questionary:step1.options16.>2 months'),
    },
  ];

  const QOLOptions = [
    {
      value: 'Significantly worsened',
      label: t('questionary:step1.options17.Significantly worsened'),
    },
    {
      value: 'Worsened',
      label: t('questionary:step1.options17.Worsened'),
    },
    {
      value: 'No change',
      label: t('questionary:step1.options17.No change'),
    },
    {
      value: 'Slightly improved',
      label: t('questionary:step1.options17.Slightly improved'),
    },
    {
      value: 'Significantly improved',
      label: t('questionary:step1.options17.Significantly improved'),
    },
  ];
  return (
    <MainContainer>
      <QuestionText extraSpace first>{t('questionary:step1.question1')}
      </QuestionText>
      <Controller
        control={control}
        name="illStatus"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={illOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="illStatus"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText hasNote>
        {t('questionary:step1.question2')}
      </QuestionText>
      <QuestionNote>{t('questionary:step1.caption2')}</QuestionNote>
      <Controller
        control={control}
        name="zipCode"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <>
            <InputLabel>{t('questionary:step1.zipCodeLabel')}</InputLabel>
            <QuestionInput
              name={name}
              value={value}
              onChange={onChange}
              type="text"
              placeholder={t('questionary:step1.zipCodePlaceholder')}
              autoComplete="Off"
            />
          </>
        )}
      />
      <ErrorMessage
        errors={errors}
        name="zipCode"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question3')}
      </QuestionText>
      <Controller
        control={control}
        name="age"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={ageOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="age"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question4')}
      </QuestionText>
      <Controller
        control={control}
        name="ethnicity"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionListMulti
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected)} // Pass the entire selected array
            items={ethnicityOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="ethnicity"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question5')}
      </QuestionText>
      <Controller
        control={control}
        name="gender"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionListMulti
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected)} // Pass the entire selected array
            items={genderOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="gender"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question6')}
      </QuestionText>
      <Controller
        control={control}
        name="sex"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionListMulti
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected)} // Pass the entire selected array
            items={biologicalSexOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="sex"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question7')}
      </QuestionText>
      <Controller
        control={control}
        name="condition"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={conditionOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="condition"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question8')}
      </QuestionText>
      <Controller
        control={control}
        name="isSmoking"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionListMulti
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected)} // Pass the entire selected array
            items={smokingOptions}
          />
        )}
      />

      <ErrorMessage
        errors={errors}
        name="isSmoking"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question9')}
      </QuestionText>
      <Controller
        control={control}
        name="yearsSmoked"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionListMulti
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected)} // Pass the entire selected array
            items={yearsSmokedOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="yearsSmoked"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question10')}
      </QuestionText>
      <Controller
        control={control}
        name="COPDsymptoms"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={biologicalSexOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="COPDsymptoms"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question11')}
      </QuestionText>
      <Controller
        control={control}
        name="numChestAttacks"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={numChestAttackOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="numChestAttacks"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question12')}
      </QuestionText>
      <Controller
        control={control}
        name="numHospitalized"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={numHospitalizedOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="numHospitalized"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question13')}
      </QuestionText>
      <Controller
        control={control}
        name="compliance"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={complianceOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="compliance"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question14')}
      </QuestionText>
      <Controller
        control={control}
        name="trigger"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={triggerOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="trigger"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question15')}
      </QuestionText>
      <Controller
        control={control}
        name="rateQOL"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={recoverOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="rateQOL"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question16')}
      </QuestionText>
      <Controller
        control={control}
        name="recover"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={recoverOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="recover"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      <QuestionText>{t('questionary:step1.question17')}
      </QuestionText>
      <Controller
        control={control}
        name="QOLimprovement"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={QOLOptions}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="QOLimprovement"
        render={({ message }) => (
          <p>{message}</p>
        )}
      />

      {/* Bottom Buttons */}
      {activeStep && (
        <Portal>
          <WizardButtons
            leftLabel={t('questionary:submit')}
            leftDisabled={!isValid}
            leftHandler={handleSubmit(onSubmit)}
            invert
          />
        </Portal>
      )}
    </MainContainer>
  );
};

export default memo(Step2);
