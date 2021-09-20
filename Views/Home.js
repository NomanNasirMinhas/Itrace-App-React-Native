import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet } from "react-native";
import {
  Card,
  ListItem,
  Button,
  // Icon,
  Tile,
  Overlay,
  Avatar,
  Divider,
} from "react-native-elements";
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { sha256 } from "react-native-sha256";
import Icon from "react-native-vector-icons/FontAwesome5";
// import RNLocation from 'react-native-location';
import * as Location from 'expo-location';

export default ({ navigation }) => {
  const [seed, setSeed] = useState("");
  const [seedInfo, setSeedInfo] = useState("");
  const [iAddress, setIAddress] = useState("");
  const [location, setLocation] = useState([0,0]);
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [idnum, setIDnum] = useState("");
  // const [placeofbirth, setPlaceOfBirth] = useState("");
  // const [nationality, setNationality] = useState("");
  // const [residence, setResidence] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [visible, setVisible] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [hash, setHash] = useState("");
  const [vaccinated, setVaccinated] = useState(0);
  const [vaccineResults, setVaccineResult] = useState([]);
  const [testResults, setTestResult] = useState([]);
  const [lastResult, setLastResult] = useState(false);
  const [tested, setTested] = useState(0);
  const [vaccHash, setVaccHash] = useState([])
  const [TestHash, setTestHash] = useState([])
  const [nearby_pos, setNearbyPos] = useState(false);
//   RNLocation.configure({
//     distanceFilter: 1.0, // Meters
//     desiredAccuracy: {
//       ios: "best",
//       android: "highAccuracy"
//     },
// })

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  // var profile = {
  //   Seed: seed,
  //   FirstName: fname,
  //   LastName: sname,
  //   Email: email,
  //   DateOfBirth: dob,
  //   GovernmentID: idnum,
  //   ResidentialAddress: address,
  //   ContactNumber: phone,
  // };

  var profile = {
    address: iAddress
  }
  useEffect(() => {
    (async () => {
      try {

        let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }


        var local_seed = await AsyncStorage.getItem("seed");
        var local_info = await AsyncStorage.getItem("seedInfo");
        var iadd = await AsyncStorage.getItem("address");
        setSeed(local_seed);
        setSeedInfo(local_info);
        setIAddress(iadd);
        var obj_info = JSON.parse(local_info);
        console.log("Local Info = ", obj_info);
        setEmail(obj_info.Profile.email);
        setFname(obj_info.Profile.fname);
        setSname(obj_info.Profile.sname);
        setDOB(obj_info.Profile.dob);
        // setPlaceOfBirth(await AsyncStorage.getItem("birth"));
        // setNationality(await AsyncStorage.getItem("nationality"));
        // setResidence(await AsyncStorage.getItem("residence"));
        setAddress(obj_info.Profile.address);
        setIDnum(obj_info.Profile.idnum);
        setPhone(obj_info.Profile.phone);

        console.log("Patient Address = ", iadd);
        let vaccinationArray = [];
        var vaccineResult = await fetch(`https://itrace-middleware.herokuapp.com/getAllHash/${iadd}&0&VACCINATION`);
        vaccineResult = await vaccineResult.json();
        console.log("Vaccination Result =", vaccineResult);

        if (vaccineResult != false) {

          for (var i = 0; i < vaccineResult.length; i++) {
            var responseTx = await fetch(`https://itrace-middleware.herokuapp.com/getTx/${vaccineResult[i].toString()}`);
            var resObjTx = await responseTx.json();
            if (resObjTx.response !== false) {
                console.log(resObjTx.response)
                vaccinationArray.push(resObjTx.response)
            }
        }
          setVaccHash(vaccineResult)
          setVaccinated(1);
          setVaccineResult(vaccinationArray);
        } else {
          setVaccinated(2);
        }
        var testArray = [];
        var testResult = await fetch(
          `https://itrace-middleware.herokuapp.com/getAllHash/${iadd}&0&COVIDTEST`
        );
        testResult = await testResult.json();
        console.log("Tests Result =", testResult);

        if (testResult != false) {
          for (var i = 0; i < testResult.length; i++) {
            var responseTx = await fetch(`https://itrace-middleware.herokuapp.com/getTx/${testResult[i].toString()}`);
            var resObjTx = await responseTx.json();
            if (resObjTx.response !== false) {
                console.log(resObjTx.response)
                testArray.push(resObjTx.response)
            }
        }
          setTestHash(testResult);
          setTested(1);
          setTestResult(testArray);
          var last = testArray[0];
          // var status = JSON.parse(last.message);
          console.log("Status = ", last);
          setLastResult(last.result);
        } else setTested(2);
        // cons
        let loc = await Location.getCurrentPositionAsync({accuracy: Location.LocationAccuracy.BestForNavigation});
      console.log("Location = ", loc);
      let locArr = [loc.coords.longitude, loc.coords.latitude];
      setLocation(locArr);
        var addLoc = await fetch(`https://itrace-middleware.herokuapp.com/addLocation/${local_seed}&${loc.coords.longitude}&${loc.coords.latitude}`);
        var nearbyLoc = await fetch(`https://itrace-middleware.herokuapp.com/getAllLocations/${local_seed}`);
        nearbyLoc = await nearbyLoc.json();
        console.log("Nearby Location Result = ", nearbyLoc);
        if(nearbyLoc != false)
        setNearbyPos(true)

      } catch (e) {
        console.log("Error in Final Catch = ", e);
      }
    })();
  }, []);



  return (
    <View style={styles.container}>
      {/* <View style={{position:'relative', top:0, flexDirection:'row', width:'100%', marginBottom:20}}>

        <View style={{position:"absolute", right:5}}>
        <Button
      icon={
        <Icon
          name="user"
          size={20}
          color="#2E86C1"
          solid
          style={{marginLeft:5}}
        />
      }
      iconRight
        buttonStyle={{width:100, backgroundColor:'#E1E9EA', }}
        title="Profile"
        titleStyle={{color:'#2E86C1'}}
        onPress={() => setShowProfile(true)}
      ></Button>
      </View>
      </View> */}
      {/* <View style={{zIndex:1, width:'100%'}}> */}
      {/* <ScrollView horizontal={false} showsVerticalScrollIndicator={true} style={{zIndex:1, width:'100%'}}> */}

        <Text style={[styles.text, {fontSize:30}]}>Hello {fname} !</Text>
        <Text style={[styles.text, {fontSize:20, color: (tested==1)&&(!lastResult) ? "#229954":"#C0392B"}]}>You Are {(tested==1)&&(!lastResult) ? "": "NOT"} Eligible For Plasma Donation</Text>
        <Text style={[styles.text, {fontSize:20, color: (nearby_pos) ? "#C0392B":"#229954"}]}>
          {nearby_pos ? "There Might Be A COVID Patient Around Your. Wear Your Mask" : "There is No COVID Positive Around You"}
        </Text>

        <View
          style={styles.infoContainer}
        >
          <Text
            style={{
              position: "relative",
              left: 10,
              top: 10,
              marginBottom: 0,
              color:'white',
              fontWeight: "600",
            }}
          >
            VACCINATION STATUS
          </Text>
          <Divider style={styles.mainDivider} />

            <View style={{ margin: "auto", marginTop: 20 }}>
              <Icon
                name= {(vaccinated === 1 || vaccinated === 2) ? "syringe" : "spinner"}
                size={30}
                color={(vaccinated === 1) ? "#1E8449" : ((vaccinated === 2) ? "#CB4335" : "#F1C40F")}
                solid
                style={{ position: "absolute", right: 0 }}
              />
              <Text
                style={[
                  styles.text,
                  { color: (vaccinated === 1) ? "#1E8449" : ((vaccinated === 2) ? "#CB4335" : "#F1C40F"), position: "relative", textAlign:'left', left: 0,  fontWeight: "700", },
                ]}
              >
                {(vaccinated === 1) ? `Your are\nVaccinated` : ((vaccinated === 2) ? `You are\nNOT Vaccinated` : `Checking Vaccination\nStatus`)}
              </Text>
              {(vaccinated === 1) && <Text
                style={[
                  styles.text,
                  { color: "#229954", position: "relative", textAlign:'left', fontSize: 10 },
                ]}
              >
                Address = {vaccHash[0]}
              </Text>}
            </View>

         </View>

        {/* COVID TEST BOX */}

        <View
          style={styles.infoContainer}
        >
          <Text
            style={{
              position: "relative",
              left: 10,
              top: 10,
              marginBottom: 0,
              color:'white',
              fontWeight: "600",
            }}
          >
            TEST STATUS
          </Text>
          <Divider style={styles.mainDivider} />

            <View style={{ margin: "auto", marginTop: 20 }}>
              <Icon
                name={(tested === 0) ? 'spinner' : ((tested === 1) ? (lastResult ? "virus" : "virus-slash") : "times-circle")}
                size={30}
                color={(tested === 0) ? '#F1C40F' : ((tested === 1) ? (lastResult ? "#E74C3C" : "#27AE60") : "#CB4335")}
                solid
                style={{ position: "absolute", right: 0 }}
              />

              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: "700",
                    // fontSize: 20,
                    color: (tested === 0) ? '#F1C40F' : ((tested === 1) ? (lastResult ? "#E74C3C" : "#27AE60") : "#CB4335"),
                    position: "relative", textAlign:'left', left:0
                  },
                ]}
              >
                {(tested === 0) ? `Checking Your\nTest Status` : ((tested === 1) ? (lastResult ? `Positive\nCOVID Result` : `Negative\nCOVID Result`) : `Not Taken\nTest Yet`)}

              </Text>
              {(tested === 1) &&<Text
                style={[
                  styles.text,
                  { color: "#229954", position: "relative", textAlign:'left', fontSize: 10, },
                ]}
              >
                Address = {TestHash[0]}
              </Text>}

            </View>

        </View>

        <View>
          <View style={{ height: 20 }}></View>
          <View style={styles.btnContainer}>
            <Button
              title="Show My QR"
              icon={
                <Icon
                  name="qrcode"
                  size={20}
                  color="white"
                  solid
                  style={{position:'absolute', right:20}}
                />
              }
              iconRight
              onPress={toggleOverlay}
              buttonStyle={[
                styles.button,
                { marginBottom:20 },
              ]}
            />
            <Button
      icon={
        <Icon
          name="user"
          size={20}
          color="white"
          solid
          style={{position:'absolute', right:20}}
        />
      }
      iconRight
      buttonStyle={[styles.button, { marginBottom:20 }]}
        title="My Profile"
        // titleStyle={{color:'#2E86C1'}}
        onPress={() => setShowProfile(true)}
      ></Button>
      <Button
      icon={
        <Icon
          name="sign-out-alt"
          size={20}
          color="white"
          solid
          style={{position:'absolute', right:20}}
        />
      }
      iconRight
      buttonStyle={[styles.button, {backgroundColor:'#C0392B'}]}
        title="Logout"
        // titleStyle={{color:'#2E86C1'}}
        onPress={async() => {
          await AsyncStorage.clear();
          navigation.navigate("Welcome")
        }}
      ></Button>
            {/* <Button
              title="Scan QR Code"
              icon={
                <Icon
                  name="search"
                  size={20}
                  color="white"
                  solid
                  style={{position:'absolute', right:20}}
                />
              }
              iconRight
              onPress={() => navigation.navigate("Scan")}
              buttonStyle={styles.button}
            /> */}
          </View>
          <Divider style={styles.mainDivider} />

          <View style={{ height: 20 }}></View>
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <QRCode logoSize={400} value={JSON.stringify(profile)} />
          </Overlay>

          {/* <Button
              title="Authority Mode"
              icon={
                <Icon
                  name="exchange-alt"
                  size={20}
                  color="white"
                  solid
                  style={{position:'absolute', right:20}}
                />
              }
              iconRight
              onPress={() => navigation.navigate("AddRecord")}
              buttonStyle={styles.button}
            /> */}

            <Overlay isVisible={showProfile} onBackdropPress={toggleProfile} >
            <View style={styles.container, {backgroundColor: '#1F618D', padding:50}}>
            <Text style={[styles.subtext]}>Name</Text>
          <Text style={styles.text}>
            {fname} {sname}
          </Text>
          <Divider style={styles.mainDivider} />

          <Text style={styles.subtext}>Email</Text>
          <Text style={styles.text}>{email}</Text>
          <Divider style={styles.mainDivider} />

          <Text style={styles.subtext}>Date Of Birth</Text>
          <Text style={styles.text}>{dob}</Text>
          <Divider style={styles.mainDivider} />

          <Text style={styles.subtext}>Government ID</Text>
          <Text style={styles.text}>{idnum}</Text>
          <Divider style={styles.mainDivider} />

          {/* <Text style={styles.subtext}>Place Of Birth</Text>
          <Text style={styles.text}>{placeofbirth}</Text>
          <Divider style={styles.mainDivider} />

          <Text style={styles.subtext}>Nationality</Text>
          <Text style={styles.text}>{nationality}</Text>
          <Divider style={styles.mainDivider} />

          <Text style={styles.subtext}>Country of Residence</Text>
          <Text style={styles.text}>{residence}</Text>
          <Divider style={styles.mainDivider} /> */}

          <Text style={styles.subtext}>Address</Text>
          <Text style={styles.text}>{address}</Text>
          <Divider style={styles.mainDivider} />

          <Text style={styles.subtext}>Phone Number</Text>
          <Text style={styles.text}>{phone}</Text>
            </View>
          </Overlay>


          {/*  */}
        </View>

      {/* </ScrollView> */}
      {/* </View> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    alignItems: "center",
    justifyContent: "center",
    margin:'auto',
    // paddingTop: 50,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: "#273157",
  },
  btnContainer: {
    flexDirection: "column",
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2980B9",
    color: "white",
    width: 250,
    height:40,
    margin: 5,
    alignSelf:'center',
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "white",
  },
  btnText:{
    position:'absolute',
    left:20
  },
  text: {
    // fontFamily: "Varela",
    color: "#F0F3F4",
    textAlign: "center",
    fontSize: 20,
  },

  subtext: {
    // fontFamily: "Metropolis",
    color: "gray",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
  },



  image: {
    position:'absolute',
    bottom: 0,
    width: "100%",
    height: 100,
    zIndex:0
    // alignSelf: "center",
    // marginBottom: 50,
  },

  subDivider: {
    backgroundColor: "gray",
    marginVertical: 10,
    height: 2,
    width: 200,
    alignSelf: "center",
    opacity: 0.1,
  },

  mainDivider: {
    backgroundColor: "gray",
    marginTop: 10,
    height: 2,
    width: "90%",
    alignSelf: "center",
  },
  infoContainer: {
    // marginHorizontal: 0,
            borderWidth: 2,
            borderColor: "#27AE60",
            borderRadius: 20,
            marginTop:20,
            marginHorizontal:20,
            width:'90%',
            paddingHorizontal:20,
            paddingBottom:20,
            // flexDirection: "column",
  }
});
