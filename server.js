require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

 require("./src/services/ai.service");

const {
  resume,
  selfDescription,
  jobDescription
} = require("./src/services/temp");

connectDB();

  
// invokeGeminiAi("Hello Gemini")
//   .then((response) => {
//     console.log("Gemini Response:", response);
//   })
 

app.listen(3000, () => {
  console.log("Server is Running on PORT 3000");
});