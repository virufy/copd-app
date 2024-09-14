import React, {
  useEffect, useCallback, memo, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import usePortal from 'react-useportal';
import { isMobile } from 'react-device-detect';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Components
import WizardButtons from 'components/WizardButtons';
import Link from 'components/Link';
import Checkbox from 'components/Checkbox';
import { BlackText } from 'components/Texts';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { Country } from 'helper/consentPathHelper';
import { scrollToTop } from 'helper/scrollHelper';
import { getCountry } from 'helper/stepsDefinitions';

// Data
import { consentPdf } from 'data/consentPdf';

// Styles
import LinkPurple from 'components/LinkPurple';
import {
  ContainerShapeDown,
  InnerContainerShapeDown,
  WelcomeContent,
  WelcomeStyledFormAlternative,
  CheckboxTitle,
} from '../style';

const schema = Yup.object().shape({
  agreedConsentTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedPolicyTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedCovidDetection: Yup.boolean().required().default(false).oneOf([true]),
  agreedCovidCollection: Yup.boolean().required().default(false).oneOf([true]),
});

type Step3Type = Yup.InferType<typeof schema>;

const Step4 = (p: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const { setType, setDoGoBack, setSubtitle } = useHeaderContext();
  const { state, action } = useStateMachine(updateAction(p.storeKey));
  const history = useHistory();
  const { t } = useTranslation();
  const store = state?.[p.storeKey];
  const currentCountry: Country = getCountry();
  const {
    control, handleSubmit, formState,
  } = useForm({
    defaultValues: store,
    resolver: yupResolver(schema),
    context: {
      country: currentCountry,
    },
    mode: 'onChange',
  });
  const { errors, isValid } = formState;
  // const { isLoadingFile, file: consentFormContent } = useEmbeddedFile(
  //   buildConsentFilePath(currentCountry, state.welcome.language),
  // );

  // States
  const [activeStep, setActiveStep] = useState(true);

  // Callbacks
  const onSubmit = async (values: Step3Type) => {
    if (values) {
      action(values);
      if (p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

  const doBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effcts
  useEffect(() => {
    scrollToTop();
    setDoGoBack(() => doBack);
    setType('secondary');
    setSubtitle(t('consent:title'));
  }, [doBack, setDoGoBack, setType, setSubtitle, t]);

  return (
    <WelcomeStyledFormAlternative>
      <ContainerShapeDown isMobile={isMobile}>
        <InnerContainerShapeDown>
          <BlackText>
            <Trans i18nKey="consent:paragraph1">
              Virufy cares about your privacy and is advised by licensed data privacy experts.
              The information and recordings you provide will only be used for the purposes described in our
              <Link to="https://virufy.org/privacy_policy" target="_blank">Virufy Privacy Policy</Link> and <Link to={consentPdf[currentCountry]} target="_blank">consent form</Link>.
              Please read the consent Form:
            </Trans>
          </BlackText>
        </InnerContainerShapeDown>
      </ContainerShapeDown>
      <WelcomeContent>

        <BlackText>
          <Trans i18nKey="consent:paragraph3">
            By checking the below boxes, you are granting your explicit, freely given,
            and informed consent to Virufy to collect, process, and share your information
            for the purposes indicated above and as provided in greater detail in our
            Privacy Policy. You can print a copy of this Consent Form for your personal records by
            accessing <Link to={consentPdf[currentCountry]} target="_blank">Consent Form</Link>
          </Trans>
        </BlackText>

        <CheckboxTitle>
          {t('consent:pleaseConfirm', 'Please confirm the following:')}
        </CheckboxTitle>

        <Controller
          control={control}
          name="agreedConsentTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="Step2-ConsentTerms"
              label={(
                <Trans i18nKey="consent:certify">
                  I certify that I am at least 18 years old and agree to the terms of this Consent Form.
                </Trans>
              )}
              name="agreedConsentTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedPolicyTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="Step2-PolicyTerms"
              label={(
                <Trans i18nKey="consent:agree">
                  I agree to the terms of the <LinkPurple to="https://virufy.org/privacy_policy" target="_blank">Virufy Privacy Policy</LinkPurple>.
                </Trans>
              )}
              name="agreedPolicyTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedCovidDetection"
          defaultValue={false}
          render={({ onChange, value, name }) => (
            <Checkbox
              id="Step2-DetectionCovid"
              label={(
                <Trans i18nKey="consent:detection">
                  I hereby acknowledge and agree that processing shall be done for the purposes indicated above and,
                  in particular but without limitation, for training artificial intelligence algorithms to analyze
                  cough audio recordings to better determine spread of respiratory disease.
                </Trans>
                )}
              name={name}
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedCovidCollection"
          defaultValue={false}
          render={({ onChange, value, name }) => (
            <Checkbox
              id="Step2-CollectionCovid"
              label={(
                <Trans i18nKey="consent:collection">
                  I hereby expressly consent to the collection and processing of my personal information,
                  biometric information, and health information.
                </Trans>
                )}
              name={name}
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <p><ErrorMessage errors={errors} name="name" /></p>
        {activeStep && (
          <Portal>
            <WizardButtons
              invert
              leftLabel={t('consent:nextButton')}
              leftHandler={handleSubmit(onSubmit)}
              leftDisabled={!isValid}
            />
          </Portal>
        )}
      </WelcomeContent>
    </WelcomeStyledFormAlternative>
  );
};

export default memo(Step4);
