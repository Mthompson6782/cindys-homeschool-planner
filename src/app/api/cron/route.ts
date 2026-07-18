import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { mockSchedule, blackoutDates } from '@/lib/mockData';

// Vercel Cron sends a secret header we can verify to ensure it's actually Vercel calling the endpoint
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Protect the route
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    // 1. Fetch Assignments
    let todayAssignments = [];
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Connect to real database using service role key (bypasses RLS)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('date', todayStr);
        
      if (error) throw error;
      todayAssignments = data || [];
    } else {
      // Fallback to mock data for local testing
      console.log("Supabase not configured yet, using mock data for emails.");
      todayAssignments = mockSchedule.filter(a => a.date === todayStr);
    }

    // Check if today is a blackout date
    if (blackoutDates.includes(todayStr) || todayAssignments.length === 0) {
       return NextResponse.json({ message: 'No assignments for today or today is a blackout date.' });
    }

    // 2. Setup Nodemailer (Using Gmail App Passwords)
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
       console.log("Email credentials missing. Skipping email dispatch.", todayAssignments);
       return NextResponse.json({ 
         message: 'Simulated email send successfully! To send real emails, add GMAIL_USER and GMAIL_APP_PASSWORD to .env',
         assignmentsCount: todayAssignments.length
       });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // 3. Group assignments by student
    const leoTasks = todayAssignments.filter(a => a.user === 'leo');
    const alexTasks = todayAssignments.filter(a => a.user === 'alex');

    // 4. Send Emails
    const promises = [];
    
    if (leoTasks.length > 0 && process.env.LEO_EMAIL) {
       const htmlBody = `
         <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
           <h2 style="color: #1e40af;">Good Morning Leo!</h2>
           <p style="color: #374151; font-size: 16px;">Here are your assignments for <strong>${format(new Date(), "EEEE, MMMM do, yyyy")}</strong>:</p>
           <ul style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
             ${leoTasks.map(t => `<li style="margin-bottom: 10px; color: #111827;"><strong>${t.title}</strong>: ${t.description}</li>`).join("")}
           </ul>
           <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Have a great day of learning! <br>— Cindy's Home School Planner</p>
         </div>
       `;
       promises.push(transporter.sendMail({
         from: `"Homeschool Planner" <${process.env.GMAIL_USER}>`,
         to: process.env.LEO_EMAIL,
         subject: `Your Daily Assignments - ${format(new Date(), "MMM do")}`,
         html: htmlBody
       }));
    }

    if (alexTasks.length > 0 && process.env.ALEX_EMAIL) {
       const htmlBody = `
         <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
           <h2 style="color: #059669;">Good Morning Alex!</h2>
           <p style="color: #374151; font-size: 16px;">Here are your assignments for <strong>${format(new Date(), "EEEE, MMMM do, yyyy")}</strong>:</p>
           <ul style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
             ${alexTasks.map(t => `<li style="margin-bottom: 10px; color: #111827;"><strong>${t.title}</strong>: ${t.description}</li>`).join("")}
           </ul>
           <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Have a great day of learning! <br>— Cindy's Home School Planner</p>
         </div>
       `;
       promises.push(transporter.sendMail({
         from: `"Homeschool Planner" <${process.env.GMAIL_USER}>`,
         to: process.env.ALEX_EMAIL,
         subject: `Your Daily Assignments - ${format(new Date(), "MMM do")}`,
         html: htmlBody
       }));
    }

    await Promise.all(promises);

    return NextResponse.json({ message: `Successfully sent ${promises.length} emails.` });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
