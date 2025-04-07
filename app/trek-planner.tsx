"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { generateItinerary } from "../service/geminiService";
import colors from "../theme/color";
import ItineraryModal from "./ItineryModal";
import { LinearGradient } from "expo-linear-gradient";

const TrekPlanner: React.FC = () => {
  const [trekRegion, setTrekRegion] = useState<string>("Annapurna Circuit");
  const [duration, setDuration] = useState<number>(10);
  const [fitnessLevel, setFitnessLevel] = useState<string>("Beginner");
  const [budget, setBudget] = useState<string>("Budget ($500-1000)");
  const [specialReq, setSpecialReq] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [open, setOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateItinerary(
        trekRegion,
        duration,
        fitnessLevel,
        budget,
        specialReq
      );
      setItinerary(result);
      setModalVisible(true);
    } catch (error) {
      console.error("Error in handleGenerate:", error);
      setItinerary("Failed to generate itinerary. Please try again later.");
      setModalVisible(true);
    } finally {
      setLoading(false);
      setTrekRegion("Annapurna Circuit");
      setDuration(10);
      setFitnessLevel("Beginner");
      setBudget("Budget ($500-1000)");
      setSpecialReq("");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={colors.mountain_blue}
        barStyle="light-content"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LinearGradient
          colors={[colors.mountain_blue, "#1A4A6E"]}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/treknepal.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>AI Trek Planner</Text>
          <Text style={styles.subtitle}>
            Your personalized mountain adventure awaits
          </Text>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Trekking Region</Text>
              <View style={styles.pickerContainer}>
                <DropDownPicker
                  open={open}
                  setOpen={setOpen}
                  items={[
                    { label: "Annapurna Circuit", value: "Annapurna Circuit" },
                    { label: "Everest Base Camp", value: "Everest Base Camp" },
                    {
                      label: "Langtang Valley Trek",
                      value: "Langtang Valley Trek",
                    },
                    { label: "Manaslu Circuit", value: "Manaslu Circuit" },
                    {
                      label: "Upper Mustang Trek",
                      value: "Upper Mustang Trek",
                    },
                  ]}
                  value={trekRegion}
                  setValue={setTrekRegion}
                  style={styles.picker}
                  dropDownContainerStyle={{
                    borderWidth: 1,
                    borderColor: "#E0E6ED",
                  }}
                  placeholder="Select Trekking Region"
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>
            </View>

            {/* Duration */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration (days)</Text>
              <View style={styles.durationContainer}>
                <TouchableOpacity
                  style={styles.durationButton}
                  onPress={() => setDuration(Math.max(1, duration - 1))}
                >
                  <Text style={styles.durationButtonText}>−</Text>
                </TouchableOpacity>
                <TextInput
                  keyboardType="numeric"
                  value={String(duration)}
                  onChangeText={(text) => {
                    const num = Number.parseInt(text);
                    if (!isNaN(num) && num > 0) {
                      setDuration(num);
                    } else if (text === "") {
                      setDuration(0);
                    }
                  }}
                  style={styles.durationInput}
                  placeholderTextColor={colors.dark + "80"}
                />
                <TouchableOpacity
                  style={styles.durationButton}
                  onPress={() => setDuration(duration + 1)}
                >
                  <Text style={styles.durationButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Fitness Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fitness Level</Text>
              <View style={styles.optionsContainer}>
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.optionButton,
                      fitnessLevel === level && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFitnessLevel(level)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        fitnessLevel === level && styles.optionTextSelected,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Budget */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Budget Range</Text>
              <View style={styles.optionsContainer}>
                {[
                  { label: "Budget", value: "Budget ($500-1000)" },
                  { label: "Mid-range", value: "Mid-range ($1000-2000)" },
                  { label: "Luxury", value: "Luxury ($2000+)" },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.optionButton,
                      budget === item.value && styles.optionButtonSelected,
                    ]}
                    onPress={() => setBudget(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        budget === item.value && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Special Requirements */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Special Requirements</Text>
              <TextInput
                placeholder="Any special needs or preferences..."
                placeholderTextColor={colors.dark + "60"}
                value={specialReq}
                onChangeText={setSpecialReq}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleGenerate}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <LinearGradient
                  colors={[colors.evergreen, "#1B6B3C"]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Generate Itinerary</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            {/* Loading Message */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.mountain_blue} size="small" />
                <Text style={styles.loadingText}>
                  Creating your personalized trek plan...
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Modal for Displaying Itinerary */}
        <ItineraryModal
          visible={modalVisible}
          itinerary={itinerary}
          onClose={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.mountain_blue,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB", // Lighter, more modern background
  },
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.white,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: colors.white,
    opacity: 0.9,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.dark,
    paddingLeft: 2,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E0E6ED",
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.white,
    color: colors.dark,
    fontSize: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  pickerContainer: {
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    overflow: "visible",
    zIndex: 3000,
  },
  picker: {
    borderWidth: 1.5,
    borderColor: "#E0E6ED",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#E0E6ED",
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    overflow: "hidden",
  },
  durationButton: {
    width: 50,
    height: 50,
    backgroundColor: "#F7F9FB",
    justifyContent: "center",
    alignItems: "center",
  },
  durationButtonText: {
    fontSize: 28,
    fontWeight: "300",
    color: colors.mountain_blue,
  },
  durationInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: colors.dark,
    fontWeight: "500",
    height: 50,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E0E6ED",
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  optionButtonSelected: {
    borderColor: colors.mountain_blue,
    backgroundColor: colors.mountain_blue + "10",
  },
  optionText: {
    fontSize: 14,
    color: colors.dark,
  },
  optionTextSelected: {
    color: colors.mountain_blue,
    fontWeight: "600",
  },
  button: {
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    overflow: "hidden",
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonGradient: {
    width: "100%",
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: colors.mountain_blue,
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default TrekPlanner;
