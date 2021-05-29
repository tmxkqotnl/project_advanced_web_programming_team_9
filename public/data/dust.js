let request = require("request");
let cheerio = require("cheerio");
const fs = require("fs");
const { time } = require("console");

fs.writeFileSync("public/data/dust10data.js", "var dust10=[");
fs.writeFileSync("public/data/dust25data.js", "var dust25=[");

var location = [
  "제주",
  "경남",
  "경북",
  "전남",
  "전북",
  "충남",
  "충북",
  "강원",
  "경기",
  "세종",
  "울산",
  "대전",
  "광주",
  "인천",
  "대구",
  "부산",
  "서울",
];

for (var i in location) {
  var loc = location[i];
  var url =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";
  var queryParams =
    "?" +
    encodeURIComponent("ServiceKey") +
    "=vdV%2B8EeWPgBthUe3Y9mji7ct6VbJO7y8ShTDPLDoQKis7tw%2BIofWzd4tAQHHEADRnLTFW3a0HCDYopMs3ZRLvg%3D%3D"; /* Service Key*/
  // queryParams += '&' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent('-'); /* */
  queryParams +=
    "&" +
    encodeURIComponent("returnType") +
    "=" +
    encodeURIComponent("xml"); /* */
  queryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("1"); /* */
  queryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
  queryParams +=
    "&" + encodeURIComponent("sidoName") + "=" + encodeURIComponent(loc); /* */
  queryParams +=
    "&" + encodeURIComponent("ver") + "=" + encodeURIComponent("1.0"); /* */

  request(
    {
      url: url + queryParams,
      method: "GET",
    },
    async function (err, res, body) {
      if (err) {
        console.log("error");
      } else {
        const $ = cheerio.load(body);
        let dust10;
        let dust25;
        $("item").each(function (idx) {
          dust10 = $(this).find("pm10Value").text();
          dust25 = $(this).find("pm25Value").text();
        });

        fs.appendFileSync("public/data/dust10data.js", `${dust10},\n`);
        fs.appendFileSync("public/data/dust25data.js", `${dust25},\n`);
        // console.log(dust10);
      }
    }
  );
}

setTimeout(function () {
  fs.appendFileSync("public/data/dust10data.js", "]");
  fs.appendFileSync("public/data/dust25data.js", "]");
}, 1000);
