import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SubmitButton from "@/components/ui/submitButton"

const LoginForm = () => {
  return (
    <form>
      <div className="form_item">
        <Label
          htmlFor="email"
          className="form_label"
        >
          אימייל
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="example@email.com"
          className="input_underscore"
        ></Input>
      </div>

      <div>
        <Label
          htmlFor="password"
          className="form_label"
        >
          סיסמא
        </Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          className="input_underscore"
        >
        </Input>
      </div>

      <div className="flex w-full justify-center">
        <SubmitButton className="mt-3 rounded-sm bg-blue-500 px-5 py-5 text-lg font-semibold text-white">
          התחבר
        </SubmitButton>
      </div>
    </form>
  )
}

export default LoginForm;