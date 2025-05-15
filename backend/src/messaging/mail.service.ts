import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    const fromEmail = this.configService.get<string>('MAIL_FROM');
    const fromName = this.configService.get<string>('MAIL_FROM_NAME');
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
}
