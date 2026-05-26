import {
  auth as firebaseAuth,
  isFirebaseConfigured
} from '../firebase/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';

const localUsersKey = 'momentum_mock_users';
const activeUserKey = 'momentum_active_user';

export const authService = {
  // Check if Firebase is active
  isFirebase: () => isFirebaseConfigured,

  // Listen to Auth State
  onAuthChange: (callback) => {
    if (isFirebaseConfigured) {
      return onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          callback({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`
          });
        } else {
          callback(null);
        }
      });
    } else {
      // Mock Auth listener
      const checkUser = () => {
        const userStr = localStorage.getItem(activeUserKey);
        if (userStr) {
          try {
            callback(JSON.parse(userStr));
          } catch (e) {
            callback(null);
          }
        } else {
          callback(null);
        }
      };

      // Poll or check initially
      checkUser();
      
      // Custom event for mock login state changes
      const handler = () => checkUser();
      window.addEventListener('mock-auth-change', handler);
      return () => window.removeEventListener('mock-auth-change', handler);
    }
  },

  // Signup
  signup: async (email, password, displayName) => {
    if (isFirebaseConfigured) {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      // Update display name if possible, or return user
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || email.split('@')[0]
      };
    } else {
      // Mock Sign up
      const users = JSON.parse(localStorage.getItem(localUsersKey) || '[]');
      if (users.find(u => u.email === email)) {
        throw new Error('Email already registered.');
      }
      const newUser = {
        uid: Math.random().toString(36).substr(2, 9),
        email,
        password, // For simple mock authentication
        displayName: displayName || email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
      };
      users.push(newUser);
      localStorage.setItem(localUsersKey, JSON.stringify(users));
      
      // Auto log-in
      localStorage.setItem(activeUserKey, JSON.stringify(newUser));
      window.dispatchEvent(new Event('mock-auth-change'));
      return newUser;
    }
  },

  // Login
  login: async (email, password) => {
    if (isFirebaseConfigured) {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email.split('@')[0]
      };
    } else {
      // Mock Login
      const users = JSON.parse(localStorage.getItem(localUsersKey) || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        // Create an automatic demo user if logging in with demo/test account
        if (email === 'demo@momentum.app' || email === 'test@momentum.app') {
          const demoUser = {
            uid: 'demo-user',
            email,
            displayName: 'Momentum Builder',
            photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=demo`
          };
          localStorage.setItem(activeUserKey, JSON.stringify(demoUser));
          window.dispatchEvent(new Event('mock-auth-change'));
          return demoUser;
        }
        throw new Error('Invalid email or password. Use demo@momentum.app (any password) to bypass.');
      }
      localStorage.setItem(activeUserKey, JSON.stringify(user));
      window.dispatchEvent(new Event('mock-auth-change'));
      return user;
    }
  },

  // Login with Google
  loginWithGoogle: async () => {
    if (isFirebaseConfigured) {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
    } else {
      // Mock Google Login
      const googleUser = {
        uid: 'google-mock-user',
        email: 'google.user@momentum.app',
        displayName: 'Google Dev 🔥',
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=google`
      };
      localStorage.setItem(activeUserKey, JSON.stringify(googleUser));
      window.dispatchEvent(new Event('mock-auth-change'));
      return googleUser;
    }
  },

  // Logout
  logout: async () => {
    if (isFirebaseConfigured) {
      await signOut(firebaseAuth);
    } else {
      localStorage.removeItem(activeUserKey);
      window.dispatchEvent(new Event('mock-auth-change'));
    }
  },

  // Reset Password
  resetPassword: async (email) => {
    if (isFirebaseConfigured) {
      await sendPasswordResetEmail(firebaseAuth, email);
    } else {
      // Mock reset password
      const users = JSON.parse(localStorage.getItem(localUsersKey) || '[]');
      if (!users.find(u => u.email === email) && email !== 'demo@momentum.app') {
        throw new Error('Email address not found.');
      }
      console.log(`Password reset link sent to ${email} (Mock)`);
    }
  }
};
