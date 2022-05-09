const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 1
        },
        password: {
            type: String,
            required: true,
            unique: false,
            trim: true,
            minlength: 1
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            minlength: 1
        },
        birthdate: {
            type: Date,
            default: Date.now
        },
        city: {
            type: String,
            trim: true,
            default: ""
        },
        country: {
            type: String,
            trim: true,
            default: ""
        },
        profilePic: {
            //relative paths for now
            type: String,
            trime: true,
            default: "/default.jpg"
        },
        subscribed: [String],
        triedCultures: [{ culture: String, number: Number }],
        skills: [String],
        savedRecipes: [String] //store object id's
    },
    {
        timestamps: true
    }
);

/*
  A user still needs:
  Cultures its tried - list of {culturename: #of dishes}
  List of subscribed cultures

  email: "user123@gmail.com",
  birth_date: "2000/12/21",
  city: "Toronto",
  country: "Canada",
  profile_picture: ProfileImage -- can store small images in mongodb. Will need to restrict upload size to 10MB. 

*/

const User = mongoose.model("User", userSchema);

module.exports = User;
