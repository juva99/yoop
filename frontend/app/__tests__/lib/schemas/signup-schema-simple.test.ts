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
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message === 'הסיסמאות אינן מתאימות'
        )).toBe(true)
      }
    })
  })

  describe('complete form validation', () => {
    it('validates a complete valid form', () => {
      const result = SignupFormSchema.safeParse(validFormData)
      expect(result.success).toBe(true)
    })
  })
})
