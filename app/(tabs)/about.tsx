import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AboutScreen() {
  const openSocialMedia = (url: string) => {
    Linking.openURL(url);
  };

  const features: {
    icon: "map-marker" | "weather-cloudy" | "account-tie" | "medical-bag";
    title: string;
    description: string;
    color: string;
  }[] = [
    {
      icon: "map-marker",
      title: "Trek Planner",
      description:
        "Plan your trekking routes efficiently with detailed maps and guides.",
      color: "#4CAF50",
    },
    {
      icon: "weather-cloudy",
      title: "Weather Updates",
      description:
        "Get real-time weather updates to ensure a safe trekking experience.",
      color: "#2196F3",
    },
    {
      icon: "account-tie",
      title: "Book Guides",
      description:
        "Hire experienced trekking guides for a better and safer adventure.",
      color: "#FF9800",
    },
    {
      icon: "medical-bag",
      title: "Emergency SOS",
      description: "One-tap SOS feature to get help when you need it most.",
      color: "#F44336",
    },
  ];

  return (
    <ScrollView style={styles.scrollView}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmVwYWwlMjB0cmVra2luZ3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        }}
        style={styles.header}
      >
        <View style={styles.overlay}>
          <MaterialCommunityIcons
            name="information-outline"
            size={60}
            color="#ffffff"
            style={styles.icon}
          />
          <Text style={styles.title}>About This App</Text>
          <Text style={styles.tagline}>Your Ultimate Trekking Companion</Text>
        </View>
      </ImageBackground>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          This app is designed to help trekkers plan their adventures, get
          weather updates, book guides, and access emergency SOS features.
          Explore the beauty of Nepal with confidence and ease!
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Main Features</Text>

      <View style={styles.cardContainer}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: feature.color }]}
          >
            <MaterialCommunityIcons
              name={feature.icon}
              size={40}
              color="#fff"
            />
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Text style={styles.cardDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    height: 220,
    justifyContent: "flex-end",
  },
  overlay: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    fontStyle: "italic",
  },
  descriptionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 5,
  },
  description: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 15,
    marginLeft: 15,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  card: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    height: 160,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  cardDescription: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.9,
  },
});
