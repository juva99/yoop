import { LoginFormSchema } from '@/lib/schemas/login_schema'

describe('LoginFormSchema', () => {
  describe('userEmail validation', () => {
    it('accepts valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user@domain.org',
        'email@test.co.il',
        'valid.email@example.com'
      ]

      validEmails.forEach(email => {
        const result = LoginFormSchema.safeParse({
          userEmail: email,
          pass: 'StrongPass123!'
        })
        expect(result.success).toBe(true)
      })
    })

    it('rejects invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.com',
        ''
      ]

      invalidEmails.forEach(email => {
        const result = LoginFormSchema.safeParse({
          userEmail: email,
          pass: 'StrongPass123!'
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toMatch(/אימייל/)
        }
      })
    })

    it('requires email field to be filled', () => {
      const result = LoginFormSchema.safeParse({
        userEmail: '',
        pass: 'StrongPass123!'
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('חובה למלא אימייל')
      }
    })
  })

  describe('password validation', () => {
    it('accepts strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MyPassword1@',
        'Complex$Pass99',
        'Valid123#Pass'
      ]

      strongPasswords.forEach(password => {
        const result = LoginFormSchema.safeParse({
          userEmail: 'test@example.com',
          pass: password
        })
        expect(result.success).toBe(true)
      })
    })

    it('rejects passwords shorter than 8 characters', () => {
      const shortPasswords = [
        'Short1!',
        'Pass1@',
        '123Abc!',
        ''
      ]

      shortPasswords.forEach(password => {
        const result = LoginFormSchema.safeParse({
          userEmail: 'test@example.com',
          pass: password
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.some(issue => 
            issue.message === 'לפחות 8 תווים'
          )).toBe(true)
        }
      })
    })

    it('rejects passwords without letters', () => {
      const noLetterPasswords = [
        '12345678!',
        '98765432@',
        '111111!!!'
      ]

      noLetterPasswords.forEach(password => {
        const result = LoginFormSchema.safeParse({
          userEmail: 'test@example.com',
          pass: password
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.some(issue => 
            issue.message === 'אותיות גדולות וקטנות באנגלית'
          )).toBe(true)
        }
      })
    })

    it('rejects passwords without numbers', () => {
      const noNumberPasswords = [
        'StrongPass!',
        'MyPassword@',
        'NoNumbers#'
      ]

      noNumberPasswords.forEach(password => {
        const result = LoginFormSchema.safeParse({
          userEmail: 'test@example.com',
          pass: password
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.some(issue => 
            issue.message === 'לפחות מספר אחד'
          )).toBe(true)
        }
      })
    })

    it('rejects passwords without special characters', () => {
      const noSpecialCharPasswords = [
        'StrongPass123',
        'MyPassword99',
        'NoSpecialChar1'
      ]

      noSpecialCharPasswords.forEach(password => {
        const result = LoginFormSchema.safeParse({
          userEmail: 'test@example.com',
          pass: password
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.some(issue => 
            issue.message === 'לפחות תו מיוחד אחד'
          )).toBe(true)
        }
      })
    })
  })

  describe('complete form validation', () => {
    it('validates a complete valid form', () => {
      const validForm = {
        userEmail: 'test@example.com',
        pass: 'StrongPass123!'
      }

      const result = LoginFormSchema.safeParse(validForm)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data).toEqual(validForm)
      }
    })

    it('validates form with trimmed password', () => {
      const formWithSpaces = {
        userEmail: 'test@example.com',
        pass: '  StrongPass123!  '
      }

      const result = LoginFormSchema.safeParse(formWithSpaces)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.pass).toBe('StrongPass123!')
      }
    })

    it('rejects completely empty form', () => {
      const emptyForm = {
        userEmail: '',
        pass: ''
      }

      const result = LoginFormSchema.safeParse(emptyForm)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        // Multiple validation errors can occur for each field
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
        expect(result.error.issues.some(issue => 
          issue.message === 'חובה למלא אימייל'
        )).toBe(true)
        expect(result.error.issues.some(issue => 
          issue.message === 'לפחות 8 תווים'
        )).toBe(true)
      }
    })
  })
})
