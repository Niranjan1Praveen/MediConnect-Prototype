import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { searchParams } = new URL(request.url);
  const userType = searchParams.get("user_type");
  console.log(userType);
  
  if (!user || user == null || !user.id) {
    throw new Error("Something went wrong!");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
        role: userType?.toUpperCase() || "NGO",
      },
    });
  }

  let redirectUrl;

  switch (userType) {
    case 'corporate':
      redirectUrl = "http://127.0.0.1:9050/";
      break;
    default:
      redirectUrl = "http://localhost:3000/doctor";
  }

  return NextResponse.redirect(redirectUrl);
}
