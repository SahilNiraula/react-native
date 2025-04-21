import colors from "@/theme/color";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function Home() {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const router = useRouter();

  const menuItems = [
    {
      id: 1,
      title: "Trek Planner",
      icon: (
        <MaterialCommunityIcons
          name="map-marker-path"
          size={28}
          color={colors.dark}
        />
      ),
      bgColor: colors.light_gray,
      description: "Plan custom treks with routes, stops & timing",
      onPress: () => router.navigate("/trek-planner"),
    },
    {
      id: 2,
      title: "Weather Updates",
      icon: (
        <MaterialCommunityIcons
          name="weather-cloudy-clock"
          size={28}
          color={colors.dark}
        />
      ),
      bgColor: colors.light_gray,
      description: "Current & forecast mountain weather conditions",
      onPress: () => router.navigate("/weatherUpdates"),
    },
    {
      id: 3,
      title: "Mountains Info",
      icon: <FontAwesome6 name="mountain" size={28} color={colors.dark} />,
      bgColor: colors.light_gray,
      description: "Explore peaks, trails, and difficulty levels",
      onPress: () => router.navigate("/mountainInfo"),
    },
    {
      id: 4,
      title: "Book Guides",
      icon: <MaterialIcons name="group-add" size={28} color={colors.dark} />,
      bgColor: colors.light_gray,
      description: "Find experienced local guides & porters",
      onPress: () => router.navigate("/trek-planner"),
    },
    {
      id: 5,
      title: "Offline Maps",
      icon: (
        <MaterialCommunityIcons
          name="map-search-outline"
          size={28}
          color={colors.dark}
        />
      ),
      bgColor: colors.light_gray,
      description: "Download maps for when you're off the grid",
      onPress: () => router.navigate("/trek-planner"),
    },
    {
      id: 6,
      title: "Emergency SOS",
      icon: (
        <MaterialIcons name="sos" size={28} color={colors.sunrise_orange} />
      ),
      bgColor: colors.light_gray,
      description: "Quick access to emergency contacts & services",
      onPress: () => router.navigate("/trek-planner"),
    },
  ];

  const handleMenuPress = (id: number) => {
    setActiveMenu(id === activeMenu ? null : id);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/welcome-bg.jpg")}
        style={styles.headerBg}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, Trekker</Text>
          <Text style={styles.subText}>Plan your next adventure in Nepal</Text>
        </View>
      </ImageBackground>

      <ScrollView style={styles.scrollView}>
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  {
                    backgroundColor:
                      activeMenu === item.id
                        ? colors.mountain_blue
                        : colors.white,
                  },
                ]}
                onPress={() => item.onPress()}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>{item.icon}</View>
                <Text
                  style={[
                    styles.menuTitle,
                    {
                      color:
                        activeMenu === item.id
                          ? colors.light_text
                          : colors.dark,
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Trek</Text>
          <TouchableOpacity style={styles.featuredCard}>
            <ImageBackground
              source={require("@/assets/images/anapurna.jpg")}
              style={styles.featuredImage}
              imageStyle={{ borderRadius: 12 }}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Annapurna Circuit</Text>
                <View style={styles.featuredDetails}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="hiking"
                      size={16}
                      color={colors.light_text}
                    />
                    <Text style={styles.detailText}>12-18 days</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons
                      name="height"
                      size={16}
                      color={colors.light_text}
                    />
                    <Text style={styles.detailText}>5,416m max</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featuredCard}>
            <ImageBackground
              source={require("@/assets/images/everest.jpg")}
              style={styles.featuredImage}
              imageStyle={{ borderRadius: 12 }}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Everest Base Camp</Text>
                <View style={styles.featuredDetails}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="hiking"
                      size={16}
                      color={colors.light_text}
                    />
                    <Text style={styles.detailText}>12-14 days</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons
                      name="height"
                      size={16}
                      color={colors.light_text}
                    />
                    <Text style={styles.detailText}>5,364m max</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featuredCard}>
            <ImageBackground
              source={require("@/assets/images/langtang.jpg")}
              style={styles.featuredImage}
              imageStyle={{ borderRadius: 12 }}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Langtang Valley Trek</Text>
                <View style={styles.featuredDetails}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="hiking"
                      size={16}
                      color={colors.light_text}
                    />
                    <Text style={styles.detailText}>7-10 days</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons
                      name="height"
                      size={16}
                      color={colors.light_text}
                    />
                    <Text style={styles.detailText}>4,984m max</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerBg: {
    height: 180,
  },
  header: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingTop: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: colors.light_text,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  menuContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    paddingLeft: 4,
    color: colors.dark,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuItem: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    minHeight: 130,
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    backgroundColor: colors.light_gray,
    padding: 12,
    borderRadius: 50,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  menuDescription: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    color: colors.light_text,
  },
  featuredSection: {
    padding: 16,
    marginBottom: 20,
  },
  featuredCard: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  featuredImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  featuredContent: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  featuredDetails: {
    flexDirection: "row",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    color: colors.light_text,
    fontSize: 14,
    marginLeft: 4,
  },
});

