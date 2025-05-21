import Link from "next/link";
import Image from "next/image";

const page: React.FC = ({}) => {
  return (
    <div className="menu h-[70vh] bg-[url('/search-friends-background.png')] bg-cover bg-top bg-no-repeat px-7 pt-15 text-center">
      <h1 className="text-title mb-20 text-3xl font-bold">תפריט ראשי</h1>
      <div className="menu-grid">
        <Link
          href={"/search"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image
            src="/menu-search.png"
            alt="חיפוש משחק"
            width={50}
            height={50}
          />
          <span className="mt-2">חפש משחק</span>
        </Link>
        <Link
          href={"/"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image src="/menu-home.png" alt="בית" width={50} height={50} />
          <span className="mt-2">דף הבית</span>
        </Link>
        <Link
          href={"/mygames"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image src="/menu-games.svg" alt="משחקים" width={50} height={50} />
          <span className="mt-2">משחקים</span>
        </Link>
        <Link
          href={"/profile"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image src="/menu-profile.png" alt="פרופיל" width={50} height={50} />
          <span className="mt-2">פרופיל</span>
        </Link>

        <Link
          href={"/friends"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image
            src="/menu-friends.png"
            alt="חיפוש חברים"
            width={50}
            height={50}
          />
          <span className="mt-2">חברים</span>
        </Link>

        <Link href={"/api/auth/signout"} className="menu-item">
          <Image src="/menu-logout.png" alt="התנתק" width={50} height={50} />
          <span className="mt-2">התנתק</span>
        </Link>
      </div>
    </div>
  );
};

export default page;
