// src/screens/WeatherScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  weatherAPI,
  WeatherForecast,
  DailyForecast,
} from "../service/weatherAPI";

const { width } = Dimensions.get("window");

interface WeatherScreenProps {
  // Add any required props here
}

// Get appropriate background colors based on weather condition
const getBackgroundColors = (
  weatherMain: string,
  isNight: boolean
): string[] => {
  if (isNight) {
    return ["#1f2937", "#111827", "#030712"];
  }

  switch (weatherMain.toLowerCase()) {
    case "clear":
      return ["#60a5fa", "#3b82f6", "#2563eb"];
    case "clouds":
      return ["#9ca3af", "#6b7280", "#4b5563"];
    case "rain":
    case "drizzle":
      return ["#6b7280", "#4b5563", "#374151"];
    case "thunderstorm":
      return ["#4b5563", "#374151", "#1f2937"];
    case "snow":
      return ["#e5e7eb", "#d1d5db", "#9ca3af"];
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
      return ["#9ca3af", "#6b7280", "#4b5563"];
    default:
      return ["#60a5fa", "#3b82f6", "#2563eb"];
  }
};

// Format date from unix timestamp
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

// Weather icon component
const WeatherIcon = ({ iconCode }: { iconCode: string }) => {
  const iconUrl = weatherAPI.getWeatherIconUrl(iconCode);
  return (
    <Image
      source={{ uri: iconUrl }}
      style={styles.weatherIcon}
      resizeMode="contain"
    />
  );
};

