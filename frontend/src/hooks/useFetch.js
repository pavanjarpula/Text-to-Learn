// src/hooks/useFetch.js
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    let isMounted = true; // prevent setting state on unmounted component

    const fetchData = async () => {
      setLoading(true);
      try {
        let headers = { ...(options.headers || {}) };

        // If user is logged in, add JWT token
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
          };
        }

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();

        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, isAuthenticated, getAccessTokenSilently]);

  return { data, loading, error };
};
