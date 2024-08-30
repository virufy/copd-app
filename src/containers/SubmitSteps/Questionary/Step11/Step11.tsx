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
    COPDstage: Yup.string().oneOf(['GOLD I - mild: FEV1 ≥80% predicted', 'GOLD II - moderate: 50% ≤ FEV1 <80%', 'GOLD III - severe: 30% ≤ FEV1 <50% predicted', 'GOLD IV - very severe: FEV1 <30% predicted']).required(),
    FEV1: Yup.string().required('Required Field'),
    FVC: Yup.string().required('Required Field'),
    ratio: Yup.string().required('Required Field'),
}).defined();

type Step11Type = Yup.InferType<typeof schema>;

const Step12 = ({
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

  const onSubmit = async (values: Step11Type) => {
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
      value: 'GOLD I - mild: FEV1 ≥80% predicted',
      label: t('questionary:question11.options.FEV1 ≥80% predicted')
    },
    {
      value: 'GOLD II - moderate: 50% ≤ FEV1 <80%',
      label: t('questionary:question11.options.50% ≤ FEV1 <80%'),
    },
    {
      value: 'GOLD III - severe: 30% ≤ FEV1 <50% predicted',
      label: t('questionary:question11.options.30% ≤ FEV1 <50% predicted'),
    },
    {
      value: 'GOLD IV - very severe: FEV1 <30% predicted',
      label: t('questionary:question11.options.FEV1 <30% predicted'),
    },
  ];

  return (
    <MainContainer>
      <QuestionText extraSpace first>
        {t("questionary:question11.questionA")}
      </QuestionText>
      <Controller
        control={control}
        name="COPDstage"
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
        name="COPDstage"
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


      <QuestionText>{t('questionary:question11.questionB')}</QuestionText>
      <Controller
        control={control}
        name="FEV1"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <>
            <QuestionInput
              name={name}
              value={value}
              onChange={onChange}
              type="text"
              placeholder={t('questionary:question11.questionB')}
              autoComplete="Off"
            />
          </>
        )}
      />
      <ErrorMessage
        errors={errors}
        name="FEV1"
        render={({ message }) => (
          <p
            style={{
              fontFamily: 'Source Sans Pro',
            }}
          >{message}
          </p>
        )}
      />

      <QuestionText>{t('questionary:question11.questionC')}</QuestionText>
      <Controller
        control={control}
        name="FVC"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <>
            <QuestionInput
              name={name}
              value={value}
              onChange={onChange}
              type="text"
              placeholder={t('questionary:question11.placeholderC')}
              autoComplete="Off"
            />
          </>
        )}
      />
      <ErrorMessage
        errors={errors}
        name="FVC"
        render={({ message }) => (
          <p
            style={{
              fontFamily: 'Source Sans Pro',
            }}
          >{message}
          </p>
        )}
      />

      <QuestionText>{t('questionary:question11.questionD')}</QuestionText>
      <Controller
        control={control}
        name="ratio"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <>
            <QuestionInput
              name={name}
              value={value}
              onChange={onChange}
              type="text"
              placeholder={t('questionary:question11.placeholderD')}
              autoComplete="Off"
            />
          </>
        )}
      />
      <ErrorMessage
        errors={errors}
        name="ratio"
        render={({ message }) => (
          <p
            style={{
              fontFamily: 'Source Sans Pro',
            }}
          >{message}
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

export default memo(Step12);