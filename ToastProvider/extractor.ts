import { type AxiosError } from 'axios'

export function extractLogs(error?: AxiosError<any>): string | undefined {
  if (error === undefined) {
    return ''
  }
  const { config, response } = error
  if (config !== undefined && response !== undefined) {
    const method = config.method?.toUpperCase()
    const baseURL = config.baseURL
    const url = config.url
    const requestData = config.data as string | undefined
    const token = config.headers['Permissions-Token'] as string | undefined
    const status = response.status
    const responseData = response.data as string | undefined

    return `${method ?? 'XXX'} -> ${baseURL ?? ''}${
      url ?? ''
    }\n\nPermissions-Token: ${
      token ?? '--não informado--'
    }\n\n-> Payload enviado:\n"${
      JSON.stringify(requestData, undefined, 2) ?? 'undefined'
    }"\n\n<- Resposta recebida (${status}):\n"${
      JSON.stringify(responseData, undefined, 2) ?? 'undefined'
    }"`
  }
}
