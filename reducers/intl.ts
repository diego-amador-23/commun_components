import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Dictionary = Record<string, any> // Tipo genérico para os dicionários

interface InitialState {
  dictionaryName: string
  dictionary?: Dictionary
}

const DICTIONARY_URL =
  import.meta.env.VITE_DICTIONARY_URL || 'http://127.0.0.1:4000'

let dictionaryName = localStorage.getItem('language')

if (!dictionaryName) {
  const browserLanguage = window.navigator.language || 'en-US'
  console.log('Idioma do navegador detectado:', browserLanguage)

  // Normalizar para o formato esperado
  if (browserLanguage.toLowerCase().startsWith('pt')) {
    dictionaryName = 'pt-BR'
  } else if (browserLanguage.toLowerCase().startsWith('en')) {
    dictionaryName = 'en-US'
  } else {
    dictionaryName = browserLanguage // Usa o valor retornado pelo navegador
  }

  localStorage.setItem('language', dictionaryName)
}

console.log('Nome do dicionário selecionado:', dictionaryName)

const initialState: InitialState = {
  dictionaryName: dictionaryName, // Fallback para 'pt-BR' se undefined
  dictionary: undefined
}

// Função para carregar o dicionário dinamicamente com base no nome do idioma
const loadDictionary = async (name: string): Promise<Dictionary> => {
  try {
    const response = await fetch(`${DICTIONARY_URL}/dicionarios/${name}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load dictionary ${name}`)
    }
    const data = await response.json()
    console.log(`Dicionário ${name} carregado:`, data)
    return data
  } catch (error) {
    console.error(`Error loading dictionary ${name}:`, error)
    return {}
  }
}

const intlSlice = createSlice({
  name: 'intl',
  initialState,
  reducers: {
    setDictionary: (state, action: PayloadAction<Dictionary>) => {
      state.dictionary = action.payload
    },
    setDictionaryName: (state, action: PayloadAction<string>) => {
      console.log('Nome do dicionário definido:', action.payload)
      state.dictionaryName = action.payload
      localStorage.setItem('language', action.payload)
    },
    loadDictionary: (state, action: PayloadAction<string>) => {
      state.dictionaryName = action.payload
      localStorage.setItem('language', action.payload)
    }
  }
})

export const intlReducer = intlSlice.reducer
export const intlActions = intlSlice.actions
export const intlSelections = {
  dictionaryName: (state: any) => state.intl.dictionaryName,
  dictionary: (state: any) => state.intl.dictionary as Dictionary
}

// Thunk para carregar o dicionário dinamicamente
export const fetchDictionary = (language: string) => async (dispatch: any) => {
  const dictionary = await loadDictionary(language)
  console.log('Dicionário carregado:', dictionary) // Adiciona um log aqui
  dispatch(intlActions.setDictionary(dictionary))
}
