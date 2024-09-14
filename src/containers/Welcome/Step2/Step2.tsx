import React, {
  useEffect, useCallback, useState, memo,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import usePortal from 'react-useportal';
import { isMobile } from 'react-device-detect';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Components
import WizardButtons from 'components/WizardButtons';
import { BlackText } from 'components/Texts';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import {
  ContainerShapeDown,
  InnerContainerShapeDown,
  WelcomeContent,
  WelcomeStyledFormAlternative,
  AboutUsSVG,
} from '../style';

const Step3 = (p: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const {
    setType, setDoGoBack, setLogoSize, setSubtitle,
  } = useHeaderContext();
  const { t } = useTranslation();
  const history = useHistory();

  // States
  const [activeStep, setActiveStep] = useState(true);

  // Callbacks
  const handleNext = useCallback(() => {
    if (p.nextStep) {
      history.push(p.nextStep);
    }
  }, [history, p.nextStep]);

  const doBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effects
  useEffect(() => {
    scrollToTop();
    setDoGoBack(() => doBack);
    setLogoSize('regular');
    setSubtitle(t('helpVirufy:title'));
    setType('secondary');
  }, [doBack, setDoGoBack, setLogoSize, setType, setSubtitle, t]);

  return (
    <WelcomeStyledFormAlternative>
      <ContainerShapeDown isMobile={isMobile}>
        <InnerContainerShapeDown>
          <AboutUsSVG />
        </InnerContainerShapeDown>
      </ContainerShapeDown>
      <WelcomeContent maxWidth={470} mt={0}>
        <BlackText>
          <Trans i18nKey="helpVirufy:aboutParagraph">
            <p>
              <strong><u>Virufy</u></strong> is a robust <strong>501(c)(3) nonprofit research organization</strong>
              developing AI algorithms to identify various respiratory diseases like COVID-19, flu,
              and TB through analysis of smartphone-recorded forced coughing sounds.
              Our team comprises <strong>50 partner organizations</strong>
              including Amazon Web Services and One Young World, and 250 volunteers
              including students and faculty from Stanford, Harvard, and MIT.
            </p>
            <p>
              We are building a mapping system to track and predict the spread of respiratory diseases.
              Please join us by sharing <strong>your cough sounds</strong> to help us build a dashboard
              to support the health of your local community.
            </p>
          </Trans>
        </BlackText>
      </WelcomeContent>

      {activeStep && (
        <Portal>
          <WizardButtons
            invert
            leftLabel={t('helpVirufy:nextButton')}
            leftHandler={handleNext}
          />
        </Portal>
      )}

    </WelcomeStyledFormAlternative>
  );
};

export default memo(Step3);
