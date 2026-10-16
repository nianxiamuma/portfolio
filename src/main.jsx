import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerSW } from './lib/registerSW'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// PWA：仅生产 + secure context 下注册；dev 与本地 http 与现在行为完全一致
registerSW()
