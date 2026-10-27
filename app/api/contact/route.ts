import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// Initialize Sanity client securely with server-side write token
function getWriteClient() {
  const token = process.env.SANITY_API_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!token) {
    throw new Error("Missing server environment variable: SANITY_API_TOKEN");
  }

  return createClient({
    projectId: projectId || "brst44qi",
    dataset: dataset || "production",
    apiVersion: "2026-10-26",
    token,
    useCdn: false, // Must be false for real-time mutations
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, eventDate, date } = body;

    const requestedDate = (eventDate || date || "").trim();

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!service?.trim()) {
      return NextResponse.json(
        { success: false, error: "Service selection is required." },
        { status: 400 }
      );
    }

    if (!requestedDate) {
      return NextResponse.json(
        { success: false, error: "Event date or timeframe is required." },
        { status: 400 }
      );
    }

    const client = getWriteClient();

    // Create document in Sanity dataset
    const newDoc = await client.create({
      _type: "contactSubmission",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service: service.trim(),
      eventDate: requestedDate,
      status: "New",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your story is safe with us. We will be in touch soon.",
        data: {
          id: newDoc._id,
          name: newDoc.name,
          email: newDoc.email,
          service: newDoc.service,
          eventDate: newDoc.eventDate,
          submittedAt: newDoc.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating contact submission in Sanity:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to save submission.";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
