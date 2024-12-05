import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { isAuthenticated } from '@/lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData';
import { favouritesAtom, searchHistoryAtom } from '@/store';

const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  const updateAtoms = async () => {
    try {
      console.log("Updating atoms...");
      setFavouritesList(await getFavourites());
      setSearchHistory(await getHistory());
    } catch (error) {
      console.error("Error updating atoms:", error.message);
    }
  };

  useEffect(() => {
    // Initial auth check and atom update
    authCheck(router.pathname);

    if (isAuthenticated()) {
      updateAtoms();
    }

    const handleRouteChange = (url) => authCheck(url);
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const authCheck = (url) => {
    const path = url.split('?')[0];
    const authenticated = isAuthenticated();

    console.log("Auth Check Path:", path);
    console.log("Is Authenticated:", authenticated);

    if (!authenticated && !PUBLIC_PATHS.includes(path)) {
      console.warn("Unauthorized access. Redirecting to /login");
      setAuthorized(false);
      if (router.pathname !== '/login') router.push('/login');
    } else {
      console.log("Access authorized for:", path);
      setAuthorized(true);
    }
  };

  return <>{authorized && children}</>;
}

