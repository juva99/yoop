import Link from "next/link";
import Image from "next/image";
import BouncingBall from "@/components/ui/bouncing-ball";

const page: React.FC = ({}) => {
  return (
    <div className="menu relative h-[100vh] bg-[url('/search-friends-background.png')] bg-top bg-no-repeat px-7 pt-15 text-center">
      <h1 className="relative z-20">תפריט ראשי</h1>
      <div className="menu-grid relative z-20">
        <Link
          href={"/search"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image
            src="/menu-search.png"
            alt="חיפוש משחק"
            width={40}
            height={40}
          />
          <span className="mt-2">חפש משחק</span>
        </Link>
        <Link
          href={"/"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image src="/menu-home.png" alt="בית" width={40} height={40} />
          <span className="mt-2">דף הבית</span>
        </Link>
        <Link
          href={"/mygames"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image src="/menu-games.svg" alt="משחקים" width={40} height={40} />
          <span className="mt-2">משחקים</span>
        </Link>
        <Link
          href={"/profile"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image src="/menu-profile.png" alt="פרופיל" width={40} height={40} />
          <span className="mt-2">פרופיל</span>
        </Link>
        <Link
          href={"/friends"}
          className="menu-item flex flex-col items-center justify-center"
        >
          <Image
            src="/menu-friends.png"
            alt="חיפוש חברים"
            width={40}
            height={40}
          />
          <span className="mt-2">חברים</span>
        </Link>{" "}
        <a href={"/api/auth/signout"} className="menu-item">
          <Image src="/menu-logout.png" alt="התנתק" width={40} height={40} />
          <span className="mt-2">התנתק</span>
        </a>
      </div>

      {/* Interactive Soccer Ball */}
      <BouncingBall />
    </div>
  );
};

export default page;
