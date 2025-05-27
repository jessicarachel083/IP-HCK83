import axios from "axios"

async function fetchAnimals() {
    try {
        let data = await axios.get("https://api.petfinder.com/v2/animals", {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJlRGl2OG5Fc0ZDVmZHZXVmZGVRQnNpVDFDbUtUS1RiMjVid0ZtN3hQQUhRdGw2NE1nWSIsImp0aSI6ImRkNTMwNzVjMjZjN2JiODE3MDJmNzQyYmYwMDg4ZGY3NmYyNWFhNmNmMjc5MzU3OThjMmU1NmI1ZTJlZGE5ZTMyMjNmNTVmZmY0OTk0MDExIiwiaWF0IjoxNzQ4MjY5NDczLCJuYmYiOjE3NDgyNjk0NzMsImV4cCI6MTc0ODI3MzA3Mywic3ViIjoiIiwic2NvcGVzIjpbXX0.KNkBUKn2gDRDf1Pbzf8nIg37CMq4DasUc-JOOOgsfzdHtejWZeRRytesYH752gMkcQTz8MYK9VN01b61Y0BuxdcvgqcoTHoIZHVlkXRnJcsIXFtAv8nu7I8zXxEYrgJgiavQpHiy-QdE3QZReKsjkQl-8S4tw-5jez0SegU5CybwsD6sSP_yEX0bTgu_41KKsNzNeRr8WzI0qxTQurbW_h2Qzte3mt-8-gFwFaVsthJCMI2Bliu3XflNvwc5KZs79cWpABBoApXIUoU6PDxJVaQy4xV77rjzoNpGh5ePdXUcFeB_Ps9VUrp5hykj8fuC7Z6-Q_xJAz7F3i2Dydsq_w`
        })

        console.log(data);
        
    } catch (error) {
        console.log(error);
        
    }
}

fetchAnimals()