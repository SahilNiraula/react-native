import React from "react";
import {
  TouchableOpacity,
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2e6e4a" />

      <ScrollView style={styles.scrollView}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>Welcome, Trekker!</Text>
          <Text style={styles.welcomeSubtitle}>
            Plan your next adventure in Nepal
          </Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => Alert.alert(item.title, item.message)}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color="#fff"
                />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Developer Credit */}
      <View style={styles.developerCredit}>
        <Text style={styles.developerText}>Developed by Sahil Niraula</Text>
      </View>
    </SafeAreaView>
  );
};

const menuItems: {
  title: string;
  message: string;
  icon:
    | "map-marker-path"
    | "weather-partly-cloudy"
    | "image-filter-hdr"
    | "account-tie"
    | "alarm-light"
    | "file-document";
}[] = [
  {
    title: "Trek Planner",
    message: "Trek Planner feature coming soon!",
    icon: "map-marker-path",
  },
  {
    title: "Weather Updates",
    message: "Weather Updates feature coming soon!",
    icon: "weather-partly-cloudy",
  },
  {
    title: "AR Mountain View",
    message: "AR Mountain View feature coming soon!",
    icon: "image-filter-hdr",
  },
  {
    title: "Book Guides",
    message: "Book Guides feature coming soon!",
    icon: "account-tie",
  },
  {
    title: "Emergency SOS",
    message: "Emergency SOS feature coming soon!",
    icon: "alarm-light",
  },
  {
    title: "Trek Permits",
    message: "Trek Permits feature coming soon!",
    icon: "file-document",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#2e6e4a",
    paddingVertical: 15,
    alignItems: "center",
    elevation: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  welcomeBanner: {
    backgroundColor: "#e6f5e9",
    padding: 20,
    margin: 15,
    borderRadius: 10,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e6e4a",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#2e6e4a",
    marginTop: 5,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  menuItem: {
    backgroundColor: "#d1ead9",
    width: "48%",
    height: 100,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2e6e4a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  menuText: {
    color: "#2e6e4a",
    fontWeight: "bold",
    textAlign: "center",
  },
  developerCredit: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  developerText: {
    fontSize: 12,
    color: "#555",
  },
});

export default App;

