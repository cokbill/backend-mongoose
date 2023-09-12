const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  const refreshToken = req.cookies["refreshToken"];

  if (!authHeader && !refreshToken) {
    const error = new Error("Not authenticated missing Token");
    error.statusCode = 411;
    throw error;
  }

  //support auth header OR bearer token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  // Remove Bearer from string
  token = token.replace(/^Bearer\s+/, "");

  //const token = authHeader.split(" ")[1]
  console.log(token);
  let decodedToken;

  try {
    //verify akses token
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
    console.log(decodedToken);
    req.userId = decodedToken.userId;
    next();

    if (!decodedToken) {
      const error = new Error("Token Salah");
      error.statusCode = 412;
      throw error;
    }
  } catch (err) {
    console.log(err);

    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    //if error maybe expired, try to refresh token
    if (
      err instanceof jwt.TokenExpiredError ||
      err instanceof jwt.JsonWebTokenError
    ) {
      return res.status(405).send({ error: "Token Expired" });

      // try {
      //     //cek expired of refreshtoken
      //     const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
      //     const accessToken = jwt.sign(
      //         {
      //             email: decodedRefresh.email,
      //             userId:decodedRefresh.userId,
      //             roles: decodedRefresh.roles
      //         },
      //          process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '1h' });

      //     req.userId = decodedRefresh.userId

      //     res
      //       .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
      //       .header('Authorization', accessToken)
      //       .json({message: "refresh success", accessToken")

      // } catch (error) {
      //     console.log(error)
      //     return res.status(400).send('Invalid Token.');
      // }
    }
  }
};