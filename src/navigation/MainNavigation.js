import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import AdminNavigator from "./AdminNavigator";
import { GuardContext } from "../GuardContext";

const Stack = createStackNavigator();

function MainNavigation() {
  const { isAuthenticated, isLoading} = useContext(GuardContext)

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ): (
          // Main App Stack
          <Stack.Screen name="Admin" component={AdminNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;