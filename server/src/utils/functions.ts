import { compare } from "bcrypt";

export const errorPasswordMessage = (userLogged: boolean) => {
  return userLogged
    ? "A senha informada é diferente da sua senha atual!"
    : "Email ou senha incorretos!";
};

export const comparePassword = async (
  passwordInput: string,
  encryptedPassword: string,
  userLogged: boolean
) => {
  const validatePassword = await compare(passwordInput, encryptedPassword);

  if (!validatePassword) {
    if (userLogged) {
      throw new Error("A senha informada é diferente da sua senha atual!");
    } else {
      throw new Error("Email ou senha incorretos!");
    }
  }
};
