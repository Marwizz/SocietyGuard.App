import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import TabNavigation from "./TabNavigation";
import GroupPreapprove from "../screens/GroupPreapprove";


const Stack = createStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="GroupPreapprove" component={GroupPreapprove} />

     
    </Stack.Navigator>
  );
}