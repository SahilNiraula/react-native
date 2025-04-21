"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import colors from "../theme/color";

interface ItineraryModalProps {
  visible: boolean;
  itinerary: string;
  onClose: () => void;
}

const ItineraryModal: React.FC<ItineraryModalProps> = ({
  visible,
  itinerary,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Parsing the itinerary content with improved section detection
  const parseItinerary = (content: string) => {
    const sections: Record<string, string[]> = {
      overview: [],
      budget: [],
      dailyPlan: [],
      considerations: [],
    };

    // Split content into lines
    const lines = content.split("\n");

    // Define section markers with regex patterns for more robust detection
    const sectionMarkers = [
      {
        section: "overview",
        pattern: /^##\s*15-Day|^1\.\s*REGIONAL\s*OVERVIEW|REGIONAL\s*OVERVIEW/,
      },
      {
        section: "budget",
        pattern: /BUDGET\s*BREAKDOWN|^2\.\s*COMPLETE\s*BUDGET/,
      },
      {
        section: "dailyPlan",
        pattern: /DAY-BY-DAY\s*ITINERARY|^3\.\s*DETAILED\s*DAY/,
      },
      {
        section: "considerations",
        pattern:
          /IMPORTANT\s*CONSIDERATIONS|Health\s*&\s*Safety|Permits\s*&\s*Documentation/,
      },
    ];

    let currentSection = "overview";

    // Process each line and determine the section it belongs to
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) continue;

      // Check if this line starts a new section
      for (const marker of sectionMarkers) {
        if (marker.pattern.test(line)) {
          currentSection = marker.section;
          break;
        }
      }

      // Special handling for daily plan - detect day entries
      if (/^Day\s+\d+:/.test(line)) {
        currentSection = "dailyPlan";
      }

      // Clean the line (remove markdown formatting)
      const cleanedLine = line
        .replace(/^\*+/g, "") // Remove leading asterisks
        .replace(/\*\*/g, "") // Remove double asterisks
        .replace(/^\s*[\*\-]\s*/, "") // Remove bullet points
        .trim();

      if (cleanedLine) {
        sections[currentSection].push(cleanedLine);
      }
    }

    return sections;
  };

  // Parse the itinerary
  const sections = parseItinerary(itinerary);

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.overviewContainer}>
        <Text style={styles.sectionTitle}>
          {sections.overview[0]?.replace(/^##\s*/, "").trim() ||
            "Trek Overview"}
        </Text>
        {sections.overview.slice(1).map((line, index) => (
          <Text key={index} style={styles.paragraph}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );

  const renderBudgetTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.budgetContainer}>
        <Text style={styles.budgetTitle}>Budget Breakdown</Text>
        {sections.budget.map((line, index) => {
          if (line.includes("Total Estimated Cost")) {
            return (
              <Text key={index} style={styles.totalCost}>
                {line}
              </Text>
            );
          }

          // Match both "Item: $100" and "Item (explanation): $100" formats
          const parts = line.split(/:\s*(?=\$|\d)/);
          if (parts.length === 2) {
            return (
              <View key={index} style={styles.budgetItem}>
                <Text style={styles.budgetCategory}>{parts[0].trim()}</Text>
                <Text style={styles.budgetAmount}>{parts[1].trim()}</Text>
              </View>
            );
          }
          return (
            <Text key={index} style={styles.budgetText}>
              {line}
            </Text>
          );
        })}
      </View>
    </View>
  );

  const renderDailyPlanTab = () => {
    // Improved parsing of daily plan items
    const dailyPlans: { title: string; content: string; items: string[] }[] =
      [];
    let currentDay: { title: string; content: string; items: string[] } | null =
      null;

    for (const line of sections.dailyPlan) {
      // Check if this line is a day header
      const dayMatch = line.match(/^(Day\s+\d+:)(.+)/);

      if (dayMatch) {
        // If we already have a day object, push it to the array before creating a new one
        if (currentDay) {
          dailyPlans.push(currentDay);
        }

        // Create a new day object
        currentDay = {
          title: dayMatch[1].trim(),
          content: dayMatch[2].trim(),
          items: [],
        };
      }
      // If not a day header and we have a current day, add as an item
      else if (currentDay && line.trim()) {
        // Skip section headers and other non-item content
        if (
          !line.includes("DAY-BY-DAY") &&
          !line.includes("DETAILED DAY") &&
          !line.includes("(Note:")
        ) {
          currentDay.items.push(line);
        }
      }
    }

    // Add the last day
    if (currentDay) {
      dailyPlans.push(currentDay);
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.dailyPlanContainer}>
          {dailyPlans.map((day, index) => (
            <View key={index} style={styles.dayCard}>
              <Text style={styles.dayTitle}>{day.title}</Text>
              <Text style={styles.dayContent}>{day.content}</Text>
              {day.items.length > 0 && (
                <View style={styles.dayItems}>
                  {day.items.map((item, idx) => (
                    <View key={idx} style={styles.dayItemRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.dayItem}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderConsiderationsTab = () => {
    // Filter out lines that might belong to other sections
    const considerationItems = sections.considerations.filter(
      (line) =>
        !line.includes("Day") &&
        !line.includes("Remember:") &&
        !line.includes("Total Estimated")
    );

    return (
      <View style={styles.tabContent}>
        <View style={styles.considerationsContainer}>
          <Text style={styles.considerationsTitle}>
            Important Considerations
          </Text>
          {considerationItems.map((line, index) => (
            <View key={index} style={styles.considerationItem}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.considerationText}>{line}</Text>
            </View>
          ))}
          <Text style={styles.footerNote}>
            This itinerary provides a framework. Adjust it based on your fitness
            level, weather conditions, and personal preferences. Remember to
            prioritize safety and enjoy the incredible beauty of the region!
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Trek Itinerary</Text>
              <View style={styles.modalDivider} />
            </View>

            <View style={styles.tabsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScrollContent}
              >
                {["overview", "budget", "dailyPlan", "considerations"].map(
                  (tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        styles.tab,
                        activeTab === tab && styles.activeTab,
                      ]}
                      onPress={() => setActiveTab(tab)}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === tab && styles.activeTabText,
                        ]}
                      >
                        {tab === "dailyPlan"
                          ? "Daily Plan"
                          : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>

            <ScrollView
              style={styles.contentScrollView}
              showsVerticalScrollIndicator={false}
            >
              {activeTab === "overview" && renderOverviewTab()}
              {activeTab === "budget" && renderBudgetTab()}
              {activeTab === "dailyPlan" && renderDailyPlanTab()}
              {activeTab === "considerations" && renderConsiderationsTab()}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>Save Itinerary</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: width * 0.9, // Fixed width (90% of screen width)
    height: height * 0.8, // Fixed height (80% of screen height)
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    padding: 16,
    backgroundColor: colors.mountain_blue,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  modalDivider: {
    height: 3,
    backgroundColor: colors.sunrise_orange,
    width: 60,
    alignSelf: "center",
    marginTop: 8,
    borderRadius: 10,
  },
  tabsContainer: {
    backgroundColor: "#f7f9fc",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    height: 48, // Fixed height for tabs
  },
  tabsScrollContent: {
    paddingHorizontal: 10,
    height: 48,
    alignItems: "center",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    height: 48,
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.mountain_blue,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: colors.mountain_blue,
    fontWeight: "bold",
  },
  contentScrollView: {
    flex: 1, // Takes remaining space between tabs and buttons
  },
  tabContent: {
    padding: 16,
  },
  // Overview Tab Styles
  overviewContainer: {
    backgroundColor: "#e6f2ff",
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.mountain_blue,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mountain_blue,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  // Budget Tab Styles
  budgetContainer: {
    backgroundColor: "#e6f7e6",
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2e7d32",
    marginBottom: 8,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  budgetItems: {
    marginTop: 8,
  },
  budgetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  budgetCategory: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    letterSpacing: 0.2,
  },
  budgetAmount: {
    fontSize: 15,
    color: "#2e7d32",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  budgetText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  totalCostContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#c8e6c9",
    backgroundColor: "rgba(46, 125, 50, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
  totalCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#c8e6c9",
    letterSpacing: 0.3,
  },
  // Daily Plan Tab Styles
  dailyPlanContainer: {
    gap: 12,
  },
  dayCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.mountain_blue,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  dayContent: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  dayItems: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 10,
    borderRadius: 8,
  },
  dayItemRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletPoint: {
    fontSize: 15,
    color: colors.mountain_blue,
    marginRight: 8,
    marginTop: 2,
  },
  dayItem: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  // Considerations Tab Styles
  considerationsContainer: {
    backgroundColor: "#fff8e1",
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff8f00",
    marginBottom: 8,
  },
  considerationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff8f00",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  considerationItems: {
    marginTop: 8,
  },
  considerationItem: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 143, 0, 0.2)",
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  considerationText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  footerNote: {
    marginTop: 16,
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 12,
    borderRadius: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    height: 80,
  },
  closeButton: {
    flex: 1,
    backgroundColor: colors.sunrise_orange,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
    justifyContent: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.mountain_blue,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default ItineraryModal;
