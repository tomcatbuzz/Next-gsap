import { TransitionProvider } from '../context/TransitionContext';
import Header from '../components/Header';
import TransitionComponent from '../components/Transition';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

const Layout = ({ children }) => {
  const [routingPageOffset, setRoutingPageOffset] = useState(0)
  const router = useRouter()
  useEffect(() => {
    const pageChange = () => {
      setRoutingPageOffset(window.scrollY)
    }
    // const pageEnd = () => {
    //   setRoutingPageOffset(null)
    // }
    router.events.on('routeChangeStart', pageChange)
    // router.events.on('routeChangeComplete', pageEnd)
    console.log(router.events, "router")
  }, [router.events])
  return (
    <StyleSheetManager shouldForwardProp={isPropValid} disableVendorPrefixes={false}>
    <div>
      <Header />
      <TransitionProvider>
        <div className="content-container">
          <TransitionComponent route={router.asPath} routingPageOffset={routingPageOffset}>{children}</TransitionComponent>
          
        </div>
      </TransitionProvider>
    </div>
    </StyleSheetManager>
  );
};

export default Layout;