import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { intlActions, intlSelections, type Dictionary } from '../reducers/intl'
import { useToastAxiosError } from './toastAxiosError'

interface UseIntlReturns {
  loaded: boolean
  errors?: Array<{ path: string; message: string }>
}

export function useIntl(): UseIntlReturns {
  const dispatch = useDispatch()
  const toast = useToastAxiosError()

  const dictionaryName = useSelector(intlSelections.dictionaryName)
  const dictionary = useSelector(intlSelections.dictionary)

  const [loading, setLoading] = useState(true)

  const getDictionary = async (name: string): Promise<void> => {
    setLoading(true)
    try {
      if (
        (import.meta.env.VITE_VERSION as string).includes('dev-') &&
        sessionStorage.getItem('useIH') !== 'true'
      ) {
        const response = await axios.get(`/dicionarios/${name}.json`, {
          withCredentials:
            process.env.NODE_ENV === 'development' ? undefined : true
        })
        dispatch(intlActions.setDictionary(response.data as Dictionary))
      } else {
        const module = import.meta.env.VITE_APPLICATION_IDENTIFIER as string
        const response = await axios.get(
          `${
            import.meta.env.VITE_DICTIONARY_SERVICE as string
          }/dictionaries/${module}/${name}`,
          {
            withCredentials:
              process.env.NODE_ENV === 'development' ? undefined : true
          }
        )
        dispatch(intlActions.setDictionary(response.data as Dictionary))
      }
    } catch (error) {
      if (import.meta.env.VITE_DEFAULT_LANGUAGE === name) {
        toast(error, `Falha ao tentar carregar o dicionário ${name}.`)
      }
      dispatch(
        intlActions.setDictionaryName(import.meta.env.VITE_DEFAULT_LANGUAGE)
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    void getDictionary(dictionaryName)
  }, [dictionaryName])

  return {
    loaded: !loading && dictionary !== undefined,
    errors: undefined
  }
}
