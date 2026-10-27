**Task: Implement Contact Form Sanity Schema and API Route**

Please generate the code to handle saving submissions from our conversational "Mad-Libs" contact form directly into Sanity.io. We need the Sanity Schema definition and the Next.js server-side API route[cite: 6, 9].

**1. Sanity Schema Definition (`contactSubmission.ts`)**

- Create a new document schema in Sanity to store inquiries. It must include:
  - `name` (String): The prospective client's name[cite: 1, 11].
  - `email` (String): The client's email address[cite: 1, 11].
  - `service` (String): The requested service. Set options to match our 6 core services (Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, Promotion Video)[cite: 11].
  - `eventDate` (String or Date): The requested date or timeframe[cite: 1, 11].
  - `status` (String): A hidden or read-only field for lead status (e.g., "New", "Contacted", "Booked") defaulting to "New".
  - `submittedAt` (Datetime): A timestamp of when the inquiry was received.

**2. Next.js API Route (`app/api/contact/route.ts`)**

- Build a secure POST request handler using Next.js App Router conventions[cite: 6, 9].
- **Logic:**
  - Parse the incoming JSON payload from the frontend contact form.
  - Initialize the Sanity client securely. Use a server-only `SANITY_API_TOKEN` environment variable so the client has write access to the Sanity database without exposing the key to the frontend.
  - Insert a new document of `_type: 'contactSubmission'` into the Sanity dataset.
- **Response:** Return a structured JSON success response. This response will be used by the frontend to trigger the cinematic fade-to-black success message ("Your story is safe with us...")[cite: 11].

Output _only_ the complete, working Sanity schema code block followed by the Next.js API route code block. Do not provide explanations or read further context. Ensure all environment variable usage is strictly server-side.
