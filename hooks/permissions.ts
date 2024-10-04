import { useSelector } from 'react-redux'
import { sessionSelects } from '../reducers/session'

interface UsePermissionsReturn {
  checkPermission: (key: string) => boolean
}

export function usePermissions(): UsePermissionsReturn {
  const permissions = useSelector(sessionSelects.permissions)

  const checkPermission = (key: string): boolean => {
    return Boolean(permissions.includes('all')) || permissions.includes(key)
  }

  return {
    checkPermission
  }
}
