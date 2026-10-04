import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { 
  Bell, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  Package, 
  FileText, 
  Sparkles,
  Check
} from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-sand-300 dark:border-forest-700 border-t-forest-900 dark:border-t-mint-400 animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-sand-500 dark:text-sand-400 uppercase tracking-widest">
          Retrieving Patient Alerts…
        </p>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 py-6 sm:py-8 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sand-200 dark:border-forest-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-mint-400">
            Care Communications
          </span>
          <h1 className="text-3xl font-black text-forest-950 dark:text-white tracking-tight mt-1">
            Clinical Notifications
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 dark:text-sand-400 font-medium mt-1">
            Real-time updates regarding pharmacist approvals, order shipments, and prescription alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-forest-900 dark:bg-forest-800 text-mint-300 text-xs font-bold">
            {unreadCount} Unread
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-forest-900/60 p-12 rounded-4xl text-center border border-sand-200 dark:border-forest-800 shadow-elevated space-y-3">
          <Bell className="w-10 h-10 text-sand-400 dark:text-sand-500 mx-auto" />
          <h3 className="text-base font-black text-forest-950 dark:text-white">All Clear</h3>
          <p className="text-xs text-sand-500 dark:text-sand-400">You have no active alerts or unread dispensary updates at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'bg-white dark:bg-forest-900/40 border-sand-200 dark:border-forest-800 opacity-80'
                  : 'bg-white dark:bg-forest-900/80 border-forest-300 dark:border-forest-700 shadow-subtle'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-2xl flex-shrink-0 mt-0.5 ${
                  n.isRead ? 'bg-sand-100 dark:bg-forest-800 text-sand-500 dark:text-sand-400' : 'bg-forest-900 dark:bg-forest-800 text-mint-400'
                }`}>
                  {n.type === 'ORDER' ? (
                    <Package className="w-4 h-4" />
                  ) : n.type === 'PRESCRIPTION' ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-forest-700 dark:text-mint-400 bg-sand-100 dark:bg-forest-950 px-2 py-0.5 rounded-md">
                      {n.type || 'Alert'}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-forest-950 dark:text-white text-sm">{n.title}</h4>
                  <p className="text-xs text-sand-600 dark:text-sand-300 leading-relaxed font-normal">{n.message}</p>
                  <span className="text-[10px] text-sand-400 dark:text-sand-500 block pt-1">
                    {new Date(n.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs font-bold text-forest-700 dark:text-mint-400 hover:text-forest-950 dark:hover:text-mint-300 p-2 rounded-xl hover:bg-sand-100 dark:hover:bg-forest-800 transition flex items-center gap-1 flex-shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Acknowledge</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
