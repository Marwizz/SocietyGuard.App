import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import React, { useContext, useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GuardContext } from "../GuardContext";
import { ScrollView } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import GuestEntryModal from "./modals/GuestEntryModal";
import CabEntryModal from "./modals/CabEntryModal";
import DeliveryEntryModal from "./modals/DeliveryEntryModal";
import PreApprovedOtp from "./PreApprovedOtp";

export default function HomeScreen() {
  const { user } = useContext(GuardContext);
  const navigation = useNavigation();
  const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
  const [isCabModalVisible, setIsCabModalVisible] = useState(false);
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;

  // Calculate the width to show exactly 4 icons
  const containerWidth = windowWidth - 32; // Subtract padding
  const iconWidth = containerWidth / 4; // Show 4 icons at once

  const [showRightIndicator, setShowRightIndicator] = useState(true);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const scrollViewRef = useRef(null);

  // Handle scroll events to update indicators
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    // Show left indicator if we've scrolled right
    setShowLeftIndicator(contentOffsetX > 10);

    // Show right indicator if we haven't reached the end
    setShowRightIndicator(contentOffsetX < contentWidth - layoutWidth - 10);
  };

  useEffect(() => {
    console.log("user inside homescreen", user);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress=
          {() =>
            navigation.navigate("Profile", {
              societyId: user?.SocietyId,
            })
          }> 
          
          {user?.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={40} color="#000" />
          )}
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{user?.FullName || "Ramu"}</Text>
          <Text style={styles.block}>{user?.HouseId?.Name || "Main Gate"}</Text>
        </View>
        {/* 
        <Ionicons
          name="search-outline"
          size={24}
          color="#333"
          style={styles.icon}
        /> */}
        {/* <Ionicons
          name="notifications-outline"
          size={24}
          color="black"
          style={styles.icon}
        /> */}
      </View>
      <PreApprovedOtp />

      {/* Icons row */}
      <ScrollView>
        <View style={styles.iconsRowContainer}>
          {/* Left scroll indicator */}
          {showLeftIndicator && (
            <View style={[styles.scrollIndicator, styles.leftIndicator]}>
              <Ionicons name="chevron-back" size={20} color="#666" />
            </View>
          )}

          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <TouchableOpacity
              style={[styles.iconButton, { width: iconWidth }]}
              onPress={() =>
                navigation.navigate("GroupPreapprove", {
                  societyId: user?.SocietyId,
                })
              }
            >
              <View style={styles.preApprovedIcon}>
                <Ionicons name="people-outline" size={30} color="#EAB308" />
              </View>
              <Text style={styles.iconText}>Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { width: iconWidth }]}
              onPress={() =>
                navigation.navigate("CabPreapprove", {
                  societyId: user?.SocietyId,
                })
              }
            >
              <View style={styles.preApprovedIcon}>
                <Ionicons name="car-outline" size={30} color="#EAB308" />
              </View>
              <Text style={styles.iconText}>Cab</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { width: iconWidth }]}
              onPress={() =>
                navigation.navigate("DeliveryPreapprove", {
                  societyId: user?.SocietyId,
                })
              }
            >
              <View style={styles.preApprovedIcon}>
                <Ionicons name="cube-outline" size={30} color="#EAB308" />
              </View>
              <Text style={styles.iconText}>Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { width: iconWidth }]}
              onPress={() =>
                navigation.navigate("FrequentPreapprove", {
                  societyId: user?.SocietyId,
                })
              }
            >
              <View style={styles.preApprovedIcon}>
                <Ionicons name="repeat-outline" size={30} color="#EAB308" />
              </View>
              <Text style={styles.iconText}>Frequent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { width: iconWidth }]}
              onPress={() =>
                navigation.navigate("OtherVisitors", {
                  societyId: user?.SocietyId,
                })
              }
            >
              <View style={styles.preApprovedIcon}>
                <MaterialIcons name="more" size={24} color="#EAB308" />
              </View>
              <Text style={styles.iconText}>Others</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Right scroll indicator */}
          {showRightIndicator && (
            <View style={[styles.scrollIndicator, styles.rightIndicator]}>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          )}
        </View>

        {/* On Arrival section */}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>On Arrival</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsGuestModalVisible(true)}
          >
            <View style={styles.arrivalIcon}>
              <Ionicons name="person-outline" size={24} color="#666" />
            </View>
            <Text style={styles.optionText}>Guest</Text>

            <Ionicons
              name="chevron-forward"
              size={24}
              color="#666"
              style={styles.chevron}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsCabModalVisible(true)}
          >
            <View style={styles.arrivalIcon}>
              <Ionicons name="car-outline" size={24} color="#666" />
            </View>
            <Text style={styles.optionText}>Cab Entry</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#666"
              style={styles.chevron}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsDeliveryModalVisible(true)}
          >
            <View style={styles.arrivalIcon}>
              <Ionicons name="cube-outline" size={24} color="#666" />
            </View>
            <Text style={styles.optionText}>Delivery</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#666"
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>
        {/* Modals */}

        <GuestEntryModal
          visible={isGuestModalVisible}
          onClose={() => setIsGuestModalVisible(false)}
          societyId={user?.SocietyId}
          onSubmit={(guestData) => {
            // Handle the guest entry data here
            console.log(guestData);
          }}
        />
        <CabEntryModal
          visible={isCabModalVisible}
          onClose={() => setIsCabModalVisible(false)}
          societyId={user?.SocietyId}
          onSubmit={(guestData) => {
            // Handle the guest entry data here
            console.log(guestData);
          }}
        />
        <DeliveryEntryModal
          visible={isDeliveryModalVisible}
          onClose={() => setIsDeliveryModalVisible(false)}
          societyId={user?.SocietyId}
          onSubmit={(guestData) => {
            // Handle the guest entry data here
            console.log(guestData);
          }}
        />

        {/* Alerts section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Alerts</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() =>
              navigation.navigate("Alerts", {
                societyId: user?.SocietyId,
              })
            }
          >
            <View style={styles.alertIcon}>
              <Ionicons name="alert-outline" size={24} color="#EF4444" />
            </View>
            <Text style={styles.optionText}>View Alerts</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#666"
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFCE8",
    marginTop: "20",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F3EB",
    padding: 22,
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    zIndex: 1000,
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  block: {
    fontSize: 14,
    color: "#666",
  },
  icon: {
    marginLeft: "auto",
    marginRight: 10,
  },
  preApprovedContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 200,
  },
  sectionLabel: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  digitBox: {
    width: 40,
    height: 50,
    borderBottomWidth: 2,
    borderColor: "#888282",
    justifyContent: "center",
    alignItems: "center",

    fontWeight: "600",
    textAlign: "center",
    fontSize: 23,
  },
  digitBoxFilled: {
    borderColor: "#EAB308",
  },
  digitBoxActive: {
    borderColor: "#EAB308",
    borderBottomWidth: 3,
  },
  verifyButton: {
    backgroundColor: "#EAB308",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  verifyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  verifyTextDisabled: {
    color: "#9CA3AF",
  },

  verifyButton: {
    backgroundColor: "#EAB308",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  verifyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  iconsRowContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
    position: "relative",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 5,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  preApprovedIcon: {
    backgroundColor: "#Fff",
    padding: 8,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 46,
    height: 46,
  },
  iconText: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  scrollIndicator: {
    position: "absolute",
    top: "-5%",
    transform: [{ translateY: -15 }],
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },
  leftIndicator: {
    left: 16,
  },
  rightIndicator: {
    right: 16,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  chevron: {
    marginLeft: "auto",
  },
  alertIcon: {
    backgroundColor: "#FEE2E2",
    padding: 8,
    borderRadius: 50,
  },
  arrivalIcon: {
    backgroundColor: "#e5e5e5",
    padding: 8,
    borderRadius: 50,
  },
});
