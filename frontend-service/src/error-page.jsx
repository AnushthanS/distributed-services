import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return <section id="error-page" className="p-10 h-[100vh] mx-4 my-auto rounded-lg">
        <div className="p-2 w-full my-[15vh] flex justify-center flex-col items-center">
            <h1 className="text-8xl font-extralight p-4">Sorry!</h1>
            <p className="text-4xl font-extralight p-4">Something unexpected happened</p>
            <p className="py-4">
                <i className="font-thin text-2xl">{error.statusText || error.message}</i>
            </p>
        </div>
    </section>
}