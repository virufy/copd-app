import React, { memo, useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
  StepCounter,
  StepTracker,
} from "../style";

const schema = Yup.object({
  isSmoking: Yup.string()
    .oneOf(["Yes, current smoker", "Yes, in the past", "No, I have never smoked"])
    .required("Required Field"),
}).defined();

type Step4Type = Yup.InferType<typeof schema>;

const Step5 = ({
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

  const baseUrl = "/submit-steps";

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

  //get URL
  const location = useLocation();
  const currentURL = location.pathname + location.search;

  const onSubmit = async (values: Step4Type) => {
    if (values) {
      action(values);
      if (nextStep) {
        //skip smoking related questions when never smoked
        const nextAndPrevStep: any[] =
          values?.isSmoking === "No, I have never smoked"
            ? [`${baseUrl}/questionary/step10`, currentURL]
            : [`${baseUrl}/questionary/step5`, null]; //an array of [nextStep, previousStep]
        setActiveStep(false);
        history.push(nextAndPrevStep[0], { previousStep: nextAndPrevStep[1] });
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
      value: "Yes, current smoker",
      label: t("questionary:question4.options.Yes, current smoker"),
    },
    {
      value: "Yes, in the past",
      label: t("questionary:question4.options.Yes, in the past"),
    },
    {
      value: "No, I have never smoked",
      label: t("questionary:question4.options.No, I have never smoked"),
    },
  ];

  return (
    <MainContainer>
      <StepCounter>
        {metadata?.current} {t("questionary:stepOf")} {metadata?.total}
      </StepCounter>
      <StepTracker progress={metadata?.current} total={metadata?.total} />

      <QuestionText extraSpace first>
        {t("questionary:question4.question")}
      </QuestionText>
      <Controller
        control={control}
        name="isSmoking"
        defaultValue={undefined}
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={(v) => onChange(v.selected[0])}
            items={options}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="isSmoking"
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

export default memo(Step5);
