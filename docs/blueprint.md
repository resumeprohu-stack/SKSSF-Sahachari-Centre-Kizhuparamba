# **App Name**: Sahachari Resource Tracker

## Core Features:

- User Authentication and Roles: Secure Firebase Authentication to manage admin and public user roles.
- Item Management: Admins can add, edit, and delete items with details like name, category, description, quantity, image (stored in Firebase Storage), and status.
- Real-time Availability Status: Display real-time availability status (Available, Issued, Returned) using Firestore real-time listeners.
- Item Issuance and Return Tracking: Track items issued to individuals, recording issue date, expected return date, and actual return date.  Highlight items pending return.
- Weekly Report Generation: Automatically generate weekly reports on items added, issued, returned, and pending return, with date range filters and export options (CSV/PDF).
- Dashboard UI: Admin-only access to dashboard that presents the status of each item, based on data available from Firestore
- Smart Status Tool: Use a generative AI tool to cross-reference Firestore data and provide prompts to users to address outstanding requests, approaching deadlines, or any identified inconsistencies.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5), conveying trust and stability, reflecting the organization's reliability. 
- Background color: Light blue (#E3F2FD), providing a calm and clean backdrop for content.
- Accent color: Muted purple (#7E57C2) to add a touch of sophistication and highlight key interactive elements.
- Body and headline font: 'PT Sans', a humanist sans-serif for a modern, readable style.
- Use clear, simple icons to represent item categories and status. Icons should be consistent and easily understandable.
- Implement a clean, responsive layout using simple tables and cards to display item information and reports. Prioritize mobile-first design.
- Subtle transitions and loading animations to enhance user experience and provide feedback on interactions.