import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SectionList,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { EXPO_PUBLIC_BASE_URL, EXPO_PUBLIC_IMAGE_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Foundation from "@expo/vector-icons/Foundation";
import { Linking } from "react-native";

export default function Directory() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [sections, setSections] = useState([]);
  const navigation = useNavigation();
  const [allMembers, setAllMembers] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchMembers();
    }
  }, [userData]);

  useEffect(() => {
    // Process members data without filtering
    processMembers();
  }, [members]);

  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
      } else {
        console.error("User data not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching user data from AsyncStorage:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!userData?.SocietyId) {
        console.error("Society ID not found in user data.");
        setLoading(false);
        return;
      }

      const societyId =
        typeof userData.SocietyId === "object"
          ? userData.SocietyId._id
          : userData.SocietyId;

      const response = await axios.post(
        `${EXPO_PUBLIC_BASE_URL}/auth/listBySocietyParams/MemberMaster`,
        {
          skip: 0,
          per_page: 100,
          match: "",
          societyId: societyId,

          IsActive: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Members:", response.data[0]);

      if (response.data && response.data[0] && response.data[0].data) {
        setAllMembers(response.data[0].data);
        setMembers(response.data[0].data);
      }
    } catch (error) {
      console.error(
        "Error fetching members:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const processMembers = () => {
    if (!Array.isArray(members)) return;

    // Group members by first letter of name
    const membersByLetter = {};

    members.forEach((member) => {
      if (member.memberName) {
        const firstLetter = member.memberName.charAt(0).toUpperCase();

        if (!membersByLetter[firstLetter]) {
          membersByLetter[firstLetter] = [];
        }

        // Generate initials from member name
        const nameParts = member.memberName.split(" ");
        let initials = nameParts[0].charAt(0);
        if (nameParts.length > 1) {
          initials += nameParts[nameParts.length - 1].charAt(0);
        }

        // Generate a consistent color based on member id
        const colors = [
          "#FFA500",
          "#E066FF",
          "#32CD32",
          "#6495ED",
          "#FF6B6B",
          "#4CAF50",
          "#9C27B0",
        ];
        const colorIndex = member._id
          ? member._id.charCodeAt(member._id.length - 1) % colors.length
          : 0;

        membersByLetter[firstLetter].push({
          id: member._id || "",
          name: member.memberName,
          flatNumber:
            typeof member.HouseId === "object"
              ? member.HouseId.Name
              : member.HouseId || "No Building",
          initials: initials.toUpperCase(),
          color: colors[colorIndex],
          contactNo: member.ownerContact || "N/A",
          email: member.email || "N/A",
          profileImage: member.profileImage || null,
        });
      }
    });

    // Convert to sections format
    const letterSections = Object.keys(membersByLetter)
      .sort()
      .map((letter) => ({
        letter,
        data: membersByLetter[letter],
      }));

    setSections(letterSections);
  };

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      // If search is empty, show all members
      setMembers(allMembers);
    } else {
      // Filter members based on search text
      const filteredMembers = allMembers.filter((member) => {
        return member.memberName?.toLowerCase().includes(text.toLowerCase());
      });
      setMembers(filteredMembers);
    }
  };

  const renderResidentItem = ({ item }) => {
    const handleCall = () => {
      // Check if we have a valid phone number
      if (item.contactNo && item.contactNo !== 'N/A') {
        // Format the phone number by removing any non-numeric characters
        const phoneNumber = item.contactNo.replace(/\D/g, '');
        
        // Open the phone dialer with the contact's number
        Linking.openURL(`tel:${phoneNumber}`);
      } else {
        // You might want to show an alert if there's no phone number
        alert('No phone number available for this contact');
      }
    };
  
    return (
      <View style={styles.residentItem}>
        <View style={styles.avatarContainer}>
          {item.profileImage ? (
            <Image
              source={{
                uri: `${EXPO_PUBLIC_IMAGE_BASE_URL}${item.profileImage}`,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.avatarCircle, { backgroundColor: item.color }]}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
          )}
        </View>
        <View style={styles.residentInfo}>
          <Text style={styles.residentName}>{item.name}</Text>
          <Text style={styles.residentDetails}>{item.flatNumber}</Text>
          
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={handleCall}>
          <Foundation name="telephone" size={30} color="#008000" />
        </TouchableOpacity>
      </View>
    );
  };
  const renderSectionHeader = ({ section: { letter } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{letter}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Society Directory</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search residents by name, email or phone"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderResidentItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.residentsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No residents found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  residentsList: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F0F5FF",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  residentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  residentInfo: {
    flex: 1,
  },
  chatButton: {
    padding: 8,
  },
  residentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  residentDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  contactDetails: {
    fontSize: 13,
    color: "#666",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
