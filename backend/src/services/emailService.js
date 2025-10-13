import nodemailer from 'nodemailer';

// Variable global para almacenar el transportador y credenciales
let cachedTransporter = null;
let etherealAccount = null;

// Configurar el transportador de email
const createTransporter = async () => {
  // Si ya tenemos un transportador en caché, usarlo
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // Si hay credenciales configuradas (producción)
  if (process.env.EMAIL_SERVICE === 'gmail' && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    return cachedTransporter;
  }
  
  // Si hay SMTP configurado
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
    return cachedTransporter;
  }

  // 🎓 MODO ACADÉMICO: Crear cuenta Ethereal automáticamente
  console.log('📧 Creando cuenta de prueba Ethereal Email...');
  etherealAccount = await nodemailer.createTestAccount();
  
  console.log('✅ Cuenta Ethereal creada:');
  console.log('   📮 Usuario:', etherealAccount.user);
  console.log('   🔑 Password:', etherealAccount.pass);
  console.log('   🌐 SMTP Host:', etherealAccount.smtp.host);
  console.log('   🔢 SMTP Port:', etherealAccount.smtp.port);
  
  cachedTransporter = nodemailer.createTransport({
    host: etherealAccount.smtp.host,
    port: etherealAccount.smtp.port,
    secure: etherealAccount.smtp.secure,
    auth: {
      user: etherealAccount.user,
      pass: etherealAccount.pass
    }
  });
  
  return cachedTransporter;
};

export const sendTicketEmail = async (emailData, pdfBuffer) => {
  try {
    const transporter = await createTransporter();
    
    // Crear el template HTML compatible con todos los clientes de correo
    const emailTemplate = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>TicketVue - Tu Entrada Digital</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: Arial, Helvetica, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7fa;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              
              <!-- Container Principal -->
              <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                
                <!-- Header Azul -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">TicketVue</h1>
                    <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Tu Entrada Digital</p>
                  </td>
                </tr>
                
                <!-- Contenido Principal -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">¡Hola ${emailData.firstName}! 🎉</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Tu entrada para <strong style="color: #2563eb;">${emailData.eventName}</strong> ha sido confirmada exitosamente.
                    </p>
                    
                    <!-- Tarjeta de Evento -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Detalles del Evento</p>
                          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">${emailData.eventName}</h3>
                          ${emailData.eventDate ? `<p style="color: #475569; font-size: 14px; margin: 5px 0;">📅 ${emailData.eventDate}</p>` : ''}
                          ${emailData.eventLocation ? `<p style="color: #475569; font-size: 14px; margin: 5px 0;">📍 ${emailData.eventLocation}</p>` : ''}
                          ${emailData.ticketType ? `<p style="color: #475569; font-size: 14px; margin: 5px 0;">🎫 ${emailData.ticketType}</p>` : ''}
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Código QR y Código de Entrada -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); border-radius: 8px; margin: 25px 0;">
                      <tr>
                        <td align="center" style="padding: 30px 20px;">
                          ${emailData.qrCode ? `
                            <img src="cid:qrcode" alt="Código QR" style="width: 200px; height: 200px; border: 4px solid #ffffff; border-radius: 8px; display: block; margin: 0 auto 20px auto;" />
                          ` : ''}
                          <p style="color: #e0e7ff; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Código de Entrada</p>
                          <p style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; font-family: 'Courier New', monospace;">${emailData.ticketCode}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Instrucciones -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0;">
                      <tr>
                        <td>
                          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📋 Instrucciones Importantes</h3>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding: 10px 0;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width: 30px; vertical-align: top;">
                                      <span style="color: #2563eb; font-size: 20px;">✓</span>
                                    </td>
                                    <td>
                                      <p style="color: #475569; font-size: 14px; margin: 0; line-height: 1.5;">Descarga el <strong>PDF adjunto</strong> con tu entrada digital</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width: 30px; vertical-align: top;">
                                      <span style="color: #2563eb; font-size: 20px;">✓</span>
                                    </td>
                                    <td>
                                      <p style="color: #475569; font-size: 14px; margin: 0; line-height: 1.5;">Presenta el <strong>código QR</strong> en la entrada del evento</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width: 30px; vertical-align: top;">
                                      <span style="color: #2563eb; font-size: 20px;">✓</span>
                                    </td>
                                    <td>
                                      <p style="color: #475569; font-size: 14px; margin: 0; line-height: 1.5;">También puedes usar tu <strong>código de entrada</strong> para validar tu acceso</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width: 30px; vertical-align: top;">
                                      <span style="color: #2563eb; font-size: 20px;">✓</span>
                                    </td>
                                    <td>
                                      <p style="color: #475569; font-size: 14px; margin: 0; line-height: 1.5;">Llega con <strong>tiempo suficiente</strong> antes del evento</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                      Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 5px 0;">
                      Este es un correo automático, por favor no respondas a este mensaje.
                    </p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0;">
                      &copy; 2025 <strong style="color: #2563eb;">TicketVue</strong> - Sistema de Boletería Digital
                    </p>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"TicketVue - Boletería Digital" <noreply@ticketvue.com>',
      to: emailData.email,
      subject: `🎫 TicketVue - Tu Entrada para ${emailData.eventName}`,
      html: emailTemplate,
      attachments: [
        {
          filename: `Entrada-${emailData.ticketCode}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    
    // Si hay código QR, agregarlo como imagen embebida
    if (emailData.qrCode) {
      // El qrCode viene como data URL, extraer solo la parte base64
      const qrBase64 = emailData.qrCode.replace(/^data:image\/png;base64,/, '');
      mailOptions.attachments.push({
        filename: 'qrcode.png',
        content: qrBase64,
        encoding: 'base64',
        cid: 'qrcode' // Mismo CID que se usa en el HTML
      });
    }
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado exitosamente:', info.messageId);
    
    // Obtener URL de previsualización (funciona con Ethereal)
    const previewUrl = nodemailer.getTestMessageUrl(info);
    
    if (previewUrl) {
      console.log('📧 ═══════════════════════════════════════════════════════════');
      console.log('📧 EMAIL ENVIADO - Ver en navegador:');
      console.log('📧 ' + previewUrl);
      console.log('📧 ═══════════════════════════════════════════════════════════');
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null
    };
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw new Error('Error al enviar el email: ' + error.message);
  }
};
