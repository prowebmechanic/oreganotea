
'use server';
/**
 * @fileOverview A Genkit flow to save a note to Google Drive.
 *
 * - saveNoteToDrive - A function that handles saving the note to Google Drive.
 * - SaveToDriveInput - The input type for the saveNoteToDrive function.
 * - SaveToDriveOutput - The return type for the saveNoteToDrive function.
 */

import { google } from 'googleapis';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SaveToDriveInputSchema = z.object({
  noteTitle: z.string().describe('The title of the note to save.'),
  noteContent: z.string().describe('The content of the note to save.'),
  accessToken: z.string().describe("The Google OAuth2 access token. Expected format: 'Bearer <token>' or just '<token>'."),
});

export type SaveToDriveInput = z.infer<typeof SaveToDriveInputSchema>;

const SaveToDriveOutputSchema = z.object({
  fileId: z.string().describe('The ID of the file saved to Google Drive.'),
  fileName: z.string().describe('The name of the file saved to Google Drive.'),
  webViewLink: z.string().optional().describe('A link to view the file in Google Drive.'),
});

export type SaveToDriveOutput = z.infer<typeof SaveToDriveOutputSchema>;

export async function saveToDrive(input: SaveToDriveInput): Promise<SaveToDriveOutput> {
  return saveNoteToDriveFlow(input);
}

const saveNoteToDriveFlow = ai.defineFlow(
  {
    name: 'saveNoteToDriveFlow',
    inputSchema: SaveToDriveInputSchema,
    outputSchema: SaveToDriveOutputSchema,
  },
  async (input) => {
    const { noteTitle, noteContent, accessToken } = input;

    const auth = new google.auth.OAuth2();
    // Ensure the token doesn't include "Bearer " prefix, as setCredentials expects just the token.
    const cleanAccessToken = accessToken.startsWith('Bearer ') ? accessToken.substring(7) : accessToken;
    auth.setCredentials({ access_token: cleanAccessToken });

    const drive = google.drive({ version: 'v3', auth });

    const fileName = `${noteTitle.trim() || 'Untitled Oreganote'}.txt`;
    const fileMetadata = {
      name: fileName,
      parents: ['root'], // Saves to the root of the user's Drive. Change to a specific folder ID if needed.
      // Consider adding mimeType if it's not plain text, e.g., 'application/vnd.google-apps.document' for Google Docs
    };
    const media = {
      mimeType: 'text/plain', // For .txt files
      body: noteContent,
    };

    try {
      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink', // Request additional fields like webViewLink
      });
      
      if (!file.data.id || !file.data.name) {
        throw new Error('Failed to create file in Google Drive, ID or name missing in response.');
      }

      return { 
        fileId: file.data.id,
        fileName: file.data.name,
        webViewLink: file.data.webViewLink || undefined
      };
    } catch (err: any) {
      console.error('Error saving to Google Drive:', err.message);
      // More detailed error logging
      if (err.response?.data?.error) {
        console.error('Google API Error:', err.response.data.error);
      }
      if (err.code === 401 || (err.errors && err.errors.some((e:any) => e.reason === 'authError'))) {
          throw new Error('Authentication failed. Please ensure you have a valid access token and the Drive API is enabled.');
      }
      throw new Error(`Failed to save to Google Drive: ${err.message}`);
    }
  }
);
