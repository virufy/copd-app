import React from 'react';
import { useTranslation } from 'react-i18next';

// Modals
import PWAInstallModal from 'modals/PWAInstallModal';

// Hooks
import usePWAHelpers from 'hooks/usePWAHelpers';

// Styles
import { FooterContainer, DownloadSVG } from './style';

const FooterInstallAsApp = () => {
  const { t } = useTranslation();
  const installPwaButtonId = 'virufy-install-button';
  const pwaModalRef = React.useRef<PWAInstallModal>(null);
  const { handlePrompt, isInstalled, setIsInstalled } = usePWAHelpers(installPwaButtonId);
  const handleClickInstall = React.useCallback(() => {
    if (handlePrompt) {
      const promise = handlePrompt();
      if (promise) {
        promise.then((userChoiceResult: any) => {
          if (userChoiceResult && userChoiceResult.outcome === 'accepted') {
            setIsInstalled(true);
          }
        }).catch(() => pwaModalRef.current?.show());
      } else {
        pwaModalRef.current?.show();
      }
    }
  }, [handlePrompt, setIsInstalled]);

  return (
    <>
      { !isInstalled
          && (
            <FooterContainer id={installPwaButtonId} onClick={handleClickInstall}>
              <DownloadSVG />
              { t('helpVirufy:installApp')}
            </FooterContainer>
          )}
      <PWAInstallModal ref={pwaModalRef} />
    </>
  );
};

export default React.memo(FooterInstallAsApp);
