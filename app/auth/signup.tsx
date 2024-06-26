import { DCButton } from "@/components/DCButton";
import { DCText } from "@/components/DCText";
import {
  horizontalScale,
  NunitoSans10ptBold,
  NunitoSansMedium,
  verticalScale,
} from "@/styles";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function signUpScreen() {
  const [firstName, setFirstName] = useState<String>("");
  const [lastName, setLastName] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [imageUri, setImageUri] = useState<String>("");
  const [loading, setLoading] = useState<Boolean>(false);

  const onSignUp = () => {
    const createUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email_id: email,
            password: password,
            phone_number: phoneNumber,
          },
        ])
        .select();
      if (error) {
        Alert.alert("Error happened");
      }

      Alert.alert("Account created Successfully !");
      // console.log(data, "Data");
    };
    createUser();
    router.push("/auth/login");
  };

  async function signUpWithEmail() {
    setLoading(true);
    if (phoneNumber && phoneNumber.length !== 10) {
      Alert.alert(
        "Invalid phone number",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          isAdmin: false,
          phoneNumber: phoneNumber,
        },
      },
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");

    router.push("/auth/login");
    setLoading(false);
  }

  return (
    <SafeAreaView
      style={{
        paddingVertical: verticalScale(20),
        paddingHorizontal: horizontalScale(15),
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <KeyboardAwareScrollView style={styles.container}>
        <View>
          <View style={styles.fieldInputs}>
            <DCText
              textStyle={{ fontSize: 16, fontFamily: NunitoSans10ptBold }}
            >
              First Name
            </DCText>
            <TextInput
              style={styles.textInput}
              value={firstName}
              onChangeText={(e) => setFirstName(e)}
              placeholder="Enter your first name"
            />
          </View>
          <View style={styles.fieldInputs}>
            <DCText
              textStyle={{ fontSize: 16, fontFamily: NunitoSans10ptBold }}
            >
              Last Name
            </DCText>
            <TextInput
              style={styles.textInput}
              value={lastName}
              onChangeText={(e) => setLastName(e)}
              placeholder="Enter your last name"
            />
          </View>
          <View style={styles.fieldInputs}>
            <DCText
              textStyle={{ fontSize: 16, fontFamily: NunitoSans10ptBold }}
            >
              Email ID
            </DCText>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(e) => setEmail(e)}
              placeholder="Enter your email ID"
            />
          </View>
          <View style={styles.fieldInputs}>
            <DCText
              textStyle={{ fontSize: 16, fontFamily: NunitoSans10ptBold }}
            >
              Password
            </DCText>
            <TextInput
              style={styles.textInput}
              value={password}
              secureTextEntry={true}
              onChangeText={(e) => setPassword(e)}
              placeholder="Enter your password"
            />
          </View>
          <View style={styles.fieldInputs}>
            <DCText
              textStyle={{ fontSize: 16, fontFamily: NunitoSans10ptBold }}
            >
              Phone Number
            </DCText>
            <TextInput
              style={styles.textInput}
              value={phoneNumber}
              keyboardType="numeric"
              onChangeText={(e) => setPhoneNumber(e)}
              placeholder="Enter your phone number"
              returnKeyLabel="Done"
              returnKeyType="done"
            />
          </View>
          {/*<View style={styles.fieldInputs}>
            <DCText
              textStyle={{ fontSize: 16, fontFamily: NunitoSans10ptBold }}
            >
              Profile Photo
            </DCText>
            <TextInput
              style={styles.textInput}
              value={imageUri}
              onChangeText={(e) => setImageUri(e)}
              placeholder="Upload your profile picture"
            />
          </View>*/}
        </View>
        <DCButton
          title="Sign Up"
          onPress={() => signUpWithEmail()}
          buttonStyle={{
            backgroundColor: "green",
            borderRadius: 100,
            padding: 10,
            margin: 10,
          }}
          textStyle={{
            textAlign: "center",
            color: "white",
            fontSize: 16,
            fontFamily: NunitoSans10ptBold,
          }}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  fieldInputs: {
    flexDirection: "column",
    marginHorizontal: 15,
    marginTop: 25,
  },
  textInput: {
    fontFamily: NunitoSansMedium,
    height: verticalScale(40),
    backgroundColor: "#F0F0F0",
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 4,
    marginVertical: verticalScale(3),
    fontSize: 14,
  },
});
