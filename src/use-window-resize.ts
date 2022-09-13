import { useEffect } from "react"

const useWindowResize = (action: () => void) => {
  const addGlobalListeners = () => {
    window.addEventListener("resize", action, false)
  }

  const removeGlobalListeners = () => {
    window.removeEventListener("resize", action, false)
  }

  useEffect(() => {
    action()
    addGlobalListeners()

    return function cleanup() {
      removeGlobalListeners()
    }
  }, [])
}

export default useWindowResize
