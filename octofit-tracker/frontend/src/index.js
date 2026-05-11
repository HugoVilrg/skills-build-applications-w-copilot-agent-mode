import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const codespaceName =
  import.meta.env.REACT_APP_CODESPACE_NAME ||
  import.meta.env.VITE_REACT_APP_CODESPACE_NAME ||
  import.meta.env.VITE_CODESPACE_NAME ||
  import.meta.env.CODESPACE_NAME ||
  window.REACT_APP_CODESPACE_NAME

console.log('React app launching with codespace name:', codespaceName)

import './index.jsx'
