import bcrypt from "bcrypt";

import User from "../models/User";

export const findByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// export const findById = async (id: string) => {
//   return await User.findById(id);
// };

export const createUser = async (
  name: string,
  lastName: string,
  email: string,
  password: string
) => {
  const hash = bcrypt.hashSync(password, 10);
  const newUser = await User.create({
    name,
    lastName,
    email,
    password: hash,
  });

  return newUser;
};

export const matchPassword = async (
  passwordText: string,
  encrypted: string
) => {
  return bcrypt.compareSync(passwordText, encrypted);
};

export const authentication = async (email: string, password: string) => {
  const user = await findByEmail(email);
  if (!user) return false;

  const hash = user.password;
  const authenticate = await matchPassword(password, hash);

  return authenticate ? user : false;
};

// export const all = async () => {
//   return await User.findAll();
// };
