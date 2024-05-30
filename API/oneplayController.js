const fs = require("fs");

const get = (req, res) => res.sendFile(__dirname + "/public/oneplayers.json");

const post = (req, res) => {
  if (req.params.function && req.params.name) {
    fs.readFile(__dirname + "/public/oneplayers.json", (err, data) => {
      if (err) {
        console.log("ERROR: " + err);
        return res.status(500).json({
          success: false,
        });
      }
      const oneplayers = JSON.parse(data);
      let isFirst = true;

      let oneplayerIndex = -1;
      for (const op in oneplayers) {
        if (oneplayers[op].name == req.params.name) {
          oneplayerIndex = op;
        }
        if (oneplayers[op].guessed) {
          isFirst = false;
        }

        if (req.params.function == "next") {
          oneplayers[op].current = false;
          oneplayers[op].guessed = false;
        }
      }
      if (oneplayerIndex == -1) {
        return res.send({
          success: false,
          message: "oneplayer not found",
        });
      }

      if (req.params.function == "next") {
        oneplayers[oneplayerIndex].current = false;
        let newIndex = parseInt(oneplayerIndex) + 1;
        if (oneplayers.length - newIndex <= 0) {
          newIndex = 0;
        }
        oneplayers[newIndex].current = true;
      } else if (req.params.function == "guessed") {
        if (!oneplayers[oneplayerIndex].guessed) {
          let pointsToAdd = 6 - new Date().getDay();
          if (isFirst) {
            pointsToAdd += 1;
          }

          oneplayers[oneplayerIndex].guessed = true;
          oneplayers[oneplayerIndex].points += pointsToAdd;
        }
      } else {
        oneplayers[oneplayerIndex].points -= 5;
      }

      const newOneplayers = JSON.stringify(oneplayers);

      fs.writeFile(
        __dirname + "/public/oneplayers.json",
        newOneplayers,
        "utf-8",
        function (err) {
          if (err) {
            console.log("ERROR: " + err);
            return res.status(500).json({
              success: false,
            });
          }

          return res.send({
            success: true,
            oneplayers: newOneplayers,
          });
        }
      );
    });
  } else {
    res.status(401).json({
      success: false,
    });
  }
};

module.exports = {
  get,
  post,
};
