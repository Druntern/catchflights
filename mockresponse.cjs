const mockResponses = {
  "/generate-itinerary": {
    days: [
      {
        "day": 1,
        "activities": [
          {
            "time": "9:00 AM",
            "activity": "Visit the British Museum",
            "duration": "2 hours",
            "description": "Explore the world-famous collection of art and antiquities at the British Museum, including the Rosetta Stone and the Elgin Marbles."
          },
          {
            "time": "11:30 AM",
            "activity": "Stroll through Covent Garden",
            "duration": "1.5 hours",
            "description": "Enjoy the vibrant atmosphere of Covent Garden, browse the market stalls, and watch street performers."
          },
          {
            "time": "1:00 PM",
            "activity": "Lunch at Dishoom",
            "duration": "1.5 hours",
            "description": "Savor a delicious lunch at this popular Indian restaurant known for its vibrant ambiance and flavorful dishes."
          },
          {
            "time": "3:00 PM",
            "activity": "See a West End Show",
            "duration": "2.5 hours",
            "description": "Experience the magic of London theatre with a matinee performance in the famous West End."
          },
          {
            "time": "6:00 PM",
            "activity": "Dinner at The Ivy",
            "duration": "1.5 hours",
            "description": "Dine at this iconic restaurant known for its classic British fare and celebrity sightings."
          },
          {
            "time": "8:00 PM",
            "activity": "Walk along the South Bank",
            "duration": "1 hour",
            "description": "Take a leisurely evening walk along the South Bank of the Thames, enjoying beautiful views of the city."
          }
        ]
      },
      {
        "day": 2,
        "activities": [
          {
            "time": "9:00 AM",
            "activity": "Visit Tower of London",
            "duration": "2.5 hours",
            "description": "Discover the history of the Tower of London, see the Crown Jewels, and learn about its role in shaping British history."
          },
          {
            "time": "12:00 PM",
            "activity": "Lunch at Borough Market",
            "duration": "1.5 hours",
            "description": "Explore the famous Borough Market and enjoy a selection of street food and local delicacies."
          },
          {
            "time": "2:00 PM",
            "activity": "Ride the London Eye",
            "duration": "1 hour",
            "description": "Take a ride on the iconic London Eye for breathtaking views of the city skyline."
          },
          {
            "time": "3:30 PM",
            "activity": "Explore the Tate Modern",
            "duration": "2 hours",
            "description": "Experience contemporary art at the Tate Modern, housed in a former power station on the banks of the Thames."
          },
          {
            "time": "6:00 PM",
            "activity": "Dinner at Flat Iron",
            "duration": "1.5 hours",
            "description": "Indulge in a delicious steak dinner at this popular eatery known for its affordable prices and casual vibe."
          },
          {
            "time": "8:00 PM",
            "activity": "Enjoy Pub Quiz Night",
            "duration": "2 hours",
            "description": "Join a local pub's quiz night for some fun trivia and a chance to mingle with locals."
          }
        ]
      },
      {
        "day": 3,
        "activities": [
          {
            "time": "9:00 AM",
            "activity": "Visit Buckingham Palace",
            "duration": "1.5 hours",
            "description": "Witness the Changing of the Guard ceremony at Buckingham Palace and take a brief stroll through St. James's Park."
          },
          {
            "time": "11:00 AM",
            "activity": "Explore Westminster Abbey",
            "duration": "1.5 hours",
            "description": "Discover the history and stunning architecture of Westminster Abbey, the burial site of many famous figures."
          },
          {
            "time": "1:00 PM",
            "activity": "Lunch at The Red Lion",
            "duration": "1.5 hours",
            "description": "Enjoy a classic British pub lunch at The Red Lion, located near Westminster."
          },
          {
            "time": "3:00 PM",
            "activity": "Visit the Houses of Parliament",
            "duration": "1.5 hours",
            "description": "Take a guided tour of the Houses of Parliament and learn about UK politics and history."
          },
          {
            "time": "5:00 PM",
            "activity": "Explore Camden Market",
            "duration": "2 hours",
            "description": "Wander through Camden Market, known for its eclectic shops, food stalls, and vibrant atmosphere."
          },
          {
            "time": "7:30 PM",
            "activity": "Dinner at Camden Town Brewery",
            "duration": "1.5 hours",
            "description": "Wrap up your trip with a casual dinner at Camden Town Brewery, where you can enjoy local craft beers and tasty food."
          }
        ]
      }
    ]
},
  "/another-endpoint": {
    success: true,
    message: "This is a mock response for another endpoint.",
  },
};
  
function getMockResponse(endpoint) {
  return mockResponses[endpoint] || { success: false, message: "Mock response not found" };
}

module.exports = getMockResponse;