import React from 'react';
import loadable from '@loadable/component';
import {
  Switch, Route, Redirect, useLocation,
} from 'react-router-dom';

// Components
import FullWidth from 'components/FullWidthDiv';
import Header, { HeaderContextProvider } from 'components/Header';
import FooterReportProblems from 'components/FooterReportProblems';
import FooterInstallAsApp from 'components/FooterInstallAsApp';

// hooks
import { useInitializeGoogleAnalytics } from 'hooks/useInitializeGoogleAnalytics';

// Styles
import { AppContainer } from './style';

const AsyncLoad = loadable(({ container }: { container: string }) => import(`containers/${container}`), {
  fallback: <div>Cargando ...</div>,
});

declare global {
  interface Window {
    sourceCampaign?: string | null;
  }
}

const App = () => {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(search);
    window.sourceCampaign = params.get('utm_campaign');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Google Analytics
  useInitializeGoogleAnalytics();

  return (
    <AppContainer>
      <HeaderContextProvider>
        <Header />
        <FullWidth style={{ flex: 1 }}>
          <Switch>
            <Route path="/welcome">
              <AsyncLoad key="Welcome" container="Welcome" />
            </Route>
            <Route path="/submit-steps">
              <AsyncLoad key="SubmitSteps" container="SubmitSteps" />
            </Route>
            <Redirect exact from="/" to="/welcome" />
            <Route>
              <div>404 Page</div>
            </Route>
          </Switch>
        </FullWidth>
        {(!pathname.endsWith('/welcome/')) && (pathname.endsWith('/welcome/splash') ? <FooterInstallAsApp /> : <FooterReportProblems />) }
      </HeaderContextProvider>
    </AppContainer>
  );
};

export default App;
