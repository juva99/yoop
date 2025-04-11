import React from 'react'

const Registration = ({onSubmit}) => {
  return (
    <div>
      <h1 className=''> וואי וואי!</h1>
      <h2 className=''> ⚽️🔥אוטוטו אתה עולה למגרש, פוגש חברים חדשים, ונותן גול מהסרטים </h2>
      <p><strong>כל מה שנשאר זה למלא את הפרטים -</strong> ותכף תמצא את עצמך אומר: "איך חייתי בלי זה עד עכשיו?!"</p>
      <p> יאללה, תן פס - ונתקדם &gt;&gt;</p>
      <div>
        <form onSubmit={onSubmit} className='flex flex-col'>
          <label>אימייל</label>
          <input type="email" placeholder='alex_manager@gmail.com' required></input>
          <label>סיסמא</label>
          <input type="password" placeholder='••••••••' required></input>
          <label>מספר נייד</label>
          <input type="tel" pattern='[0-9]{10}' placeholder='0501234567' required></input>
          <label>גיל</label>
          <input type="number" min="0" max="100" placeholder='21' required></input>
          <button type="submit" className='bg-blue-500 text-white p-2 rounded-md'>הירשם עכשיו</button>
          </form>
      </div>
    </div>
  )
}

export default Registration;