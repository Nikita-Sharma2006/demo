import { useCallback, useState } from 'react'

export function useApi(apiHandler) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiHandler(...args)
        setData(response)
        return response
      } catch (requestError) {
        setError(requestError)
        throw requestError
      } finally {
        setIsLoading(false)
      }
    },
    [apiHandler],
  )

  return { data, error, isLoading, execute }
}
