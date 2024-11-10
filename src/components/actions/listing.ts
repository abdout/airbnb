// components/actions/listing.ts
'use server'

import { db } from "@/lib/db";
import getCurrentUser from "@/components/actions/getCurrentUser";
import { revalidatePath } from "next/cache";

export async function createListing(data: any) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error('Unauthorized');
    }

    const {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      price,
    } = data;

    // Validate required fields
    Object.keys(data).forEach((value: any) => {
      if (!data[value]) {
        throw new Error('Missing required fields');
      }
    });

    const listing = await db.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUser.id,
      },
    });

    revalidatePath('/');
    return { success: true, data: listing };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteListing(listingId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error('Unauthorized');
    }

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid Id");
    }

    const listing = await db.listing.deleteMany({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
    });

    revalidatePath('/');
    return { success: true, data: listing };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}