import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "News Feed",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="newspaper-o" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="submit"
        options={{
          title: "Submit News",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="plus-circle" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="info-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
