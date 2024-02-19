const bcrypt = require("bcrypt");
const Users = require("../models/user");

const getUsers = (req, res) => {
  try {
    let query = {};

    if (req.query.userid) {
      query.userid = parseInt(req.query.userid);
    }

    // Execute the query with the conditional filters
    Users.find(query)
      .select("-_id -__v -password") // Exclude _id and __v fields
      .sort("-createdAt") // Sort by createdAt in descending order (newest first)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ success: false, message: "Error inesperado", error: err });
      });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error inesperado", error: error });
  }
};

const login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .send({ success: false, message: "Error en los datos enviados" });
      return;
    }

    Users.findOne({ email })
      .select("-_id -__v") // Exclude _id and __v fields
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            let _user = user.toObject();
            delete _user.password;
            res.status(200).send(_user);
          } else {
            res
              .status(401)
              .send({ success: false, message: "Contraseña incorrecta" });
          }
        } else {
          res
            .status(401)
            .send({ success: false, message: "Email no encontrado" });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ success: false, message: "Error inesperado", error: err });
      });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Error inesperado", error: err });
  }
};

const register = (req, res) => {
  const { email, password, name, surname, dob } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .send({ success: false, message: "Error en los datos enviados" });
    return;
  }

  Users.findOne({ email }).then((user) => {
    if (user) {
      res.status(409).send({ success: false, message: "El usuario ya existe" });
    } else {
      Users.count({})
        .then((count) => {
          const userid = count + 1;
          const user = {
            userid,
            email,
            password: bcrypt.hashSync(password, 10),
            name,
            surname,
            dob,
          };

          Users.create(user)
            .then((user) => {
              if (user) {
                res.status(200).send({ success: true, userid });
              } else {
                res
                  .status(500)
                  .send({ success: false, message: "Error inesperado" });
              }
            })
            .catch((e) => {
              console.log("create", e);
              res.status(500).send({
                success: false,
                message: "Error inesperado",
                error: e,
              });
            });
        })
        .catch((err) => {
          console.log("count", err);
          res
            .status(500)
            .send({ success: false, message: "Error inesperado", error: err });
        });
    }
  });
};

const deleteUser = (req, res) => {
  if (req.query.userid) {
    Users.findOneAndDelete({ userid: req.query.userid }, function (err) {
      if (err) res.status(500).send(err);
      res
        .status(200)
        .send({ success: true, message: "Eliminado Correctamente" });
    });
  } else {
    res
      .status(400)
      .send({ success: false, message: "Error en los datos enviados" });
  }
};

module.exports = {
  login,
  register,
  getUsers,
  deleteUser,
};
