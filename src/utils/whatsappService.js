export const sendWhatsAppConfirmation = async (appointment, doctorName) => {
  console.log("====== TWILIO ROOT CAUSE ANALYSIS START ======");
  
  const accountSid = import.meta.env.VITE_TWILIO_SID;
  const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  
  const rawSender = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || "+14155238886";
  const fromWhatsAppNumber = rawSender.startsWith("whatsapp:") ? rawSender : `whatsapp:${rawSender}`;
  const toWhatsAppNumber = appointment.phone ? `whatsapp:+91${appointment.phone}` : "whatsapp:+919999999999";
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  console.log("1. Environment variables detected:", !!accountSid && !!authToken ? "TRUE" : "FALSE (Missing)");
  console.log("2. Destination phone number:", toWhatsAppNumber);
  console.log("3. Twilio request URL:", twilioUrl);

  if (!accountSid || !authToken) {
    console.error("HALT: Missing credentials. Falling back to wa.me.");
    console.log("====== TWILIO ROOT CAUSE ANALYSIS END ======");
    return { success: false, fallbackUrl: generateWaMeLink(appointment, doctorName) };
  }

  try {
    const details = new URLSearchParams();
    details.append('To', toWhatsAppNumber);
    details.append('From', fromWhatsAppNumber);
    details.append('Body', `🏥 Appointment Confirmation - MediConnect\n\nDear ${appointment.patientName || appointment.name},\n\nThis is to confirm that your appointment has been successfully scheduled.\n\nProvider:\n${doctorName}\n\nDate:\n${appointment.date}\n\nTime:\n${appointment.time}\n\nLocation:\nMediConnect Healthcare Center\nVijayawada, Andhra Pradesh\n\nAppointment ID:\n${appointment.id}\n\nInstructions:\n• Please arrive 15 minutes before your appointment.\n• Please bring a valid photo ID.\n• Carry previous medical records if available.\n\nIf you need to cancel or reschedule, please contact the clinic in advance.\n\nContact:\n+91 XXXXXXXXXX\n\nThank you for choosing MediConnect.`);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: details
    });

    console.log("4. Response status code:", response.status);

    if (!response.ok) {
      const errBody = await response.json();
      console.error("Twilio Error Response:");
      console.table({
        SID: errBody.sid || "N/A",
        status: errBody.status || response.status,
        error_code: errBody.code || "N/A",
        error_message: errBody.message || "Unknown error"
      });
      console.log("====== TWILIO ROOT CAUSE ANALYSIS END ======");
      return { success: false, fallbackUrl: generateWaMeLink(appointment, doctorName) };
    }

    const successBody = await response.json();
    console.log("Twilio Success Response:");
    console.table({
      SID: successBody.sid || "N/A",
      status: successBody.status || "N/A",
      error_code: successBody.error_code || "None",
      error_message: successBody.error_message || "None"
    });
    
    console.log("5. Response body: SUCCESS. Message Sent.");
    console.log("====== TWILIO ROOT CAUSE ANALYSIS END ======");
    return { success: true };
  } catch (error) {
    console.error("4. Response status code: NULL (Request Blocked by Browser)");
    console.error("5. Response body: NULL");
    console.error("6. Any fetch/CORS errors:", error.message, error);
    console.log("====== TWILIO ROOT CAUSE ANALYSIS END ======");
    return { success: false, fallbackUrl: generateWaMeLink(appointment, doctorName) };
  }
};

export const generateWaMeLink = (appointment, doctorName) => {
  const phone = appointment.phone || "9999999999";
  const message = `🏥 Appointment Confirmation - MediConnect%0A%0ADear ${appointment.patientName || appointment.name},%0A%0AThis is to confirm that your appointment has been successfully scheduled.%0A%0AProvider:%0A${doctorName}%0A%0ADate:%0A${appointment.date}%0A%0ATime:%0A${appointment.time}%0A%0ALocation:%0AMediConnect Healthcare Center%0AVijayawada, Andhra Pradesh%0A%0AAppointment ID:%0A${appointment.id}%0A%0AInstructions:%0A• Please arrive 15 minutes before your appointment.%0A• Please bring a valid photo ID.%0A• Carry previous medical records if available.%0A%0AIf you need to cancel or reschedule, please contact the clinic in advance.%0A%0AContact:%0A+91 XXXXXXXXXX%0A%0AThank you for choosing MediConnect.`;
  return `https://wa.me/91${phone}?text=${message}`;
};

export const sendWhatsAppReminder = async (appointment, doctorName) => {
  // Exported for future use. Similar to sendWhatsAppConfirmation.
  const accountSid = import.meta.env.VITE_TWILIO_SID;
  const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  const rawSender = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || "+14155238886";
  const fromWhatsAppNumber = rawSender.startsWith("whatsapp:") ? rawSender : `whatsapp:${rawSender}`;
  const toWhatsAppNumber = appointment.phone ? `whatsapp:+91${appointment.phone}` : "whatsapp:+919999999999";
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  if (!accountSid || !authToken) return { success: false };

  try {
    const details = new URLSearchParams();
    details.append('To', toWhatsAppNumber);
    details.append('From', fromWhatsAppNumber);
    details.append('Body', `⏰ Appointment Reminder - MediConnect\n\nDear ${appointment.patientName || appointment.name},\n\nThis is a reminder for your upcoming appointment.\n\nDoctor:\n${doctorName}\n\nDate:\n${appointment.date}\n\nTime:\n${appointment.time}\n\nAppointment ID:\n${appointment.id}\n\nPlease arrive 15 minutes early.\n\nRegards,\nMediConnect`);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: details
    });

    return { success: response.ok };
  } catch (error) {
    return { success: false };
  }
};
