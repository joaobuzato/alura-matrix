import appConfig from '../config.json'
function GlobalStyle() {
    return (
        <style global jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          list-style: none;
        }
        body {
          font-family: 'Open Sans', sans-serif;
        }
        /* App fit Height */ 
        html, body, #__next {
          min-height: 100vh;
          display: flex;
          flex: 1;
        }
        #__next {
          flex: 1;
        }
        #__next > * {
          flex: 1;
        }
        ul::-webkit-scrollbar {
          width: 12px;               /* width of the entire scrollbar */
        }
        
        ul::-webkit-scrollbar-track {
          display: none
        }
        
        ul::-webkit-scrollbar-thumb {
          background-color:  ${appConfig.theme.colors.neutrals['900']};    /* color of the scroll thumb */
          border-radius: 20px;       /* roundness of the scroll thumb */
          border: 3px solid  ${appConfig.theme.colors.neutrals['700']};  /* creates padding around scroll thumb */
        }
        /* ./App fit Height */ 
      `}</style>
    );
}

export default function MyApp( {Component, pageProps}){
    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
        </>
    )
}