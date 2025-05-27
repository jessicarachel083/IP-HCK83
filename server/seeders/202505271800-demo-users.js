'use strict';

const { hashPassword } = require("../helpers/bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    const dataUser = [
      {
        username: "john_doe",
        email: "john@test.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "08123456789",
        location: "Jakarta Selatan",
        oauthProvider: null,
        oauthId: null,
        profilePicture: null
      },
      {
        username: "jane_smith",
        email: "jane@test.com", 
        password: "password123",
        firstName: "Jane",
        lastName: "Smith",
        phoneNumber: "08987654321",
        location: "Bandung",
        oauthProvider: null,
        oauthId: null,
        profilePicture: null
      },
      {
        username: "google_user",
        email: "googleuser@gmail.com",
        password: null, // OAuth user, no password
        firstName: "Google",
        lastName: "User",
        phoneNumber: null,
        location: "Surabaya",
        oauthProvider: "google",
        oauthId: "google_123456789",
        profilePicture: "https://lh3.googleusercontent.com/sample-avatar.jpg"
      },
      {
        username: "facebook_user",
        email: "fbuser@yahoo.com",
        password: null, // OAuth user, no password
        firstName: "Facebook",
        lastName: "User", 
        phoneNumber: "08111222333",
        location: null, // Profile not complete
        oauthProvider: "facebook",
        oauthId: "facebook_987654321",
        profilePicture: "https://graph.facebook.com/sample/picture"
      },
      {
        username: "pet_lover",
        email: "petlover@email.com",
        password: "petpass123",
        firstName: "Pet",
        lastName: "Lover",
        phoneNumber: "08222333444",
        location: "Yogyakarta",
        oauthProvider: null,
        oauthId: null,
        profilePicture: null
      }
    ]

    dataUser.forEach(el => {
      delete el.id
      // Only hash password if it exists (regular users, not OAuth)
      if (el.password) {
        el.password = hashPassword(el.password)
      }
      el.createdAt = el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert("Users", dataUser, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null)
  }
};