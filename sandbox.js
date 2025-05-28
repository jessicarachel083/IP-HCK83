// import axios from "axios"

// async function fetchAnimals() {
//     try {
//         let data = await axios.get("https://api.petfinder.com/v2/animals", {
//             Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJlRGl2OG5Fc0ZDVmZHZXVmZGVRQnNpVDFDbUtUS1RiMjVid0ZtN3hQQUhRdGw2NE1nWSIsImp0aSI6ImRkNTMwNzVjMjZjN2JiODE3MDJmNzQyYmYwMDg4ZGY3NmYyNWFhNmNmMjc5MzU3OThjMmU1NmI1ZTJlZGE5ZTMyMjNmNTVmZmY0OTk0MDExIiwiaWF0IjoxNzQ4MjY5NDczLCJuYmYiOjE3NDgyNjk0NzMsImV4cCI6MTc0ODI3MzA3Mywic3ViIjoiIiwic2NvcGVzIjpbXX0.KNkBUKn2gDRDf1Pbzf8nIg37CMq4DasUc-JOOOgsfzdHtejWZeRRytesYH752gMkcQTz8MYK9VN01b61Y0BuxdcvgqcoTHoIZHVlkXRnJcsIXFtAv8nu7I8zXxEYrgJgiavQpHiy-QdE3QZReKsjkQl-8S4tw-5jez0SegU5CybwsD6sSP_yEX0bTgu_41KKsNzNeRr8WzI0qxTQurbW_h2Qzte3mt-8-gFwFaVsthJCMI2Bliu3XflNvwc5KZs79cWpABBoApXIUoU6PDxJVaQy4xV77rjzoNpGh5ePdXUcFeB_Ps9VUrp5hykj8fuC7Z6-Q_xJAz7F3i2Dydsq_w`
//         })

//         console.log(data);
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }

// fetchAnimals()



// index.js
const express = require("express");
const { generateContent } = require("./lib/gemini.api");
const app = express();

const prompt1 = `
    I like detective movie. so generate a new movie for me with following details:

    genreId is one of the following:
    [
      {
        "id": 1,
        "name": "Animation"
        },
      {
        "id": 2,
        "name": "Fantasy"
      },
      {
        "id": 3,
        "name": "Sci-Fi"
      }
    ]
    `;

const userPesona = {
  name: "John Doe",
  age: 30,
  gender: "Male",
  moviePreferences: {
    highlyRated: true,
    genreInterests: ["Animation", "Fantasy", "Sci-Fi"],
  },
};

// 1. kita get all movies dari database
const dataMovies = require("../data/movies.json").map((movie) => ({
  id: movie.id,
  title: movie.title,
}));
const prompt2 = `
I want you to recommend the user with top 3 movies

from the list below:
${dataMovies.map((movie) => `- ${movie.title} (ID: ${movie.id})`).join("\n")}

based on the following criteria:
- Highly rated
- Genre: Sci-Fi, Fantasy, Animation
- For Girl

Response with Array of ID
`;

app.get("/", async (req, res) => {
  console.log("Received request with user persona:", userPesona);
  console.log("Prompt for generation:", prompt2);

  const generation = await generateContent(prompt2);

  const parsedOutput = JSON.parse(generation);

  console.log("Generation:", parsedOutput);

  // await Movie.findAll({ where: { id: { [Op.in]: parsedOutput } } })
  // Select * from movies where id in (22, 13, 50)
  const movies = require("../data/movies.json").filter((movie) =>
    parsedOutput.includes(movie.id)
  );

  res.json({
    message: "Hello from Gemini API",
    generation: parsedOutput,
    movies,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));






// helpers/gemini.api.js
const { GoogleGenAI, Type } = require("@google/genai");

const GOOGLE_GENAI_API_KEY = "";

const ai = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });

async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          // type: Type.OBJECT,
          // properties: {
          //   title: { type: Type.STRING },
          //   synopsis: { type: Type.STRING },
          //   genreId: { type: Type.INTEGER },
          //   rating: { type: Type.INTEGER },
          //   trailerUrl: { type: Type.STRING },
          //   imgUrl: { type: Type.STRING },
          // },
          type: Type.ARRAY,
          items: {
            type: Type.INTEGER,
          },
        },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    // 503 Service Unavailable
    if (error.response && error.response.status === 503) {
      throw new Error("Service Unavailable: Please try again later.");
    }
    throw error;
  }
}
module.exports = {
  generateContent,
};