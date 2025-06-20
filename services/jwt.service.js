const config = require("config");
const jwt = require("jsonwebtoken");

class JwtService {
  constructor(accessKey, refreshKey, accessTime, refreshTime) {
    this.accessKey = accessKey;
    this.refreshKey = refreshKey;
    this.accessTime = accessTime;
    this.refreshTime = refreshTime;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessKey, {
      expiresIn: this.accessTime,
    });

    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, this.accessKey);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

let StudentJwtService = new JwtService(
  config.get("studentAccessKey"),
  config.get("studentRefreshKey"),
  config.get("studentAccessTime"),
  config.get("studentRefreshTime")
);

let OwnerJwtService = new JwtService(
  config.get("ownerAccessKey"),
  config.get("ownerRefreshKey"),
  config.get("ownerAccessTime"),
  config.get("ownerRefreshTime")
);

let AdminJwtService = new JwtService(
  config.get("adminAccessKey"),
  config.get("adminRefreshKey"),
  config.get("adminAccessTime"),
  config.get("adminRefreshTime")
);

module.exports = {
  StudentJwtService,
  OwnerJwtService,
  AdminJwtService,
};
