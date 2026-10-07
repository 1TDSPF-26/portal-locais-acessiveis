import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

if (import.meta.env.DEV) {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/*ele faz com que o react-router funcione para navegar entre as paginas do site*/}
      <App />
    </BrowserRouter>
  </StrictMode>,
)