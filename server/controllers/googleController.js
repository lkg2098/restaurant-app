const axios = require("axios");
const asyncHandler = require("express-async-handler");

exports.nearby_search_old = async (req, res, next) => {
  try {
    let location = [40.93941850319317, -73.83195923491385];
    let key = process.env.PLACES_API_KEY;
    let { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location[0]}%2C${location[1]}&radius=1500&type=restaurant&key=${key}`
    );
    console.log(data);
    res.status(200).json({ message: "this is working" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.nearby_search = async (req, res, next) => {
  try {
    let key = process.env.PLACES_API_KEY;
    let { data } = await axios.post(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        includedTypes: ["restaurant"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: 40.9393651065372,
              longitude: -73.83199458046688,
            },
            radius: 500,
          },
        },
      },
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "places.accessibilityOptions,places.addressComponents,places.formattedAddress,places.name,places.displayName,places.location,places.photos,places.types,places.primaryType,places.priceLevel,places.regularOpeningHours,places.currentOpeningHours,places.regularSecondaryOpeningHours,places.currentSecondaryOpeningHours,places.rating,places.userRatingCount,places.websiteUri",
        },
      }
    );
    console.log(data.places);
    res.status(200).json({ message: "this is working" });
  } catch (err) {
    console.log(err.response.data.error);
    res.status(500).json({ error: err });
  }
};

exports.sample_google_data = (req, res, next) => {
  places = [
    {
      name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8",
      types: [
        "breakfast_restaurant",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      formattedAddress: "112 Kraft Ave, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "112",
          shortText: "112",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Kraft Avenue",
          shortText: "Kraft Ave",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.940843,
        longitude: -73.83425,
      },
      rating: 4.3,
      websiteUri: "http://thebronxvillediner.com/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 7,
              minute: 0,
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 7,
              minute: 0,
            },
            close: {
              day: 1,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 2,
              hour: 7,
              minute: 0,
            },
            close: {
              day: 2,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 3,
              hour: 7,
              minute: 0,
            },
            close: {
              day: 3,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 4,
              hour: 7,
              minute: 0,
            },
            close: {
              day: 4,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 5,
              hour: 7,
              minute: 0,
            },
            close: {
              day: 5,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 6,
              hour: 7,
              minute: 0,
            },
            close: {
              day: 6,
              hour: 21,
              minute: 0,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 7:00 AM – 9:00 PM",
          "Tuesday: 7:00 AM – 9:00 PM",
          "Wednesday: 7:00 AM – 9:00 PM",
          "Thursday: 7:00 AM – 9:00 PM",
          "Friday: 7:00 AM – 9:00 PM",
          "Saturday: 7:00 AM – 9:00 PM",
          "Sunday: 7:00 AM – 9:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_MODERATE",
      userRatingCount: 981,
      displayName: {
        text: "Bronxville Diner",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 7,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 7,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 7,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 7,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 7,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 7,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 7,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 7:00 AM – 9:00 PM",
          "Tuesday: 7:00 AM – 9:00 PM",
          "Wednesday: 7:00 AM – 9:00 PM",
          "Thursday: 7:00 AM – 9:00 PM",
          "Friday: 7:00 AM – 9:00 PM",
          "Saturday: 7:00 AM – 9:00 PM",
          "Sunday: 7:00 AM – 9:00 PM",
        ],
      },
      primaryType: "restaurant",
      photos: [
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXWHlKEQKVYLSLjoS2YNtZ9ttjp3FP_Mnf-9VY-UX7OIHU_DDp9JCPJOL8oe2WE_p4dpN5Eh8EvdZr8ypx6uiRqZBxYeNodi6hAe3gkeOH5XqTbmkNGWs7pXqEQZzNksLwiUsJs2ViN0apqvkJhvA2pS--MfJcC65grX",
          widthPx: 2048,
          heightPx: 1228,
          authorAttributions: [
            {
              displayName: "Bronxville Diner",
              uri: "//maps.google.com/maps/contrib/103536951004213398224",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWm1PgYl7vrRK2bfkv856TWASYTnz49w6RKH-uHOObSUhqR4_I=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXXCmTzyWZnatA9ZiWg41VXj6uRCEREX2S-VJQtVOTptekFswZxPUua9rGPZwIeFkbnOG3HMpsPHP45qd5oX-kO1mAe93QtdMpKSIBNbG604e1nFjmNkl9659wcrrVrBukHaCJNOwh-Yw5gqBhqOCyO7v33vRpMqRxFd",
          widthPx: 1024,
          heightPx: 682,
          authorAttributions: [
            {
              displayName: "Bronxville Diner",
              uri: "//maps.google.com/maps/contrib/103536951004213398224",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWm1PgYl7vrRK2bfkv856TWASYTnz49w6RKH-uHOObSUhqR4_I=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXVpQeiqKr4jD1ZFGL8fMXEGKJzymfxiVz5wNYMEgm-1mVu2jzNSAg9zWhKYadkRx35X_y7XvohpCb0MidgeCxrI11IZPSf--p4maaqOV340vra6r51N-b9N0jXXEivFfWtrRqqSf8mT15EAjra0ejPhFlcu0iCJZhJM",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Nora N.",
              uri: "//maps.google.com/maps/contrib/115226868192408163458",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWAkliUT-LPCe4qXUcCABSjOKc388bf3dA3cYjxL8ywK5t0Epot=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXXEVe1l5jXUyZFv8JPBx0iljjgVxQbFiUXNbXEkFq1bcBHPBv92G8JYsl44sUIKCo2hynJizhoQJjQp33G_Ao5wzISU6vy035PGtoVgi8uwH-Ju8FVN8HFTitvTwPjc-uOf8AKJbP-sPJgMqZJQOC-noPLAWEkq6pk",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Kim Gullberg",
              uri: "//maps.google.com/maps/contrib/111035411571893892330",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVQICCQe1aOgee88QVbprScdUHTpWq2rX57R_XTGsCrMzDyW7A=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXU06sLrBTlATiViEw_iqukvuuE_vHZ4uxeYUuxPrVYaKzxteiEzZ7BT09np-HhzgWelxxMDHDdnSQDhm6eVIyZQFV46E3-C2LYatAoZZe2-h1VpnQh1i7UnM_uuEkQKAhXHzH8RIuLUYLhldeTNNZXUQu9MhbyfVIsc",
          widthPx: 2585,
          heightPx: 3295,
          authorAttributions: [
            {
              displayName: "Tom Moncho",
              uri: "//maps.google.com/maps/contrib/114125059648511830046",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVIp0U9d6wWacj8xmefHG8bluUDQi8UHlEY4abaq0TDMmoMQYTo0w=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXUTE8o1ogL3X-Bg3pFckloyWtvWVyY9sLBWH1CZh8HyPUUinKBG0xCIXwuDapY4rgee1w6aJejwZ6kn6ysmmefRRWheVeJXkBN89QGbD2IZA5oVCQQO-mwe-JAl0s0LbolJZgAsC9UMcUe4R4oD7uMBGZw2KrVTSgsJ",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Dominick Vellucci",
              uri: "//maps.google.com/maps/contrib/116345219794599247988",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLL_owKx7Ll_ECHNGV8gYvICGsjANzrOOhaddLlAt_rs7dnEw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXWs6Myds_CZ4NBGa5HJiXzk6NxqJb89LzWV9tetC8JLV5vMUzKme_w-_AJbnVDjd-d_cd4LyqlI93VrIq5NWV6u7UXAjlwZuP0-kamAMFswEIBYeIRxTEnaSVCtdtHGiIpwrlPkDMlC0p-97263fLzaEq3OwlIEqekq",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Anand Pande",
              uri: "//maps.google.com/maps/contrib/103660647979898389800",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocKkiZoDzZKxdsAgjBbc8eJa331GdYw3LiXdH2FXM_Fz5sbckb_d=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXX62KWzaZEVDNmb_cOOinZcnLwcuo4XycI_BqtxJKxM4v9g89GOdYBksvPiI9zLRi_HH7ttVI2deM3aQX7aSIKPNZRRnIU-2u5LzLEhSqVnMWyTzkVs3KgChsUrcRh_PLxCG8zRxhd1wBgsr_NN6z5fWBwWAPmKQOVi",
          widthPx: 3984,
          heightPx: 3000,
          authorAttributions: [
            {
              displayName: "Tom Moncho",
              uri: "//maps.google.com/maps/contrib/114125059648511830046",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVIp0U9d6wWacj8xmefHG8bluUDQi8UHlEY4abaq0TDMmoMQYTo0w=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXVZbY6Q86L4lUeyUdGCi1xysbD8dxR-vX4zlrkO4y2os7epXyn_XqD7lRHjyNhJQBLLJfxIryorzrQIjXCrpKEhu1jwVOTzVeALzpStykkYjL8Mt4GaGc8d0gfeErg1pUL4FFcEIDfrAmeRwDuRSKEGIR6FvOWfTXwT",
          widthPx: 4000,
          heightPx: 2252,
          authorAttributions: [
            {
              displayName: "Marcel Younes (Marco)",
              uri: "//maps.google.com/maps/contrib/107319038800645389560",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUOo8BYqeyYxILKD8LnOb9SK7HcC6SdR9FCgaOuPmHy9b0s4l8N_A=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXXnTVMYqphJwkwp3FeKSs5VC9ZNwC0uB7RUSKBEgJ68UApZnldNUtn3RiPDvJplwXTKj_MNLZIyyN5SQfQUYojcH9xI8jZ3fgWHMiD2Ux3rwn9AQd7FH5KDOiDVw3u5P_SHlf7tEjmU5ywSJa175JGsdJyLfx4cRVV8",
          widthPx: 4000,
          heightPx: 2252,
          authorAttributions: [
            {
              displayName: "Marcel Younes (Marco)",
              uri: "//maps.google.com/maps/contrib/107319038800645389560",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUOo8BYqeyYxILKD8LnOb9SK7HcC6SdR9FCgaOuPmHy9b0s4l8N_A=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleParking: true,
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI",
      types: ["restaurant", "food", "point_of_interest", "establishment"],
      formattedAddress: "7 Pondfield Rd, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "7",
          shortText: "7",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Pondfield Road",
          shortText: "Pondfield Rd",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.942234,
        longitude: -73.8340454,
      },
      rating: 4.6,
      websiteUri: "https://lacasabronxville.com/",
      regularOpeningHours: {
        openNow: false,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 17,
              minute: 0,
            },
            close: {
              day: 1,
              hour: 21,
              minute: 30,
            },
          },
          {
            open: {
              day: 2,
              hour: 17,
              minute: 0,
            },
            close: {
              day: 2,
              hour: 21,
              minute: 30,
            },
          },
          {
            open: {
              day: 3,
              hour: 17,
              minute: 0,
            },
            close: {
              day: 3,
              hour: 21,
              minute: 30,
            },
          },
          {
            open: {
              day: 4,
              hour: 17,
              minute: 0,
            },
            close: {
              day: 4,
              hour: 22,
              minute: 30,
            },
          },
          {
            open: {
              day: 5,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 5,
              hour: 22,
              minute: 30,
            },
          },
          {
            open: {
              day: 6,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 6,
              hour: 22,
              minute: 30,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 5:00 – 9:30 PM",
          "Tuesday: 5:00 – 9:30 PM",
          "Wednesday: 5:00 – 9:30 PM",
          "Thursday: 5:00 – 10:30 PM",
          "Friday: 12:00 – 10:30 PM",
          "Saturday: 12:00 – 10:30 PM",
          "Sunday: 11:30 AM – 9:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_MODERATE",
      userRatingCount: 380,
      displayName: {
        text: "La Casa Bronxville",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: false,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 17,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 21,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 17,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 21,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 17,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 21,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 17,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 22,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 22,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 22,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 5:00 – 9:30 PM",
          "Tuesday: 5:00 – 9:30 PM",
          "Wednesday: 5:00 – 9:30 PM",
          "Thursday: 5:00 – 10:30 PM",
          "Friday: 12:00 – 10:30 PM",
          "Saturday: 12:00 – 10:30 PM",
          "Sunday: 11:30 AM – 9:00 PM",
        ],
      },
      currentSecondaryOpeningHours: [
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 4,
                hour: 17,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
              close: {
                day: 4,
                hour: 22,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
            },
            {
              open: {
                day: 5,
                hour: 16,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
              close: {
                day: 5,
                hour: 18,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: Closed",
            "Tuesday: Closed",
            "Wednesday: Closed",
            "Thursday: 5:00 – 10:30 PM",
            "Friday: 4:30 – 6:00 PM",
            "Saturday: Closed",
            "Sunday: Closed",
          ],
          secondaryHoursType: "HAPPY_HOUR",
        },
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 0,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 12,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 6,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: Closed",
            "Tuesday: Closed",
            "Wednesday: Closed",
            "Thursday: Closed",
            "Friday: Closed",
            "Saturday: 12:00 – 4:00 PM",
            "Sunday: 11:30 AM – 4:00 PM",
          ],
          secondaryHoursType: "BRUNCH",
        },
      ],
      regularSecondaryOpeningHours: [
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 4,
                hour: 17,
                minute: 0,
              },
              close: {
                day: 4,
                hour: 22,
                minute: 30,
              },
            },
            {
              open: {
                day: 5,
                hour: 16,
                minute: 30,
              },
              close: {
                day: 5,
                hour: 18,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: Closed",
            "Tuesday: Closed",
            "Wednesday: Closed",
            "Thursday: 5:00 – 10:30 PM",
            "Friday: 4:30 – 6:00 PM",
            "Saturday: Closed",
            "Sunday: Closed",
          ],
          secondaryHoursType: "HAPPY_HOUR",
        },
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 30,
              },
              close: {
                day: 0,
                hour: 16,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 12,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 16,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: Closed",
            "Tuesday: Closed",
            "Wednesday: Closed",
            "Thursday: Closed",
            "Friday: Closed",
            "Saturday: 12:00 – 4:00 PM",
            "Sunday: 11:30 AM – 4:00 PM",
          ],
          secondaryHoursType: "BRUNCH",
        },
      ],
      primaryType: "restaurant",
      photos: [
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXVqV9FFGA6D28rOpqQyxeunGWMEWOsxWhKsh1Q-7HqMhtYI8wHj6EbnRq4csPIzipdPkq7W1CabBSZPJGk0hQHEdHV1tXRHZr8A63vgAhHxE7uCpq2LNyF9Gcg5Lbil5GgIMj19zZ_hBw16Hjl08-bjQ3iw_6to3Mbv",
          widthPx: 1100,
          heightPx: 734,
          authorAttributions: [
            {
              displayName: "La Casa Bronxville",
              uri: "//maps.google.com/maps/contrib/102498846217371794194",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVuX5PpDHz8y_nZtLKHBPTsopba_lHZmVRLrYCSBpcghX8-LAw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXV7J3mdA73mq2kuCdyj2Tl-zkWNQlmpVIOZakJ1b91sYlBW-Kdlpd9LmcNknrrq0ChTqzevqpSrXQEfO361s_-Q08zP4NbdoP2CU0RNdWG3-wYWns64lRLzGtvjKA5GYDwnZTCAaqySiPdgdt14jvQrjAwKJidSgQJ7",
          widthPx: 2901,
          heightPx: 2723,
          authorAttributions: [
            {
              displayName: "La Casa Bronxville",
              uri: "//maps.google.com/maps/contrib/102498846217371794194",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVuX5PpDHz8y_nZtLKHBPTsopba_lHZmVRLrYCSBpcghX8-LAw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXX9i7Fr2TtjfsZHCXP_m4AFt3v0NhZl_GdygiQW00EyJGBTRSFVX3hIY-d0E3dYsp3nECwREDyP7DvvKOBNG5ubbMrNDKExeG8n8rcPraXyCgb-ALaJni3-CBzqnSlquq87BFWgn8-b34qFoXghNvtShAW7uYer0Q77",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Dominick Vellucci",
              uri: "//maps.google.com/maps/contrib/116345219794599247988",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLL_owKx7Ll_ECHNGV8gYvICGsjANzrOOhaddLlAt_rs7dnEw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXUmLJVFEBrNRSe_21nph-772V8yqVM4Gt9XqgZIIrHJeu3U_XnPiWDe0Az-81QQLoy0a-sBj0gNZYVLF7AbwrU3Cnb07G79SOIX5PfEocgjZBzyTHL8FDsfNrmlZkZoCgHmiATBa7PRyR1EFTNctjfZMg7lF-NHZnX5",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Dominick Vellucci",
              uri: "//maps.google.com/maps/contrib/116345219794599247988",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLL_owKx7Ll_ECHNGV8gYvICGsjANzrOOhaddLlAt_rs7dnEw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXXr6TfNU0h3mmMlZ9JJ9DjuLDbJHHwvV0rYg-BuhA5FuQCEYIM26JyhY77lV610GGm9yHu9GhiZq3LLRVTJhKYU5PXGdQ_YDkNE99WrGJJjEP_MKzEjlx1-D-OZ--hy_59JjMa1qpjuvGmT6C5fD6AQUVqekvFck4Xj",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Dominick Vellucci",
              uri: "//maps.google.com/maps/contrib/116345219794599247988",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLL_owKx7Ll_ECHNGV8gYvICGsjANzrOOhaddLlAt_rs7dnEw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXU8ZFTXp6fm4yT-m8AkVPtic1Ru0a6zSOhzHGODT5WRDLTn1Dk9fED6QIN5l6TlG-bcXhFem3rrjZhMCvXLCs3OI2Y6gTYL4LL1mi5Ix-7xonxVhbZjv_zL8WtN0PkFdmhUipy3FH-o5nE5eSF_KtjNxiHRij8DzV0i",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Chrystal Tyler",
              uri: "//maps.google.com/maps/contrib/100662241990079929790",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWxhnInuTDbq-JJZiquvvUsevxAQopl70sSoGjk42O5fksU0jYO=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXV3TXeNNXsWJRiXRbwgIKXujm4Ka4k8fi5BAZH_sYxGd5V6KtZ8hJSPFeAqSQ6xMTXDgk515PR4nsPBl6pRvpziAq77OwHdWWE2zYxr0IhZ4rjFb0FwmycGxZmpbvtEjfhN0VDDgRlpqVOmEkvU6BD5iqS9vRetTEUD",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "La Casa Bronxville",
              uri: "//maps.google.com/maps/contrib/102498846217371794194",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVuX5PpDHz8y_nZtLKHBPTsopba_lHZmVRLrYCSBpcghX8-LAw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXUVGDcKkuPQ3hTYXJsDYdmtNBMIEgIx5ALnFp-zHWFrzSsgBp0Eczpf40Sb2x26vgkZEFXUiq307gsXnFl9XkmtqbgOXdSroGgV0vrCspMXreFIB8_YgBcGN4cV0itkjhBN0BRfYkD84Hru0BLNl-JLj8Y8pKIB9Ey9",
          widthPx: 3000,
          heightPx: 2000,
          authorAttributions: [
            {
              displayName: "Nathan M",
              uri: "//maps.google.com/maps/contrib/115520065226364451025",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWzDTP1spCmKODLM6fpNlpPg3aZH6GCmQH5kUwHqTIC_7qNSl6K6g=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXXcytbTMzv26rXsa9MJy1dhi-UVfILy57tOrIY_FqEtBFe3TcKdbmcV59dB6689zqM97sJPEM-GUfrUs-WLombSV-Kg1tkAGzJ8_00XzcB6tAAwHjAspxPSn_JvphJu7pvORwR3BH5zEm-jAYnwxFUCOqrXbVfhXAwB",
          widthPx: 3487,
          heightPx: 2323,
          authorAttributions: [
            {
              displayName: "La Casa Bronxville",
              uri: "//maps.google.com/maps/contrib/102498846217371794194",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVuX5PpDHz8y_nZtLKHBPTsopba_lHZmVRLrYCSBpcghX8-LAw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJv0CFoxKTwokR4Sfgcmab1EI/photos/AUc7tXXXNlqUIk6f-wzVDx3NbmOIJ4cvgxL9ZJisr1czpeuhFVBhbgE_ZdOirA5KUpzgzWP4_3t3HHId9d198exLPdOMl2UCUI3MixZdlvyuAudP42Lwbv3KoJUpjSnRbAlIwtxsKt_nbXx_E3tFFibgomKF6HAk5RnWwxFk",
          widthPx: 2992,
          heightPx: 2992,
          authorAttributions: [
            {
              displayName: "Izzy P",
              uri: "//maps.google.com/maps/contrib/106312316226975657938",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXXFxjJMQpmf98nMKdUpjBbEDGH_sJyGVDeWpUYDI8YUsXt8KFC=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w",
      types: ["restaurant", "food", "point_of_interest", "establishment"],
      formattedAddress: "15 Park Pl, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "15",
          shortText: "15",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Park Place",
          shortText: "Park Pl",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.9395715,
        longitude: -73.8337966,
      },
      rating: 4.8,
      websiteUri: "http://playabowls.com/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 9,
              minute: 0,
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 9,
              minute: 0,
            },
            close: {
              day: 1,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 2,
              hour: 9,
              minute: 0,
            },
            close: {
              day: 2,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 3,
              hour: 9,
              minute: 0,
            },
            close: {
              day: 3,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 4,
              hour: 9,
              minute: 0,
            },
            close: {
              day: 4,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 5,
              hour: 9,
              minute: 0,
            },
            close: {
              day: 5,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 6,
              hour: 9,
              minute: 0,
            },
            close: {
              day: 6,
              hour: 21,
              minute: 0,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 9:00 AM – 9:00 PM",
          "Tuesday: 9:00 AM – 9:00 PM",
          "Wednesday: 9:00 AM – 9:00 PM",
          "Thursday: 9:00 AM – 9:00 PM",
          "Friday: 9:00 AM – 9:00 PM",
          "Saturday: 9:00 AM – 9:00 PM",
          "Sunday: 9:00 AM – 9:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_MODERATE",
      userRatingCount: 505,
      displayName: {
        text: "Playa Bowls",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 9,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 9,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 9,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 9,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 9,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 9,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 9,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 9:00 AM – 9:00 PM",
          "Tuesday: 9:00 AM – 9:00 PM",
          "Wednesday: 9:00 AM – 9:00 PM",
          "Thursday: 9:00 AM – 9:00 PM",
          "Friday: 9:00 AM – 9:00 PM",
          "Saturday: 9:00 AM – 9:00 PM",
          "Sunday: 9:00 AM – 9:00 PM",
        ],
      },
      primaryType: "restaurant",
      photos: [
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXXvNZ903dC65MgTYpmyZz8Xc_mOQVbx7_dSQ8nk7A5Zm7EvaggqnD1bB5Qjf56ZFn3G7WZYkttac1D0IxntAPlulQfBDqKCgec0jI4osvppp6rSHWfh-qhIdcRx_PYyhCswO2B90dIFGJX9wB43JV39d65zPAtQF1aw",
          widthPx: 2649,
          heightPx: 2895,
          authorAttributions: [
            {
              displayName: "SPD",
              uri: "//maps.google.com/maps/contrib/109954214289545768470",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLjhs5L_LaggmEjon3Gw1VQApDXiMs4j73QBROytW8x7mf2FA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXWzDGbcHvaCjcMFVibz4Ap1anqA1WaVCelLZiaQtERofJuNRk2y3fvPSHC7s-LjzwErYlyj7nVWXIEhHwhUJKMCISoMQZKiEYXlQEsXCf7IE_tQ_o_GKUdx_snU2znIC_bUMCCT1qz9Re0wQeChftYGusxRDlLt5rv2",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Ryan Raaum",
              uri: "//maps.google.com/maps/contrib/105892243175315839968",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWrZIE1TvBwgB1gtW7zA83gkX2Gc_WtF0UZCeVz075Jbk-l0LNd=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXXaKz5E62PRh4NYw-YT42ZhMxqNibuyKGoOgCWb0iMonfsixXfsw9F50AJCtR7ed-F6YPi1wg3iefL1bRBj_SbEUgvd4ixl4xtiXdZ5Wcd-EnyoRqYvxtXzSmuZVDs2F3BTCMa5EpKiBw9rX5J52-ji-hVmchoLpM6w",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Renee Perkins",
              uri: "//maps.google.com/maps/contrib/111666520096562646940",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWPXEvAr30F89xDB3LZp4HkVUHjHbwtbnhOUpp8wr3MRJZpoxI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXWKeMu6TtTO_AUMZJIHRhstqQ0TdrSQ42ELWP0MCppvWPyfqWRgFXdHewQfUeN8XacABd8UQredqQ8SSrx_nKtrxORbRh8kBqwG3bwq7J1YbaDuwgfrqiivwCRXUyn3SemBW3OKP2CUrPn-voYpVgf46ohwBYodvP5K",
          widthPx: 3000,
          heightPx: 3000,
          authorAttributions: [
            {
              displayName: "among us Gamer",
              uri: "//maps.google.com/maps/contrib/112552625260623853690",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUUu6_f-_b_NV1TRb9I3dIeXX5Q0eA9-B884nPglsIGb4udMMM=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXUHm1_a_wblq8OUjI2tDq5VMsCxBBKGXK8WsJpfGhdVuKPJrJRYHU4jjYvHRJDArZhhseyJ9zk9jJ0GSi_Nlt64Z3sMQ7D2B6JPH2pZVEjRU9cgC7_TVXJ4t5gDTqYSDlDWrYUL15sLocenV7984qyAo2EtsYBuN0o",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Jess the Blessed",
              uri: "//maps.google.com/maps/contrib/108398016219706138219",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUBiio_GFueTlO7D5EvMjvB0If0eEBczigdDhndJNTvRq1jUBs=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXWU0yontRd2H7FYenwBvn9qyp8xIhiKhvOQCvsxUusMQl2OJ3NF_pOfjmKwirZ9rEM3SJvYmM7uyTCWn-SJKoSz8QCadAb3szmna8UysAALKyamTow_NT3xrLqMh3kgQgx9K7fcpT2jJfhFDkawy5Vqi4xJ96pRpoOd",
          widthPx: 1920,
          heightPx: 1080,
          authorAttributions: [
            {
              displayName: "kamal maq",
              uri: "//maps.google.com/maps/contrib/106311411889971113392",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUwz4M34bAEKlPxrWmsq0NpwOfFiCwepaIpFyQM5ib1-g1mSC91=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXUuiruakp3TcH8fS8RdsLqSbSOCA8R0c9N9-ZIJGBxRn0DhIudhl9Aj4uJjg7x1_POFy_T2N1YNAzr_MDwqecgRGLzcSziQvo7VR0HdVFHR9a_J77CSXZZbVe7q6nd-5d6hbzWTX0AqyCssKpWZW53z6G3KWw0s1Gwe",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Gerard Visser",
              uri: "//maps.google.com/maps/contrib/117835854773569504294",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVIo-uGyIVfdSS9OnqrsUw79rnAplzsVIMjxz1BCLhstSO480Fjnw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXUZUvjLtdd1mSUgdyHfJUblx476y7qvTXqi2tHxJIrLNnYe7qtJpM-th8rep_oKKi_WoGSmpDVXuXm4W5EFPczuGjKdMC7CI3v8i-yEXl-mgN23-A5uqIT2HBPdJ0UWRNiBOeBj2ayZJse3SJG3LvLeEhoGt7wbsWZ8",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Gabriela Lêdo Franco",
              uri: "//maps.google.com/maps/contrib/112720967901361075004",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjX6n2oLQGm24NNJ6QmKD1x5z1rcTnTocG4RCmurf1ZCNZ11EMPIkg=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXX7PaSCqnjRqO6VtxzTv079G3n65YK2cYSfES9hIgf4Hx2ob55Rud1ALidbDVZpoe1s5c35jYTaaKG92a2FFKXOJnh1liplnXJgXPdEbkSC29dBWshF84BwZ1lqKS-kTiceX5b4cDO03reOwEZiyERU5EXwOLQrjswN",
          widthPx: 4032,
          heightPx: 1960,
          authorAttributions: [
            {
              displayName: "cesar duque",
              uri: "//maps.google.com/maps/contrib/114571796102722332405",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjV33CZnN8uGtrOlUwZLqy4TrNnvvPhboqNiQ4BkvSWPPp_lfapgTA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ23paVWmTwokRd0rp8kdKM0w/photos/AUc7tXV-4ITUvybj7JMZpYBabAGsJI3C6YdtGyC4QiNXjN1Zqo1etdkwJOLvYLMDsEkTGWSAYmVLTXEnd7GRTr8uIMpOJnnVSezRQOLy-MeLOIgj1JbGBVtKe9J4xfQNPynhJ-ZhUXW6cDJ1Z8T6pA_RDlfr7HUNveOt59i_",
          widthPx: 1125,
          heightPx: 1164,
          authorAttributions: [
            {
              displayName: "HD13",
              uri: "//maps.google.com/maps/contrib/101333690446174682033",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLQQGA372_kEJZRWfCgl6jM6oToPDQ4iQ9efLxQBCgnHPSYag=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleParking: true,
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU",
      types: [
        "coffee_shop",
        "cafe",
        "breakfast_restaurant",
        "store",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      formattedAddress: "29 Park Pl, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "29",
          shortText: "29",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Park Place",
          shortText: "Park Pl",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.939473,
        longitude: -73.8344161,
      },
      rating: 4,
      websiteUri: "https://www.starbucks.com/store-locator/store/12029/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 6,
              minute: 0,
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 5,
              minute: 30,
            },
            close: {
              day: 1,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 2,
              hour: 5,
              minute: 30,
            },
            close: {
              day: 2,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 3,
              hour: 5,
              minute: 30,
            },
            close: {
              day: 3,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 4,
              hour: 5,
              minute: 30,
            },
            close: {
              day: 4,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 5,
              hour: 5,
              minute: 30,
            },
            close: {
              day: 5,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 6,
              hour: 6,
              minute: 0,
            },
            close: {
              day: 6,
              hour: 21,
              minute: 0,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 5:30 AM – 9:00 PM",
          "Tuesday: 5:30 AM – 9:00 PM",
          "Wednesday: 5:30 AM – 9:00 PM",
          "Thursday: 5:30 AM – 9:00 PM",
          "Friday: 5:30 AM – 9:00 PM",
          "Saturday: 6:00 AM – 9:00 PM",
          "Sunday: 6:00 AM – 9:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_MODERATE",
      userRatingCount: 330,
      displayName: {
        text: "Starbucks",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 6,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 5,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 5,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 5,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 5,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 5,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 6,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 5:30 AM – 9:00 PM",
          "Tuesday: 5:30 AM – 9:00 PM",
          "Wednesday: 5:30 AM – 9:00 PM",
          "Thursday: 5:30 AM – 9:00 PM",
          "Friday: 5:30 AM – 9:00 PM",
          "Saturday: 6:00 AM – 9:00 PM",
          "Sunday: 6:00 AM – 9:00 PM",
        ],
      },
      primaryType: "coffee_shop",
      photos: [
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXWkb4d2FIgSAMLrStX4BkhS2-RYQ2KX6hJOtNW5BKFzFTtkAv0s-nQGsHl_3BHq_nIVJW9MKDVMwKYwQttrHhTajB2DhNEs0DZtIJ0aeU9LiPXZwHYFGoi6CodtLyxoyirZzgXL4J9FKOtDPjy4ukH6UU33IlkuEUw_",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Reya OnTheRoad",
              uri: "//maps.google.com/maps/contrib/108638165399857172930",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUK2nFXaZICnPGsYUCq7FEObhR3HVHM6ABqwPqvBSOo_hffi7c8=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXVh1YCcBpsXk7vmWNYVMIuvJUn5l5cIBy66IgvDHcxsQVw9Z41zZBoT_8n9E3ke6gRbxpJhS9-zs6_VTbMCcbyTzDfzlO7wjyG1mIucZoMfv9NU8RQ2coYKtDPHbxRQ_2XmHfUfFVNYhnQoaDoWucUgBlHdh5VHY5M",
          widthPx: 512,
          heightPx: 289,
          authorAttributions: [
            {
              displayName: "Starbucks",
              uri: "//maps.google.com/maps/contrib/116309899670369583156",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjV-z-q_947yluoLBu1dv0f4I09OPKHIh7aST_ACe_V9hfAVPQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXUSaK9YSZzyKnFAPfEHtnRc-IEjClFsI4VVLNUj2E_ge2eDOrTJZmZlwjY9Hq3FGmf9Ue45hClsRzFBrxyAesZXty2teCHyXcNe_nMp3LCs9nc4UXfzmyAU9d3sSrbMn3L9TIvOUTMMhUf4GaHsUHdx1c706hN-2iGi",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Greg DeCristofaro",
              uri: "//maps.google.com/maps/contrib/111241687392768018033",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVuuRzqGwfBj6DIcfTpUjGbcSndZYp9VrS4H335pT62e7FjerOUgA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXUs6ZuRti0aOQwiBUZkZp665LZZl7EB7eocM8PEna4ektQ9HYdgEMjr_475PY6Tbl2cKxUl2QDqxzGxyPkxuoEKx0T3hj07kVgommFQGCdpQzVgTgyW7nQEBsy3s5Htg3yf9bY9_W57RhAyEpihFwOe56_fjHDKO6A",
          widthPx: 502,
          heightPx: 546,
          authorAttributions: [
            {
              displayName: "Starbucks",
              uri: "//maps.google.com/maps/contrib/116309899670369583156",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjV-z-q_947yluoLBu1dv0f4I09OPKHIh7aST_ACe_V9hfAVPQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXWcID2XEfv7BHFVia0z5EDj1WhhWguIj49nua73n-iHlZ6I3-B4ZH0eMyelv1tRTXH7G7V2MTes2nnqmi4wzMrUlKCw_khsYH3Dp9aqzYm20D3ozAHRRkWafHvd3Ba1HG9fjTrPljJL8PFf0dq-KRreIgR30srGdo8",
          widthPx: 732,
          heightPx: 664,
          authorAttributions: [
            {
              displayName: "Starbucks",
              uri: "//maps.google.com/maps/contrib/116309899670369583156",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjV-z-q_947yluoLBu1dv0f4I09OPKHIh7aST_ACe_V9hfAVPQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXVGtd_kVj7zCfemZ2X0o4DXP0i7YlCCKraWI-Uvzco-OjZFvhKIGrO8UDKutGN7cBdVumaAy-cQSemjTy7ldLqnqfPFhklPVGf7g_yzadU-kBfHTPAjz7EgLQmfbAQFAc7bBKM2GqNRTOlPOpK28Z7yvSWHAuFAT4zE",
          widthPx: 1932,
          heightPx: 2576,
          authorAttributions: [
            {
              displayName: "soxxpuppet",
              uri: "//maps.google.com/maps/contrib/113279348064979698475",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXNBS72pjlA_sFxvr2t1B5nFUqkuqJaxKHKZ9K2hXrMOb_fiDpL=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXXcVdLORATddrFZf01DB9u2dxWkxhVB7f0xqLXuyCpzjUibe6EI2iTjZMqFHDx_3U66bs8yazBaajd-UM_OOR9c00h_5pVWG1qTUJGYUgUVLxjPlqjzv76yaO46h3divYDUihqW4pFMm_54araPlHl_abD6BfCNeDw",
          widthPx: 640,
          heightPx: 640,
          authorAttributions: [
            {
              displayName: "Starbucks",
              uri: "//maps.google.com/maps/contrib/116309899670369583156",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjV-z-q_947yluoLBu1dv0f4I09OPKHIh7aST_ACe_V9hfAVPQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXXWq3f-qc-eW--M9IeqtNSWkrNLrslj9Mj3Z5as7jMGdfEH4IAAvb8w66Kt18JrDXQOCOe_VHuI0Yk_on2ngy-oOjR1KL7mrRX-wj2Zeh-ZfO9X58Zn0QahX8VGhxxia3sxwWqGVBuGgzWM3z_mVvNvRqve91remGri",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Rodrigo Olvera",
              uri: "//maps.google.com/maps/contrib/107112452808436073885",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjV7YnBjzz6nca0ZafVBTQecuegxRpt2vnAi0TThYkHylW0ONM5O=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXW7yzJAr36N3G0hVf19F0nHP7RCvD1Kh_15LCqAw3WkkjId-vIitiXHlqBw2dRuvvKl1MfEE3t-jgz2tEl-S14SalXgU9tkNcGcV_pQikodGRy3kpfpT43P9fmkaoqbHqMqpn1axU7crz3_dQlbfBLDGjcP2L1kRSGc",
          widthPx: 4160,
          heightPx: 2340,
          authorAttributions: [
            {
              displayName: "Ger Regan",
              uri: "//maps.google.com/maps/contrib/117901930310042349773",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjX43iRjWIPD59lyZKLlALWI9JohsDqGEGjFldgAHTlobiJovlX_bw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJK0BTQK6SwokRN5bYvABnbvU/photos/AUc7tXXzRU2ASR_uhOFTl7o7-sS0KALMq4tivFMOJe2jOtk0cHuuuy7gXK-_WrV3SweRGdepKfgD_ZJG-WmINnIAuU-CelAsKD4VSIokO02AB1jYvqyG2C-C5rs7duJcCjkjVBY4rq5k5reiIkdvf2RJuwUg_DtfRZ9H1amL",
          widthPx: 1080,
          heightPx: 1920,
          authorAttributions: [
            {
              displayName: "Robert Alexander Boyle",
              uri: "//maps.google.com/maps/contrib/110748589967585680902",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUJ0FkTXmE5yfsHFquLesb1S9MwMj_umU_PJf9ntRWWYpP1ADHL=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleParking: true,
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls",
      types: [
        "brunch_restaurant",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      formattedAddress: "65 Pondfield Rd, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "65",
          shortText: "65",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Pondfield Road",
          shortText: "Pondfield Rd",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.9407694,
        longitude: -73.8332839,
      },
      rating: 4.3,
      websiteUri: "https://thetacoproject.com/locations/bronxville/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 1,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 2,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 3,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 4,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 5,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 6,
              hour: 22,
              minute: 0,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:00 AM – 9:00 PM",
          "Tuesday: 11:00 AM – 9:00 PM",
          "Wednesday: 11:00 AM – 9:00 PM",
          "Thursday: 11:00 AM – 9:00 PM",
          "Friday: 11:00 AM – 10:00 PM",
          "Saturday: 11:00 AM – 10:00 PM",
          "Sunday: 11:00 AM – 9:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_MODERATE",
      userRatingCount: 378,
      displayName: {
        text: "The Taco Project",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:00 AM – 9:00 PM",
          "Tuesday: 11:00 AM – 9:00 PM",
          "Wednesday: 11:00 AM – 9:00 PM",
          "Thursday: 11:00 AM – 9:00 PM",
          "Friday: 11:00 AM – 10:00 PM",
          "Saturday: 11:00 AM – 10:00 PM",
          "Sunday: 11:00 AM – 9:00 PM",
        ],
      },
      currentSecondaryOpeningHours: [
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 4,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 0,
                hour: 18,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
            {
              open: {
                day: 1,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
              close: {
                day: 1,
                hour: 18,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
            },
            {
              open: {
                day: 2,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
              close: {
                day: 2,
                hour: 21,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
            },
            {
              open: {
                day: 3,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
              close: {
                day: 3,
                hour: 18,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
            },
            {
              open: {
                day: 4,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
              close: {
                day: 4,
                hour: 18,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
            },
            {
              open: {
                day: 5,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
              close: {
                day: 5,
                hour: 18,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 6,
                hour: 18,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 4:00 – 6:00 PM",
            "Tuesday: 11:00 AM – 9:00 PM",
            "Wednesday: 4:00 – 6:00 PM",
            "Thursday: 4:00 – 6:00 PM",
            "Friday: 4:00 – 6:00 PM",
            "Saturday: 4:00 – 6:00 PM",
            "Sunday: 4:00 AM – 6:00 PM",
          ],
          secondaryHoursType: "HAPPY_HOUR",
        },
        {
          openNow: true,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 1,
                hour: 0,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
            },
            {
              open: {
                day: 1,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
              close: {
                day: 2,
                hour: 0,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
            },
            {
              open: {
                day: 2,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
              close: {
                day: 2,
                hour: 23,
                minute: 59,
                truncated: true,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
            },
            {
              open: {
                day: 3,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
              close: {
                day: 4,
                hour: 0,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
            },
            {
              open: {
                day: 4,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
              close: {
                day: 5,
                hour: 0,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
            },
            {
              open: {
                day: 5,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
              close: {
                day: 6,
                hour: 0,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 0,
                hour: 0,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 11:00 AM – 12:00 AM",
            "Tuesday: 11:00 AM – 12:00 AM",
            "Wednesday: 11:00 AM – 12:00 AM",
            "Thursday: 11:00 AM – 12:00 AM",
            "Friday: 11:00 AM – 12:00 AM",
            "Saturday: 11:00 AM – 12:00 AM",
            "Sunday: 11:00 AM – 12:00 AM",
          ],
          secondaryHoursType: "TAKEOUT",
        },
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 0,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 6,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: Closed",
            "Tuesday: Closed",
            "Wednesday: Closed",
            "Thursday: Closed",
            "Friday: Closed",
            "Saturday: 11:00 AM – 3:00 PM",
            "Sunday: 11:00 AM – 3:00 PM",
          ],
          secondaryHoursType: "BRUNCH",
        },
      ],
      regularSecondaryOpeningHours: [
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 4,
                minute: 0,
              },
              close: {
                day: 0,
                hour: 18,
                minute: 0,
              },
            },
            {
              open: {
                day: 1,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 1,
                hour: 18,
                minute: 0,
              },
            },
            {
              open: {
                day: 2,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 2,
                hour: 21,
                minute: 0,
              },
            },
            {
              open: {
                day: 3,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 3,
                hour: 18,
                minute: 0,
              },
            },
            {
              open: {
                day: 4,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 4,
                hour: 18,
                minute: 0,
              },
            },
            {
              open: {
                day: 5,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 5,
                hour: 18,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 18,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 4:00 – 6:00 PM",
            "Tuesday: 11:00 AM – 9:00 PM",
            "Wednesday: 4:00 – 6:00 PM",
            "Thursday: 4:00 – 6:00 PM",
            "Friday: 4:00 – 6:00 PM",
            "Saturday: 4:00 – 6:00 PM",
            "Sunday: 4:00 AM – 6:00 PM",
          ],
          secondaryHoursType: "HAPPY_HOUR",
        },
        {
          openNow: true,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 1,
                hour: 0,
                minute: 0,
              },
            },
            {
              open: {
                day: 1,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 2,
                hour: 0,
                minute: 0,
              },
            },
            {
              open: {
                day: 2,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 3,
                hour: 0,
                minute: 0,
              },
            },
            {
              open: {
                day: 3,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 4,
                hour: 0,
                minute: 0,
              },
            },
            {
              open: {
                day: 4,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 5,
                hour: 0,
                minute: 0,
              },
            },
            {
              open: {
                day: 5,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 0,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 0,
                hour: 0,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 11:00 AM – 12:00 AM",
            "Tuesday: 11:00 AM – 12:00 AM",
            "Wednesday: 11:00 AM – 12:00 AM",
            "Thursday: 11:00 AM – 12:00 AM",
            "Friday: 11:00 AM – 12:00 AM",
            "Saturday: 11:00 AM – 12:00 AM",
            "Sunday: 11:00 AM – 12:00 AM",
          ],
          secondaryHoursType: "TAKEOUT",
        },
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 0,
                hour: 15,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 15,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: Closed",
            "Tuesday: Closed",
            "Wednesday: Closed",
            "Thursday: Closed",
            "Friday: Closed",
            "Saturday: 11:00 AM – 3:00 PM",
            "Sunday: 11:00 AM – 3:00 PM",
          ],
          secondaryHoursType: "BRUNCH",
        },
      ],
      primaryType: "restaurant",
      photos: [
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXVYSMLuwt8JWInHSJY60b6Qjot_tlBBvGZvmSKgVjpGK9wsGZ90mrfP3Dshpob_g08YeHqchKoiz7cLBgnk8fGt06T8gwUwYxIXMlKABFkBIC2dACOATGaUMnNdGYg0m9z27gCi3xuwYhg94ukDVEj6tTA0mg8QoPT9",
          widthPx: 2992,
          heightPx: 2992,
          authorAttributions: [
            {
              displayName: "Cesar Blanco",
              uri: "//maps.google.com/maps/contrib/103754609233749771540",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUsSZU1uOH5PGcCPzqbQrtNioQ10hPbuIFrGMqcjILIMRUtiopcpQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXWd0rPJfpzCRMLsG_n10S-def0AAhbDBsZo3PNSFBO6XPamtTppaE6wpjzm1fUNzcsOeSskd28sxL-cHfnFlhzD8ecq5zZNYnYyPGTdQsJzApc7taqx92mVEhAF2L1v1G6h7UlfBhEkDiWjFmdmXJsJ_z0C6R614Guo",
          widthPx: 3000,
          heightPx: 4498,
          authorAttributions: [
            {
              displayName: "The Taco Project",
              uri: "//maps.google.com/maps/contrib/109397006751132688605",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXZ_NB9YpFdRPl1qbGsShixQcfG6KcjDm7dlUo1kv-tqLcijo4=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXXFVWUDxSe_t1_8VqcRfJLrWTCO5B6C1uyCg9AdV17LsSsERua73bnP5xqdXKraUdv7Sj1Q1wjLb2rFf3OYsoichgu-NmTCaWolaMp1AoU9ZE4QYKN3DmfuY55Xg1LnPxYuHNzXh0VhoIwbVqDr7rkEdEFxQtMcVHso",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "The Taco Project",
              uri: "//maps.google.com/maps/contrib/109397006751132688605",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXZ_NB9YpFdRPl1qbGsShixQcfG6KcjDm7dlUo1kv-tqLcijo4=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXXhHmg6Vdo-swsUJtEEsWbBA3Nr31BoLpVilHVyiKPp82AB4SMwv3yxg2WAY78b6SZHF35SRPYjU-C40ZvUFQhVOK-EzyIqxrtUtqkfpufnFpqcbkrL0bU4elrFKSDxuLpx-JwInAX5wb3M3DR22YL6sS-yvkUVZplG",
          widthPx: 3000,
          heightPx: 4498,
          authorAttributions: [
            {
              displayName: "The Taco Project",
              uri: "//maps.google.com/maps/contrib/109397006751132688605",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXZ_NB9YpFdRPl1qbGsShixQcfG6KcjDm7dlUo1kv-tqLcijo4=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXUjmsmIx44w4RPwGRD82ac23WOF_D8prmG0Q2QMshzheyQCex_ZNJqRH7wgJPDY0vHoCajDHZ4US7VBEx1G7oov2gEX_g08C1i9garYugya5_o94XfIblqQJayWrxIMegVpmWA5YlNkbdf2C10uWXAnkllgklqDy6Hp",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Eva Perez",
              uri: "//maps.google.com/maps/contrib/112367570864029807305",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW2mEbzLS5U_zWhFfjQtiKcxGx89P07qecm4fNgkNPJZit_0ibqyA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXV8JtyMWztFyD53mjB-pSfaCn1kKir2DuX-5IOaArhkIKhqhdZYJeDLkuXKZxBq75bdkkgX_0KuZxQ2EU5_UYQ1ADuX-nuye-lDHYJXpLuyel99TjFdOMzo2Mqhh73tRSc6gmBwIfuI0bgIUNv4ZZZ9gTcxk6XVDPTz",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Chris Gerber",
              uri: "//maps.google.com/maps/contrib/107448670651566569306",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUGW-rgBfRJzHWXmt3SCLPn2-NV4rTYL2psrhmOBkQoX1gMOg1fNQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXU6ybyLYWZQv2U-brzLg_9KMDmN_tHhtrLTMzbRofVxEX-0ovoyF1POhgWef4z6vSyjiOReZwRzzZ3I0ofhGojdBZpnY-Ck2RJ6SY6sQ6f9tebsGwG6ZxVvRaFlh0yECrOGg2dqA2-fuD1Xd-iYjD4d6zFYWrhuWQ2g",
          widthPx: 4032,
          heightPx: 1908,
          authorAttributions: [
            {
              displayName: "Heather F (Nurturedbynature1111)",
              uri: "//maps.google.com/maps/contrib/116920449522519003452",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUtBQ6wXYWiviRkSDulhHTk1syyFGWoR_P1Tr1WtlLrTwaDcrShKA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXUF-7K90NW1cnTYz8grlD6TqLmJTbCwhsE96xJKeQNb8CFf3M24jUs8HzZ0_LItkX7DMgKozE0Emhp2w2CjPmcYaYHDhu0tr7JDrk0m7ivS8d2-4Ls25rRxWTm92R8zWkCmA2d7fGvwfXbkefrhCnDqS9Znn4__do4p",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Gerard Visser",
              uri: "//maps.google.com/maps/contrib/117835854773569504294",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVIo-uGyIVfdSS9OnqrsUw79rnAplzsVIMjxz1BCLhstSO480Fjnw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXU74tAxZBDnoMuQPAZLja1Wrh4KsGLaKmfigJvd3lyDM9fwMIPeElbxq7Ix9DvaAoi142pBP0L7ugO-eYKGkpS5iXbkGBAaAcM2kPLSqbHdTYkTWisjOtGSD-wrSabblD756GABFVCoxD2FNwIvWXJDpYn5cX8etOWS",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "William Crumlic",
              uri: "//maps.google.com/maps/contrib/111622802133898265003",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXdnnA_x6v5TgQqFC3eEHA3AzfNC5AqRlWU6twKRaMh3w32WK4qhw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJfxSm1EyTwokRYGIgYm3dqls/photos/AUc7tXXAnEe3iJSswdRxBbN67F0F8mrqQjfLkyfMkLEMYS3CPERrBNAMo33gDWTvbLPsdCINbEkCuMEjKMLmMB16oRe46zVUOaxPf3wrTfDVXm716jYFcLg863rOhwRA2Z59a7Nk6Ioto7ZTBr_ozjkEaz8n0yxSYB-Ffm-W",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Nyelex",
              uri: "//maps.google.com/maps/contrib/117811040693882315042",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXS9lR1MrEHAlhMZk75Gv-HdBd4Coq6PeAZPvhqhwrG-irILFCC=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleParking: true,
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJG3TgE66SwokRX0scyzq-V6o",
      types: [
        "american_restaurant",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      formattedAddress: "74 Pondfield Rd, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "74",
          shortText: "74",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Pondfield Road",
          shortText: "Pondfield Rd",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
        {
          longText: "3801",
          shortText: "3801",
          types: ["postal_code_suffix"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.9403778,
        longitude: -73.833586099999991,
      },
      rating: 4.4,
      websiteUri: "http://www.underhillscrossing.com/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 1,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 2,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 3,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 4,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 5,
              hour: 22,
              minute: 30,
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 6,
              hour: 22,
              minute: 30,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:30 AM – 10:00 PM",
          "Tuesday: 11:30 AM – 10:00 PM",
          "Wednesday: 11:30 AM – 10:00 PM",
          "Thursday: 11:30 AM – 10:00 PM",
          "Friday: 11:30 AM – 10:30 PM",
          "Saturday: 11:00 AM – 10:30 PM",
          "Sunday: 11:00 AM – 9:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_EXPENSIVE",
      userRatingCount: 443,
      displayName: {
        text: "Underhills Crossing",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 22,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 22,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:30 AM – 10:00 PM",
          "Tuesday: 11:30 AM – 10:00 PM",
          "Wednesday: 11:30 AM – 10:00 PM",
          "Thursday: 11:30 AM – 10:00 PM",
          "Friday: 11:30 AM – 10:30 PM",
          "Saturday: 11:00 AM – 10:30 PM",
          "Sunday: 11:00 AM – 9:00 PM",
        ],
      },
      currentSecondaryOpeningHours: [
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 0,
                hour: 19,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
            {
              open: {
                day: 1,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
              close: {
                day: 1,
                hour: 20,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
            },
            {
              open: {
                day: 2,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
              close: {
                day: 2,
                hour: 20,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
            },
            {
              open: {
                day: 3,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
              close: {
                day: 3,
                hour: 20,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
            },
            {
              open: {
                day: 4,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
              close: {
                day: 4,
                hour: 20,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
            },
            {
              open: {
                day: 5,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
              close: {
                day: 5,
                hour: 20,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 16,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 6,
                hour: 20,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 4:00 – 8:00 PM",
            "Tuesday: 4:00 – 8:00 PM",
            "Wednesday: 4:00 – 8:30 PM",
            "Thursday: 4:00 – 8:00 PM",
            "Friday: 4:00 – 8:00 PM",
            "Saturday: 4:00 – 8:00 PM",
            "Sunday: 4:00 – 7:00 PM",
          ],
          secondaryHoursType: "DELIVERY",
        },
        {
          openNow: true,
          periods: [
            {
              open: {
                day: 0,
                hour: 12,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 0,
                hour: 19,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
            {
              open: {
                day: 1,
                hour: 12,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
              close: {
                day: 1,
                hour: 20,
                minute: 30,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
            },
            {
              open: {
                day: 2,
                hour: 12,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
              close: {
                day: 2,
                hour: 20,
                minute: 30,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
            },
            {
              open: {
                day: 3,
                hour: 12,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
              close: {
                day: 3,
                hour: 20,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
            },
            {
              open: {
                day: 4,
                hour: 12,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
              close: {
                day: 4,
                hour: 20,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
            },
            {
              open: {
                day: 5,
                hour: 12,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
              close: {
                day: 5,
                hour: 21,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 12,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 6,
                hour: 21,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 12:00 – 8:30 PM",
            "Tuesday: 12:00 – 8:30 PM",
            "Wednesday: 12:00 – 8:30 PM",
            "Thursday: 12:00 – 8:30 PM",
            "Friday: 12:00 – 9:00 PM",
            "Saturday: 12:00 – 9:00 PM",
            "Sunday: 12:00 – 7:30 PM",
          ],
          secondaryHoursType: "TAKEOUT",
        },
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 0,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 6,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: Closed",
            "Tuesday: Closed",
            "Wednesday: Closed",
            "Thursday: Closed",
            "Friday: Closed",
            "Saturday: 11:00 AM – 3:00 PM",
            "Sunday: 11:00 AM – 3:00 PM",
          ],
          secondaryHoursType: "BRUNCH",
        },
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 0,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
            {
              open: {
                day: 1,
                hour: 11,
                minute: 30,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
              close: {
                day: 1,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
            },
            {
              open: {
                day: 2,
                hour: 11,
                minute: 30,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
              close: {
                day: 2,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
            },
            {
              open: {
                day: 3,
                hour: 11,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
              close: {
                day: 3,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
            },
            {
              open: {
                day: 4,
                hour: 11,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
              close: {
                day: 4,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
            },
            {
              open: {
                day: 5,
                hour: 11,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
              close: {
                day: 5,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 11,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 6,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 11:30 AM – 3:00 PM",
            "Tuesday: 11:30 AM – 3:00 PM",
            "Wednesday: 11:30 AM – 3:00 PM",
            "Thursday: 11:30 AM – 3:00 PM",
            "Friday: 11:30 AM – 3:00 PM",
            "Saturday: 11:00 AM – 3:00 PM",
            "Sunday: 11:00 AM – 3:00 PM",
          ],
          secondaryHoursType: "LUNCH",
        },
        {
          openNow: true,
          periods: [
            {
              open: {
                day: 0,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
              close: {
                day: 0,
                hour: 20,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 30,
                },
              },
            },
            {
              open: {
                day: 1,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
              close: {
                day: 1,
                hour: 21,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 1,
                },
              },
            },
            {
              open: {
                day: 2,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
              close: {
                day: 2,
                hour: 21,
                minute: 0,
                date: {
                  year: 2024,
                  month: 7,
                  day: 2,
                },
              },
            },
            {
              open: {
                day: 3,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
              close: {
                day: 3,
                hour: 21,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 26,
                },
              },
            },
            {
              open: {
                day: 4,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
              close: {
                day: 4,
                hour: 21,
                minute: 30,
                date: {
                  year: 2024,
                  month: 6,
                  day: 27,
                },
              },
            },
            {
              open: {
                day: 5,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
              close: {
                day: 5,
                hour: 22,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 28,
                },
              },
            },
            {
              open: {
                day: 6,
                hour: 15,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
              close: {
                day: 6,
                hour: 22,
                minute: 0,
                date: {
                  year: 2024,
                  month: 6,
                  day: 29,
                },
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 3:00 – 9:00 PM",
            "Tuesday: 3:00 – 9:00 PM",
            "Wednesday: 3:00 – 9:00 PM",
            "Thursday: 3:00 – 9:30 PM",
            "Friday: 3:00 – 10:00 PM",
            "Saturday: 3:00 – 10:00 PM",
            "Sunday: 3:00 – 8:30 PM",
          ],
          secondaryHoursType: "DINNER",
        },
      ],
      regularSecondaryOpeningHours: [
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 0,
                hour: 19,
                minute: 0,
              },
            },
            {
              open: {
                day: 1,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 1,
                hour: 20,
                minute: 0,
              },
            },
            {
              open: {
                day: 2,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 2,
                hour: 20,
                minute: 0,
              },
            },
            {
              open: {
                day: 3,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 3,
                hour: 20,
                minute: 30,
              },
            },
            {
              open: {
                day: 4,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 4,
                hour: 20,
                minute: 0,
              },
            },
            {
              open: {
                day: 5,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 5,
                hour: 20,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 16,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 20,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 4:00 – 8:00 PM",
            "Tuesday: 4:00 – 8:00 PM",
            "Wednesday: 4:00 – 8:30 PM",
            "Thursday: 4:00 – 8:00 PM",
            "Friday: 4:00 – 8:00 PM",
            "Saturday: 4:00 – 8:00 PM",
            "Sunday: 4:00 – 7:00 PM",
          ],
          secondaryHoursType: "DELIVERY",
        },
        {
          openNow: true,
          periods: [
            {
              open: {
                day: 0,
                hour: 12,
                minute: 0,
              },
              close: {
                day: 0,
                hour: 19,
                minute: 30,
              },
            },
            {
              open: {
                day: 1,
                hour: 12,
                minute: 0,
              },
              close: {
                day: 1,
                hour: 20,
                minute: 30,
              },
            },
            {
              open: {
                day: 2,
                hour: 12,
                minute: 0,
              },
              close: {
                day: 2,
                hour: 20,
                minute: 30,
              },
            },
            {
              open: {
                day: 3,
                hour: 12,
                minute: 0,
              },
              close: {
                day: 3,
                hour: 20,
                minute: 30,
              },
            },
            {
              open: {
                day: 4,
                hour: 12,
                minute: 0,
              },
              close: {
                day: 4,
                hour: 20,
                minute: 30,
              },
            },
            {
              open: {
                day: 5,
                hour: 12,
                minute: 0,
              },
              close: {
                day: 5,
                hour: 21,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 12,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 21,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 12:00 – 8:30 PM",
            "Tuesday: 12:00 – 8:30 PM",
            "Wednesday: 12:00 – 8:30 PM",
            "Thursday: 12:00 – 8:30 PM",
            "Friday: 12:00 – 9:00 PM",
            "Saturday: 12:00 – 9:00 PM",
            "Sunday: 12:00 – 7:30 PM",
          ],
          secondaryHoursType: "TAKEOUT",
        },
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 0,
                hour: 15,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 15,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: Closed",
            "Tuesday: Closed",
            "Wednesday: Closed",
            "Thursday: Closed",
            "Friday: Closed",
            "Saturday: 11:00 AM – 3:00 PM",
            "Sunday: 11:00 AM – 3:00 PM",
          ],
          secondaryHoursType: "BRUNCH",
        },
        {
          openNow: false,
          periods: [
            {
              open: {
                day: 0,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 0,
                hour: 15,
                minute: 0,
              },
            },
            {
              open: {
                day: 1,
                hour: 11,
                minute: 30,
              },
              close: {
                day: 1,
                hour: 15,
                minute: 0,
              },
            },
            {
              open: {
                day: 2,
                hour: 11,
                minute: 30,
              },
              close: {
                day: 2,
                hour: 15,
                minute: 0,
              },
            },
            {
              open: {
                day: 3,
                hour: 11,
                minute: 30,
              },
              close: {
                day: 3,
                hour: 15,
                minute: 0,
              },
            },
            {
              open: {
                day: 4,
                hour: 11,
                minute: 30,
              },
              close: {
                day: 4,
                hour: 15,
                minute: 0,
              },
            },
            {
              open: {
                day: 5,
                hour: 11,
                minute: 30,
              },
              close: {
                day: 5,
                hour: 15,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 11,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 15,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 11:30 AM – 3:00 PM",
            "Tuesday: 11:30 AM – 3:00 PM",
            "Wednesday: 11:30 AM – 3:00 PM",
            "Thursday: 11:30 AM – 3:00 PM",
            "Friday: 11:30 AM – 3:00 PM",
            "Saturday: 11:00 AM – 3:00 PM",
            "Sunday: 11:00 AM – 3:00 PM",
          ],
          secondaryHoursType: "LUNCH",
        },
        {
          openNow: true,
          periods: [
            {
              open: {
                day: 0,
                hour: 15,
                minute: 0,
              },
              close: {
                day: 0,
                hour: 20,
                minute: 30,
              },
            },
            {
              open: {
                day: 1,
                hour: 15,
                minute: 0,
              },
              close: {
                day: 1,
                hour: 21,
                minute: 0,
              },
            },
            {
              open: {
                day: 2,
                hour: 15,
                minute: 0,
              },
              close: {
                day: 2,
                hour: 21,
                minute: 0,
              },
            },
            {
              open: {
                day: 3,
                hour: 15,
                minute: 0,
              },
              close: {
                day: 3,
                hour: 21,
                minute: 0,
              },
            },
            {
              open: {
                day: 4,
                hour: 15,
                minute: 0,
              },
              close: {
                day: 4,
                hour: 21,
                minute: 30,
              },
            },
            {
              open: {
                day: 5,
                hour: 15,
                minute: 0,
              },
              close: {
                day: 5,
                hour: 22,
                minute: 0,
              },
            },
            {
              open: {
                day: 6,
                hour: 15,
                minute: 0,
              },
              close: {
                day: 6,
                hour: 22,
                minute: 0,
              },
            },
          ],
          weekdayDescriptions: [
            "Monday: 3:00 – 9:00 PM",
            "Tuesday: 3:00 – 9:00 PM",
            "Wednesday: 3:00 – 9:00 PM",
            "Thursday: 3:00 – 9:30 PM",
            "Friday: 3:00 – 10:00 PM",
            "Saturday: 3:00 – 10:00 PM",
            "Sunday: 3:00 – 8:30 PM",
          ],
          secondaryHoursType: "DINNER",
        },
      ],
      primaryType: "american_restaurant",
      photos: [
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXX_EqznDH08W0_1Us2SFq2VQZseM-_0P5t0nM1NxNfj7fiHh8fSRlyJz1sUxgf9uAqDq8C4BFbWuzPLdlWe1X7uvaCOPnlSM9ZqEY-PZaxyQ3eowWans9E3-QcX300dCrvEjFDO2dIKVnjKAyMIvwOCvf5ehbJJ046Z",
          widthPx: 850,
          heightPx: 314,
          authorAttributions: [
            {
              displayName: "Underhills Crossing",
              uri: "//maps.google.com/maps/contrib/103357425819361248278",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXPdeA5-piNbIadZ2W5M5FQAF5lIc6FQDaEKdTFQJ1PZd0716s=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXWRibr9rxL-18ZN5eIsYBj5pEM9E-gmggPURBO4Y1edpKMEWVLFOl_3JqyKsSCemfd1D3xQY_uAl0YPK0g3qECnM7sx-v_sH3ED0bElqDduJ5cQW2pCPeZjwmDXEBFtdqKLvV63Q_OxgeR43egID7f0w-2qRG6_0WQ1",
          widthPx: 3072,
          heightPx: 4080,
          authorAttributions: [
            {
              displayName: "Dominick Vellucci",
              uri: "//maps.google.com/maps/contrib/116345219794599247988",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLL_owKx7Ll_ECHNGV8gYvICGsjANzrOOhaddLlAt_rs7dnEw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXWyFwmwRzl2li6p9OMHUEmJVxZm3wBtZOsd0TrE6gYXa8BhKspJ3iaA_c1X5-luSn2adDuNtuB_vfsE2R8Qtsa2LTVTnGXhoMVtEvG0FRrGH2_JCYufuWuvzM8HUfahjS7V8Z-q8yyvQgs05iwO7e5dRssUPJy3PYOE",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Dominick Vellucci",
              uri: "//maps.google.com/maps/contrib/116345219794599247988",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLL_owKx7Ll_ECHNGV8gYvICGsjANzrOOhaddLlAt_rs7dnEw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXV8hgfrrzK2G0CYW1qwf_P__uzqhMNmNsAUC1B4DKSipBw-IthlhagIGdKIg1exxx552vV_ZVfEARH4UcHv_8HGokPIkTTQLNkQtxF4eCYNa1kl2u8HTWOi4JY4TPGeoHGN6h2-chTs1YSr9F6GkrqXFbbhc4TSu1Ya",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Carmine Battista",
              uri: "//maps.google.com/maps/contrib/105370633778241153025",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXdqmQxSkDZiKWzMj-lQoSJwv2cpR8yDliWEqYOUROPDtOv4pM=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXW7LsQ5cgi1IRkNBIsMpDNE12STh5WBiWNk-4LcnDRmK1Q0wpMc2WI1pijgxR7zAudNRBfj_oUXLU1TlKrPRe-jMLNtV1HvdpuTrAu1aO_61zU7JAAhSIgWyyvD6kVm1EYe7Z15ITJ2-vC_X1jGQbNjtAI131utoDDN",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Tony Shkurtaj",
              uri: "//maps.google.com/maps/contrib/108063350920350331139",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocKJYmO6_MhFxanxxXBc4TWvIA-ARw4aBeCCmNyOSwrii-U0tQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXW9-rxqXIVQCE1jkd_iaWVTgEBeizL1Yfc0gcmIJ1nJfMY1u611m-uD4uLrZ2cvUYqLamfZKNtUMp0uciMi2NXlbIWAzZ3DNWYWzxHjYztz5DKXtM3o4o2IVVgaJiiA3XyzId0RBhKYRa63PI_aCl_71f4QV55nkVXf",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Carmine Battista",
              uri: "//maps.google.com/maps/contrib/105370633778241153025",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXdqmQxSkDZiKWzMj-lQoSJwv2cpR8yDliWEqYOUROPDtOv4pM=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXXXF2Vk85X95qBtuFgrAUY2786UtGCHJ9pZRuLtKVxeDAZc3G5sUaQaJukz9jmIeSFTKlLHQp0yVmwlXLRCAeF2Ai3fDKYe-6VDcRE9jnsxwyNKGupWTybNiAwqv6qtd7_6_AnGauUtrPobN4-50r_LXL8Iu7iHHC0I",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Dominick Vellucci",
              uri: "//maps.google.com/maps/contrib/116345219794599247988",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLL_owKx7Ll_ECHNGV8gYvICGsjANzrOOhaddLlAt_rs7dnEw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXU7oSRcxdvy3Dl5X-yItoB0HRJhpflxkenTJ6r7gH0CKfuQO7mBLsBvOLrGXO24jLCLFXmSsD2oaGsMA46VZlDlv4AebHM9RG6k6aRfVRpHCkR4ve0IcnGIHJxHF9PDM3y8LBhea_sA8i_5iKhp_7pzFsd3KBv3pVkJ",
          widthPx: 3000,
          heightPx: 4000,
          authorAttributions: [
            {
              displayName: "Kathleen",
              uri: "//maps.google.com/maps/contrib/101682016355417045938",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWnuvCyxb1AomUv3V3gq9RJs6mmjZf77mwnPHRHk4jvNEP2FLXY3g=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXW0-N9QgKdjgsiH4c3HseLgRdKit1DroK_mIekVvw1t-EA-Xw5iXs4K2WHnYc8V9ym0FZPokPPinSfEZU55JoED6ckIP0QnyLVXNWiJJB5QXwlc2i2hFwjtNJuCS2f6_34GbFNfuj7cFq_bBR3ohDfGiLatwjt-GRH9",
          widthPx: 3000,
          heightPx: 4000,
          authorAttributions: [
            {
              displayName: "Larinzon Bruno",
              uri: "//maps.google.com/maps/contrib/114101730503913719322",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocL9NAssS95MOX52-Xm2I8CoE_H_p-au2WJkAE1Fu-8tfBzmkg=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJG3TgE66SwokRX0scyzq-V6o/photos/AUc7tXWJPWTzSAbtLZspKb9kXu7WSKYOSmQthKr_K_Ubgy71KwQW8E-QbPlLt4SzJZUKtWkABw-rUFQvZuI4wr57jP0w7f9mkFtENubups6EdHZp8CmZyBgJ7w9_E6X6aXzn3EW3dhyl7RuVC8XIxopxzmvz10fLXAtzbb7l",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Ann Wms",
              uri: "//maps.google.com/maps/contrib/109048576471835451634",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocIMRu7HvHTY4nT9HiwL_V9cvdS91YBrjqGS67dkuRwPA1DS-w=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleParking: true,
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY",
      types: [
        "american_restaurant",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      formattedAddress: "124 Pondfield Rd, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "124",
          shortText: "124",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Pondfield Road",
          shortText: "Pondfield Rd",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.9387247,
        longitude: -73.8328142,
      },
      rating: 4.4,
      websiteUri: "http://theurbanhamlet.com/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 1,
              hour: 21,
              minute: 30,
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 2,
              hour: 21,
              minute: 30,
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 3,
              hour: 21,
              minute: 30,
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 4,
              hour: 21,
              minute: 30,
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 5,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 6,
              hour: 22,
              minute: 0,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:30 AM – 9:30 PM",
          "Tuesday: 11:30 AM – 9:30 PM",
          "Wednesday: 11:30 AM – 9:30 PM",
          "Thursday: 11:30 AM – 9:30 PM",
          "Friday: 11:30 AM – 10:00 PM",
          "Saturday: 11:30 AM – 10:00 PM",
          "Sunday: 11:30 AM – 9:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_MODERATE",
      userRatingCount: 317,
      displayName: {
        text: "The Urban Hamlet",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 21,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 21,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 21,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 21,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 21,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:30 AM – 9:30 PM",
          "Tuesday: 11:30 AM – 9:30 PM",
          "Wednesday: 11:30 AM – 9:30 PM",
          "Thursday: 11:30 AM – 9:30 PM",
          "Friday: 11:30 AM – 10:00 PM",
          "Saturday: 11:30 AM – 10:00 PM",
          "Sunday: 11:30 AM – 9:00 PM",
        ],
      },
      primaryType: "american_restaurant",
      photos: [
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXWx2-Rg9tp_dIbAYmE38GJZZdItoAK3SbJZb8GhrRgq2t2xCNMstlKx7B1fD08NL1WJO6Fvkm6Q_Vsfj2tScn3Xec3MeHOdxwMfGN6nQKK6UjrD26NttfBwQBcpApxioRVmS-zJp2a9PQ_rB7j29_EZwVD8-6_nM9VJ",
          widthPx: 800,
          heightPx: 800,
          authorAttributions: [
            {
              displayName: "The Urban Hamlet",
              uri: "//maps.google.com/maps/contrib/101613830390933577682",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW5-IDr066a-5GEM3dW9iCRAV9TDuGF5XIhxgb2xGo0Qb95lVU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXW94J6FHsFPQfejZpB_SH2-xkTtnm-OogWQgrrYdgT3hyUjd8kra4xgy3UpK72FGeqEk6g7NN4OFty6x2m2d63KABKsHNN27ZSvWzpUkVkuUAbByeo4v9AN6PgW5xeZnjEeJFTkH8OdrEuOklTmm7Vte-NJ4ZLGZS8s",
          widthPx: 800,
          heightPx: 800,
          authorAttributions: [
            {
              displayName: "The Urban Hamlet",
              uri: "//maps.google.com/maps/contrib/101613830390933577682",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW5-IDr066a-5GEM3dW9iCRAV9TDuGF5XIhxgb2xGo0Qb95lVU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXXLZkhVDhszgaeFfIOYag_DcmlLPn6JA4PJzlu6gfPPbF3wlmIfYMCHkYHRtNR_uf1yANKycXB7HUoid1rnvq_S8kELY8xl2T-JGv0KSRC0A3ML7xSRorcUzOzLB7ZstbVZLua_Q8xjcNcFPuNPQmcScYKV0yqQmmlV",
          widthPx: 800,
          heightPx: 800,
          authorAttributions: [
            {
              displayName: "The Urban Hamlet",
              uri: "//maps.google.com/maps/contrib/101613830390933577682",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW5-IDr066a-5GEM3dW9iCRAV9TDuGF5XIhxgb2xGo0Qb95lVU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXWkxvfmZ0WzsbvZAVQvlLbPoi35uyl17kRYXcrigH5n5AEdcdG2lM3ap91ntw8UqwfeXdPPvxREJEMz57s5CkZi96HglWTPFQjCLvOtmdXT-i6COSCaLmPMk9vUQChY0YJb4IhiHGwgU2mnqerJrwKM6skbtO5z0RUr",
          widthPx: 800,
          heightPx: 800,
          authorAttributions: [
            {
              displayName: "The Urban Hamlet",
              uri: "//maps.google.com/maps/contrib/101613830390933577682",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW5-IDr066a-5GEM3dW9iCRAV9TDuGF5XIhxgb2xGo0Qb95lVU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXXu7PnFwSWLjc0cWEBes6pgIdv9Kb5kuVxOvLTrBTmpToDNlojArY-fryU0cCE-b_PV3W5NFVRnT7hqyNF_kGhb0KgqWBBHjHGP-srud4rdArWjTEXRAU1hrKZlTsPb1rphYWbtRweJ48zoBB-X3ge7sRZrDBwP3dUJ",
          widthPx: 800,
          heightPx: 800,
          authorAttributions: [
            {
              displayName: "The Urban Hamlet",
              uri: "//maps.google.com/maps/contrib/101613830390933577682",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW5-IDr066a-5GEM3dW9iCRAV9TDuGF5XIhxgb2xGo0Qb95lVU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXVZG-PVGyY5aGi-wCPPmxyC7pz3Aqz3qvIhBDl1_crkjl2LEg6qPCuM6X6FIETwYzlkX0EjN8OF4QsvGC2gQbeXYCflckxC-x9LZ1BAT7TadBUmC5qljEXVZXk519HDIpT0cLWZfGfCXseokvZnLvRbhEI9UPc_wJig",
          widthPx: 800,
          heightPx: 800,
          authorAttributions: [
            {
              displayName: "The Urban Hamlet",
              uri: "//maps.google.com/maps/contrib/101613830390933577682",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW5-IDr066a-5GEM3dW9iCRAV9TDuGF5XIhxgb2xGo0Qb95lVU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXXdGRxK_vIeHx-dtQEkSK8IkXfS7iRtzWyB-dUtANacw7Qcn2xvAM4V_geK4guasT5cFaLFyCpaQ4mgeLRrcaNByOo7HRPO6ElKej6-fiG5wArIcV6Mv850cuGfOdTwGBvZuFzCIRtEv5iH7tM8IQ-Qjtcp6F0nLM9x",
          widthPx: 800,
          heightPx: 800,
          authorAttributions: [
            {
              displayName: "The Urban Hamlet",
              uri: "//maps.google.com/maps/contrib/101613830390933577682",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW5-IDr066a-5GEM3dW9iCRAV9TDuGF5XIhxgb2xGo0Qb95lVU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXWvCjQrVpsDQ_Qp_0kX5n0bfaL2hTNCWACe0AUV7mlhSgkhMOzrOAwk3pXKSwDktmDh4BdoJDe2L8poaZByyQ_3-AGS89_EbAdi6bbHeqRDIz5liG7UrFhFWD1SDYSIHPVpTmEzbmwp4mA3MCYcGLLfokJbXxYZkK_y",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Samreth Kagnoeung",
              uri: "//maps.google.com/maps/contrib/115464909674303705007",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU_GoSc_IS54vdmof_impNrPuSl19VMHpG6IF1l4z2Etfm2ymdRRQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXU4gezrH6fIfk0-IZfsa_RYWk3teuMDTVKUnikuBvyjWw2d3UcUdA_wwBX0qF5uwwEvyhnsX7Un9-YmyNKXjYNshiGx5RQValg54hLn80R5H02UvXFGLrx1GCTlIMTbvDlWjjcLWtAgvIMKePs_w7s2DXW-w5r9afua",
          widthPx: 800,
          heightPx: 800,
          authorAttributions: [
            {
              displayName: "The Urban Hamlet",
              uri: "//maps.google.com/maps/contrib/101613830390933577682",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjW5-IDr066a-5GEM3dW9iCRAV9TDuGF5XIhxgb2xGo0Qb95lVU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJl4RjnqeTwokRgvrQWgt9EmY/photos/AUc7tXUXWBEIzFEOyyAuUkWtpYnM1c9PxXk1S0kVbk_IEqrIZe9_WPVd5Iy77hi6qT1BAAPVgHLQQCuH0_04at9urp14W4pSy3KWwntxmYXkctnOwkhxVcKkxCZG76mrbfFZeP_-3U6fwi4cs97WUCWvl5WMWEWLIC5r7BzH",
          widthPx: 3000,
          heightPx: 4000,
          authorAttributions: [
            {
              displayName: "Frank Lucus",
              uri: "//maps.google.com/maps/contrib/101828356860680569955",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUB3a7uUY7mWsjReQhN0LMu4oylhrV5S2rTSwa_JhPNjuOPKtMy=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleParking: true,
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJ0aowaK6SwokRL-HTR_foN38",
      types: [
        "bar",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      formattedAddress: "60 Kraft Ave, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "60",
          shortText: "60",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Kraft Avenue",
          shortText: "Kraft Ave",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
        {
          longText: "4110",
          shortText: "4110",
          types: ["postal_code_suffix"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.9392889,
        longitude: -73.83451389999999,
      },
      rating: 4.4,
      websiteUri: "http://jcfogartys.com/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 0,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 1,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 2,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 3,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 4,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 5,
              hour: 23,
              minute: 0,
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 30,
            },
            close: {
              day: 6,
              hour: 23,
              minute: 0,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:30 AM – 10:00 PM",
          "Tuesday: 11:30 AM – 10:00 PM",
          "Wednesday: 11:30 AM – 10:00 PM",
          "Thursday: 11:30 AM – 10:00 PM",
          "Friday: 11:30 AM – 11:00 PM",
          "Saturday: 11:30 AM – 11:00 PM",
          "Sunday: 11:30 AM – 10:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_MODERATE",
      userRatingCount: 527,
      displayName: {
        text: "J C Fogarty's",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 23,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 30,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 23,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:30 AM – 10:00 PM",
          "Tuesday: 11:30 AM – 10:00 PM",
          "Wednesday: 11:30 AM – 10:00 PM",
          "Thursday: 11:30 AM – 10:00 PM",
          "Friday: 11:30 AM – 11:00 PM",
          "Saturday: 11:30 AM – 11:00 PM",
          "Sunday: 11:30 AM – 10:00 PM",
        ],
      },
      primaryType: "restaurant",
      photos: [
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXUQIxvWprL9x2wQlqbaaii87yQX31PfLIzNreakpXEsPZjhGTUdd8WXXKzdjcfzHvvPbKZi_qIhqwgV3cVlg4dhEcMvbJTIhi7i-lHFA7X0PMA6Ru6wGlYDdJFO7of6-C6RacMdJ-7mKeA1r2AUxAnpivDH0WaKWUji",
          widthPx: 2448,
          heightPx: 3264,
          authorAttributions: [
            {
              displayName: "Army G",
              uri: "//maps.google.com/maps/contrib/110676994141518641408",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUdOw_Tl_j9d9nzOh8uX0sTbp-z0KQQK3UXZHYEw0fKCVezH3cqJg=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXVJEuErDUtuRYDwHFIDyaWjAisHSCGlNCPqNCmeGpKCQqr0CoD4g52Nqa4FTdHTtE41MVkar3VAE1MdTLjYHjVvsoEoeLSYcpYpRYdMnoOZ_6XkKj6AAZeHo_fnlTzHhKXcFmqF-3UrD81JBv7Is6VsWnevkGW4mhgq",
          widthPx: 3072,
          heightPx: 4080,
          authorAttributions: [
            {
              displayName: "Michelle Ciofalo",
              uri: "//maps.google.com/maps/contrib/105555818638232816628",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUstqMBmP41Y3BAqUEQH14xKmJBN13ItiTeSuxxmfibYsejkGBY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXXRj2COF0WCIAiJCYX_BQt0jrARag_fZ5zqJX9oRstaoau7b6dOp1xuYv-3phP6g7qYRC27gTm1g2v3MAJHkc8m5M5DRd4miKdctdKQtvGYBrnp1z1RTyA6w7XjzjF9D2UhT7Tmv9MC8L_YonsSbWOFqY0XXOBbZvzB",
          widthPx: 2609,
          heightPx: 3713,
          authorAttributions: [
            {
              displayName: "James Hynes",
              uri: "//maps.google.com/maps/contrib/106509990577861510655",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocIYBVe8_r8aKKBtOjvJixBnNIo0fdmyBouFtoRxf742iZv53Q=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXUtfC7NlUO3SJS_0aipAp9j15cjTlXJEr5Muks567_czgjGHAZHJxxrG74ItTrm3AwL-IG0ySrlKP8goKZzI9adZaTBzjmI6wp-SL-Mg_7-HUjwLfZY6HO25I_CDISilkyfX1EsQHYLFxFUfARJJ3Y3VVZZDRBWCy5W",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Tony Shkurtaj",
              uri: "//maps.google.com/maps/contrib/108063350920350331139",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocKJYmO6_MhFxanxxXBc4TWvIA-ARw4aBeCCmNyOSwrii-U0tQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXW8G_oDuDZSFhzR-i0uuh90Jj92x8VPiU2t-WeXIgZO2EPF_7Jns_TBsE0hzFuudXNdVISrCKpv4J38-khW8xLwE0-8u_50_mLM6n0xeOrCkg5ekeBkWNXiBx74LAUpBCwLrgd-Oht7zyHmJRZfcPB4rdeE60wk_4VQ",
          widthPx: 4032,
          heightPx: 2268,
          authorAttributions: [
            {
              displayName: "soxxpuppet",
              uri: "//maps.google.com/maps/contrib/113279348064979698475",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXNBS72pjlA_sFxvr2t1B5nFUqkuqJaxKHKZ9K2hXrMOb_fiDpL=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXWy19nypENmyco6IF6yEZAt_GmsTfH0cPNB74KsXO1VipT17F4dDGIE6ypeqOwSJVbcTn5tq5Ofa-LInPULzQ0nU6ocrvIWBQy_epEsmDtzog0g0PYhzMUk9-hDOjUk4o5fsD9ngVUh_cVoaoCMvWorgJFfmccNR94U",
          widthPx: 1200,
          heightPx: 1600,
          authorAttributions: [
            {
              displayName: "Genesis Balloons & Decorations",
              uri: "//maps.google.com/maps/contrib/107570140054536850403",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUueQRQbJWslvQq02d9sXGy44ZJqTRLlRHn_myvJYUDOUEwLB8=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXWUD2e2M7DSe1_FjKvZ3g4x3ZR_Rw6Syvn13sJSjQd3lpdGza8D0sGHKaMseRzQYYsjwRynh_2kzj-Ft0ohe9ogPhX520yoMmxxj8Ey6keuXWig0tD7XS46r0KY4rkEY8sfO8qkcg9dS1VK1D27PJ7xMJDIxLcstDZf",
          widthPx: 2268,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Illey Graham",
              uri: "//maps.google.com/maps/contrib/111127826653062456923",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU6SlAeXeUW2CRYU8hrcu-4roDUGWDAZCYcro1LGEMjRvfBszAb=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXXaGS4f-OdGcgz-02NC2CHqDhqbWShiL68SI2vxxBGNUQM64uRycrD9whUqQv3fBMS10d8NZBE5BUaj_BTpvOUAle5pqRrs5DiQfC0q5mbRqwLrwKefOnARoXhGAoAQu_n-OZY2s0G7WCx8i5kHPMxsRKsrbRi8iqAR",
          widthPx: 4048,
          heightPx: 3036,
          authorAttributions: [
            {
              displayName: "Jeanne Marie Hoffman",
              uri: "//maps.google.com/maps/contrib/109375371905095030322",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXhTpfWbNQtyA7jznRtxqquI4VlpxC6pL0Is7rmDezwymXRSCEj=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXWyKzy8SUHJY2M5Ticx2wTvJhn2km4AR84Sh5AwAPSYVnl75Kw4bkZsBI9_oDJ-aABNwDkQ8kGK0BKXF45jA7LOC2SDDxMKMl6NVRdyFhHOqK4aiRO08XSTgyuNfMCHxEEuChd2YMIAZvRiFyq7FXXungI997jr3dBQ",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Jeanne Marie Hoffman",
              uri: "//maps.google.com/maps/contrib/109375371905095030322",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXhTpfWbNQtyA7jznRtxqquI4VlpxC6pL0Is7rmDezwymXRSCEj=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJ0aowaK6SwokRL-HTR_foN38/photos/AUc7tXVJe-P3HZsi3NI0wUKNHKoeqehA9dvqCUUHYV1TgUFwq8xa-Fdkx84SgmSh8iKEWW3eMCaFjhnBXM6JCUwO4wz7fx2skMTeezdhzf1ag6npqUm32wLy9q1hEy0F423wv-4qAsBnQD2cIWAJWBSl9We-IdM1qLASDHhW",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "dalrick dandy",
              uri: "//maps.google.com/maps/contrib/117017372155994499398",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXLHHkutoIvpYAeMkUAWhmqAxXSv-9RtqSTnCz4tC_f6ABEVeQ=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleParking: true,
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJZReJaq6SwokRbZGfHBROUZU",
      types: [
        "bar",
        "american_restaurant",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      formattedAddress: "18-20 Park Pl, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "18-20",
          shortText: "18-20",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Park Place",
          shortText: "Park Pl",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.939835699999996,
        longitude: -73.834142500000013,
      },
      rating: 4.1,
      websiteUri: "http://www.petesofbronxville.com/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 1,
              hour: 0,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 2,
              hour: 0,
              minute: 0,
            },
          },
          {
            open: {
              day: 2,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 3,
              hour: 0,
              minute: 0,
            },
          },
          {
            open: {
              day: 3,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 4,
              hour: 0,
              minute: 0,
            },
          },
          {
            open: {
              day: 4,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 5,
              hour: 0,
              minute: 0,
            },
          },
          {
            open: {
              day: 5,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 6,
              hour: 1,
              minute: 0,
            },
          },
          {
            open: {
              day: 6,
              hour: 12,
              minute: 0,
            },
            close: {
              day: 0,
              hour: 4,
              minute: 0,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 12:00 PM – 12:00 AM",
          "Tuesday: 12:00 PM – 12:00 AM",
          "Wednesday: 12:00 PM – 12:00 AM",
          "Thursday: 12:00 PM – 12:00 AM",
          "Friday: 12:00 PM – 1:00 AM",
          "Saturday: 12:00 PM – 4:00 AM",
          "Sunday: 12:00 PM – 12:00 AM",
        ],
      },
      userRatingCount: 422,
      displayName: {
        text: "Pete's Park Place Tavern",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 1,
              hour: 0,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 2,
              hour: 0,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 23,
              minute: 59,
              truncated: true,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 4,
              hour: 0,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 5,
              hour: 0,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 6,
              hour: 1,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 12,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 0,
              hour: 4,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 12:00 PM – 12:00 AM",
          "Tuesday: 12:00 PM – 12:00 AM",
          "Wednesday: 12:00 PM – 12:00 AM",
          "Thursday: 12:00 PM – 12:00 AM",
          "Friday: 12:00 PM – 1:00 AM",
          "Saturday: 12:00 PM – 4:00 AM",
          "Sunday: 12:00 PM – 12:00 AM",
        ],
      },
      primaryType: "bar",
      photos: [
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXUCa_Lp0QfizMRQ7UWmMR-xDoqR_9Yn8k7ppNBJwe8uOkir3IQZrSvrzk3YyWXmiP4zBKxr1xMe90D_LF-mrrbAgnh3_tRRK-93QMdFA3h4sK80lo5VCyw4b0sqwYfsMMXZA16W-DRhpgqFGFL3hFfFTXjLmMzyUgrP",
          widthPx: 3078,
          heightPx: 1866,
          authorAttributions: [
            {
              displayName: "regina osullivan",
              uri: "//maps.google.com/maps/contrib/100228429572626059363",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXJOqDn0kKdrqEmX1wklSCTCG-9TUVwHhd1gJiOgdl8BL_7SV0Ozg=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXVVkq6XRxDXILsfijMCUuRgVxZKUbO66ua5z51V6mG6fwloSryVUbenN172U4_mpli2OYXMkPUdvxhROJ19AQ5qVU5ruM6zFa7zmlAC9j8nlDZ7l-Vls4fl3EAnG4kWRFFSizNUnwSxFlshV1UuPxxVb_1gONcpLsFS",
          widthPx: 4000,
          heightPx: 3000,
          authorAttributions: [
            {
              displayName: "Space Dandy",
              uri: "//maps.google.com/maps/contrib/100563658592719678557",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUpsyu8vW2oXbHTCKLwcc5cH-Jvk0s4MCCm5AZoYHbnHtDP22X9=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXVrVgtFmkHyy0ljPJbthMkFc_tnHT-AHUDf_m_parUjuds2sKje1mY5DIf3H5-F5RZLc2UcZyinrGGWfOpT1b_7OzCrYKaetq6lOZanDyC1EKtSLMUnUYsy-0sg4pzJ9mYKt-O7GMOFqmoil1uq_05zEyVmls-fceqQ",
          widthPx: 3615,
          heightPx: 2643,
          authorAttributions: [
            {
              displayName: "Space Dandy",
              uri: "//maps.google.com/maps/contrib/100563658592719678557",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUpsyu8vW2oXbHTCKLwcc5cH-Jvk0s4MCCm5AZoYHbnHtDP22X9=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXX4ZRmb-UilxqORm7gmuqNZLNtSUzSusVmfcGL7eEL4zzHomvm2IT1RPSKIAJY3JMzQ90LF_esPSM8PIXWEXuPZ0zSfAA3TIJdfZQVnve9m2fplsb_fGPZ6d0qltzDJn3o3m2UDM-oaGuTJCPQktCgjNwO6QH8IyboR",
          widthPx: 3024,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Amelina Castillo",
              uri: "//maps.google.com/maps/contrib/117114678707981705303",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLPNfmtVCIrjD29Whvap-nF9C2HT6yjPNe2ihawcnvuhOXhuQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXW54DHW-aYKpFM79gBvvVI5TB_PtowxXs1oQYNRgmDLU8OYQK9wyWpVVxnJQEESjLL0YjSb5MiMMGD2Q7Y7ylpswUgDpU6aEOPZzrE6IrWprmseB8lw7xw6b9fIULo5PMuSR9ih6CW1L8NXtNoBZwZr7JqJbuiAD13C",
          widthPx: 4000,
          heightPx: 2252,
          authorAttributions: [
            {
              displayName: "cory hartman",
              uri: "//maps.google.com/maps/contrib/117113678754225878848",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocJ2ZH3sAUp_WC4WVZdxYOSiTuKSHGBrqyp9xACvH7R8dMOtbw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXXo_4CUzTXe7hXTEQbohtKHA1ErO6HcXPBOyBA6gXo7OJpUHfP0UuxCxyezhA_ob1CghbCmnNRAiDXF2z9PikffdLXD7INZwEwPsTw_ZKUnDIPfS8nuUiPNDmSVVtPtGQ_TGPFNC6xXgpdSjuIGtnDttqkd_u66ISzj",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "William Freer",
              uri: "//maps.google.com/maps/contrib/113793213493976468070",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUmXe48e6SfEQXbQbzj6fg4nxnqS9omsRz-rOSOGkd_NfWDsRGOuw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXVgqinPcgWxv_OzDqxwIYZrBYNG68AaQp56nioLarGc82XMPsx9N3o1qRCngkhptRttHZO0tGBZRwpWOc8x6o1XXpmN3tVRSxldD9FhPhz2mvjO3Mfa01na-IqoqUH9DjbT4AYQk5KTOabI73dbctmpOcV4FMfJKsBP",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Christine Devoy",
              uri: "//maps.google.com/maps/contrib/107286623939460137515",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVbvF2ymxT1o_WMKE7OoX-0JMUEBoliTJnZIGF0duzkFKs8uUKB=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXXsl8ftTiZkn76R3D2uUNvD4tNEiTunU3QGf1G1DCpEMcq0MxhbQ07foVUmB7m_dTWj6KJT_N5oiFXZ6fxcLKvU2TkStDFvUolYUl5rMh_6oG7kvZnT9-tCzkq-IJ49Q5od4JkKYayhEey3SW5WQ3Ik6qdoHQysVzY7",
          widthPx: 3264,
          heightPx: 2448,
          authorAttributions: [
            {
              displayName: "Army G",
              uri: "//maps.google.com/maps/contrib/110676994141518641408",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUdOw_Tl_j9d9nzOh8uX0sTbp-z0KQQK3UXZHYEw0fKCVezH3cqJg=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXVy9nEol3KGDMWarhRLDpIbTEtA5yGhwV8UfdAbg48xg395fvyS2yoxG6mNzvtpra-QWjQYeLu3n2DimoS-XY5bSYa07QabM3x4OMTzyWJg1FDsqnKoJvNgeL-V3CAxViFZs4r9Ov9P-WoHw8zSU598FJOtOnMVFw_4",
          widthPx: 2933,
          heightPx: 2264,
          authorAttributions: [
            {
              displayName: "Space Dandy",
              uri: "//maps.google.com/maps/contrib/100563658592719678557",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUpsyu8vW2oXbHTCKLwcc5cH-Jvk0s4MCCm5AZoYHbnHtDP22X9=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZReJaq6SwokRbZGfHBROUZU/photos/AUc7tXWEBxZfVt2b0Tnt1ffUPkeuJjez42S8B7WgKNmxDnfzNsM7z7P_vXEonWc6sOUltGKafsJSo82G65XXzpvqzaCpJA2RmREU4ODfUuxHKU4YwBMRFvcQOT6JkgzfqNTZkmJEIcH6secOX6GqOk6N9Pow3Jcbnz9QY_lJ",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Christine Devoy",
              uri: "//maps.google.com/maps/contrib/107286623939460137515",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVbvF2ymxT1o_WMKE7OoX-0JMUEBoliTJnZIGF0duzkFKs8uUKB=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
    {
      name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI",
      types: [
        "italian_restaurant",
        "pizza_restaurant",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      formattedAddress: "1 Park Pl, Bronxville, NY 10708, USA",
      addressComponents: [
        {
          longText: "1",
          shortText: "1",
          types: ["street_number"],
          languageCode: "en-US",
        },
        {
          longText: "Park Place",
          shortText: "Park Pl",
          types: ["route"],
          languageCode: "en",
        },
        {
          longText: "Bronxville",
          shortText: "Bronxville",
          types: ["locality", "political"],
          languageCode: "en",
        },
        {
          longText: "Eastchester",
          shortText: "Eastchester",
          types: ["administrative_area_level_3", "political"],
          languageCode: "en",
        },
        {
          longText: "Westchester County",
          shortText: "Westchester County",
          types: ["administrative_area_level_2", "political"],
          languageCode: "en",
        },
        {
          longText: "New York",
          shortText: "NY",
          types: ["administrative_area_level_1", "political"],
          languageCode: "en",
        },
        {
          longText: "United States",
          shortText: "US",
          types: ["country", "political"],
          languageCode: "en",
        },
        {
          longText: "10708",
          shortText: "10708",
          types: ["postal_code"],
          languageCode: "en-US",
        },
      ],
      location: {
        latitude: 40.939557199999996,
        longitude: -73.833429,
      },
      rating: 4.3,
      websiteUri: "http://ilbaciotrattoria.com/",
      regularOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 0,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 1,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 2,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 3,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 4,
              hour: 22,
              minute: 0,
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 5,
              hour: 23,
              minute: 0,
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 0,
            },
            close: {
              day: 6,
              hour: 23,
              minute: 0,
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:00 AM – 10:00 PM",
          "Tuesday: 11:00 AM – 10:00 PM",
          "Wednesday: 11:00 AM – 10:00 PM",
          "Thursday: 11:00 AM – 10:00 PM",
          "Friday: 11:00 AM – 11:00 PM",
          "Saturday: 11:00 AM – 11:00 PM",
          "Sunday: 11:00 AM – 10:00 PM",
        ],
      },
      priceLevel: "PRICE_LEVEL_MODERATE",
      userRatingCount: 485,
      displayName: {
        text: "Il Bacio Trattoria",
        languageCode: "en",
      },
      currentOpeningHours: {
        openNow: true,
        periods: [
          {
            open: {
              day: 0,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
            close: {
              day: 0,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 30,
              },
            },
          },
          {
            open: {
              day: 1,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
            close: {
              day: 1,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 1,
              },
            },
          },
          {
            open: {
              day: 2,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
            close: {
              day: 2,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 7,
                day: 2,
              },
            },
          },
          {
            open: {
              day: 3,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
            close: {
              day: 3,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 26,
              },
            },
          },
          {
            open: {
              day: 4,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
            close: {
              day: 4,
              hour: 22,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 27,
              },
            },
          },
          {
            open: {
              day: 5,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
            close: {
              day: 5,
              hour: 23,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 28,
              },
            },
          },
          {
            open: {
              day: 6,
              hour: 11,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
            close: {
              day: 6,
              hour: 23,
              minute: 0,
              date: {
                year: 2024,
                month: 6,
                day: 29,
              },
            },
          },
        ],
        weekdayDescriptions: [
          "Monday: 11:00 AM – 10:00 PM",
          "Tuesday: 11:00 AM – 10:00 PM",
          "Wednesday: 11:00 AM – 10:00 PM",
          "Thursday: 11:00 AM – 10:00 PM",
          "Friday: 11:00 AM – 11:00 PM",
          "Saturday: 11:00 AM – 11:00 PM",
          "Sunday: 11:00 AM – 10:00 PM",
        ],
      },
      primaryType: "italian_restaurant",
      photos: [
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXUXAPo5G0z9n_8zV_D9Gq_LcvUSQvKg3vMzQ-DfBPNSWt8o3g79h7HlVcCNThJ2trihw3iG5YeLSWHxdr8PrNUVeIo-MOavvp4p5NI0BDpUJiaaRpe2jgOQj11QHyY4CUZvLWIt0h0Xe9OfXo0gm9hanfrLirTi0Pq7",
          widthPx: 5335,
          heightPx: 2999,
          authorAttributions: [
            {
              displayName: "Miky Midima",
              uri: "//maps.google.com/maps/contrib/110451655287868346588",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWtnrth00S7NLdvVKq3Ofxlox0qOnigu8F2B_5IwhfhB_zpVrq-tA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXUNZo6BP1eUxoDvSGFN_ikT0LBxtwSyIPtAbBeitdMj7-itTog4OSEcMKhFAokJGw8gciWtnhQRuRrsWlVvoiH1RyxSbSP9RV-kBx7m9Zu7ez6Biufk2i8wEJBBePzs7LQB2ghwWJyn9cNpEhadbo5tszW1_KniZJ99",
          widthPx: 4000,
          heightPx: 3000,
          authorAttributions: [
            {
              displayName: "Adam Corrigan",
              uri: "//maps.google.com/maps/contrib/115051006048521434223",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUwhqqQ4QK9iUdBNQUMHPnsw7vAwUwC_QWed209cPTLnnaUPmnGuA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXXMftgrgnxo6GZssmG1DLk1ZasTkO88kOtLxhkqKGX3_UkZ7VuYQs90njVxN-Qpx4Zk1sb26kdBYbyS92bCK-cQFH3fBc9NcQlxI3ThQyQK3oE7fl8gH0fuZJQdtp9GA3nAQEEuMaHU-k6fqyoChJhzYIB9Z1OBcmzY",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Vincent Capparelli",
              uri: "//maps.google.com/maps/contrib/114549532456479195525",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVaO1nar9fJEGZXrgBFUZZk55tioIT1ZVodKIuBLOJAeKEFMwjo=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXUfk8hTP5ZZdsYKgXI-gHJ7qvUDuXeBCC7aQObtSULObuztS7tDfYfyL8m1b2WdDyFmFwP2ME5hP-JTeTOrZd_4AbYb0NmqkaN5fW0pkXpIipVjgf3Lx3pl34aZpEKnomecTraS-gUTo0GJyV8MarqwuT0tNTs9WA40",
          widthPx: 4000,
          heightPx: 2252,
          authorAttributions: [
            {
              displayName: "Marcel Younes (Marco)",
              uri: "//maps.google.com/maps/contrib/107319038800645389560",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUOo8BYqeyYxILKD8LnOb9SK7HcC6SdR9FCgaOuPmHy9b0s4l8N_A=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXXj5Z7Va-hP9xExJjuFTmERCVWJRA6HNhwPKhpDdTxklJP83MqX-HfUpQSeC5CwuUHKMxGeV3MZbfTSx0iB8JmZss53T35ilpizJddqYBOapkIW9_wQRR0yQQ1ucn6nbIFjw-9HsfJY8ozfoGvd8cAiTYY2DvrAe9aA",
          widthPx: 4080,
          heightPx: 3072,
          authorAttributions: [
            {
              displayName: "Vincent Capparelli",
              uri: "//maps.google.com/maps/contrib/114549532456479195525",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVaO1nar9fJEGZXrgBFUZZk55tioIT1ZVodKIuBLOJAeKEFMwjo=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXXf8-VbFkwCWZLzOJXTEEPX_H4bGO-m-sKQR3p8H4M6PE6Z7Bd8fveso2mdGj9tT0mKa62GcceEMnbF7D9yoaE1zXA17YY1MO-QLHEeBNOQRB13DKB-kKc-qFNbVrS-vALoidybdOaVXyD2ZLGhkRm_wPQnMdLp63O8",
          widthPx: 3000,
          heightPx: 4000,
          authorAttributions: [
            {
              displayName: "Peter Bajra",
              uri: "//maps.google.com/maps/contrib/103302469218456242372",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjX85TUIVw5K8QHCc5BLtS3AuBbtcs3x7H7AWoo29hPCs5-pRCXU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXVRaQ-BKWZ9u1psovA1zBWm2Q_U2cABwV8S52oQi2W8uCAKxkdziUY09PXAwWif89Le-l9jAsCAS-n668UJhV1iv8noViwg0y2B27pH-49UnWTDf3kw5CKeHQK4omP-6m1LnPyXQQ_VZVUL31ufa4BD5OA9vyQvlQzd",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Alessandra Alves Matos",
              uri: "//maps.google.com/maps/contrib/105236837801594036606",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocKnGZKkWU15oDnHcfdIWMFQUDTcKHdV7Ht9GzjA80IF0jdqqoCM=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXUU_wQEHscdX0ZhWbVAL2dyB5hfpl-Rbejr9rdfVGh7JB6gIcWqqJBhhTd3haYf-gXKR0Z-oo4fIIdaMo3nKOmxceFokqQGpm3_Z_XT43PHHtJ0l9pqF-1z9bXt59ihdUQ8nqFFh6QsSS2popbh4niccREwLV_2xFJx",
          widthPx: 3024,
          heightPx: 4032,
          authorAttributions: [
            {
              displayName: "Cristal Vidal",
              uri: "//maps.google.com/maps/contrib/106612420618881432145",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWXr0pMFM0GGXicALruDXOI5VTYuLyjuxD1v_fCd5WQ60nTPor9=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXWL1urqy8C6oeEMvZ8cz9zFLcWso4aZDSCC4ZpPh4_1WD3EynZdgbPd0G00k9Xc9DpLGHDbnBL2BVfzYenRHC2Ya8zLKfzyr_eKUR4scmQp3xtXG64i8Tx-QU5SYBUQPIg6kD2FeB30AKbSbkPxljVjGAIHOx4s-5eW",
          widthPx: 3840,
          heightPx: 2160,
          authorAttributions: [
            {
              displayName: "Alan Varghese",
              uri: "//maps.google.com/maps/contrib/110620966140771264252",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVCGE23ha28yxtQcoEbnccStYuWXH17KYLKkIiAwqpw-oQUSd3w=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJmV5ONq6SwokR9NUCEVE0DKI/photos/AUc7tXVVoLTY-yqM_fH03pDxdj5TfUtoL00iMoSb2wIQ-GO4NkUSRma0QTmszbRU7qALD5jUCcUSEohgnLbQczXeCVWvPp_r6_Yfw9Ub2umnl2Ii35rBcLdsfX8XPncP8V39sufM3ajUdvIrnlGIIJ7ibtmQH5VUsyPxMpGg",
          widthPx: 2160,
          heightPx: 3840,
          authorAttributions: [
            {
              displayName: "Cristal Vidal",
              uri: "//maps.google.com/maps/contrib/106612420618881432145",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWXr0pMFM0GGXicALruDXOI5VTYuLyjuxD1v_fCd5WQ60nTPor9=s100-p-k-no-mo",
            },
          ],
        },
      ],
      accessibilityOptions: {
        wheelchairAccessibleParking: true,
        wheelchairAccessibleEntrance: true,
        wheelchairAccessibleRestroom: true,
        wheelchairAccessibleSeating: true,
      },
    },
  ];

  const results = [
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8587323, lng: 151.2100055 },
        viewport: {
          northeast: { lat: -33.85739847010727, lng: 151.2112436298927 },
          southwest: { lat: -33.86009812989271, lng: 151.2085439701072 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
      icon_background_color: "#FF9E67",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
      name: "Cruise Bar",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 608,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/112582655193348962755">A Google User</a>',
          ],
          photo_reference:
            "Aap_uECvJIZuXT-uLDYm4DPbrV7gXVPeplbTWUgcOJ6rnfc4bUYCEAwPU_AmXGIaj0PDhWPbmrjQC8hhuXRJQjnA1-iREGEn7I0ZneHg5OP1mDT7lYVpa1hUPoz7cn8iCGBN9MynjOPSUe-UooRrFw2XEXOLgRJ-uKr6tGQUp77CWVocpcoG",
          width: 1080,
        },
      ],
      place_id: "ChIJi6C1MxquEmsR9-c-3O48ykI",
      plus_code: {
        compound_code: "46R6+G2 The Rocks, New South Wales",
        global_code: "4RRH46R6+G2",
      },
      price_level: 2,
      rating: 4,
      reference: "ChIJi6C1MxquEmsR9-c-3O48ykI",
      scope: "GOOGLE",
      types: [
        "bar",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 1269,
      vicinity:
        "Level 1, 2 and 3, Overseas Passenger Terminal, Circular Quay W, The Rocks",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8675219, lng: 151.2016502 },
        viewport: {
          northeast: { lat: -33.86614532010728, lng: 151.2031259298927 },
          southwest: { lat: -33.86884497989272, lng: 151.2004262701072 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Sydney Harbour Dinner Cruises",
      opening_hours: { open_now: true },
      photos: [
        {
          height: 835,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/109764923610545394994">A Google User</a>',
          ],
          photo_reference:
            "Aap_uEBVsYnNcrpRixtrlHBztigZh70CwYkNWZzQnqJ39SjeBo_wvgKf-kXc6tgaMLBdQrRKmxmSKjOezoZrv-sHKVbTX0OI48HBqYYVnQiZQ-WGeuQDsLEPwX7LaVPa68nUAxX114Zpqt7bryoO9wL4qXdgEnopbOp5WWLALhKEHoIEH7f7",
          width: 1200,
        },
      ],
      place_id: "ChIJM1mOVTS6EmsRKaDzrTsgids",
      plus_code: {
        compound_code: "46J2+XM Sydney, New South Wales",
        global_code: "4RRH46J2+XM",
      },
      rating: 4.8,
      reference: "ChIJM1mOVTS6EmsRKaDzrTsgids",
      scope: "GOOGLE",
      types: [
        "tourist_attraction",
        "travel_agency",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 9,
      vicinity: "32 The Promenade, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8676569, lng: 151.2017213 },
        viewport: {
          northeast: { lat: -33.86629922010728, lng: 151.2031712798927 },
          southwest: { lat: -33.86899887989272, lng: 151.2004716201073 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Clearview Sydney Harbour Cruises",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 685,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/114394575270272775071">Clearview Glass Boat Cruises</a>',
          ],
          photo_reference:
            "Aap_uEAlExjnXA0VWyb_oYwCJ8utWG_Ennhwmn_xadpgenMNUgTuxrvgf1Xdw4bsbL6kFSWH7bhbpVHK1esdNY37ancJvbL_Gnsc7EZ5KEBNPvYZ_ZEyLco4a5v34LFkodxfFZbJ-ejO3zN4W_0C37P5jAmTnLWMNFYUPvoU3UMi70qHRNF5",
          width: 1024,
        },
      ],
      place_id: "ChIJNQfwZTiuEmsR1m1x9w0E2V0",
      plus_code: {
        compound_code: "46J2+WM Sydney, New South Wales",
        global_code: "4RRH46J2+WM",
      },
      rating: 3.8,
      reference: "ChIJNQfwZTiuEmsR1m1x9w0E2V0",
      scope: "GOOGLE",
      types: [
        "travel_agency",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 49,
      vicinity: "32 The Promenade King Street Wharf 5, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8677035, lng: 151.2017297 },
        viewport: {
          northeast: { lat: -33.86634597010728, lng: 151.2031781298927 },
          southwest: { lat: -33.86904562989272, lng: 151.2004784701072 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Sydney Harbour Lunch Cruise",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 545,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/102428257696490257922">Sydney Harbour Lunch Cruise</a>',
          ],
          photo_reference:
            "Aap_uEBFyQ2xDzHk7dGF_FTvNeJ01NQD6GROq89rufdGQl5Gi0zVfpnETBjPK2v7UEDl_6F-m8aR5FcEWJMqPaH4Oh_CQh2jaUAUAesUInucpCe7OFdleSYJ_8kgunhsIvGf1D1s_pes6Rk2JMVEs8rEs6ZHSTmUQXX2Yh-Gt9MuPQdYNuNv",
          width: 969,
        },
      ],
      place_id: "ChIJUbf3iDiuEmsROJxXbhYO7cM",
      plus_code: {
        compound_code: "46J2+WM Sydney, New South Wales",
        global_code: "4RRH46J2+WM",
      },
      rating: 3.9,
      reference: "ChIJUbf3iDiuEmsROJxXbhYO7cM",
      scope: "GOOGLE",
      types: [
        "travel_agency",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 23,
      vicinity: "5/32 The Promenade, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8675883, lng: 151.2016452 },
        viewport: {
          northeast: { lat: -33.86623847010728, lng: 151.2029950298927 },
          southwest: { lat: -33.86893812989273, lng: 151.2002953701073 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Sydney Showboats - Dinner Cruise With Show",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 4912,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/105311284660389698992">A Google User</a>',
          ],
          photo_reference:
            "Aap_uED1aGaMs8xYfiuzeBqVcFsk3yguUujdE4S3rNThMpLtoU0RukF40KCt0CAxgHP1HoY8Z7NYcWvax6qmMMVPBbmzGhoaiwiAAyv2GGA9vhcgsJ5w0LweT0y1lgRGZxU3nZIdNLiYAp9JHM171UkN04H6UqYSxKVZ8N_f2aslkqOaBF_e",
          width: 7360,
        },
      ],
      place_id: "ChIJjRuIiTiuEmsRCHhYnrWiSok",
      plus_code: {
        compound_code: "46J2+XM Sydney, New South Wales",
        global_code: "4RRH46J2+XM",
      },
      rating: 4.1,
      reference: "ChIJjRuIiTiuEmsRCHhYnrWiSok",
      scope: "GOOGLE",
      types: [
        "travel_agency",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 119,
      vicinity: "32 The Promenade, King Street Wharf, 5, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8677035, lng: 151.2017297 },
        viewport: {
          northeast: { lat: -33.86634597010728, lng: 151.2031781298927 },
          southwest: { lat: -33.86904562989272, lng: 151.2004784701072 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Magistic Cruises",
      opening_hours: { open_now: true },
      photos: [
        {
          height: 1536,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/103073818292552522030">A Google User</a>',
          ],
          photo_reference:
            "Aap_uEC8bq-YphfIDcdxANBfgGMBIX2B0ggNep9ddVoePj6sfdcdusIn07x8biaxevZ_6BpzDDRsUL8No5P3ftI4on_pqbAbIEUL5gFGgezpVZ3M9GWvKdJm3njO_aJaghWl4_aQb75c0WGYDRFPhn6fWsLkD7KxodviJeCX4OCGt1eRJnlK",
          width: 2048,
        },
      ],
      place_id: "ChIJxRjqYTiuEmsRGebAA_chDLE",
      plus_code: {
        compound_code: "46J2+WM Sydney, New South Wales",
        global_code: "4RRH46J2+WM",
      },
      rating: 3.9,
      reference: "ChIJxRjqYTiuEmsRGebAA_chDLE",
      scope: "GOOGLE",
      types: [
        "tourist_attraction",
        "travel_agency",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 99,
      vicinity: "King Street Wharf, 32 The Promenade, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8609391, lng: 151.2098735 },
        viewport: {
          northeast: { lat: -33.85958927010727, lng: 151.2112233298927 },
          southwest: { lat: -33.86228892989272, lng: 151.2085236701072 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Australian Cruise Group",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 1536,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/113088009011192061895">Keith Bauman</a>',
          ],
          photo_reference:
            "Aap_uED7aBwIbN6iuoZi8e9xCrt6F_EhppGCBfzYCgypetw8cGn4Ui0Y3JZe3QJ0buf0zc54BtPz-SWXxecPd6kDvNNZD5Eu_ZzTP13rXMzSDJa6UcwFiXU4y3qYrWAyJ6mtYrd2PJgw0KzvYaZoPze7Ka6zG6k3IOjeSICDYH6YOzkXhelj",
          width: 2048,
        },
      ],
      place_id: "ChIJpU8KgUKuEmsRKErVGEaa11w",
      plus_code: {
        compound_code: "46Q5+JW Sydney, New South Wales",
        global_code: "4RRH46Q5+JW",
      },
      rating: 4.4,
      reference: "ChIJpU8KgUKuEmsRKErVGEaa11w",
      scope: "GOOGLE",
      types: [
        "travel_agency",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 5,
      vicinity: "6 Cirular Quay, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8686058, lng: 151.2018206 },
        viewport: {
          northeast: { lat: -33.86730002010728, lng: 151.2032717798927 },
          southwest: { lat: -33.86999967989272, lng: 151.2005721201073 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Rhythmboat Cruises",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 2269,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/104066891898402903288">Rhythmboat Sydney Harbour Cruises</a>',
          ],
          photo_reference:
            "Aap_uEAT8eop-IsfSAQ3KP6YXRNRsFkESXDecsaPnaVhq5bZzny5guvhS4smciianRGbZgDtFtAcU-ZXTaBfuh80CFw8vpJyKaB4grgW_CW64rU1JF9FDy_M8HtEk3rOrMhPDiF8ns-mc16E4rWSuAQIc76Du_eCd63ofoErESOtSWAQVcew",
          width: 4032,
        },
      ],
      place_id: "ChIJyWEHuEmuEmsRm9hTkapTCrk",
      plus_code: {
        compound_code: "46J2+HP Sydney, New South Wales",
        global_code: "4RRH46J2+HP",
      },
      rating: 3.9,
      reference: "ChIJyWEHuEmuEmsRm9hTkapTCrk",
      scope: "GOOGLE",
      types: [
        "travel_agency",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 30,
      vicinity: "King Street Wharf, King St, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8712692, lng: 151.1898651 },
        viewport: {
          northeast: { lat: -33.86952792010727, lng: 151.1914560298927 },
          southwest: { lat: -33.87222757989272, lng: 151.1887563701073 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Glass Island",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 4480,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/117745044320706972021">A Google User</a>',
          ],
          photo_reference:
            "Aap_uEAaToCBaHP7Gfdjc740gwIkQcjeUD97NO0TKXJ5IXB0CLGQA6slEpHn4k9LwyhoAzzbSTXJduYyFIkHVmQWGp34NggRxrtOWp7sJf5N6j0ASYlJPmAtWUaaCWnbx_pxdndsopeJ7PYn9kTiMgFcSs-GeipI8hDZgAJswMBnfsO0xWQ-",
          width: 6720,
        },
      ],
      place_id: "ChIJnScuboavEmsRyh-FGxhc3pw",
      plus_code: {
        compound_code: "45HQ+FW Pyrmont, New South Wales",
        global_code: "4RRH45HQ+FW",
      },
      rating: 4.1,
      reference: "ChIJnScuboavEmsRyh-FGxhc3pw",
      scope: "GOOGLE",
      types: [
        "bar",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 90,
      vicinity: "37 Bank St, Pyrmont",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.85876140000001, lng: 151.2100004 },
        viewport: {
          northeast: { lat: -33.85737742010728, lng: 151.2111319298927 },
          southwest: { lat: -33.86007707989272, lng: 151.2084322701072 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
      icon_background_color: "#FF9E67",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet",
      name: "Junk Lounge",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 608,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/104473997089847488714">A Google User</a>',
          ],
          photo_reference:
            "Aap_uEDaHF9VZFV88tQqFyIgmPlcbCsK-ScCGuUVGh0mTAP4OzWh_0q0T5rPbeC7bas7vD5vC9oS95jtdr4oOnQmhGDAIbHkv4E6UHrQIl0f3XZ-3-RRDjn293w4qQb_BfhbPPO3nokU7npfMfVvCcelWf9WHiWNHT4EEHrFtvuhAWKobTnC",
          width: 1080,
        },
      ],
      place_id: "ChIJq9W3HZOvEmsRYtKNTRmq34M",
      plus_code: {
        compound_code: "46R6+F2 The Rocks, New South Wales",
        global_code: "4RRH46R6+F2",
      },
      price_level: 2,
      rating: 4.1,
      reference: "ChIJq9W3HZOvEmsRYtKNTRmq34M",
      scope: "GOOGLE",
      types: ["restaurant", "food", "point_of_interest", "establishment"],
      user_ratings_total: 63,
      vicinity:
        "Level 2, Overseas Passenger Terminal, Circular Quay W, The Rocks",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8677035, lng: 151.2017297 },
        viewport: {
          northeast: { lat: -33.86634597010728, lng: 151.2031781298927 },
          southwest: { lat: -33.86904562989272, lng: 151.2004784701072 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#7B9EB0",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "Sydney New Year's Eve Cruises",
      opening_hours: { open_now: true },
      photos: [
        {
          height: 1600,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/115281801304517408477">A Google User</a>',
          ],
          photo_reference:
            "Aap_uEDceKHtQ9Hf2eHwnQYXLqrwZ1X2LYVhsfXbqrpIm3_lXZ9apURjAXtVgRVTGxJPD7BtaqR8C7bwaSTakmi0Pazn7g3suj8ZaQRBqheT3KVJDhZ9_GwVInLkWbxqnhivEXs1a-MC_J8XF1SL_5AQ3mAETgiLRQ04116IAEV5vHyIGRsa",
          width: 2400,
        },
      ],
      place_id: "ChIJ__8_hziuEmsR27ucFXECfOg",
      plus_code: {
        compound_code: "46J2+WM Sydney, New South Wales",
        global_code: "4RRH46J2+WM",
      },
      rating: 5,
      reference: "ChIJ__8_hziuEmsR27ucFXECfOg",
      scope: "GOOGLE",
      types: [
        "travel_agency",
        "restaurant",
        "food",
        "point_of_interest",
        "establishment",
      ],
      user_ratings_total: 5,
      vicinity: "King Street Wharf 5, 32 The Promenade, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.8669866, lng: 151.2017231 },
        viewport: {
          northeast: { lat: -33.86563197010727, lng: 151.2031347298927 },
          southwest: { lat: -33.86833162989272, lng: 151.2004350701073 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
      icon_background_color: "#13B5C7",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
      name: "King Street Wharf Darling Harbour",
      opening_hours: { open_now: true },
      photos: [
        {
          height: 3024,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/101920674986627213698">朱品貞</a>',
          ],
          photo_reference:
            "Aap_uEDwKXVOjIaCj3LptOdd86B5umsdG7Z3jcvqcpUVLwHS6w8VGEkphgC8-shAx95CrsuXpnKz-XVIixVmgagQHKPH3vSLLqJ6LOAR7Q-_jiyx3ELXD0pm7AARiAtQAMBN9A-oqbtvGbE27yDpvBS1lKe9PCm-dMfrHIIcsS91Qeq2E4b6",
          width: 4032,
        },
      ],
      place_id: "ChIJkfDzJ72vEmsR8xtYbk5f0p0",
      plus_code: {
        compound_code: "46M2+6M Sydney, New South Wales",
        global_code: "4RRH46M2+6M",
      },
      rating: 4.4,
      reference: "ChIJkfDzJ72vEmsR8xtYbk5f0p0",
      scope: "GOOGLE",
      types: [
        "tourist_attraction",
        "convenience_store",
        "bowling_alley",
        "travel_agency",
        "bar",
        "restaurant",
        "food",
        "point_of_interest",
        "store",
        "establishment",
      ],
      user_ratings_total: 3213,
      vicinity: "The Promenade, Lime St, Sydney",
    },
    {
      business_status: "OPERATIONAL",
      geometry: {
        location: { lat: -33.870383, lng: 151.1979245 },
        viewport: {
          northeast: { lat: -33.86901092010727, lng: 151.1991702798927 },
          southwest: { lat: -33.87171057989271, lng: 151.1964706201073 },
        },
      },
      icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
      icon_background_color: "#FF9E67",
      icon_mask_base_uri:
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet",
      name: "The Little Snail Restaurant",
      opening_hours: { open_now: false },
      photos: [
        {
          height: 900,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/114727320476039103791">The Little Snail</a>',
          ],
          photo_reference:
            "Aap_uEA9aHKkB_6VoFx4VHRSp19PCwnTOuGfpmDYw1NdYNbzncfdjjfEmiiFz-E4tIJ6iGVZjR_bejX6wNr5thJjqlcdQ2PvPyTTo1jGtxk31JG9b6Vd0vu_v4Ep7yutzf3KTzBjYFBIGsYPf3Pj0DptMWPLP7fn33SBT7YmRqDEoGcUsBzw",
          width: 1350,
        },
      ],
      place_id: "ChIJtwapWjeuEmsRcxV5JARHpSk",
      plus_code: {
        compound_code: "45HX+R5 Pyrmont, New South Wales",
        global_code: "4RRH45HX+R5",
      },
      price_level: 2,
      rating: 4.5,
      reference: "ChIJtwapWjeuEmsRcxV5JARHpSk",
      scope: "GOOGLE",
      types: ["restaurant", "food", "point_of_interest", "establishment"],
      user_ratings_total: 1916,
      vicinity: "3/50 Murray St, Pyrmont",
    },
  ];
  res.status(200).json({
    results: places.map((res) => ({
      id: res.name.split("/")[1],
      name: res.displayName.text,
      address: res.formattedAddress,
      types: res.types.reduce((types, type) => {
        if (type.match("^.+restaurant$")) {
          types.push(type.replace("_", " "));
          return types;
        }
        return types;
      }, []),
      location: res.location,
      priceLevel: res.priceLevel,
      rating: res.rating,
      rating_count: res.userRatingCount,
      hours: res.regularOpeningHours.weekdayDescriptions,
      photos: res.photos.reduce((results, photo, index) => {
        if (index < 3) {
          results.push(photo.name);
        }
        return results;
      }, []),
      accessibilityOptions: res.accessibilityOptions,
      website: res.websiteUri,
    })),
  });
};
