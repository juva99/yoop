import { useRef, useState } from "react";
import Image from 'next/image';
export default function ImagePicker({}) {
  const [pickedImage, setPickedImage] = useState<string | null>();
  const imageInput = useRef<HTMLInputElement>(null);

  function handleClick() {
    if (imageInput.current) {
      imageInput.current.click();
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file?.type.startsWith("image/")) {
      setPickedImage(null);
      alert("Please select a valid image file.");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        setPickedImage(fileReader.result);
      }
    };

    fileReader.readAsDataURL(file);
  }


  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={handleClick} className="bg-blue-400 text-white p-2 rounded">
        בחר תמונה
      </button>
      {!pickedImage && <p className="border p-4">לא נבחרה תמונה</p>}
      {pickedImage && (
        <div className="relative w-32 h-32">
        <Image src={pickedImage} alt="התמונה שנבחרה" fill className="object-cover rounded-md" />
        </div>
      )}
      <input
        type="file"
        accept="image/png image/jpeg"
        name="image"
        ref={imageInput}
        onChange={handleImageChange}
        hidden
      ></input>
    </div>
  );
}
