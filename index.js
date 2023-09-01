const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// accepts the URL of an instagram page
const getVideo = async (url) => {
  // calls axios to go to the page and stores the result in the html variable
  const html = await axios.get(url);
  // calls cheerio to process the html received
  const $ = cheerio.load(html);
  console.log($)
  // searches the html for the videoString
  const videoString = $("meta[property='og:video']").attr("content");
  console.log(videoString)
  // returns the videoString
  return videoString;
};

// the callback is an async function
app.post("/api/download", async (request, response) => {
  console.log("request coming in...", request.body.url);

  try {
    // call the getVideo function, wait for videoString and store it
    // in the videoLink variable
    const videoLink = await getVideo(request.body.url);
    // if we get a videoLink, send the videoLink back to the user
    if (videoLink !== undefined) {
      response.json({ downloadLink: videoLink });
    } else {
      // if the videoLink is invalid, send a JSON response back to the user
      response.json({ error: "The link you have entered is invalid. " });
    }
  } catch (err) {
    // handle any issues with invalid links
    response.json({
      error: "There is a problem with the link you have provided.",
    });
  }
});

// our sever is listening on port 3001 if we're not in production
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
