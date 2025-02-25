import dotenv from "dotenv";

dotenv.config();

// 스케줄러 사용시 사용
// function getEnvValueConvertUnderbar(key){
//   let value = process.env[key];
//   return value.replace(/_/g, ' ');
// }

function getEnvValue(key) {
  let value = process.env[key];
  if (value && value.startsWith("[")) {
    value = value.replace(/[\[\]\s]/g, "").split(",");
  }
  return value;
}

export const config = {
  db:{
    db_host:getEnvValue("DB_HOST")
  },

  jwt: {
    user_secretKey : getEnvValue("USER_JWT_SECRET"),
    employer_secretKey : getEnvValue("EMPLOYER_JWT_SECRET"),
    expiresInSec: parseInt(getEnvValue("JWT_EXPIRES_SEC", 259200)),
  },
  
  bcrypt: {
    saltRounds: parseInt(getEnvValue("BCRYPT_SALT_ROUNDS")),
  },

  hosting_port: {
    user_front: parseInt(getEnvValue("USER_FRONT")),
    user_back: parseInt(getEnvValue("USER_BACK")),
  },
  
  nodemailer: {
    email: getEnvValue("MANAGER_EMAIL_ACCOUNT"),
    password: getEnvValue("MANAGER_EMAIL_PASSWORD"),
  },

  jobs: {
    jobCategory: getEnvValue("JOB_CATEGORY_CODE")
  },

  talented: {
    type: getEnvValue("TALENTED_TYPE_CODE")
  },

  api: {
    apiKey: getEnvValue('API_KEY'),
    apiSecretKey: getEnvValue('API_SECRET'),
    hpNumber: getEnvValue('MY_NUMBER')
  },
}