import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import TabNavigation from "./TabNavigation";
import GroupPreapprove from "../screens/GroupPreapprove";
import DeliveryPreapprove from "../screens/DeliveryPreapprove";
import CabPreapprove from "../screens/CabPreapprove";
import FrequentPreapprove from "../screens/FrequentPreapprove";
import OthersVisitor from "../screens/OthersVisitor";
import SecurityAlerts from "../screens/Alerts";
import Profile from "../screens/Profile";


const Stack = createStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="GroupPreapprove" component={GroupPreapprove} />
      <Stack.Screen name="DeliveryPreapprove" component={DeliveryPreapprove} />
      <Stack.Screen name="CabPreapprove" component={CabPreapprove} />
      <Stack.Screen name="FrequentPreapprove" component={FrequentPreapprove} />
      <Stack.Screen name="OtherVisitors" component={OthersVisitor} />
      <Stack.Screen name="Alerts" component={SecurityAlerts} />
      <Stack.Screen name="Profile" component={Profile} />

     
    </Stack.Navigator>
  );
}