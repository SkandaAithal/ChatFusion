import dynamic from "next/dynamic";

const UserGreetingBanner = dynamic(
  () => import("@/components/common/UserGreetingBanner"),
  { ssr: false }
);

const Home = () => {
  return <UserGreetingBanner />;
};

export default Home;
