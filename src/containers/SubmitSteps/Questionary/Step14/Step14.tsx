import React, { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import usePortal from "react-useportal";
import { useTranslation } from "react-i18next";

// Form
import { useForm, Controller } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { yupResolver } from "@hookform/resolvers";
import { ErrorMessage } from "@hookform/error-message";
import * as Yup from "yup";

// Update Action
import { updateAction } from "utils/wizard";

// Header Control
import useHeaderContext from "hooks/useHeaderContext";

// Utils
import { scrollToTop } from "helper/scrollHelper";

// Components
import OptionList from "components/OptionList";
import WizardButtons from "components/WizardButtons";

// Styles
import {
  QuestionText,
  MainContainer,
  QuestionNote,
  QuestionInput,
  InputLabel,
} from "../style";

const schema = Yup.object({
    conditions: Yup.array().of(Yup.string().oneOf(['None', 'Allergies', 'Asthma', 'Bronchitis', 'Congestive heart failure', 'COPD/emphysema', 'Extreme obesity', 'Heart disease', 'HIV, AIDS, or impaired immune system', 'Other chronic lung disease', 'Pneumonia', 'Pulmonary fibrosis', 'Sinusitis', 'Tuberculosis', 'Hypertension', 'Hypothyroidism', 'Family member has or had suffered from a respiratory disease', 'Other'])).min(1).required()
}).defined();

type Step14Type = Yup.InferType<typeof schema>;

const Step15 = ({
  previousStep,
  nextStep,
  storeKey,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo:
      document && (document.getElementById("wizard-buttons") as HTMLDivElement),
  });
  const { setDoGoBack, setTitle, setType, setSubtitle } = useHeaderContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { state, action } = useStateMachine(updateAction(storeKey));
  const { control, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });

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

  const onSubmit = async (values: Step14Type) => {
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
    setTitle(`${t("questionary:headerQuestions")}`);
    setType("primary");
    setDoGoBack(() => handleDoBack);
    setSubtitle("");
  }, [handleDoBack, setDoGoBack, setTitle, setType, metadata, t, setSubtitle]);

  
  const options = [
    {
      value: 'None',
      label: t('questionary:question14.options.None'),
    },
    {
      value: 'Allergies',
      label: t('questionary:question14.options.Allergies'),
    },
    {
      value: 'Asthma',
      label: t('questionary:question14.options.Asthma'),
    },
    {
      value: 'Bronchitis',
      label: t('questionary:question14.options.Bronchitis'),
    },
    {
      value: 'Congestive heart failure',
      label: t('questionary:question14.options.Congestive heart failure'),
    },
    {
      value: 'COPD/emphysema',
      label: t('questionary:question14.options.COPD/emphysema'),
    },
    {
      value: 'Extreme obesity',
      label: t('questionary:question14.options.Extreme obesity'),
    },
    {
      value: 'Heart disease',
      label: t('questionary:question14.options.Heart disease'),
    },
    {
      value: 'HIV, AIDS, or impaired immune system',
      label: t('questionary:question14.options.HIV, AIDS, or impaired immune system'),
    },
    {
      value: 'Other chronic lung disease',
      label: t('questionary:question14.options.Other chronic lung disease'),
    },
    {
      value: 'Pneumonia',
      label: t('questionary:question14.options.Pneumonia'),
    },
    {
      value: 'Pulmonary fibrosis',
      label: t('questionary:question14.options.Pulmonary fibrosis'),
    },
    {
      value: 'Sinusitis',
      label: t('questionary:question14.options.Sinusitis'),
    },
    {
      value: 'Tuberculosis',
      label: t('questionary:question14.options.Tuberculosis'),
    },
    {
      value: 'Hypertension',
      label: t('questionary:question14.options.Hypertension'),
    },
    {
      value: 'Hypothyroidism',
      label: t('questionary:question14.options.Hypothyroidism'),
    },
    {
      value: 'Family member has or had suffered from a respiratory disease',
      label: t('questionary:question14.options.Family member has or had suffered from a respiratory disease'),
    },
    {
      value: 'Other',
      label: t('questionary:question14.options.Other'),
    },
  ];

  return (
    <MainContainer>
      <QuestionText extraSpace first>
        {t("questionary:question14.question")}
      </QuestionText>
      <QuestionNote>{t('questionary:question14.note')}</QuestionNote>
      <Controller
        control={control}
        name="conditions"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            value={{ selected: value ? value : [] }}
            onChange={(v) => onChange(v.selected)}
            items={options}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="conditions"
        render={({ message }) => (
          <p
            style={{
              fontFamily: "Source Sans Pro",
            }}
          >
            {message}
          </p>
        )}
      />

      {/* Bottom Buttons */}
      {activeStep && (
        <Portal>
          <WizardButtons
            leftLabel={t("questionary:nextButton")}
            leftDisabled={!isValid}
            leftHandler={handleSubmit(onSubmit)}
            invert
          />
        </Portal>
      )}
    </MainContainer>
  );
};

export default memo(Step15);