let request = require("request");
let cheerio = require("cheerio");
const fs = require("fs");

// 데이터 출처 : https://www.data.go.kr/data/15043378/openapi.do

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();
let date = `${year}0${month}${day}`;

console.log(`${date}`);
const url =
  "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
var queryParams =
  "?" +
  encodeURIComponent("ServiceKey") +
  "=vdV%2B8EeWPgBthUe3Y9mji7ct6VbJO7y8ShTDPLDoQKis7tw%2BIofWzd4tAQHHEADRnLTFW3a0HCDYopMs3ZRLvg%3D%3D"; /* Service Key*/
queryParams +=
  "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
queryParams +=
  "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10"); /* */
queryParams +=
  "&" +
  encodeURIComponent("startCreateDt") +
  "=" +
  encodeURIComponent(date); /* */
queryParams +=
  "&" +
  encodeURIComponent("endCreateDt") +
  "=" +
  encodeURIComponent(date); /* */

let GUBUN = [];
let incDec = [];

request(
  {
    url: url + queryParams,
    method: "GET",
  },
  function (err, res, body) {
    if (err) {
      console.log(`ERROR`);
    } else {
      const $ = cheerio.load(body);
      $("item").each(function (idx) {
        GUBUN.push($(this).find("GUBUN").text());
        incDec.push($(this).find("incDec").text());
      });
      var file = fs.createWriteStream("public/data/covid19data.js");
      file.on("error", function (err) {
        console.log(err);
      });
      file.write("var covid19=[");
      incDec.forEach((value) => file.write(`${value},\n`));
      file.write("]");
      file.end();
      if (incDec.length == 0) {
        var queryParams =
          "?" +
          encodeURIComponent("ServiceKey") +
          "=vdV%2B8EeWPgBthUe3Y9mji7ct6VbJO7y8ShTDPLDoQKis7tw%2BIofWzd4tAQHHEADRnLTFW3a0HCDYopMs3ZRLvg%3D%3D"; /* Service Key*/
        queryParams +=
          "&" +
          encodeURIComponent("pageNo") +
          "=" +
          encodeURIComponent("1"); /* */
        queryParams +=
          "&" +
          encodeURIComponent("numOfRows") +
          "=" +
          encodeURIComponent("10"); /* */
        queryParams +=
          "&" +
          encodeURIComponent("startCreateDt") +
          "=" +
          encodeURIComponent(date - 1); /* */
        queryParams +=
          "&" +
          encodeURIComponent("endCreateDt") +
          "=" +
          encodeURIComponent(date); /* */
        request(
          {
            url: url + queryParams,
            method: "GET",
          },
          function (err, res, body) {
            if (err) {
              console.log(`ERROR`);
            } else {
              const $ = cheerio.load(body);
              $("item").each(function (idx) {
                GUBUN.push($(this).find("GUBUN").text());
                incDec.push($(this).find("incDec").text());
              });
              var file = fs.createWriteStream("public/data/covid19data.js");
              file.on("error", function (err) {
                console.log(err);
              });
              file.write("var covid19=[");
              incDec.forEach((value) => file.write(`${value},\n`));
              file.write("]");
              file.end();
            }
          }
        );
      }
    }
  }
);
