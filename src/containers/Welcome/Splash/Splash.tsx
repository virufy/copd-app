import React, { memo, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import usePortal from 'react-useportal';

// Assets
import HeaderSplash from 'assets/images/baseLogoSplash.png';

// Components
import CreatedBy from 'components/CreatedBy';
import WizardButtons from 'components/WizardButtons';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import { BlackText } from 'components/Texts';
import {
  WelcomeContent, WelcomeStyledForm,
  HeaderImageContainer,
  HeaderImage,
  LogoWhiteBG,
  CollectionStudySVG,
  InstructionContainer,
  WelcomeBullets,
  BulletIndicator,
} from '../style';

declare interface OptionsProps {
  label: string;
  value: string;
}

const Splash = (p: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const { t } = useTranslation();
  const {
    setType, setDoGoBack, setLogoSize,
  } = useHeaderContext();
  const history = useHistory();

  // Callbacks
  const handleNext = useCallback(() => {
    if (p.nextStep) {
      history.push(p.nextStep);
    }
  }, [history, p.nextStep]);

  useEffect(() => {
    scrollToTop();
    // Hide back arrow in header if neccesary
    setDoGoBack(null);
    setLogoSize('regular');
    setType('null');
  }, [setDoGoBack, setLogoSize, setType]);

  return (
    <>
      <WelcomeStyledForm>
        <HeaderImageContainer>
          <HeaderImage
            src={HeaderSplash}
          />
          <LogoWhiteBG />
        </HeaderImageContainer>

        <WelcomeContent mt={62}>
          <CollectionStudySVG />
        </WelcomeContent>

        <WelcomeContent maxWidth={470} mt={104}>
          <BlackText>
            <Trans i18nKey="study:intro">
              Welcome to our study! This should only take about 5 minutes to complete. Before we begin,
              let’s discuss what we will cover:
            </Trans>
          </BlackText>

          <InstructionContainer>
            <WelcomeBullets>
              <BulletIndicator>1</BulletIndicator>
            </WelcomeBullets>
            <BlackText>
              <Trans i18nKey="study:bulletsIntro">
                <strong>Intro:</strong> About us, Terms, Safety Reminders
              </Trans>
            </BlackText>
          </InstructionContainer>
          <InstructionContainer>
            <WelcomeBullets>
              <BulletIndicator>2</BulletIndicator>
            </WelcomeBullets>
            <BlackText>
              <Trans i18nKey="study:bulletCough">
                <strong>Cough Into Phone</strong>
              </Trans>
            </BlackText>
          </InstructionContainer>
          <InstructionContainer>
            <WelcomeBullets>
              <BulletIndicator>3</BulletIndicator>
            </WelcomeBullets>
            <BlackText>
              <Trans i18nKey="study:bulletQuestions">
                <strong>Quick Health Questionnaire</strong>
              </Trans>
            </BlackText>
          </InstructionContainer>

          <Portal>
            <WizardButtons
              invert
              leftLabel={t('study:next', "Let's Start")}
              leftHandler={handleNext}
            />
            <CreatedBy inline />
          </Portal>
        </WelcomeContent>
      </WelcomeStyledForm>
    </>
  );
};

export default memo(Splash);
