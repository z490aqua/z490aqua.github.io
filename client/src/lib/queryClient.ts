import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { clientStorage } from "../utils/clientStorage";

// Detect if the app is running as a static site without a backend
const isStaticSite = () => {
  return typeof window !== 'undefined' && 
         (window.location.protocol === 'file:' || 
          window.__GAME_DATA__ !== undefined ||
          process.env.NODE_ENV === 'production');
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Process API requests for both server and static modes
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // If in static site mode, use client storage instead of server
  if (isStaticSite()) {
    // Parse the endpoint from the URL
    const endpoint = url.split('/').pop();
    const userId = 1; // Default user ID for static mode
    
    // Handle different endpoints with client storage
    let result: any = null;
    if (url.includes('/game-progress')) {
      if (method === 'GET') {
        result = await clientStorage.getGameProgress(userId);
      } else {
        result = await clientStorage.saveGameProgress(userId, data as any);
      }
    } else if (url.includes('/high-scores')) {
      if (method === 'GET') {
        result = await clientStorage.getHighScores();
      } else {
        result = await clientStorage.saveHighScore(data as any);
      }
    } else if (url.includes('/users')) {
      if (method === 'GET') {
        result = await clientStorage.getUser(userId);
      } else {
        result = await clientStorage.createUser(data as any);
      }
    }
    
    // Create a mock response
    return {
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => result,
      text: async () => JSON.stringify(result || {}),
    } as Response;
  }
  
  // Normal server mode
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // If in static site mode, use client storage
    if (isStaticSite()) {
      const endpoint = String(queryKey[0]).split('/').pop();
      const userId = 1; // Default user ID for static mode
      
      // Handle different endpoints
      if (String(queryKey[0]).includes('/game-progress')) {
        return await clientStorage.getGameProgress(userId);
      } else if (String(queryKey[0]).includes('/high-scores')) {
        return await clientStorage.getHighScores();
      } else if (String(queryKey[0]).includes('/users')) {
        return await clientStorage.getUser(userId);
      }
      
      // Default empty response
      return null;
    }
    
    // Normal server mode
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// TypeScript declaration for window extensions
declare global {
  interface Window {
    // Game data for static site
    __GAME_DATA__?: {
      levels: any[];
      documents: any[];
      settings: {
        sound: boolean;
        music: boolean;
      };
      isStatic?: boolean;
      created?: string;
    };
    
    // Game engine instance
    gameEngine?: any;
    
    // Game controls interface
    gameControls?: {
      moveLeft: (active: boolean) => void;
      moveRight: (active: boolean) => void;
      jump: (active: boolean) => void;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
