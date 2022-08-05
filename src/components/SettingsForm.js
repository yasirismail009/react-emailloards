import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import Button from "@material-tailwind/react/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import countries from "i18n-iso-countries";
// Import the languages you want to use
import enLocale from "i18n-iso-countries/langs/en.json";
import itLocale from "i18n-iso-countries/langs/it.json";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import Papa from "papaparse";

export default function SettingsForm() {
  const fileReader = new FileReader();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [senderEmail, setsenderEmail] = useState("");
  const [senderPassword, setsenderPassword] = useState("");
  const [emailLimit, setemailLimit] = useState(500);
  const [uploadedFile, setuploadedFile] = useState();

  const selectCountryHandler = (value) => setSelectedCountry(value);

  // Have to register the languages you want to use
  countries.registerLocale(enLocale);
  countries.registerLocale(itLocale);

  // Returns an object not a list
  const countryObj = countries.getNames("en", { select: "official" });

  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return {
      label: value,
      value: key,
    };
  });

  const handleOnChange = (e) => {
    console.log(e.target.files[0]);
    setuploadedFile(e.target.files[0]);
  };

  function sendData() {
    const fileData = new FormData();
    fileData.append("file", uploadedFile);
    fileData.append("email", senderEmail);
    fileData.append("password", senderPassword);
    fileData.append("limit", emailLimit);
    // const data = {
    //   email: senderEmail,
    //   password: senderPassword,
    //   limit: emailLimit,
    // };
    // fileData.append("data", data);
    axios.post("emails/send/", fileData, {}).then((res) => {
      // then print response status
      console.log(res.statusText);
    });
  }
  return (
    <Card>
      <CardHeader color="red" contentPosition="none">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-white text-2xl">Emails Send</h2>
          <Button
            color="transparent"
            buttonType="link"
            size="lg"
            style={{ padding: 0 }}
          >
            Enjoy it
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className=" w-full justify-center items-center">
          <div className="grid grid-cols-2 gap-4 py-8">
            <div className="w-full">
              <p className="text-base font-bold py-4">Sender Email</p>
              <TextField
                required
                id="outlined-required"
                label="Required"
                className="w-full"
                defaultValue={senderEmail}
                onChange={(e) => {
                  setsenderEmail(e.target.value);
                }}
              />
            </div>
            <div className="w-full">
              <p className="text-base font-bold py-4">Sender App Password</p>
              <TextField
                required
                id="outlined-required"
                label="Required"
                className="w-full"
                defaultValue={senderPassword}
                onChange={(e) => {
                  setsenderPassword(e.target.value);
                }}
              />
            </div>
            <div className="w-full">
              <p className="text-base font-bold py-4">Email Limit</p>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                defaultValue="500"
                name="row-radio-buttons-group"
                onChange={(e) => {
                  setemailLimit(e.target.value);
                }}
              >
                <FormControlLabel value="500" control={<Radio />} label="500" />
                <FormControlLabel
                  value="2000"
                  control={<Radio />}
                  label="2000"
                />
              </RadioGroup>
            </div>
            <div className="w-full">
              <p className="text-base font-bold py-4">Reciever List</p>

              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Upload
                </Button>
                <input
                  hidden
                  accept=".csv"
                  id="contained-button-file"
                  name="file"
                  type="file"
                  onChange={handleOnChange}
                  // onChange={(e) => {
                  //   const files = e.target.files;
                  //   console.log(files);
                  //   if (files) {
                  //     console.log(files[0]);
                  //     Papa.parse(files[0], {
                  //       complete: function (results) {
                  //         console.log("Finished:", results.data);
                  //       },
                  //     });
                  //   }
                  // }}
                />
              </label>
            </div>
          </div>
          <hr className="border-2" />
          <Button
            style={{
              marginTop: "20px",
              paddingLeft: "50px",
              paddingRight: "50px",
              paddingTop: "15px",
              paddingBottom: "15px",
              fontSize: "15px",
            }}
            color="red"
            variant="contained"
            onClick={sendData}
          >
            Send
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
