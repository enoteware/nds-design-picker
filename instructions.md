Build a Next.js (App Router) landing page for Noteware Digital Solutions (NDS).
The goal of this page is to showcase different UI design styles (from the `../awesome-design-md/design-md` folders) and let potential clients pick one and submit a request.

1. **Setup & UI:**
   - Use Next.js, Tailwind, and lucide-react (or similar).
   - Read the folders in `../awesome-design-md/design-md` to get the list of styles (e.g., apple, linear, claude, etc.).
   - Display them as a grid of cards. Each card should have the name and ideally link to the preview.html (or just open a modal). Since the previews are hosted on Vercel (https://awesome-design-md-nine.vercel.app/), you can iframe them or link to them.

2. **The "I want this one" flow:**
   - Each style card has a "Choose this style" button.
   - Clicking it opens a form with:
     - First Name
     - Last Name
     - Email
     - Company Name
     - Project Details / Notes
     - Logo Upload (File input)
     - Selected Style (Hidden or read-only, based on what they clicked).

3. **Backend / API Route (`/api/submit-lead`):**
   - Create a Next.js Route Handler to securely process the form.
   - The route must use the `INVOI_AGENT_KEY` environment variable.
   - It will make HTTP requests to the Invoi Agent API (`https://app.noteware.dev/api/agent/...`).
   - Flow:
     a. `POST /api/agent/clients` to create a new client. Body: `{ client_type: "organization", first_name, last_name, company_name, email, notes: "Style chosen: " + style + "\n\n" + project_details }`
     b. If a logo was uploaded, use `multipart/form-data` to `POST /api/agent/clients/{client_id}/logo` (or equivalent endpoint) to upload it.
     c. (Optional) Create a support ticket for the new client via `POST /api/agent/tickets`.

Please initialize the Next.js app and build these pieces.
