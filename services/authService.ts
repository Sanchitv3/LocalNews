import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const USERS_KEY = "app_users";
const CURRENT_USER_KEY = "current_user";
const REMEMBER_ME_KEY = "remember_me";

class AuthService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  // Initialize auth service
  async initialize(): Promise<AuthState> {
    try {
      const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      if (rememberMe === "true") {
        const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (userData) {
          const user: User = JSON.parse(userData);
          // Update last login time
          user.lastLoginAt = new Date().toISOString();
          await this.setCurrentUser(user);
          this.authState = { isAuthenticated: true, user };
        }
      }
      return this.authState;
    } catch (error) {
      console.error("Error initializing auth:", error);
      return this.authState;
    }
  }

  // Register new user
  async register(username: string, email: string, password: string): Promise<{
    success: boolean;
    error?: string;
    user?: User;
  }> {
    try {
      // Validate input
      if (!username.trim() || !email.trim() || !password.trim()) {
        return { success: false, error: "All fields are required" };
      }

      if (username.length < 3) {
        return { success: false, error: "Username must be at least 3 characters" };
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: "Please enter a valid email address" };
      }

      const users = await this.getUsers();

      // Check if user already exists
      const existingUser = users.find(
        (user) => user.username.toLowerCase() === username.toLowerCase() || 
                 user.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        return { 
          success: false, 
          error: existingUser.username.toLowerCase() === username.toLowerCase() 
            ? "Username already exists" 
            : "Email already registered" 
        };
      }

      // Create new user
      const newUser: User = {
        id: this.generateId(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // Save user (in a real app, you'd hash the password)
      const updatedUsers = [...users, newUser];
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      await AsyncStorage.setItem(`password_${newUser.id}`, password); // Store password separately

      // Set as current user
      await this.setCurrentUser(newUser);
      this.authState = { isAuthenticated: true, user: newUser };
      this.notifyListeners();

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Registration failed. Please try again." };
    }
  }

  // Login user
  async login(
    usernameOrEmail: string, 
    password: string, 
    rememberMe: boolean = false
  ): Promise<{
    success: boolean;
    error?: string;
    user?: User;
  }> {
    try {
      if (!usernameOrEmail.trim() || !password.trim()) {
        return { success: false, error: "Username/email and password are required" };
      }

      const users = await this.getUsers();
      const user = users.find(
        (u) => 
          u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
          u.email.toLowerCase() === usernameOrEmail.toLowerCase()
      );

      if (!user) {
        return { success: false, error: "User not found" };
      }

      // Check password (in a real app, you'd hash and compare)
      const storedPassword = await AsyncStorage.getItem(`password_${user.id}`);
      if (storedPassword !== password) {
        return { success: false, error: "Invalid password" };
      }

      // Update last login time
      user.lastLoginAt = new Date().toISOString();
      await this.updateUser(user);

      // Set as current user
      await this.setCurrentUser(user);
      await AsyncStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());

      this.authState = { isAuthenticated: true, user };
      this.notifyListeners();

      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed. Please try again." };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([CURRENT_USER_KEY, REMEMBER_ME_KEY]);
      this.authState = { isAuthenticated: false, user: null };
      this.notifyListeners();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Get current auth state
  getAuthState(): AuthState {
    return this.authState;
  }

  // Add auth state listener
  addAuthListener(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.authState.user;
  }

  // Update user profile
  async updateProfile(updates: Partial<Pick<User, 'username' | 'email'>>): Promise<{
    success: boolean;
    error?: string;
    user?: User;
  }> {
    try {
      if (!this.authState.user) {
        return { success: false, error: "Not authenticated" };
      }

      const users = await this.getUsers();
      
      // Check for conflicts with other users
      if (updates.username || updates.email) {
        const conflict = users.find(
          (user) => 
            user.id !== this.authState.user!.id && 
            ((updates.username && user.username.toLowerCase() === updates.username.toLowerCase()) ||
             (updates.email && user.email.toLowerCase() === updates.email?.toLowerCase()))
        );

        if (conflict) {
          return { 
            success: false, 
            error: updates.username && conflict.username.toLowerCase() === updates.username.toLowerCase()
              ? "Username already exists"
              : "Email already registered"
          };
        }
      }

      const updatedUser = { ...this.authState.user, ...updates };
      await this.updateUser(updatedUser);
      await this.setCurrentUser(updatedUser);

      this.authState = { isAuthenticated: true, user: updatedUser };
      this.notifyListeners();

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Failed to update profile" };
    }
  }

  // Private helper methods
  private async getUsers(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  private async updateUser(user: User): Promise<void> {
    try {
      const users = await this.getUsers();
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  private async setCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting current user:", error);
      throw error;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.authState));
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Reset password (for demo purposes - in real app, would involve email verification)
  async resetPassword(usernameOrEmail: string, newPassword: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (newPassword.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }

      const users = await this.getUsers();
      const user = users.find(
        (u) => 
          u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
          u.email.toLowerCase() === usernameOrEmail.toLowerCase()
      );

      if (!user) {
        return { success: false, error: "User not found" };
      }

      await AsyncStorage.setItem(`password_${user.id}`, newPassword);
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: "Failed to reset password" };
    }
  }
}

export const authService = new AuthService();