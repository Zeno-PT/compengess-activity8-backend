// TODO: Change cilentId, clientSecret, redirectUri below
const client_id = "PWIuxwNVlZh70gSnWMoxfWcFpg5c7Odk1MLx3wSA";
const client_secret = "yC5OC38phIdKrBBqCvrbyuxy0TZbGDkrZmokp9Ke";
const redirect_uri = "http://44.214.169.149:3000/courseville/access_token";

const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";

const https = require("https");
const url = require("url");
const querystring = require("querystring");

exports.authApp = async (req, res) => {
  res.redirect(authorization_url);
};

exports.accessToken = async (req, res) => {
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
          req.session.token = token;
          // Redirect to your home.html page in frontend
          // TODO: Change to EC2 frontend-cv-api-XX public IP later when deployed.
          console.log(req.session.token.access_token)
          res.redirect('http://127.0.0.1:5500/login_cv/home.html')
          res.end();
        });
      }
    );
    tokenReq.on("error", (err) => {
      console.error(err);
    });
    tokenReq.write(postData);
    tokenReq.end();
  } else {
    res.writeHead(302, { Location: authorization_url });
    res.end();
  }
};

exports.getProfileInformation = async (req, res) => {
  // res.send(req.session)
  // res.end()
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
  });
  courseReq.end();
};

exports.getCompEngEssAssignments = async (req, res) => {
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
  });
  assignmentReq.end();
};

exports.logout = async (req, res) => {
  req.session.destroy();
  // Redirect to your index.html page in frontend
  // TODO: Change to EC2 frontend-cv-api-XX public IP later when deployed.
  res.redirect('http://127.0.0.1:5500/login_cv/index.html');
  res.end()
}