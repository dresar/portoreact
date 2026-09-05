import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Notification = ({ message, type, onClose, duration = 3000 }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium min-w-[200px] max-w-[300px]`}
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1">{message}</span>
    </motion.div>
  );
};

interface NotificationContainerProps {
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  onRemove: (id: string) => void;
}

export const NotificationContainer = ({ notifications, onRemove }: NotificationContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => onRemove(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

