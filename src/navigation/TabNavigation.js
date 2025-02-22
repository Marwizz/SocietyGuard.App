import { View, Text, Image } from "react-native";
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import HomeScreen from "../screens/HomeScreen";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import WaitingScreen from "../screens/WaitingScreen";
import ExitScreen from "../screens/ExitScreen";
import Directory from "../screens/Directory";
import { GuardContext } from "../GuardContext";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {

    const { user } = useContext(GuardContext);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 70,
          paddingTop: 5,
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#000" : "#979797",
                fontSize: 15,
                marginTop: 3,
                fontWeight: "bold",
              }}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={25}
              style={{ color: focused ? "#FFCC70" : "#000" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Waiting"
        children={() => <WaitingScreen societyId={user?.SocietyId} />}

        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#000" : "#979797",
                fontSize: 15,
                marginTop: 3,
                fontWeight: "bold",
              }}
            >
              Waiting
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="clock"
              size={25}
              style={{ color: focused ? "#FFCC70" : "#000" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Exit"
        component={ExitScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#000" : "#979797",
                fontSize: 15,
                marginTop: 3,
                fontWeight: "bold",
              }}
            >
              Exit
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="exit"
              size={25}
              style={{ color: focused ? "#FFCC70" : "#000" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Contact Directory"
        component={Directory}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#000" : "#979797",
                fontSize: 15,
                marginTop: 3,
                fontWeight: "bold",
              }}
            >
              Directory
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="contact-book"
              size={25}
              style={{ color: focused ? "#FFCC70" : "#000" }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
