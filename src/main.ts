import { readFileSync } from 'fs';
import { parse, stringify, Schema } from '@puppeteer/replay';
import { CypressStringifyExtension } from './CypressStringifyExtension.js';

function parseRecording(recordingContent: string): Schema.UserFlow {
  return parse(JSON.parse(recordingContent));
}

export async function stringifyRecording(
  parsedRecording: Schema.UserFlow
): Promise<Promise<string> | undefined> {
  return await stringify(parsedRecording, {
    extension: new CypressStringifyExtension(),
  });
}

export default async function cypressStringifyChromeRecorder(
  recordings: string[]
): Promise<Promise<string | undefined>[] | undefined> {
  // If no recordings found, log message and return.
  if (recordings.length === 0) {
    console.log(
      'No recordings found. Please create and upload one before trying again.'
    );

    return;
  }

  // Else, parse and stringify recordings
  const stringifiedRecording = recordings.map(async (recording) => {
    const recordingContent = readFileSync(`${recording}`, 'utf8');
    const parsedRecording = parseRecording(recordingContent);

    const cypressStringified = await stringifyRecording(parsedRecording);

    return cypressStringified;
  });

  return stringifiedRecording;
}
