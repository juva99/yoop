import { SignupFormSchema } from '@/lib/schemas/signup_schema'

describe('SignupFormSchema', () => {
  const validFormData = {
    firstName: 'ישראל',
    lastName: 'ישראלי',
    userEmail: 'test@example.com',
    pass: 'StrongPass123!',
    passConfirm: 'StrongPass123!',
    phoneNum: '0501234567',
    birthDay: '1990-01-01',
    address: 'jerusalem' as any
  }

  describe('firstName validation', () => {
    it('accepts valid Hebrew first names', () => {
      const validNames = ['ישראל', 'דוד', 'משה', 'אברהם', 'יוסף']

      validNames.forEach(name => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          firstName: name
        })
        expect(result.success).toBe(true)
      })
    })

    it('rejects names shorter than 2 characters', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        firstName: 'א'
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('שם פרטי חייב להכיל לפחות שתי אותיות')
      }
    })

    it('rejects names with non-Hebrew characters', () => {
      const invalidNames = ['David', 'יוסף123', 'ישראל@', 'John']

      invalidNames.forEach(name => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          firstName: name
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.some(issue => 
            issue.message === 'שם פרטי חייב להכיל אותיות בעברית'
          )).toBe(true)
        }
      })
    })

    it('trims whitespace from first name', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        firstName: '  ישראל  '
      })
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.firstName).toBe('ישראל')
      }
    })
  })

  describe('lastName validation', () => {
    it('accepts valid Hebrew last names', () => {
      const validNames = ['כהן', 'לוי', 'פרץ', 'מזרחי']

      validNames.forEach(name => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          lastName: name
        })
        expect(result.success).toBe(true)
      })
    })

    it('rejects names shorter than 2 characters', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        lastName: 'א'
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('שם משפחה חייב להכיל לפחות שתי אותיות')
      }
    })

    it('rejects names with non-Hebrew characters', () => {
      const invalidNames = ['Cohen', 'לוי123', 'כהן!', 'Smith']

      invalidNames.forEach(name => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          lastName: name
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.some(issue => 
            issue.message === 'שם משפחה חייב להכיל אותיות בעברית'
          )).toBe(true)
        }
      })
    })
  })

  describe('email validation', () => {
    it('accepts valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user@domain.org',
        'email@test.co.il'
      ]

      validEmails.forEach(email => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          userEmail: email
        })
        expect(result.success).toBe(true)
      })
    })

    it('rejects invalid email addresses', () => {
      const invalidEmails = ['invalid-email', '@example.com', 'test@']

      invalidEmails.forEach(email => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          userEmail: email
        })
        expect(result.success).toBe(false)
      })
    })

    it('trims whitespace from email', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        userEmail: '  test@example.com  '
      })
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.userEmail).toBe('test@example.com')
      }
    })
  })

  describe('phone number validation', () => {
    it('accepts valid Israeli phone numbers', () => {
      const validPhones = [
        '0501234567',
        '050-1234567',
        '+972501234567',
        '+97250-1234567'
      ]

      validPhones.forEach(phone => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          phoneNum: phone
        })
        expect(result.success).toBe(true)
      })
    })

    it('transforms phone numbers to standard format', () => {
      const phoneTransforms = [
        { input: '+972501234567', expected: '0501234567' },
        { input: '+97250-1234567', expected: '0501234567' },
        { input: '050-1234567', expected: '0501234567' },
        { input: '0501234567', expected: '0501234567' }
      ]

      phoneTransforms.forEach(({ input, expected }) => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          phoneNum: input
        })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.phoneNum).toBe(expected)
        }
      })
    })

    it('rejects invalid phone numbers', () => {
      const invalidPhones = [
        '123456789',
        '0401234567',
        '+1234567890',
        'not-a-phone'
      ]

      invalidPhones.forEach(phone => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          phoneNum: phone
        })
        expect(result.success).toBe(false)
      })
    })
  })

  describe('password validation', () => {
    it('accepts strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MyPassword1@',
        'Complex$Pass99'
      ]

      strongPasswords.forEach(password => {
        const result = SignupFormSchema.safeParse({
          ...validFormData,
          pass: password,
          passConfirm: password
        })
        expect(result.success).toBe(true)
      })
    })

    it('rejects passwords without uppercase letters', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        pass: 'weakpass123!',
        passConfirm: 'weakpass123!'
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message === 'אותיות גדולות וקטנות באנגלית'
        )).toBe(true)
      }
    })

    it('rejects passwords without numbers', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        pass: 'StrongPass!',
        passConfirm: 'StrongPass!'
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message === 'לפחות מספר אחד'
        )).toBe(true)
      }
    })

    it('rejects passwords without special characters', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        pass: 'StrongPass123',
        passConfirm: 'StrongPass123'
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message === 'לפחות תו מיוחד אחד'
        )).toBe(true)
      }
    })
  })

  describe('password confirmation validation', () => {
    it('accepts matching passwords', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        pass: 'StrongPass123!',
        passConfirm: 'StrongPass123!'
      })
      
      expect(result.success).toBe(true)
    })

    it('rejects non-matching passwords', () => {
      const result = SignupFormSchema.safeParse({
        ...validFormData,
        pass: 'StrongPass123!',
        passConfirm: 'DifferentPass123!'
      })
      
      expect(result.success).toBe(false)
  })
  .refine((data) => data.pass === data.passConfirm, {
    message: "הסיסמאות אינן מתאימות",
    path: ["passConfirm"],
  });
    })
  })

  describe('complete form validation', () => {
    it('validates a complete valid form', () => {
      const result = SignupFormSchema.safeParse(validFormData)
      expect(result.success).toBe(true)
    })

    it('rejects form with missing required fields', () => {
      const incompleteForm = {
        firstName: '',
        lastName: '',
        userEmail: '',
        pass: '',
        passConfirm: '',
        phoneNum: '',
        birthDay: '',
        address: ''
      }

      const result = SignupFormSchema.safeParse(incompleteForm)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        // Should have multiple validation errors
        expect(result.error.issues.length).toBeGreaterThan(5)
      }
    })
  })
})
