import * as bcrypt from "bcryptjs";

// async function hashPassword(password: string): Promise<void> {
//     const saltRounds = 10;
//
//     try {
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         console.log(`Hashed and salted password: ${hashedPassword}`);
//     } catch (error) {
//         console.error('Error hashing password:', error);
//     }
// }

export const comparePassword = async (inputPassword: string, storedHash: string): Promise<boolean> => {
    let isMatch: boolean = false;

    try {
        isMatch = await bcrypt.compare(inputPassword, storedHash);

        return isMatch;

    } catch (error) {
        console.error('Error comparing passwords:', error);
        return isMatch;
    }
};
