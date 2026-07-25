require('dotenv').config({ path: '.env.local' });
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;

const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

async function checkEmails() {
  let connection;
  try {
    connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    // Search for unread emails from the specific address with the subject keyword
    const searchCriteria = [
      'ALL',
      ['FROM', 'mthompson6782@gmail.com'],
      ['SUBJECT', 'New Feature Request']
    ];
    
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    
    if (messages.length === 0) {
      console.log("No new feature requests.");
      return;
    }

    for (let item of messages) {
      const all = item.parts.find(part => part.which === 'TEXT');
      const id = item.attributes.uid;
      const idHeader = "Imap-Id: "+id+"\r\n";
      
      const parsed = await simpleParser(idHeader + all.body);
      
      console.log("=== NEW FEATURE REQUEST FOUND ===");
      console.log("UID:", id);
      const headers = item.parts.find(p => p.which === 'HEADER').body;
      const subject = Object.keys(headers).find(k => k.toLowerCase() === 'subject');
      console.log("Subject:", headers[subject][0]);
      console.log("Content:", parsed.text);
      console.log("=================================");
    }
    
  } catch (err) {
    console.error("Error checking emails:", err);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

checkEmails();
