import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { birthdayContent } from './birthdayContent'
import './styles.css'
import App from './App.tsx'

document.title = birthdayContent.pageTitle

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
