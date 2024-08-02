import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (data: object) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

  try {
    const token = JWT.sign(data, SECRET_KEY, { expiresIn: "2h" });
    return token;
  } catch (err) {
    throw new Error("Erro ao gerar Token.");
  }
};

export const verifyToken = (token: string) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

  try {
    const decoded = JWT.verify(token, SECRET_KEY);
    return decoded; // Retorna o payload do token
  } catch (err) {
    throw new Error("Token inválido ou expirado.");
  }
};
