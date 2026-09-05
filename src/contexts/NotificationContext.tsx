import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { NotificationContainer } from '../components/admin/Notification';

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

