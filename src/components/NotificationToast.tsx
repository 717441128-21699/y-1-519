import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const bgMap = {
  success: 'bg-green-500/20 border-green-500/50',
  error: 'bg-red-500/20 border-red-500/50',
  warning: 'bg-yellow-500/20 border-yellow-500/50',
  info: 'bg-blue-500/20 border-blue-500/50',
};

export function NotificationToast() {
  const { notifications, removeNotification } = useGameStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`
              flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md
              ${bgMap[notification.type as keyof typeof bgMap] || bgMap.info}
              shadow-lg
            `}
          >
            {iconMap[notification.type as keyof typeof iconMap] || iconMap.info}
            <p className="flex-1 text-sm text-white">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
