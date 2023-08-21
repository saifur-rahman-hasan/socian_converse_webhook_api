import CopyAccessToken from "@/components/CopyAccessToken";
import { useSession } from "next-auth/react";
import Head from "next/head";
import LandingPage from "../components/LandingPage";

export default function Home() {
    const session = useSession()

    return (
        <>
            <Head>
                <title>Welcome to Converse</title>
            </Head>


            <LandingPage />

            <div className={`p-10`}>
                <CopyAccessToken session={session} />
            </div>
        </>
    )
}