import { db } from "$lib/server/db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import { utapi } from "../uploadthing";
import { auth } from "../auth";

export async function getUserById(id: string) {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return foundUser || null;
}

export async function updateUserAvatar(userId: string, newPhotoUrl: string, newPhotoKey: string) {
  const [currentUser] = await db
    .select({ imageKey: user.imageKey })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
   
    if (!currentUser) {
    throw new Error("User not found")
  }

  const oldImageKey = currentUser.imageKey;  
  
  await db 
    .update(user)
    .set({ 
      image: newPhotoUrl,
      imageKey: newPhotoKey })
    .where(eq(user.id, userId))
    .returning({ oldImageKey: user.imageKey})

  if (oldImageKey && oldImageKey !== newPhotoKey) {
    try {
      await utapi.deleteFiles([oldImageKey]);
    } catch (error) {
      console.error("Failed to delete old avatar from UploadThing:", error);
    }
  } else {
    console.log("The user did not have an avatar.");
  }
  return newPhotoUrl;
}

export async function changeUsername(headers : Headers, newUsername: string) {
  const updateUser = await auth.api.updateUser({
    body: {
      name: newUsername,
    },
    headers: headers,
  });
  return updateUser;
}

export async function changeEmail(userId: string, newEmail: string) {
  const normalizedEmail = newEmail.trim().toLowerCase();

  try {
    const result = await db.transaction(async (tx) => {
      const [existingUser] = await tx
        .select()
        .from(user)
        .where(eq(user.email, normalizedEmail))
        .limit(1);

      if (existingUser) {
        throw new Error("This email is already in use");
      }

      const [updatedUser] = await tx
        .update(user)
        .set({
          email: normalizedEmail,
          emailVerified: false,
        })
        .where(eq(user.id, userId))
        .returning();
      
      return updatedUser;
    });
    
    return result;
  } catch (error: any) {
    console.error('Full error:', error);
    
    if (error?.code === '23505' || error.message === "This email is already in use") {
      throw new Error("This email is already in use");
    }
    throw error;
  }
}