const http = require("http");
const url = require("url");
const querystring = require("querystring");

const client_id = "PWIuxwNVlZh70gSnWMoxfWcFpg5c7Odk1MLx3wSA";
const client_secret = "yC5OC38phIdKrBBqCvrbyuxy0TZbGDkrZmokp9Ke";
const redirect_uri = "http://44.214.169.149:3000/courseville/access_token";
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";

exports.authApp = (req, res) => {
  res.redirect(authorization_url);
};

exports.accessToken = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  // If the user denied the authorization request
  if (parsedQuery.error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  res.send(parsedQuery)

  // If the user granted the authorization request
  if (parsedQuery.code) {
    // Exchange the authorization code for an access token
    const postData = querystring.stringify({
      grant_type: "authorization_code",
      code: parsedQuery.code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
    });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
      },
    };

    res.send(parsedQuery.code);

  // const tokenReq = http.request(access_token_url, options, (tokenRes) => {
  //   let tokenData = '';
  //   tokenRes.on('data', (chunk) => {
  //     tokenData += chunk;
  //   });
  //   tokenRes.on('end', () => {
  //     const token = JSON.parse(tokenData);

  //     // Use the access token to fetch the user's profile
  //     const profileOptions = {
  //       headers: {
  //         'Authorization': `Bearer ${token.access_token}`
  //       }
  //     };

  //     const profileReq = http.request('https://example.com/api/user', profileOptions, (profileRes) => {
  //       let profileData = '';
  //       profileRes.on('data', (chunk) => {
  //         profileData += chunk;
  //       });
  //       profileRes.on('end', () => {
  //         const profile = JSON.parse(profileData);

  //         // Perform any necessary user authentication/authorization here

  //         // Redirect to the home page after successful authentication
  //         res.writeHead(302, {'Location': '/'});
  //         res.end();
  //       });
  //     });
  //     profileReq.on('error', (err) => {
  //       console.error(err);
  //     });
  //     profileReq.end();
  //   });
  // });
  // tokenReq.on('error', (err) => {
  //   console.error(err);
  // });
  // tokenReq.write(postData);
  // tokenReq.end();
  // } else {
  // If the user hasn't granted or denied the authorization request yet, redirect to the authorization URL
  // const authParams = querystring.stringify({
  //   client_id: client_id,
  //   response_type: "code",
  //   redirect_uri: redirect_uri,
  //   scope: "profile",
  // });
  // const authUrl = `${authorizationrl}?${authParams}`;
  //   res.writeHead(302, { Location: authorization_url });
  //   res.end();
  // }
};
