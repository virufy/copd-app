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
  exposure: Yup.array()
    .of(
      Yup.string().oneOf([
        "Cadmium dust and fumes",
        "Exposure to biomass smoke from cooking fires",
        "Grain and flour dust",
        "Silica dust",
        "Welding fumes",
        "Isocyanates",
        "Coal dust",
        "Other",
      ])
    )
    .min(1)
    .required(),
}).defined();

type Step8Type = Yup.InferType<typeof schema>;

const Step9 = ({
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

  const onSubmit = async (values: Step8Type) => {
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
      value: "Cadmium dust and fumes",
      label: t("questionary:question8.options.Cadmium dust and fumes"),
    },
    {
      value: "Exposure to biomass smoke from cooking fires",
      label: t(
        "questionary:question8.options.Exposure to biomass smoke from cooking fires"
      ),
    },
    {
      value: "Grain and flour dust",
      label: t("questionary:question8.options.Grain and flour dust"),
    },
    {
      value: "Silica dust",
      label: t("questionary:question8.options.Silica dust"),
    },
    {
      value: "Welding fumes",
      label: t("questionary:question8.options.Welding fumes"),
    },
    {
      value: "Isocyanates",
      label: t("questionary:question8.options.Isocyanates"),
    },
    {
      value: "Coal dust",
      label: t("questionary:question8.options.Coal dust"),
    },
    {
      value: "Other",
      label: t("questionary:question8.options.Other"),
    },
  ];

  return (
    <MainContainer>
      <StepCounter>
        {metadata?.current} {t("questionary:stepOf")} {metadata?.total}
      </StepCounter>
      <StepTracker progress={metadata?.current} total={metadata?.total} />

      <QuestionText extraSpace first>
        {t("questionary:question8.question")}
      </QuestionText>
      <QuestionNote>{t("questionary:question8.note")}</QuestionNote>
      <Controller
        control={control}
        name="exposure"
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
        name="exposure"
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

export default memo(Step9);
