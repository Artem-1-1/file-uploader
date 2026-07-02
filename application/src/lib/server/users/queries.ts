import { db } from "$lib/server/db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import { utapi } from "../uploadthing";

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