import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet, Alert } from "react-native";
import { SimpleAnimation } from "react-native-simple-animations";
import { ScrollView } from "react-native-gesture-handler";

import {
  Card,
  ListItem,
  Button,
  // Icon,
  Overlay,
  Divider,
  Avatar,
  Input
} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { QRCode } from "react-native-custom-qr-codes-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

// You can then use your `FadeInView` in place of a `View` in your components:
export default ({ navigation }) => {
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [idnum, setIDnum] = useState("");
  const [placeofbirth, setPlaceOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [residence, setResidence] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [visible, setVisible] = useState(false);
  const [hash, setHash] = useState("");
  const [hasData, setHasData] = useState(false);
  const [ins_Status, setInsStatus] = useState(0);
  const [in_CNIC, setIN_CNIC] = useState("");
  const [in_ID, setInID] = useState("");
  var profile = {
    FirstName: fname,
    LastName: sname,
    Email: email,
    DateOfBirth: dob,
    GovernmentID: idnum,
    PlaceOfBirth: placeofbirth,
    Nationality: nationality,
    CountryOfResidence: residence,
    ResidentialAddress: address,
    ContactNumber: phone,
  };

  useEffect(() => {
    (async () => {
      try {
        await fetch("https://itrace-middleware.herokuapp.com/");
        setEmail(await AsyncStorage.getItem("email"));
        setFname(await AsyncStorage.getItem("fname"));
        setSname(await AsyncStorage.getItem("lname"));
        setDOB(await AsyncStorage.getItem("dob"));
        setPlaceOfBirth(await AsyncStorage.getItem("birth"));
        setNationality(await AsyncStorage.getItem("nationality"));
        setResidence(await AsyncStorage.getItem("residence"));
        setAddress(await AsyncStorage.getItem("address"));
        setIDnum(await AsyncStorage.getItem("id"));
        setPhone(await AsyncStorage.getItem("phone"));

        if ((await AsyncStorage.getItem("id")) != null) setHasData(true);
        console.log("Hash = ", idnum);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      // setProcessing(true);
      setInsStatus(0);
      var seed = await fetch(`https://itrace-middleware.herokuapp.com/getAddressAdmin/${in_CNIC}`);
      seed = await seed.json();
      console.log("Seed Res = ", seed);
      if (seed != false){
        var res = await fetch(`https://itrace-middleware.herokuapp.com/addInsurance/${seed[0]}&${in_ID}`);
        res = await res.json();
      console.log("Ins Res = ", res);
        if (res == true){
          setInsStatus(1);
        }
        else{
          setInsStatus(2);
        }
      }
      // setProcessing(false);
    } catch (e) {
      // setProcessing(false);
      console.log(e);
    }
  };
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  // let [fontsLoaded] = useFonts({
  //   Varela: require("./../assets/fonts/VarelaRound-Regular.ttf"),
  //   Nunito: require("./../assets/fonts/Nunito-Black.ttf"),
  // });

  {
    return (

      <View style={styles.container}>
        <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        <View style={{ zIndex: 1 }}>
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <QRCode content={JSON.stringify(profile)} />
          </Overlay>

          <Text
            style={[
              styles.text,
              {
                fontSize: 30,
                fontWeight: "400",
                color: "#2893C1",
                marginBottom: 20,
              },
            ]}
          >
            Welcome
          </Text>

          <Text
            style={[
              styles.text,
              { fontSize: 50, fontWeight: "500", marginBottom: 30 },
            ]}
          >
            iTrace PoC
          </Text>

          <Text style={[styles.text, { fontSize: 20, fontWeight: "400" }]}>
            For Patients
          </Text>

          <View style={styles.btnContainer}>
            <Button
              icon={
                <Icon
                  name="sign-in-alt"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={styles.button}
              title="Login"
              titleStyle={styles.btnText}
              onPress={() => navigation.navigate("Login")}
            ></Button>

            <Button
              icon={
                <Icon
                  name="user-plus"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={styles.button}
              title="Sign Up"
              titleStyle={styles.btnText}
              onPress={() => navigation.navigate("SignUp")}
            ></Button>

            {/* <Button
              buttonStyle={[styles.button, { width: 50 }]}
              title="QR"
              titleStyle={{ fontFamily: "MetropolisBold" }}
              onPress={toggleOverlay}
              disabled={!hasData}
            ></Button> */}
          </View>
          <Divider style={styles.mainDivider} />
          <Text
            style={[
              styles.text,
              { fontSize: 20, fontWeight: "400", marginTop: 20 },
            ]}
          >
            For Government
          </Text>
          <View style={styles.btnContainer}>
            <Button
              icon={
                <Icon
                  name="qrcode"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={[styles.button, {}]}
              title="Scan QR"
              titleStyle={styles.btnText}
              onPress={() => navigation.navigate("Scan")}
            ></Button>
            <Button
              icon={
                <Icon
                  name="plus-circle"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={[styles.button, {}]}
              title="Add Record"
              titleStyle={styles.btnText}
              onPress={() => navigation.navigate("AddRecord")}
            ></Button>
          </View>

          <Divider style={styles.mainDivider} />
          <Text
            style={[
              styles.text,
              { fontSize: 20, fontWeight: "400", marginTop: 20 },
            ]}
          >
            For Insurance
          </Text>
          <View style={styles.container}>
            <Input
              style={styles.input}
              label="CNIC of Patinet"
              onChangeText={(value) => setIN_CNIC(value)}
            />

            <Input
              style={styles.input}
              label="Insurance Company ID"
              onChangeText={(value) => setInID(value)}
            />
            <Text
            style={[
              styles.text,
              { fontSize: 20, fontWeight: "400", marginTop: 20 },
            ]}
          >
            {(ins_Status == 1) ? "Insurance Added":""}
            {(ins_Status == 2) ? "Insurance Already Provided":""}

          </Text>
            <Button
              icon={
                <Icon
                  name="plus-circle"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={[styles.button, {width:250}]}
              title="Add Insurance"
              // titleStyle={styles.btnText}
              onPress={async() => await handleSubmit()}
            ></Button>

          </View>
        </View>
        </ScrollView>
      </View>

    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    paddingTop: 50,
    paddingBottom:20,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: "#273157",
    zIndex: 2,
  },

  button: {
    backgroundColor: "#196F3D",
    color: "white",
    width: 150,
    height: 40,
    margin: 5,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "#52BE80",
  },
  btnText: {
    position: "absolute",
    left: 20,
  },
  text: {
    // fontFamily: "Varela",
    color: "#F0F3F4",
    textAlign: "center",
    fontSize: 20,
  },

  image: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    zIndex: 1,
  },

  btnContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
  },
  mainDivider: {
    backgroundColor: "gray",
    marginVertical: 10,
    height: 2,
    width: 300,
    alignSelf: "center",
  },
});
