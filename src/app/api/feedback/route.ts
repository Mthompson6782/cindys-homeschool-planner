import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'mthompson6782@gmail.com',
      subject: `New Feature Request: ${title}`,
      text: `Cindy's Home School Planner - New Feature Suggestion\n\nTitle: ${title}\n\nDescription:\n${description}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #3b82f6;">💡 New Feature Suggestion</h2>
          <p><strong>Title:</strong> ${title}</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p style="white-space: pre-wrap; margin: 0;">${description}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">Sent from Cindy's Home School Planner</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Feature request sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending feature request email:', error);
    return NextResponse.json({ error: 'Failed to send feature request' }, { status: 500 });
  }
}
