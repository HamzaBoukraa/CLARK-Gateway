import * as env from 'dotenv';
env.config();

export const AWS_SDK_CONFIG = {
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.REGION,
};
