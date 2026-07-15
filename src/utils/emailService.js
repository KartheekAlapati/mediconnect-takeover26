console.log("Resend API Key:", import.meta.env.VITE_RESEND_API_KEY ? "FOUND" : "MISSING");

export const generateMailtoLink = (appointment, doctorName) => {
  const email = appointment.email || "";
  const subject = encodeURIComponent(`Appointment Confirmation | MediConnect | ${appointment.id}`);
  const body = encodeURIComponent(`🏥 Appointment Confirmation - MediConnect\n\nDear ${appointment.patientName || appointment.name},\n\nThis is to confirm that your appointment has been successfully scheduled.\n\nAppointment Details\n\nAppointment ID:\n${appointment.id}\n\nProvider:\n${doctorName}\n\nDate:\n${appointment.date}\n\nTime:\n${appointment.time}\n\nLocation:\nMediConnect Healthcare Center\nVijayawada, Andhra Pradesh\n\nInstructions:\n• Please arrive 15 minutes before your appointment.\n• Please bring a valid photo ID.\n• Carry previous medical records if available.\n\nIf you need to cancel or reschedule, please contact the clinic at least 24 hours in advance.\n\nClinic Contact:\n+91 XXXXXXXXXX\n\nThank you for choosing MediConnect.\n\nRegards,\nMediConnect Healthcare Team`);
  return `mailto:${email}?subject=${subject}&body=${body}`;
};

export const sendConfirmationEmail = async (appointment, doctorName) => {
  console.log("====== EMAIL ROOT CAUSE ANALYSIS START ======");
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  
  console.log("1. API Key detected:", !!apiKey ? "TRUE" : "FALSE (Missing)");
  console.log("2. Patient Email detected:", appointment.email || "FALSE (Missing)");

  if (!apiKey) {
    console.warn("HALT: No Resend API Key found. Using mailto fallback.");
    console.log("====== EMAIL ROOT CAUSE ANALYSIS END ======");
    return { success: false, fallbackUrl: generateMailtoLink(appointment, doctorName) };
  }

  try {
    let aiMessage = null;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (geminiKey) {
      try {
        const prompt = `Write a short, professional, and warm medical appointment confirmation message for a patient named ${appointment.patientName || appointment.name}. The appointment is with ${doctorName} on ${appointment.date} at ${appointment.time}. Keep it under 50 words. Output only the message text, no subject line or markdown.`;
        
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
            }),
          }
        );
        
        if (geminiRes.ok) {
          const data = await geminiRes.json();
          aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;
        }
      } catch (geminiError) {
        console.warn("Gemini generation failed, falling back to static template.", geminiError);
      }
    }

    const dynamicMessageHtml = aiMessage 
      ? `<p style="line-height: 1.5; color: #334155;">${aiMessage.replace(/\n/g, '<br/>')}</p>`
      : `<p style="line-height: 1.5; color: #334155;">Dear <strong>${appointment.patientName || appointment.name}</strong>,<br/><br/>This is to confirm that your appointment has been successfully scheduled.</p>`;

    const payload = {
      from: "MediConnect <onboarding@resend.dev>",
      to: [appointment.email || "delivered@resend.dev"], // Default fallback for hackathon demos
      subject: `Appointment Confirmation | MediConnect | ${appointment.id}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">MediConnect</h1>
            <span style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-top: 8px;">🏥 Appointment Confirmed</span>
          </div>
          ${dynamicMessageHtml}
          <h3 style="color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Appointment Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
            <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%;"><strong>Appointment ID</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-family: monospace;">${appointment.id}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Provider</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${doctorName}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Date</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${appointment.date}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Time</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${appointment.time}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Location</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">MediConnect Healthcare Center<br/>Vijayawada, Andhra Pradesh</td></tr>
          </table>
          
          <h3 style="color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Instructions</h3>
          <ul style="color: #475569; font-size: 14px; line-height: 1.6; padding-left: 20px;">
            <li>Please arrive 15 minutes before your appointment.</li>
            <li>Please bring a valid photo ID.</li>
            <li>Carry previous medical records if available.</li>
          </ul>
          
          <div style="margin-top: 30px; background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; font-size: 14px; color: #475569;">
            If you need to cancel or reschedule, please contact the clinic at least 24 hours in advance.<br/><br/>
            <strong>Clinic Contact: +91 XXXXXXXXXX</strong>
          </div>
          
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Thank you for choosing MediConnect.<br/><br/>
            Regards,<br/>
            <strong>MediConnect Healthcare Team</strong>
          </div>
        </div>
      `
    };

    console.log("3. Payload being sent to Resend:", { from: payload.from, to: payload.to, subject: payload.subject });

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("4. Resend response status code:", response.status);

    if (!response.ok) {
      const errBody = await response.json();
      console.error("Resend API Error Response:");
      console.table({
        code: errBody.statusCode || errBody.code || response.status,
        message: errBody.message || "Unknown error",
        name: errBody.name || "Error"
      });
      console.log("====== EMAIL ROOT CAUSE ANALYSIS END ======");
      return { success: false, fallbackUrl: generateMailtoLink(appointment, doctorName) };
    } else {
      const successBody = await response.json();
      console.log("5. Resend response body (SUCCESS):", successBody);
      console.log("Confirmation email sent successfully via Resend!");
      console.log("====== EMAIL ROOT CAUSE ANALYSIS END ======");
      return { success: true };
    }
  } catch (error) {
    console.error("4. Fetch/Network Error:", error.message, error);
    console.log("====== EMAIL ROOT CAUSE ANALYSIS END ======");
    return { success: false, fallbackUrl: generateMailtoLink(appointment, doctorName) };
  }
};
