import UsersRepository from "../Repositories/Usersrepository";

export async function registerUser(
  email: string,
  username: string,
  password: string,
): Promise<{ success: boolean; msg?: string }> {
  const usersRepository = new UsersRepository();

  try {
    const success = await usersRepository.registerUser(
      email,
      username,
      password,
    );

    if (success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        msg: "Failed to register user",
      };
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      msg: "Error registering user",
    };
  }
}
