import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { sessionActions, type SessionData } from '../reducers/session';

export function useAuthentication(): { loaded: boolean } {
  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);

  // Simule dados fictícios aqui
  const fakeUserId = '3bba4053-b3f0-4604-bd0d-c5d402b6d4a5';
  const fakeUserName = 'dlsilva@romi.com';
  const fakePermissions = ['read', 'write', 'execute']; // Permissões fictícias
  const fakeToken = 'fake-token-123';

  const authenticate = useCallback(async (): Promise<void> => {
    let sessionData: SessionData = {
      userid: fakeUserId,
      userName: fakeUserName,
      permissions: fakePermissions,
      token: fakeToken,
    };

    // Ignore chamadas à API e use dados simulados
    dispatch(sessionActions.createSession(sessionData));
    setLoaded(true);
  }, [dispatch]);

  useEffect(() => {
    void authenticate();
  }, [authenticate]);

  return { loaded };
}
