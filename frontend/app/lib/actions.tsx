'use server';

export async function newUserSignUp(formData: FormData) {
  const newUser = {
    email: formData.get('email'),
    password: formData.get('password'),
    phoneNumber: formData.get('phoneNumber'),
    age: formData.get('age'),
    // image: formData.get('image'),
    // ^^^^^^^
    // image is commented out for this moment as it's size is too big for..
    // .. a default server action in next. 
    // the default size can be changed in next.config.  
  }

  console.log(newUser); 
  // Todo: save new user to DB 
}