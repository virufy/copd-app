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
  StepCounter,
  StepTracker,
} from "../style";

const schema = Yup.object({
  sex: Yup.string().oneOf(["Female", "Male", "Decline to answer"]).required(),
}).defined();

type Step3Type = Yup.InferType<typeof schema>;

const Step4 = ({
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

  const onSubmit = async (values: Step3Type) => {
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
      value: "Female",
      label: t("questionary:question3.options.Female"),
    },
    {
      value: "Male",
      label: t("questionary:question3.options.Male"),
    },
    {
      value: "Decline to answer",
      label: t("questionary:question3.options.Decline to answer"),
    },
  ];

  return (
    <MainContainer>
      <StepCounter>
        {metadata?.current} {t("questionary:stepOf")} {metadata?.total}
      </StepCounter>
      <StepTracker progress={metadata?.current} total={metadata?.total} />

      <QuestionText extraSpace first>
        {t("questionary:question3.question")}
      </QuestionText>
      <QuestionNote>{t("questionary:question3.note")}</QuestionNote>
      <Controller
        control={control}
        name="sex"
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
        name="sex"
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

export default memo(Step4);