// Weather card component for daily forecast
const ForecastCard = ({ forecast }: { forecast: DailyForecast }) => {
  return (
    <View style={styles.forecastCard}>
      <Text style={styles.forecastDay}>{formatDate(forecast.dt)}</Text>
      <WeatherIcon iconCode={forecast.weather[0].icon} />
      <Text style={styles.forecastTemp}>
        {Math.round(forecast.temp.max)}°/{Math.round(forecast.temp.min)}°
      </Text>
      <Text style={styles.forecastDesc}>{forecast.weather[0].description}</Text>
      <View style={styles.forecastDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons
            name="water-percent"
            size={16}
            color="#e5e7eb"
          />
          <Text style={styles.detailText}>{forecast.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons
            name="weather-windy"
            size={16}
            color="#e5e7eb"
          />
          <Text style={styles.detailText}>
            {Math.round(forecast.wind_speed)} m/s
          </Text>
        </View>
      </View>
    </View>
  );
};

const WeatherScreen: React.FC<WeatherScreenProps> = () => {
  const [city, setCity] = useState<string>("");
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get current weather condition for background
  const currentWeather = forecast?.list[0]?.weather[0]?.main || "Clear";
  const isNight = forecast?.list[0]?.weather[0]?.icon?.includes("n") || false;
  const bgColors = getBackgroundColors(currentWeather, isNight);

  const searchWeather = async () => {
    if (!city.trim()) {
      Alert.alert("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await weatherAPI.getDailyForecastByCity(city);
      setForecast(result);
      Keyboard.dismiss();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Weather search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate background image based on weather condition
  const getBackgroundImage = (weatherMain: string, isNight: boolean): any => {
    if (isNight) {
      return require("../assets/backgrounds/night.jpg");
    }

    switch (weatherMain.toLowerCase()) {
      case "clear":
        return require("../assets/backgrounds/clear.jpg");
      case "clouds":
        return require("../assets/backgrounds/cloudy.jpg");
      case "rain":
      case "drizzle":
        return require("../assets/backgrounds/rainy.jpg");
      case "thunderstorm":
        return require("../assets/backgrounds/storm.jpg");
      case "snow":
        return require("../assets/backgrounds/snow.jpg");
      case "mist":
      case "smoke":
      case "haze":
      case "dust":
      case "fog":
        return require("../assets/backgrounds/foggy.jpg");
      default:
        return require("../assets/backgrounds/default.jpg");
    }
  };

  const backgroundImage = forecast
    ? getBackgroundImage(currentWeather, isNight)
    : require("../assets/backgrounds/default.jpg");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <SafeAreaView style={styles.safeArea}>
              <StatusBar barStyle="light-content" />

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.contentContainer}
              >
                <ScrollView
                  contentContainerStyle={styles.scrollContentContainer}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {/* Search Bar */}
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Enter city name"
                      placeholderTextColor="#9ca3af"
                      value={city}
                      onChangeText={setCity}
                      onSubmitEditing={searchWeather}
                    />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={searchWeather}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <Ionicons name="search" size={22} color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Error Message */}
                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  {/* Weather Content */}
                  {forecast && (
                    <View style={styles.weatherContainer}>
                      {/* City Header */}
                      <View style={styles.cityHeader}>
                        <Text style={styles.cityName}>
                          {forecast.city.name}, {forecast.city.country}
                        </Text>
                        <Text style={styles.currentDate}>
                          {formatDate(forecast.list[0].dt)}
                        </Text>
                      </View>

                      {/* Current Weather */}
                      <View style={styles.currentWeather}>
                        <WeatherIcon
                          iconCode={forecast.list[0].weather[0].icon}
                        />
                        <Text style={styles.currentTemp}>
                          {Math.round(forecast.list[0].temp.day)}°C
                        </Text>
                        <Text style={styles.weatherDescription}>
                          {forecast.list[0].weather[0].description}
                        </Text>

                        {/* Weather Details */}
                        <View style={styles.weatherDetails}>
                          <View style={styles.weatherDetail}>
                            <MaterialCommunityIcons
                              name="thermometer"
                              size={22}
                              color="#e5e7eb"
                            />
                            <View>
                              <Text style={styles.detailLabel}>Feels like</Text>
                              <Text style={styles.detailValue}>
                                {Math.round(forecast.list[0].temp.day)}°C
                              </Text>
                            </View>
                          </View>

                          <View style={styles.weatherDetail}>
                            <MaterialCommunityIcons
                              name="water-percent"
                              size={22}
                              color="#e5e7eb"
                            />
                            <View>
                              <Text style={styles.detailLabel}>Humidity</Text>
                              <Text style={styles.detailValue}>
                                {forecast.list[0].humidity}%
                              </Text>
                            </View>
                          </View>

                          <View style={styles.weatherDetail}>
                            <MaterialCommunityIcons
                              name="weather-windy"
                              size={22}
                              color="#e5e7eb"
                            />
                            <View>
                              <Text style={styles.detailLabel}>Wind</Text>
                              <Text style={styles.detailValue}>
                                {Math.round(forecast.list[0].wind_speed)} m/s
                              </Text>
                            </View>
                          </View>

                          <View style={styles.weatherDetail}>
                            <MaterialCommunityIcons
                              name="cloud-print"
                              size={22}
                              color="#e5e7eb"
                            />
                            <View>
                              <Text style={styles.detailLabel}>Clouds</Text>
                              <Text style={styles.detailValue}>
                                {forecast.list[0].clouds}%
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* 7-day Forecast */}
                      <View style={styles.forecastSection}>
                        <Text style={styles.forecastTitle}>7-Day Forecast</Text>
                        <FlatList
                          data={forecast.list.slice(0, 7)}
                          keyExtractor={(item) => item.dt.toString()}
                          renderItem={({ item }) => (
                            <ForecastCard forecast={item} />
                          )}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.forecastList}
                        />
                      </View>
                    </View>
                  )}
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#ffffff",
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.8)",
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  weatherContainer: {
    flex: 1,
  },
  cityHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  currentDate: {
    fontSize: 16,
    color: "#e5e7eb",
    marginTop: 4,
  },
  currentWeather: {
    alignItems: "center",
    marginBottom: 30,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  currentTemp: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#ffffff",
    marginVertical: 10,
  },
  weatherDescription: {
    fontSize: 18,
    color: "#e5e7eb",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  weatherDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 16,
  },
  weatherDetail: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLabel: {
    color: "#d1d5db",
    fontSize: 14,
    marginLeft: 10,
  },
  detailValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },

  scrollContentContainer: {
    paddingBottom: 30,
  },

  forecastSection: {
    marginTop: 10,
    overflowY: "Auto",
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  forecastList: {
    paddingVertical: 8,
  },
  forecastCard: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginRight: 12,
    width: width * 0.3,
  },
  forecastDay: {
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 14,
  },
  forecastTemp: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 4,
  },
  forecastDesc: {
    color: "#e5e7eb",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    textTransform: "capitalize",
  },
  forecastDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    color: "#e5e7eb",
    fontSize: 12,
    marginLeft: 4,
  },
});

export default WeatherScreen;
