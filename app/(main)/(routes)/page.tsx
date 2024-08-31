import { ACCESS_TOKEN } from "@/lib/constants";
import { SERVERS } from "@/lib/routes";
import { isEmpty } from "@/lib/utils";
import { getUserId } from "@/lib/utils/auth";
import { getAllServers } from "@/lib/utils/server-actions";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const UserGreetingBanner = dynamic(
  () => import("@/components/common/UserGreetingBanner"),
  { ssr: false }
);

const Home = async () => {
  const cookieStore = cookies();
  const encryptedToken = cookieStore.get(ACCESS_TOKEN)?.value;
  const userId = await getUserId(encryptedToken as string);
  if (userId) {
    const servers = await getAllServers(userId as string);
    if (!isEmpty(servers)) return redirect(SERVERS);
  }

  return <UserGreetingBanner />;
};

export default Home;
