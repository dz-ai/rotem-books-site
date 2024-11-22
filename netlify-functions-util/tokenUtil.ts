import jwt, {JwtPayload} from 'jsonwebtoken';

export const generateToken = (userId: string): string | null => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) return null;

        const expiresIn: string = '1h';

        return jwt.sign({userId}, secretKey, {expiresIn});
    } catch (err) {
        console.error(err);
        return null;
    }

};

export const verifyToken = (token: string): JwtPayload | string | null => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) return null;


        return jwt.verify(token, secretKey);
    } catch (err) {
        console.error(err);
        return null;
    }
};
