/**
 * Context for managing selected child for PARENT users
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/types';
import { getStoredUser, hasRole } from '@/lib/services/auth.service';

interface SelectedChildContextType {
  selectedChild: User | null;
  setSelectedChild: (child: User | null) => void;
  isParent: boolean;
}

const SelectedChildContext = createContext<
  SelectedChildContextType | undefined
>(undefined);

export function SelectedChildProvider({ children }: { children: ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<User | null>(null);
  const [isParent, setIsParent] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    const parent = user && hasRole(user, 'PARENT');
    setIsParent(!!parent);

    // Load selected child from localStorage if exists
    if (parent) {
      const storedChild = localStorage.getItem('selectedChild');
      if (storedChild) {
        try {
          setSelectedChild(JSON.parse(storedChild));
        } catch (e) {
          // Invalid stored data, ignore
        }
      }
    }
  }, []);

  const handleSetSelectedChild = (child: User | null) => {
    setSelectedChild(child);
    if (child) {
      localStorage.setItem('selectedChild', JSON.stringify(child));
    } else {
      localStorage.removeItem('selectedChild');
    }
  };

  return (
    <SelectedChildContext.Provider
      value={{
        selectedChild,
        setSelectedChild: handleSetSelectedChild,
        isParent,
      }}
    >
      {children}
    </SelectedChildContext.Provider>
  );
}

export function useSelectedChild() {
  const context = useContext(SelectedChildContext);
  if (context === undefined) {
    throw new Error(
      'useSelectedChild must be used within a SelectedChildProvider'
    );
  }
  return context;
}
