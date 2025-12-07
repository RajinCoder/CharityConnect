import CreatePost from "@/app/components/CreatePost";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreatePostPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/Account/Login");
    }

    return <CreatePost />;
}
