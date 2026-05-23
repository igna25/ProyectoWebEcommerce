import { NextResponse } from "next/server";
import UsersRepository from "@/lib/Repositories/UsersRepository";

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ message: "Faltan campos" }, { status: 400 });
    }

    const usersRepository = new UsersRepository();
    await usersRepository.registerUser(email, username, password);

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { message: "El email ya está registrado" },
      { status: 409 },
    );
  }
}
