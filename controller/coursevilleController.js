// TODO: Change cilentId, clientSecret, EC2 backend instance IP address, and frontend IP address and port below
const client_id = "PWIuxwNVlZh70gSnWMoxfWcFpg5c7Odk1MLx3wSA";
const client_secret = "yC5OC38phIdKrBBqCvrbyuxy0TZbGDkrZmokp9Ke";
const backendEC2IPAddress = "44.214.169.149";
// const backendEC2IPAddress = "127.0.0.1";
// TODO: Change to EC2 frontend-cv-api-XX public IP later when deployed.
// const frontendCvIPAddress = "35.174.220.149";
const frontendCvIPAddress = "127.0.0.1:8000";
let session_id;

const redirect_uri = `http://${backendEC2IPAddress}:3000/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";

const https = require("https");
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
// const { Store } = require("express-session");

exports.authApp = (req, res) => {
  // try {
  //   req.session.token = "kin3u8f3Fo4ALncQHa0FIZ5JjW8SRIQ5QrwhDW9P";
  //   console.log(req.session.token);
  //   if (req.session.token) {
  //     req.session.save();
  //     res.redirect(`http://${frontendIPAddress}:${frontendPort}/home.html`);
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  // res.end();
  // res.redirect(`http://127.0.0.1:3000/courseville/get_profile_info`);
  console.log('Request 1', req.protocol + '://' + req.get('host') + req.originalUrl)
  console.log('Request referer 1', req.header('Referer'))
  session_id = req.sessionID
  res.redirect(authorization_url);
};

exports.accessToken = async (req, res) => {
  console.log('Request 2', req.protocol + '://' + req.get('host') + req.originalUrl)
  console.log('Request referer 2', req.header('Referer'))
  // console.log('Response', res)
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
      grant_type: "authorization_code",
      code: parsedQuery.code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
    });

    const tokenOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
      },
    };

    const tokenReq = https.request(
      access_token_url,
      tokenOptions,
      (tokenRes) => {
        let tokenData = "";
        tokenRes.on("data", (chunk) => {
          tokenData += chunk;
        });
        tokenRes.on("end", () => {
          const token = JSON.parse(tokenData);
          if (token) {
            res.redirect(`http://${frontendCvIPAddress}/home.html`);
            res.end()
          }
          req.session.token = token;
          req.session.save()
          console.log('Session A', req.sessionID)
          console.log(req.session);
          // fs.writeFileSync(
          //   "./token.json",
          //   JSON.stringify(token),
          //   "utf-8",
          //   (err) => {
          //     console.error(err);
          //   }
          // );
          // Redirect to your home.html page in frontend
          // res.send(token);
          // if (req.session.token) {
          //   res.redirect(`http://${frontendCvIPAddress}/home.html`);
          //   res.end();
          // }
          // req.session.save()
          // res.end();
        });
      }
    );
    tokenReq.on("error", (err) => {
      console.error(err);
    });
    tokenReq.write(postData);
    tokenReq.end();
    // res.redirect('/courseville/get_profile_info')
    // res.redirect('http://127.0.0.1:8000/home.html')
    // res.end();
  } else {
    res.writeHead(302, { Location: authorization_url });
    res.end();
  }
};

exports.getProfileInformation = (req, res) => {
  // if (!fs.existsSync("./token.json")) {
  //   console.log("Please press logout button and login again.");
  // }
  // const token = fs.readFileSync("./token.json", "utf-8", (err) => {
  //   console.log(err);
  // });

  // req.session.token = JSON.parse(token);
  console.log('Session B', req.sessionID)
  console.log(req.session)
  const profileOptions = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`,
    },
  };
  const profileReq = https.request(
    "https://www.mycourseville.com/api/v1/public/users/me",
    profileOptions,
    (profileRes) => {
      let profileData = "";
      profileRes.on("data", (chunk) => {
        profileData += chunk;
      });
      profileRes.on("end", () => {
        const profile = JSON.parse(profileData);
        res.send(profile);
        res.end();
      });
    }
  );
  profileReq.on("error", (err) => {
    console.error(err);
  });
  profileReq.end();
};

exports.getCourses = async (req, res) => {
  // const token = fs.readFileSync("./token.json", "utf-8", (err) => {
  //   console.error(err);
  // });
  // req.session.token = JSON.parse(token);
  const courseOptions = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`,
    },
  };
  const courseReq = https.request(
    "https://www.mycourseville.com/api/v1/public/get/user/courses",
    courseOptions,
    (courseRes) => {
      let courseData = "";
      courseRes.on("data", (chunk) => {
        courseData += chunk;
      });
      courseRes.on("end", () => {
        const courses = JSON.parse(courseData);
        res.send(courses);
        res.end();
      });
    }
  );
  courseReq.on("error", (err) => {
    console.error(err);
    res.send(err);
    res.end();
  });
  courseReq.end();
};

exports.getCourseAssignments = async (req, res) => {
  const token = fs.readFileSync("./token.json", "utf-8", (err) => {
    console.error(err);
  });
  req.session.token = JSON.parse(token);
  const assignmentOptions = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`,
    },
  };
  const assignmentReq = https.request(
    `https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${req.params.cv_cid}`,
    assignmentOptions,
    (assignmentRes) => {
      let assignmentData = "";
      assignmentRes.on("data", (chunk) => {
        assignmentData += chunk;
      });
      assignmentRes.on("end", () => {
        const assignments = JSON.parse(assignmentData);
        res.send(assignments);
        res.end();
      });
    }
  );
  assignmentReq.on("error", (err) => {
    console.error(err);
    res.send(err);
    res.end();
  });
  assignmentReq.end();
};

exports.getAssignmentDetail = async (req, res) => {
  const token = fs.readFileSync("./token.json", "utf-8", (err) => {
    console.error(err);
  });
  req.session.token = JSON.parse(token);
  const itemOptions = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`,
    },
  };
  const itemReq = https.request(
    `https://www.mycourseville.com/api/v1/public/get/item/assignment?item_id=${req.params.item_id}`,
    itemOptions,
    (itemRes) => {
      let itemData = "";
      itemRes.on("data", (chunk) => {
        itemData += chunk;
      });
      itemRes.on("end", () => {
        const items = JSON.parse(itemData);
        res.send(items);
        res.end();
      });
    }
  );
  itemReq.on("error", (err) => {
    console.error(err);
    res.send(err);
    res.end();
  });
  itemReq.end();
};

exports.logout = async (req, res) => {
  req.session.destroy();
  try {
    fs.unlinkSync("./token.json");
  } catch (error) {
    console.log(error);
  }
  res.redirect(`http://${frontendCvIPAddress}`);
  res.end();
};
