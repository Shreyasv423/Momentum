import { db, isFirebaseConfigured } from '../firebase/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

// Helper for offline / local storage mode
const localDB = {
  get: (key, defaultValue = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Error reading localStorage key: ', key, e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing localStorage key: ', key, e);
    }
  }
};

export const dbService = {
  // === TASKS ===
  getTasks: async (userId) => {
    if (isFirebaseConfigured && userId) {
      try {
        const q = query(collection(db, 'tasks'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });
        return tasks;
      } catch (err) {
        console.error('Firebase getTasks failed, using local storage:', err);
      }
    }
    return localDB.get(`momentum_tasks_${userId || 'guest'}`, []);
  },

  addTask: async (userId, task) => {
    const newTask = {
      ...task,
      userId: userId || 'guest',
      completed: false,
      streakCount: task.streakCount || 0,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && userId) {
      try {
        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        return { id: docRef.id, ...newTask };
      } catch (err) {
        console.error('Firebase addTask failed, using local storage:', err);
      }
    }

    // Local Storage
    const tasks = localDB.get(`momentum_tasks_${userId || 'guest'}`, []);
    const localTask = { id: Math.random().toString(36).substr(2, 9), ...newTask };
    tasks.push(localTask);
    localDB.set(`momentum_tasks_${userId || 'guest'}`, tasks);
    return localTask;
  },

  updateTask: async (userId, taskId, updates) => {
    if (isFirebaseConfigured && userId) {
      try {
        const taskDoc = doc(db, 'tasks', taskId);
        await updateDoc(taskDoc, updates);
        return { id: taskId, ...updates };
      } catch (err) {
        console.error('Firebase updateTask failed, using local storage:', err);
      }
    }

    // Local Storage
    const tasks = localDB.get(`momentum_tasks_${userId || 'guest'}`, []);
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    localDB.set(`momentum_tasks_${userId || 'guest'}`, updatedTasks);
    return { id: taskId, ...updates };
  },

  deleteTask: async (userId, taskId) => {
    if (isFirebaseConfigured && userId) {
      try {
        const taskDoc = doc(db, 'tasks', taskId);
        await deleteDoc(taskDoc);
        return taskId;
      } catch (err) {
        console.error('Firebase deleteTask failed, using local storage:', err);
      }
    }

    // Local Storage
    const tasks = localDB.get(`momentum_tasks_${userId || 'guest'}`, []);
    const filteredTasks = tasks.filter((t) => t.id !== taskId);
    localDB.set(`momentum_tasks_${userId || 'guest'}`, filteredTasks);
    return taskId;
  },

  // === STREAK & CONSISTENCY ===
  getStreaks: async (userId) => {
    const defaultStreak = {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      history: {}, // Format: { "YYYY-MM-DD": boolean }
      milestones: [] // List of achieved milestone ids
    };

    if (isFirebaseConfigured && userId) {
      try {
        const docRef = doc(db, 'streaks', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          // Initialize
          await setDoc(docRef, defaultStreak);
          return defaultStreak;
        }
      } catch (err) {
        console.error('Firebase getStreaks failed, using local storage:', err);
      }
    }

    return localDB.get(`momentum_streak_${userId || 'guest'}`, defaultStreak);
  },

  updateStreaks: async (userId, streakData) => {
    if (isFirebaseConfigured && userId) {
      try {
        const docRef = doc(db, 'streaks', userId);
        await setDoc(docRef, streakData, { merge: true });
        return streakData;
      } catch (err) {
        console.error('Firebase updateStreaks failed, using local storage:', err);
      }
    }

    localDB.set(`momentum_streak_${userId || 'guest'}`, streakData);
    return streakData;
  },

  // === FOCUS SESSIONS ===
  getFocusSessions: async (userId) => {
    if (isFirebaseConfigured && userId) {
      try {
        const q = query(
          collection(db, 'focusSessions'),
          where('userId', '==', userId),
          orderBy('completedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const sessions = [];
        querySnapshot.forEach((doc) => {
          sessions.push({ id: doc.id, ...doc.data() });
        });
        return sessions;
      } catch (err) {
        console.error('Firebase getFocusSessions failed, using local storage:', err);
      }
    }
    return localDB.get(`momentum_focus_${userId || 'guest'}`, []);
  },

  addFocusSession: async (userId, session) => {
    const newSession = {
      ...session,
      userId: userId || 'guest',
      completedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && userId) {
      try {
        const docRef = await addDoc(collection(db, 'focusSessions'), newSession);
        return { id: docRef.id, ...newSession };
      } catch (err) {
        console.error('Firebase addFocusSession failed, using local storage:', err);
      }
    }

    const sessions = localDB.get(`momentum_focus_${userId || 'guest'}`, []);
    const localSession = { id: Math.random().toString(36).substr(2, 9), ...newSession };
    sessions.unshift(localSession); // Most recent first
    localDB.set(`momentum_focus_${userId || 'guest'}`, sessions);
    return localSession;
  },

  // === LEETCODE STATS ===
  getLeetCodeStats: async (userId) => {
    const defaultStats = {
      username: '',
      solvedTotal: 0,
      solvedEasy: 0,
      solvedMedium: 0,
      solvedHard: 0,
      contestRating: 0,
      dsaStreak: 0,
      recentSubmissions: [],
      lastUpdated: null
    };

    if (isFirebaseConfigured && userId) {
      try {
        const docRef = doc(db, 'leetcodeStats', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data();
        }
      } catch (err) {
        console.error('Firebase getLeetCodeStats failed, using local storage:', err);
      }
    }

    return localDB.get(`momentum_leetcode_${userId || 'guest'}`, defaultStats);
  },

  updateLeetCodeStats: async (userId, stats) => {
    if (isFirebaseConfigured && userId) {
      try {
        const docRef = doc(db, 'leetcodeStats', userId);
        await setDoc(docRef, stats, { merge: true });
        return stats;
      } catch (err) {
        console.error('Firebase updateLeetCodeStats failed, using local storage:', err);
      }
    }

    localDB.set(`momentum_leetcode_${userId || 'guest'}`, stats);
    return stats;
  },

  // === NOTIFICATIONS ===
  getNotifications: async (userId) => {
    if (isFirebaseConfigured && userId) {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const notifications = [];
        querySnapshot.forEach((doc) => {
          notifications.push({ id: doc.id, ...doc.data() });
        });
        return notifications;
      } catch (err) {
        console.error('Firebase getNotifications failed, using local storage:', err);
      }
    }
    return localDB.get(`momentum_notifications_${userId || 'guest'}`, []);
  },

  addNotification: async (userId, notification) => {
    const newNotif = {
      ...notification,
      userId: userId || 'guest',
      timestamp: new Date().toISOString(),
      read: false
    };

    if (isFirebaseConfigured && userId) {
      try {
        const docRef = await addDoc(collection(db, 'notifications'), newNotif);
        return { id: docRef.id, ...newNotif };
      } catch (err) {
        console.error('Firebase addNotification failed, using local storage:', err);
      }
    }

    const notifs = localDB.get(`momentum_notifications_${userId || 'guest'}`, []);
    const localNotif = { id: Math.random().toString(36).substr(2, 9), ...newNotif };
    notifs.unshift(localNotif);
    localDB.set(`momentum_notifications_${userId || 'guest'}`, notifs);
    return localNotif;
  },

  updateNotificationRead: async (userId, notifId) => {
    if (isFirebaseConfigured && userId) {
      try {
        const docRef = doc(db, 'notifications', notifId);
        await updateDoc(docRef, { read: true });
        return notifId;
      } catch (err) {
        console.error('Firebase updateNotificationRead failed, using local storage:', err);
      }
    }

    const notifs = localDB.get(`momentum_notifications_${userId || 'guest'}`, []);
    const updated = notifs.map((n) => (n.id === notifId ? { ...n, read: true } : n));
    localDB.set(`momentum_notifications_${userId || 'guest'}`, updated);
    return notifId;
  },

  clearNotifications: async (userId) => {
    if (isFirebaseConfigured && userId) {
      try {
        const q = query(collection(db, 'notifications'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const batchPromises = [];
        querySnapshot.forEach((doc) => {
          batchPromises.push(deleteDoc(doc.ref));
        });
        await Promise.all(batchPromises);
        return [];
      } catch (err) {
        console.error('Firebase clearNotifications failed, using local storage:', err);
      }
    }

    localDB.set(`momentum_notifications_${userId || 'guest'}`, []);
    return [];
  }
};
