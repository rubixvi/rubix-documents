/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  use,
  useEffect,
  useState,
} from 'react'

import { useBrowserNativeTransitions } from './browser-native'

const ViewTransitionsContext = createContext<Dispatch<SetStateAction<(() => void) | null>>>(
  () => () => {}
)

export function useSetFinishViewTransition() {
  return use(ViewTransitionsContext)
}

export function ViewTransitions({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [finishViewTransition, setFinishViewTransition] = useState<(() => void) | null>(null)

  useEffect(() => {
    if (finishViewTransition) {
      finishViewTransition()
      setFinishViewTransition(null)
    }
  }, [finishViewTransition])

  useBrowserNativeTransitions()

  return (
    <ViewTransitionsContext.Provider value={setFinishViewTransition}>
      {children}
    </ViewTransitionsContext.Provider>
  )
}
