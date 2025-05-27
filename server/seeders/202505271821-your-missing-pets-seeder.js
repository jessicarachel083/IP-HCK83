'use strict';

require('dotenv').config();

const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    // Step 1: Get access token
    const getAccessToken = async () => {
      try {
        const response = await axios.post('https://api.petfinder.com/v2/oauth2/token', {
          grant_type: 'client_credentials',
          client_id: process.env.PETFINDER_API_KEY,
          client_secret: process.env.PETFINDER_API_SECRET
        });
        return response.data.access_token;
      } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw error;
      }
    };

    // Step 2: Fetch animals from Petfinder API
    const fetchAnimals = async (token, page = 1, limit = 100) => {
      try {
        const response = await axios.get('https://api.petfinder.com/v2/animals', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            limit: limit,
            page: page,
            status: 'adoptable'
          }
        });
        return response.data.animals;
      } catch (error) {
        console.error(`Error fetching animals (page ${page}):`, error.response?.data || error.message);
        throw error;
      }
    };

    // Step 3: Generate random data for required fields
    const generateRandomData = () => {
      const locations = [
        'Jakarta Selatan', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Pusat',
        'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Medan',
        'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Malang'
      ];
      
      const contacts = [
        '08123456789', '08987654321', '08111222333', '08222333444', '08333444555',
        '08444555666', '08555666777', '08666777888', '08777888999', '08888999000'
      ];

      // Random date within last 30 days
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

      return {
        location: locations[Math.floor(Math.random() * locations.length)],
        contact: contacts[Math.floor(Math.random() * contacts.length)],
        date: randomDate,
        userId: Math.floor(Math.random() * 5) + 1 // Assuming 5 users from user seeder
      };
    };

    try {
      console.log('Getting Petfinder access token...');
      const token = await getAccessToken();
      
      console.log('Fetching animals from Petfinder API...');
      
      // Fetch 200 animals (2 pages of 100 each)
      const page1Animals = await fetchAnimals(token, 1, 100);
      const page2Animals = await fetchAnimals(token, 2, 100);
      
      const allAnimals = [...page1Animals, ...page2Animals];
      console.log(`Fetched ${allAnimals.length} animals from Petfinder`);

      // Step 4: Transform Petfinder data to MissingPets format
      const missingPetsData = allAnimals.map(animal => {
        const randomData = generateRandomData();
        
        return {
          userId: randomData.userId,
          petName: animal.name || 'Unknown Pet',
          petType: animal.type || 'Unknown',
          breed: animal.breeds?.primary || 'Mixed Breed',
          color: animal.colors?.primary || null,
          petPhoto: animal.photos && animal.photos.length > 0 
            ? animal.photos[0].medium || animal.photos[0].small || animal.photos[0].large
            : null,
          description: null, // Will be AI-generated later
          lastSeenLocation: randomData.location,
          lastSeenDate: randomData.date,
          contactInfo: randomData.contact,
          status: 'missing', // Default status
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }).filter(pet => pet.petPhoto !== null); // Only include pets with photos

      console.log(`Inserting ${missingPetsData.length} missing pets into database...`);
      
      // Step 5: Insert into database
      await queryInterface.bulkInsert("MissingPets", missingPetsData, {});
      
      console.log('Missing pets seeded successfully!');
      
    } catch (error) {
      console.error('Error in seeding process:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("MissingPets", null);
  }
};