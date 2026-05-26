import { create } from 'zustand';
import { dbService } from '../services/db';
import { authService } from '../services/auth';
import { leetCodeService } from '../services/leetcode';

export const useStore = create((set, get) => ({
  // === AUTH STATE ===
  user: null,
  authLoading: true,
  authError: null,

  setUser: (user) => set({ user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),

  // === TASKS STATE ===
  tasks: [],
  tasksLoading: false,

  // === STREAKS STATE ===
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    history: {},
    milestones: []
  },
  streakLoading: false,

  // === FOCUS STATE ===
  focusSessions: [],
  focusLoading: false,

  // === LEETCODE STATE ===
  leetcodeStats: {
    username: '',
    solvedTotal: 0,
    solvedEasy: 0,
    solvedMedium: 0,
    solvedHard: 0,
    contestRating: 0,
    dsaStreak: 0,
    recentSubmissions: [],
    lastUpdated: null
  },
  leetcodeLoading: false,

  // === NOTIFICATIONS STATE ===
  notifications: [],
  notificationsLoading: false,
  notificationPermission: 'default',

  // === SETTINGS STATE ===
  settings: {
    darkMode: true,
    soundEnabled: true,
    leetcodeUsername: '',
    focusDuration: 25,
    breakDuration: 5,
    customCategories: []
  },

  // === INITIALIZATION & SYNC ===
  initApp: (user) => {
    set({ user, authLoading: false });
    if (user) {
      get().loadTasks();
      get().loadStreak();
      get().loadFocusSessions();
      get().loadLeetCodeStats();
      get().loadNotifications();
      get().loadSettings();
    } else {
      // Clear data on logout
      set({
        tasks: [],
        streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: null, history: {}, milestones: [] },
        focusSessions: [],
        leetcodeStats: { username: '', solvedTotal: 0, solvedEasy: 0, solvedMedium: 0, solvedHard: 0, contestRating: 0, dsaStreak: 0, recentSubmissions: [], lastUpdated: null },
        notifications: [],
      });
    }
  },

  // === TASKS OPERATIONS ===
  loadTasks: async () => {
    const userId = get().user?.uid;
    set({ tasksLoading: true });
    const tasks = await dbService.getTasks(userId);
    set({ tasks, tasksLoading: false });
  },

  addTask: async (taskData) => {
    const userId = get().user?.uid;
    const newTask = await dbService.addTask(userId, taskData);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    
    // Add activity log notification
    get().addSystemNotification({
      title: 'Task Created 📋',
      body: `Added "${taskData.title}" under ${taskData.category}`,
      type: 'task'
    });
  },

  updateTask: async (taskId, updates) => {
    const userId = get().user?.uid;
    const updated = await dbService.updateTask(userId, taskId, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
    }));
  },

  deleteTask: async (taskId) => {
    const userId = get().user?.uid;
    await dbService.deleteTask(userId, taskId);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId)
    }));
  },

  toggleTaskCompleted: async (taskId) => {
    const userId = get().user?.uid;
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    const completed = !task.completed;
    const streakCount = completed ? (task.streakCount || 0) + 1 : Math.max(0, (task.streakCount || 0) - 1);
    
    await get().updateTask(taskId, { completed, streakCount });
    
    // Update streak if task is completed
    if (completed) {
      await get().triggerStreakProgress();
    }
  },

  // === STREAK OPERATIONS ===
  loadStreak: async () => {
    const userId = get().user?.uid;
    set({ streakLoading: true });
    let streak = await dbService.getStreaks(userId);
    
    // Streak rollover check (did the user miss a day?)
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (streak.lastActiveDate && streak.lastActiveDate !== todayStr && streak.lastActiveDate !== yesterdayStr) {
      // Broke streak!
      streak = {
        ...streak,
        currentStreak: 0
      };
      await dbService.updateStreaks(userId, streak);
    }
    
    set({ streak, streakLoading: false });
  },

  triggerStreakProgress: async () => {
    const userId = get().user?.uid;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const streak = { ...get().streak };
    
    // If completed already today, do not increment streak again, just set history
    if (streak.lastActiveDate === todayStr) {
      streak.history = { ...streak.history, [todayStr]: true };
      await dbService.updateStreaks(userId, streak);
      set({ streak });
      return;
    }
    
    // If last active was yesterday, increment. If was null or older than yesterday, reset to 1
    if (streak.lastActiveDate === yesterdayStr) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }
    
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
    
    streak.lastActiveDate = todayStr;
    streak.history = { ...streak.history, [todayStr]: true };
    
    // Milestone Check
    const newMilestones = [...(streak.milestones || [])];
    const checkMilestone = (days, id, title) => {
      if (streak.currentStreak >= days && !newMilestones.includes(id)) {
        newMilestones.push(id);
        get().addSystemNotification({
          title: `Milestone Achieved! 🏆`,
          body: `You unlocked the "${title}" badge for a ${days}-day streak!`,
          type: 'milestone'
        });
      }
    };
    
    checkMilestone(3, 'm3', 'Momentum Spark ⚡');
    checkMilestone(7, 'm7', 'Consistent Performer 🔥');
    checkMilestone(15, 'm15', 'Habit Master 🏆');
    checkMilestone(30, 'm30', 'Unstoppable Force 🚀');
    
    streak.milestones = newMilestones;
    
    await dbService.updateStreaks(userId, streak);
    set({ streak });
  },

  // === FOCUS OPERATIONS ===
  loadFocusSessions: async () => {
    const userId = get().user?.uid;
    set({ focusLoading: true });
    const focusSessions = await dbService.getFocusSessions(userId);
    set({ focusSessions, focusLoading: false });
  },

  addFocusSession: async (durationMinutes, mode) => {
    const userId = get().user?.uid;
    const newSession = await dbService.addFocusSession(userId, {
      durationMinutes,
      mode,
      completedAt: new Date().toISOString()
    });
    set((state) => ({ focusSessions: [newSession, ...state.focusSessions] }));
    
    get().addSystemNotification({
      title: 'Focus Session Complete 🧠',
      body: `Successfully finished a ${durationMinutes}-minute ${mode} session!`,
      type: 'focus'
    });
    
    // Trigger streak progress for a completed focus session as well
    await get().triggerStreakProgress();
  },

  // === LEETCODE OPERATIONS ===
  loadLeetCodeStats: async () => {
    const userId = get().user?.uid;
    set({ leetcodeLoading: true });
    const stats = await dbService.getLeetCodeStats(userId);
    set({ leetcodeStats: stats, leetcodeLoading: false });
  },

  updateLeetCodeUsername: async (username) => {
    const userId = get().user?.uid;
    set({ leetcodeLoading: true });
    
    // Fetch fresh stats from unofficial API
    const freshStats = await leetCodeService.fetchStats(username);
    
    if (freshStats) {
      await dbService.updateLeetCodeStats(userId, freshStats);
      // Update settings too
      const updatedSettings = { ...get().settings, leetcodeUsername: username };
      localStorage.setItem(`momentum_settings_${userId || 'guest'}`, JSON.stringify(updatedSettings));
      
      set({
        leetcodeStats: freshStats,
        settings: updatedSettings,
        leetcodeLoading: false
      });
      
      get().addSystemNotification({
        title: 'LeetCode Connected ⚡',
        body: `Stats loaded for username "${username}"`,
        type: 'leetcode'
      });
    } else {
      set({ leetcodeLoading: false });
      throw new Error('Could not retrieve stats for username');
    }
  },

  refreshLeetCodeStats: async () => {
    const username = get().leetcodeStats?.username || get().settings?.leetcodeUsername;
    if (!username) return;
    
    set({ leetcodeLoading: true });
    const freshStats = await leetCodeService.fetchStats(username);
    if (freshStats) {
      const userId = get().user?.uid;
      await dbService.updateLeetCodeStats(userId, freshStats);
      set({ leetcodeStats: freshStats, leetcodeLoading: false });
      
      get().addSystemNotification({
        title: 'Stats Refreshed 🔄',
        body: `Updated LeetCode details. Solved: ${freshStats.solvedTotal}`,
        type: 'leetcode'
      });
    } else {
      set({ leetcodeLoading: false });
    }
  },

  // === NOTIFICATIONS OPERATIONS ===
  loadNotifications: async () => {
    const userId = get().user?.uid;
    set({ notificationsLoading: true });
    const notifications = await dbService.getNotifications(userId);
    set({ notifications, notificationsLoading: false });
  },

  addSystemNotification: async (notif) => {
    const userId = get().user?.uid;
    const added = await dbService.addNotification(userId, notif);
    set((state) => ({ notifications: [added, ...state.notifications] }));
    
    // Native Browser Notification Trigger if enabled and permission granted
    if (get().settings.soundEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notif.title, {
        body: notif.body,
        icon: '/favicon.svg'
      });
    }
  },

  readNotification: async (notifId) => {
    const userId = get().user?.uid;
    await dbService.updateNotificationRead(userId, notifId);
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    }));
  },

  clearNotifications: async () => {
    const userId = get().user?.uid;
    await dbService.clearNotifications(userId);
    set({ notifications: [] });
  },

  setNotificationPermission: (permission) => {
    set({ notificationPermission: permission });
  },

  // === SETTINGS OPERATIONS ===
  loadSettings: () => {
    const userId = get().user?.uid;
    const stored = localStorage.getItem(`momentum_settings_${userId || 'guest'}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        set({ settings: parsed });
      } catch (e) {
        // Fallback
      }
    }
  },

  updateSettings: (updates) => {
    const userId = get().user?.uid;
    set((state) => {
      const newSettings = { ...state.settings, ...updates };
      localStorage.setItem(`momentum_settings_${userId || 'guest'}`, JSON.stringify(newSettings));
      return { settings: newSettings };
    });
  },

  resetProgress: async () => {
    const userId = get().user?.uid;
    
    // Clear Firestore/LocalStorage data
    await dbService.clearNotifications(userId);
    
    if (userId) {
      // Delete tasks
      const userTasks = await dbService.getTasks(userId);
      await Promise.all(userTasks.map((t) => dbService.deleteTask(userId, t.id)));
      
      // Reset streak
      const emptyStreak = { currentStreak: 0, longestStreak: 0, lastActiveDate: null, history: {}, milestones: [] };
      await dbService.updateStreaks(userId, emptyStreak);
      
      // Reset leetcode
      const emptyLeetcode = { username: '', solvedTotal: 0, solvedEasy: 0, solvedMedium: 0, solvedHard: 0, contestRating: 0, dsaStreak: 0, recentSubmissions: [], lastUpdated: null };
      await dbService.updateLeetCodeStats(userId, emptyLeetcode);
    }
    
    // Reset local state
    set({
      tasks: [],
      streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: null, history: {}, milestones: [] },
      focusSessions: [],
      leetcodeStats: { username: '', solvedTotal: 0, solvedEasy: 0, solvedMedium: 0, solvedHard: 0, contestRating: 0, dsaStreak: 0, recentSubmissions: [], lastUpdated: null },
      notifications: []
    });
    
    get().addSystemNotification({
      title: 'Progress Reset ⚠️',
      body: 'All tasks, streaks, focus history, and stats have been cleared.',
      type: 'warning'
    });
  }
}));
