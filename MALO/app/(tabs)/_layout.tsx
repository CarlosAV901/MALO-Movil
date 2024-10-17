import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Tabs } from "expo-router";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "blue" }}>
      <StatusBar style="light" backgroundColor={"blue"} />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "red",
          headerShown: false,
          tabBarStyle: { backgroundColor: "white" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
        <Tabs.Screen
          name="login/index"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
        <Tabs.Screen
          name="agregar/index"
          options={{
            title: "Agregar",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
        <Tabs.Screen
          name="buscar/index"
          options={{
            title: "Buscar",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
