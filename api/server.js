const express = require("express");
var cors = require('cors');
const axios = require("axios");
const cheerio = require("cheerio");


const app = express();
app.use(cors());

var data = [];

const getFunction = async () => {
  try {
    const html = await axios.get(
      "https://steamdb.info/sales/?min_discount=0&min_rating=0&cc=kr"
    );

    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("table.table-sales tbody").children("tr");
    // console.log($bodyList.html())

    $bodyList.each(function(i, elem) {
      //   console.log("index" + i) + "\n";
      //   console.log($(this).html());
      //   console.log(
      //     "____________________________________________________________________________________________________"
      //   );
      ulList[i] = {
        index: i,
        name: $(this)
          .find("td.applogo")
          .next()
          .find("a")
          .text(),
        url: $(this)
          .eq(0)
          .find("a")
          .attr("href"),
        //   image_url: $(this)
        //     .find("td.applogo a img")
        //     .attr("src"),
        price_discount: $(this)
          .find("td.price-discount")
          .attr("data-sort"),
        price:
          Number(
            $(this)
              .find("td.price-discount")
              .next()
              .attr("data-sort")
          ) / 10,
        rating: $(this)
          .find("td.price-discount")
          .next()
          .next()
          .attr("data-sort")
      };
    });
    // console.log(ulList);

    ulList = ulList.filter(function(arr) {
      return (
        arr.price !== undefined &&
        arr.price !== 0 &&
        arr.rating !== undefined
      );
    });
    data = ulList;
    return ulList;
  } catch (error) {
    console.error(error);
  }
};

app.get("/", async function(req, res, next) {
  const rawdata = await getFunction();
  // const list = req.params.list;
  // const list = 1;
  res.send(rawdata);
});
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;