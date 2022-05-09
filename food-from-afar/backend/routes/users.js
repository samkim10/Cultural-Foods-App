var express = require("express");
const { default: mongoose } = require("mongoose");
mongoose.set("debug", true);
var router = express.Router();

let User = require("../models/user.model");

router.route("/").get((req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
    User.findById(req.params.id, (error, result) => {
        if (error || result === null) {
            console.log("Error when finding user by ID");
        } else {
            res.send(result);
        }
    });
});

const findUser = (name, callback) => {
    User.findOne({ name: name }, function (err, userObj) {
        if (err) {
            return callback(err);
        } else if (userObj) {
            return callback(null, userObj);
        } else {
            return callback();
        }
    });
};
router.route("/username/:username").get((req, res) => {
    const name = req.params.username;
    console.log("Searching for user data for ");
    console.log(name);
    findUser(name, function (error, user) {
        if (error) {
            console.log("User Fetching Error: " + error);
        }
        if (user === null) {
            // did not find user
            res.status(422).json("Error: User not found");
            return;
        } else {
            res.send(user);
        }
    });
});

router.route("/username/:username").patch((req, res) => {
    const name = req.params.username;
    const changes = req.body
    

    //Plan is to find the user and store it locally
    // then go through the req.body's fields and update the revelant ones in the local copy
    // then replace the user in the database
    // then send the user back
    findUser(name, function(error, user) {
        if (error) {
            console.log("User Fetching Error: " + error);
        }
        if (user === null) {
            // did not find user
            res.status(422).json("Error: User not found");
            return;
        } else{
          
            for (const change of Object.keys(changes)){
               
                // note change is the key of the object
                
                if (user[change] === undefined){
                    res.status(422).send("Error invalid user field")
                }else{
                    
                    user[change] = changes[change]
                }
            }
            console.log(user)
            User.replaceOne({name: name}, user).then( (result) =>{
                
                res.json(user);
            }).catch((error) =>{
                console.log("Error patching user")
                console.log(error)
                res.status(500).send("Error patching user")
                return;
            })
            
        }
    })

});

router.route("/add").post((req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    console.log("Add request receieved");
    findUser(name, function (error, user) {
        if (error) {
            console.log("User Creation Error: " + error);
        }
        if (user === null) {
            // User already present, can't add
            res.status(422).json("Error: Username in use");
            return;
        } else {
            const newUser = new User({
                name: name,
                password: password,
                email: email
            });
            newUser
                .save()
                .then(() => res.json("User Created."))
                .catch((err) => res.status(400).json("Error: " + err));
            console.log("user created");
        }
    });
});

router.route("/check").post((req, res) => {
    console.log("Check request receieved");
    // sends a true/false value if the given username/password is valid
    const name = req.body.name;
    const password = req.body.password;

    findUser(name, function (error, user) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Found user: " + user);
        if (user === null || user === undefined) {
            console.log("No user with that username");
            res.send(false);
            return;
        }
        if (user.password === password) {
            console.log("Correct password");
            console.log(user);
            res.send(true);
        } else {
            console.log("Incorrect Password");
            res.send(false);
        }
    });
    /*
  const user = User.findOne({username:name}, function(err, userObj){
    if(err){
      console.log("Error when checking user: " + err)
      return err
  }       else if (userObj){
      return userObj
  }       else{
      return null
  }

  })
  console.log(user)
  */
});

router.route("/delete").post((req, res) => {
    const delName = req.body.name;
    console.log("Delete request receieved");

    User.findOneAndRemove({ name: delName })
        .then(function () {
            console.log("User deleted"); // Success
            res.json("User Deleted");
        })
        .catch(function (error) {
            console.log(error); // Failure
        });
});

router.route("/update").post((req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    User.findOneAndUpdate({ name: name }, { password: password })
        .then(function () {
            // TODO make body correctly in index.js to open it here
            console.log("User password updated"); // Success
            res.json("User Updated");
        })
        .catch(function (error) {
            console.log(error); // Failure
        });
});

//old search by name
router.route('/name/:name').get((req, res) => {
    User.findOne({name: req.params.name}, (error, result) =>{
      if(error || result === null){
        console.log("Error when finding user by name")
      }else{
        res.send(result)
      }
    });
  })

  // Body: {id: <document_id>, update: {param_to_update: <updated_value>, other_param: <other_value>, ...}}
router.route("/find/update").post((req, res) => {
    const update = req.body.update;
    User.findByIdAndUpdate(
        req.body.id,
        update,
        { new: true },
        (error, result) => {
            if (error || result === null) {
                log("Error when updating user");
            } else {
                res.json("user updated");
            }
        }
    );
});

module.exports = router;
