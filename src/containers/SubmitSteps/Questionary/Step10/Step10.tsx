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
    symptoms: Yup.array().of(Yup.string().oneOf(['A persistent chest cough with phlegm that does not go away', 'Frequent chest infections', 'Wheezing', 'Weight loss', 'Tiredness', 'Swollen ankles from a build-up of fluid (oedema)', 'Chest pain', 'Coughing up blood', 'Other'])).min(1).required()
}).defined();

type Step10Type = Yup.InferType<typeof schema>;

const Step11 = ({
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

  const onSubmit = async (values: Step10Type) => {
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
      value: 'A persistent chest cough with phlegm that does not go away',
      label: t('questionary:question10.options.A persistent chest cough with phlegm that does not go away'),
    },
    {
      value: 'Frequent chest infections',
      label: t('questionary:question10.options.Frequent chest infections'),
    },
    {
      value: 'Wheezing',
      label: t('questionary:question10.options.Wheezing'),
    },
    {
      value: 'Weight loss',
      label: t('questionary:question10.options.Weight loss'),
    },
    {
      value: 'Tiredness',
      label: t('questionary:question10.options.Tiredness'),
    },
    {
      value: 'Swollen ankles without injury',
      label: t('questionary:question10.options.Swollen ankles without injury'),
    },
    {
      value: 'Chest pain',
      label: t('questionary:question10.options.Chest pain'),
    },
    {
      value: 'Coughing up blood',
      label: t('questionary:question10.options.Coughing up blood'),
    },
    {
      value: 'Other',
      label: t('questionary:question10.options.Other'),
    },
  ];

  return (
    <MainContainer>
      <QuestionText extraSpace first>
        {t("questionary:question10.question")}
      </QuestionText>
      <QuestionNote>{t('questionary:question10.note')}</QuestionNote>
      <Controller
        control={control}
        name="symptoms"
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
        name="symptoms"
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

export default memo(Step11);