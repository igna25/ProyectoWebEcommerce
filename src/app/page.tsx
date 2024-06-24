import NavBar from "./ui/navBar";
import ExploreButton from "./ui/ExploreButton";

export default function Home() {
  return (
    <div>
      <NavBar></NavBar>
      <div className="home ">
        <div className="flex-1 pt-10 padding-x">
          <h1 className="home text-4xl font-extrabold p-6">
            Encuentra tu producto favorito!
          </h1>
          <div className="pt-10 flex-1 p-10 flex">
            <ExploreButton />
          </div>
        </div>
      </div>
    </div>
  );
}
