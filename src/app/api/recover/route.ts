import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, nombre } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
        }

        // Configuración de Nodemailer usando Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // ej: reservas@bedbook.com.ar
                pass: process.env.EMAIL_PASS, // App Password generado en Google
            },
        });

        const mailOptions = {
            from: `"Bedbook Reservas" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '¿Te ayudamos con tu estadía en Salta? 🏨',
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                    <p style="font-size: 16px;">Hola ${nombre ? nombre : ''}, ¿cómo estás?</p>

                    <p style="font-size: 16px;">Vimos que estuviste consultando por nuestras propiedades en Bedbook pero no llegaste a completar tu solicitud. ¡No te preocupes! Sabemos que planear un viaje lleva tiempo.</p>

                    <p style="font-size: 16px;">Te escribo solo para contarte que las fechas que estabas viendo suelen tener mucha demanda. Si tuviste alguna duda con el formulario o preferís que te asesoremos personalmente sobre qué zona de Salta te conviene más, podés responder a este mail o escribirnos directamente por WhatsApp.</p>

                    <p style="font-size: 16px;">Estamos para que tu única preocupación sea disfrutar del norte.</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://wa.me/5493871234567?text=Hola!%20Recibí%20su%20correo.%20Vengo%20de%20la%20página%20y%20quiero%20hacer%20una%20consulta." 
                           style="background-color: #365361; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                            Contactar por WhatsApp
                        </a>
                    </div>
                    
                    <p style="font-size: 16px;">Un abrazo,<br><strong>El equipo de Bedbook</strong></p>

                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px; margin-bottom: 20px;" />

                    <div style="text-align: center; font-size: 12px; color: #999;">
                        <p>Si no fuiste vos quien inició esta reserva, por favor desestimá este correo.</p>
                        <p>© Bedbook Salta.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Correo de recuperación enviado con éxito' }, { status: 200 });

    } catch (error) {
        console.error('Error enviando email:', error);
        return NextResponse.json({ error: 'Fallo interno enviando correo' }, { status: 500 });
    }
}
