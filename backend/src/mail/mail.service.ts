import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GameStatus } from '../enums/game-status.enum';
const mailjet = require('node-mailjet');

@Injectable()
export class MailService {
  private mailjet;

  constructor(private configService: ConfigService) {
    this.mailjet = mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE,
    );
  }

  async sendWelcomeEmail(to: string, name?: string) {
    const fromEmail = process.env.MAIL_FROM;
    const fromName = process.env.MAIL_FROM_NAME;
    try {
      const result = await this.mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: fromEmail,
                Name: fromName,
              },
              To: [
                {
                  Email: to,
                  Name: name || to,
                },
              ],
              Subject: 'ברוכים הבאים לאפליקציית הספורט האהובה עלייך!🎉',
              HTMLPart: `<h3> שלום ${name || ''},<h3>
                            <p>תודה שנרשמת!</p>
                            <p> קדימה! הצטרף למשחק והתחל לרוץ! <p>`,
            },
          ],
        });
      console.log('Mailjet response:', result.body);
    } catch (error) {
      console.error('Mailjet error:', error.response?.body || error);
    }
  }

  async sendNewGameStatus(
    to: string,
    name: string,
    status: GameStatus,
    fieldName: string,
  ) {
    const fromEmail = process.env.MAIL_FROM;
    const fromName = process.env.MAIL_FROM_NAME;
    try {
      const result = await this.mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: fromEmail,
                Name: fromName,
              },
              To: [
                {
                  Email: to,
                  Name: name || to,
                },
              ],
              Subject:
                status === GameStatus.APPROVED
                  ? 'המשחק אושר!🎉'
                  : 'המשחק סורב..',
              HTMLPart:
                status === GameStatus.APPROVED
                  ? `<h3> שלום ${name || ''},<h3>
                            <p>המשחק שלך ב ${fieldName} אושר!</p>
                            <p> אנחנו מתרגשים בדיוק כמוך! <p>`
                  : `<h3> שלום ${name || ''},<h3>
                            <p>המשחק שלך ב ${fieldName} נדחה..</p>
                            <p> יש לנו עוד המון מגרשים בשבילך - קדימה! כנס לאפליקציה והתחל לשחק <p>`,
            },
          ],
        });
      console.log('Mailjet response:', result.body);
    } catch (error) {
      console.error('Mailjet error:', error.response?.body || error);
    }
  }

  async sendPasswordReset(to: string, token: string, name?: string) {
    const fromEmail = process.env.MAIL_FROM;
    const fromName = process.env.MAIL_FROM_NAME;
    try {
      const result = await this.mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: fromEmail,
                Name: fromName,
              },
              To: [
                {
                  Email: to,
                  Name: name || to,
                },
              ],
              Subject: 'איפוס סיסמא לאפליקציית Yoop',
              HTMLPart: `<div dir="rtl" style="text-align:right;font-family:Arial,Helvetica,sans-serif;">
              <h3> שלום ${name || ''},<h3>
                            <p>איפוס הסיסמא שלך יתבצע בקישור הבא:</p>
                            <p>${process.env.FRONTEND_URL}/auth/reset-password/?resetToken=${token}</p>
                            <p> הקישור תקף לשעה בלבד. אם לא ביקשת לאפס את סיסמתך אל תבצע כל פעולה וראה מייל זה כמבוטל.</p></div>`,
            },
          ],
        });
      console.log('Mailjet response:', result.body);
    } catch (error) {
      console.error('Mailjet error:', error.response?.body || error);
    }
  }
  async sendManagerInvite(to: string, token: string, name?: string) {
    const fromEmail = process.env.MAIL_FROM;
    const fromName = process.env.MAIL_FROM_NAME;
    try {
      const result = await this.mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: fromEmail,
                Name: fromName,
              },
              To: [
                {
                  Email: to,
                  Name: name || to,
                },
              ],
              Subject: 'ברוכים הבאים לאפליקציית Yoop!',
              HTMLPart: `<div dir="rtl" style="text-align:right;font-family:Arial,Helvetica,sans-serif;">
              <h3> שלום ${name || ''},<h3>
                           <p> מנהל אישר את בקשתך להירשם לאתר, ונפתח עבורך משתמש ייעודי לניהול המגרשים שלך</p>
                            <p>קביעת סיסמא ראשונית תתבצע בקישור שלך יתבצע בקישור הבא:${process.env.FRONTEND_URL}auth/reset-password/?resetToken=${token}</p>
                            <p>הקישור תקף ל72 שעות בלבד!</p>
                            <p>המייל להתחברות יהיה המייל אליו קיבלת הודעה זו. במידה ותרצה לשנות אותו תוכל לעשות זו לאחר ההתחברות הראשונה.</p>
                            <p>שמחים לעבוד איתך!, צוות Yoop</p></div>`,
            },
          ],
        });
      console.log('Mailjet response:', result.body);
    } catch (error) {
      console.error('Mailjet error:', error.response?.body || error);
    }
  }
}
