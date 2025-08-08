import { Toaster } from '@/components/ui/sonner'
import { ComponentTest } from '@/pages/component-test'
import './App.css'

function App() {
  return (
    <>
      <ComponentTest />
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
