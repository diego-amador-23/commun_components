import { useSelector } from 'react-redux'
import { createApiServiceWithToken, sessionSelects } from '../'

interface Response {
  base64Image: string
  imageFormat: string
}

type GetModelImage = (identifier: string) => Promise<string>

export function useGetModelImage(): GetModelImage {
  const token = useSelector(sessionSelects.token)

  return async (identifier) => {
    if (token === undefined) {
      return '/silhueta-maquina.png'
    }

    const service = createApiServiceWithToken(token)

    try {
      const response = await service.get<Response>(
        `/image/${identifier.replaceAll('/', '')}`
      )
      const { base64Image, imageFormat } = response.data

      return `data:image/${imageFormat};base64, ${base64Image}`
    } catch (error) {
      return '/silhueta-maquina.png'
    }
  }
}
