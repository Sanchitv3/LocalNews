import React, { useState, useEffect } from "react";
import { ScrollView, Alert, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

import { authService, User, AuthState } from "@/services/authService";
import { dataService } from "@/services/dataService";

// Login Form Schema
const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

// Register Form Schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile Update Schema
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type ProfileForm = z.infer<typeof profileSchema>;

const LoginForm: React.FC<{
  onLogin: (success: boolean) => void;
  onSwitchToRegister: () => void;
}> = ({ onLogin, onSwitchToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const result = await authService.login(
        data.usernameOrEmail, 
        data.password, 
        rememberMe
      );
      
      if (result.success) {
        reset();
        onLogin(true);
        Alert.alert("Success", "Welcome back!");
      } else {
        Alert.alert("Login Failed", result.error || "Please try again");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 m-4">
      <VStack space="lg">
        <VStack space="sm">
          <Heading size="lg" className="text-center">Welcome Back</Heading>
          <Text className="text-center text-gray-500">
            Sign in to access your bookmarks
          </Text>
        </VStack>

        <VStack space="md">
          <FormControl isInvalid={!!errors.usernameOrEmail}>
            <Controller
              control={control}
              name="usernameOrEmail"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Username or Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />
            {errors.usernameOrEmail && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.usernameOrEmail.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                </Input>
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </Text>
            )}
          </FormControl>

          <HStack className="items-center justify-between">
            <HStack className="items-center">
              <Switch 
                value={rememberMe} 
                onValueChange={setRememberMe}
                size="sm"
              />
              <Text className="ml-2 text-sm">Remember me</Text>
            </HStack>
          </HStack>

          <Button 
            onPress={handleSubmit(onSubmit)} 
            isDisabled={isLoading}
            className="w-full"
          >
            {isLoading ? <Spinner size="small" /> : <Text>Sign In</Text>}
          </Button>

          <HStack className="justify-center items-center">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Button variant="link" onPress={onSwitchToRegister}>
              <Text className="text-blue-600">Sign Up</Text>
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );
};

const RegisterForm: React.FC<{
  onRegister: (success: boolean) => void;
  onSwitchToLogin: () => void;
}> = ({ onRegister, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await authService.register(
        data.username,
        data.email,
        data.password
      );
      
      if (result.success) {
        reset();
        onRegister(true);
        Alert.alert("Success", "Account created successfully!");
      } else {
        Alert.alert("Registration Failed", result.error || "Please try again");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 m-4">
      <VStack space="lg">
        <VStack space="sm">
          <Heading size="lg" className="text-center">Create Account</Heading>
          <Text className="text-center text-gray-500">
            Join us to save your favorite news
          </Text>
        </VStack>

        <VStack space="md">
          <FormControl isInvalid={!!errors.username}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />
            {errors.username && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </Input>
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                </Input>
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Confirm Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                </Input>
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </Text>
            )}
          </FormControl>

          <Button 
            onPress={handleSubmit(onSubmit)} 
            isDisabled={isLoading}
            className="w-full"
          >
            {isLoading ? <Spinner size="small" /> : <Text>Create Account</Text>}
          </Button>

          <HStack className="justify-center items-center">
            <Text className="text-gray-500">Already have an account? </Text>
            <Button variant="link" onPress={onSwitchToLogin}>
              <Text className="text-blue-600">Sign In</Text>
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );
};

const UserProfile: React.FC<{
  user: User;
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });

  useEffect(() => {
    const loadBookmarkCount = async () => {
      try {
        const bookmarks = await dataService.getBookmarks();
        setBookmarkCount(bookmarks.length);
      } catch (error) {
        console.error("Error loading bookmark count:", error);
      }
    };
    loadBookmarkCount();
  }, []);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      const result = await authService.updateProfile(data);
      
      if (result.success) {
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Update Failed", result.error || "Please try again");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            await authService.logout();
            onLogout();
          }
        },
      ]
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack space="md" className="p-4">
        {/* Profile Header */}
        <Card className="p-6">
          <VStack space="md">
            <HStack className="items-center justify-between">
              <VStack space="xs">
                <Heading size="lg">👤 {user.username}</Heading>
                <Text className="text-gray-500">{user.email}</Text>
              </VStack>
              <Button 
                variant="outline" 
                size="sm"
                onPress={() => setIsEditing(!isEditing)}
              >
                <Text>{isEditing ? "Cancel" : "Edit"}</Text>
              </Button>
            </HStack>

            <VStack space="xs">
              <Text className="text-sm text-gray-500">
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </Text>
              <Text className="text-sm text-gray-500">
                📚 {bookmarkCount} bookmarked articles
              </Text>
            </VStack>
          </VStack>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card className="p-6">
            <VStack space="md">
              <Heading size="md">Edit Profile</Heading>
              
              <FormControl isInvalid={!!errors.username}>
                <Text className="text-sm font-medium mb-2">Username</Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Username"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                      />
                    </Input>
                  )}
                />
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <Text className="text-sm font-medium mb-2">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </Input>
                  )}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </FormControl>

              <Button 
                onPress={handleSubmit(onSubmit)} 
                isDisabled={isLoading}
              >
                {isLoading ? <Spinner size="small" /> : <Text>Save Changes</Text>}
              </Button>
            </VStack>
          </Card>
        )}

        {/* Actions */}
        <Card className="p-6">
          <VStack space="md">
            <Heading size="md">Account</Heading>
            
            <Button 
              variant="outline" 
              onPress={handleLogout}
              className="self-start"
            >
              <Text>Sign Out</Text>
            </Button>
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
};

export default function ProfileScreen() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Initialize auth service and set up listener
    const initAuth = async () => {
      try {
        const initialState = await authService.initialize();
        setAuthState(initialState);
        
        // Migrate legacy bookmarks if user just logged in
        if (initialState.isAuthenticated && initialState.user) {
          await dataService.migrateLegacyBookmarks(initialState.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener
    const unsubscribe = authService.addAuthListener((newState) => {
      setAuthState(newState);
    });

    return unsubscribe;
  }, []);

  const handleAuthSuccess = async (success: boolean) => {
    if (success) {
      const user = authService.getCurrentUser();
      if (user) {
        // Migrate legacy bookmarks for new user
        await dataService.migrateLegacyBookmarks(user.id);
      }
    }
  };

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Spinner size="large" />
        <Text className="mt-4 text-gray-500">Loading...</Text>
      </Box>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <Box className="flex-1 bg-gray-50">
        {/* Header */}
        <Box className="bg-white p-4 border-b border-gray-200">
          <Heading size="lg">
            {showRegister ? "Create Account" : "Sign In"}
          </Heading>
        </Box>

        {showRegister ? (
          <RegisterForm
            onRegister={handleAuthSuccess}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onLogin={handleAuthSuccess}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-50">
      {/* Header */}
      <Box className="bg-white p-4 border-b border-gray-200">
        <Heading size="lg">Profile</Heading>
      </Box>

      <UserProfile 
        user={authState.user!} 
        onLogout={() => setAuthState({ isAuthenticated: false, user: null })}
      />
    </Box>
  );
}