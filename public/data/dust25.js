let request = require('request');
let cheerio = require('cheerio');
const fs = require("fs");
const $url2 ='http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureLIst?itemCode=PM25&dataGubun=DAILY&searchCondition=MONTH&pageNo=1&numOfRows=10&ServiceKey=vdV%2B8EeWPgBthUe3Y9mji7ct6VbJO7y8ShTDPLDoQKis7tw%2BIofWzd4tAQHHEADRnLTFW3a0HCDYopMs3ZRLvg%3D%3D';

request($url2,function(err,res,body){

    if(err)
    {
        console.log("error")
    }
    else{
    const $ = cheerio.load(body);
    let itemCode;
    let date;
    let seoul,busan,daegu,incheon,gwangju,daejeon,ulsan,gyeonggi,gangwon,chungbuk,
    chungnam,jeonbuk,jeonnam,gyeongbuk,gyeongnam,jeju,sejong ;


    $('item').each(function(idx){
        itemCode=($(this).find('itemCode').text());
        date=($(this).find('dataTime').text());
        seoul=($(this).find('seoul').text());
        busan=($(this).find('busan').text());
        daegu=($(this).find('daegu').text());
        incheon=($(this).find('incheon').text());
        gwangju=($(this).find('gwangju').text());
        daejeon=($(this).find('daejeon').text());
        ulsan=($(this).find('ulsan').text());
        gyeonggi=($(this).find('gyeonggi').text());
        gangwon=($(this).find('gangwon').text());
        chungbuk=($(this).find('chungbuk').text());
        chungnam=($(this).find('chungnam').text());
        jeonbuk=($(this).find('jeonbuk').text());
        jeonnam=($(this).find('jeonnam').text());
        gyeongbuk=($(this).find('gyeongbuk').text());
        gyeongnam=($(this).find('gyeongnam').text());
        jeju=($(this).find('jeju').text());
        sejong=($(this).find('sejong').text());
    });
    var file = fs.createWriteStream('dust25data.js');
    file.on('error', function(err) { Console.log(err) });
    file.write('var dust25=[');
    file.write(`${jeju},\n`)
    file.write(`${gyeongnam},\n`)
    file.write(`${gyeongbuk},\n`)
    file.write(`${jeonnam},\n`)
    file.write(`${jeonbuk},\n`)
    file.write(`${chungnam},\n`)
    file.write(`${chungbuk},\n`)
    file.write(`${gangwon},\n`)
    file.write(`${ gyeonggi},\n`)
    file.write(`${sejong},\n`)
    file.write(`${ulsan},\n`)
    file.write(`${daejeon},\n`)
    file.write(`${gwangju},\n`)
    file.write(`${incheon},\n`)
    file.write(`${daegu},\n`)
    file.write(`${busan},\n`)
    file.write(`${seoul},\n`)
    file.write(']');
    file.end();
    console.log(`날짜 : ${date}`);
    console.log(`지역 :seoul 미세먼지 :${itemCode} 농도 :${seoul}`);
    console.log(`지역 :busan 미세먼지 :${itemCode} 농도 :${busan}`);
    console.log(`지역 :daegu 미세먼지 :${itemCode} 농도 :${daegu}`);
    console.log(`지역 :incheon 미세먼지 :${itemCode} 농도 :${incheon}`);
    console.log(`지역 :gwangju 미세먼지 :${itemCode} 농도 :${gwangju}`);
    console.log(`지역 :daejeon 미세먼지 :${itemCode} 농도 :${daejeon}`);
    console.log(`지역 :ulsan 미세먼지 :${itemCode} 농도 :${ulsan}`);
    console.log(`지역 :gyeonggi 미세먼지 :${itemCode} 농도 :${gyeonggi}`);
    console.log(`지역 :gangwon 미세먼지 :${itemCode} 농도 :${gangwon}`);
    console.log(`지역 :chungbuk 미세먼지 :${itemCode} 농도 :${ chungbuk}`);
    console.log(`지역 :chungnam 미세먼지 :${itemCode} 농도 :${chungnam}`);
    console.log(`지역 :jeonbuk 미세먼지 :${itemCode} 농도 :${jeonbuk}`);
    console.log(`지역 :jeonnam 미세먼지 :${itemCode} 농도 :${jeonnam}`);
    console.log(`지역 :gyeongbuk 미세먼지 :${itemCode} 농도 :${gyeongbuk}`);
    console.log(`지역 :gyeongnam 미세먼지 :${itemCode} 농도 :${ gyeongnam}`);
    console.log(`지역 :jeju 미세먼지 :${itemCode} 농도 :${ jeju}`);
    console.log(`지역 :sejong 미세먼지 :${itemCode} 농도 :${sejong}`);
    }

});

