import React, { createContext, useContext, useMemo, useState } from 'react';
import { mockIssues } from '@/src/mocks/mockIssues';

const IssuesContext = createContext(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function IssuesProvider({ children }) {
  const [issues, setIssues] = useState(mockIssues);

  const value = useMemo(() => {
    return {
      issues,
      addIssue: (draft) => {
        const newIssue = {
          id: makeId(),
          createdAt: Date.now(),
          status: 'Pending',
          ...draft,
        };
        setIssues((prev) => [newIssue, ...prev]);
      },
      updateStatus: (id, status) => {
        setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      },
      getIssueById: (id) => issues.find((i) => i.id === id),
    };
  }, [issues]);

  return <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>;
}

export function useIssues() {
  const ctx = useContext(IssuesContext);
  if (!ctx) throw new Error('useIssues must be used within IssuesProvider');
  return ctx;
}

