import { fetchMountainInfo } from "@/service/getMountaonsInfo";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const MountainSearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mountainInfo, setMountainInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mountainName, setMountainName] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a mountain name");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMountainName(searchQuery);

    try {
      const info = await fetchMountainInfo(searchQuery);
      setMountainInfo(info);
    } catch (err) {
      setError("Failed to fetch mountain information");
      setMountainInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setMountainInfo(null);
    setError(null);
    setMountainName(null);
  };

  // Process the mountain info text into structured sections
  const formatMountainInfo = (info: string) => {
    if (!info) return null;

    // Split the text by main section headers (e.g., "**1. MOUNTAIN OVERVIEW**")
    const sections = info.split(/(\*\*\d+\.\s[A-Z\s]+\*\*)/g).filter(Boolean);

    // Group the sections (headers with their content)
    const groupedSections = [];
    for (let i = 0; i < sections.length; i += 2) {
      if (i + 1 < sections.length) {
        groupedSections.push({
          header: sections[i].replace(/\*\*/g, "").trim(),
          content: sections[i + 1],
        });
      }
    }

    return groupedSections.map((section, sectionIndex) => {
      // Process the bullet points in each section
      const bulletPoints = section.content.split(/\*\s/).filter(Boolean);

      return (
        <View key={sectionIndex} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.header}</Text>
          </View>
          <View style={styles.sectionContent}>
            {bulletPoints.map((point, pointIndex) => {
              // Extract the title (bold text) from each bullet point if it exists
              const titleMatch = point.match(/\*\*([^*]+)\*\*/);
              if (titleMatch) {
                const title = titleMatch[1];
                const content = point.replace(/\*\*([^*]+)\*\*/, "").trim();

                return (
                  <View key={pointIndex} style={styles.bulletPoint}>
                    <View style={styles.bulletDot} />
                    <View style={styles.bulletContent}>
                      <Text style={styles.bulletTitle}>{title}</Text>
                      <Text style={styles.bulletText}>{content}</Text>
                    </View>
                  </View>
                );
              } else {
                return (
                  <View key={pointIndex} style={styles.bulletPoint}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{point.trim()}</Text>
                  </View>
                );
              }
            })}
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mountain Explorer</Text>
        <Text style={styles.subtitle}>Discover Nepal's Majestic Peaks</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter mountain name (e.g., Everest)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A80F0" />
          <Text style={styles.loadingText}>
            Gathering information about {searchQuery}...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : mountainInfo ? (
        <ScrollView
          style={styles.infoContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.mountainHeader}>
            <Text style={styles.mountainName}>{mountainName}</Text>
            <View style={styles.divider} />
          </View>

          {formatMountainInfo(mountainInfo)}

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              This information is for general knowledge and should not be
              considered exhaustive. Always consult with relevant authorities
              and experienced professionals for up-to-date information and
              guidance before undertaking any mountain expedition.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Image
            source={require("../assets/images/treknepal.png")} // Make sure to add this image to your assets
            style={styles.emptyStateImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyStateTitle}>No Mountains Searched</Text>
          <Text style={styles.emptyStateText}>
            Search for any mountain in Nepal to discover its height, climbing
            routes, cultural significance, and more.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 16,
    backgroundColor: "#4A80F0",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  searchContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    borderColor: "#EEEEEE",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  searchButton: {
    flex: 2,
    backgroundColor: "#4A80F0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
    elevation: 1,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4A80F0",
    textAlign: "center",
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFEEEE",
    borderRadius: 8,
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  mountainHeader: {
    alignItems: "center",
    marginVertical: 16,
  },
  mountainName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textTransform: "uppercase",
  },
  divider: {
    height: 4,
    width: 60,
    backgroundColor: "#4A80F0",
    marginTop: 8,
    borderRadius: 2,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyStateImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    padding: 14,
    backgroundColor: "#4A80F0",
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sectionContent: {
    padding: 16,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 14,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4A80F0",
    marginTop: 8,
    marginRight: 10,
  },
  bulletContent: {
    flex: 1,
  },
  bulletTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  bulletText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    flex: 1,
  },
  disclaimerContainer: {
    marginTop: 10,
    marginBottom: 30,
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  disclaimerText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});

export default MountainSearchScreen;
